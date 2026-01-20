import { useQuery } from "@tanstack/react-query";
import { fetchNFTChartData } from "@/lib/coingecko";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

interface NFTChartProps {
  nftId: string;
  height?: number;
  days?: number;
}

const NFTChart = ({ nftId, height = 600, days = 7 }: NFTChartProps) => {
  const { data: chartData, isLoading } = useQuery({
    queryKey: ["nftChartData", nftId, days],
    queryFn: () => fetchNFTChartData(nftId, days),
    enabled: !!nftId,
    staleTime: 60000,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <div className="flex items-center justify-center text-muted-foreground" style={{ height }}>
        No chart data available
      </div>
    );
  }

  // Format data for recharts
  const formattedData = chartData.map((candle) => ({
    time: format(new Date(candle.time * 1000), "MMM dd"),
    timestamp: candle.time,
    price: candle.close,
    open: candle.open,
    high: candle.high,
    low: candle.low,
  }));

  const chartConfig = {
    price: {
      label: "Price",
      color: "hsl(var(--primary))",
    },
  };

  return (
    <ChartContainer config={chartConfig} className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={formattedData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis
            dataKey="time"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value.toFixed(2)}`}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value: number) => `$${value.toFixed(2)}`}
                labelFormatter={(label) => `Date: ${label}`}
              />
            }
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default NFTChart;

