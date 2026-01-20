import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import TradingViewWidget from "@/components/TradingViewWidget";
import NFTChart from "@/components/NFTChart";
import { TrendingUp, DollarSign, Coins, Wheat, ArrowLeft, Image, Images } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { fetchNFTChartData } from "@/lib/coingecko";
import { Loader2 } from "lucide-react";
import axios from "axios";

const COINGECKO_API = "https://api.coingecko.com/api/v3";

interface NFTMarket {
  symbol: string;
  name: string;
  category: string;
  id: string;
  icon: typeof Images;
}

const popularMarkets: Array<
    | {
        symbol: string;
        name: string;
        category: "Crypto" | "Stocks" | "Forex" | "Commodities";
        icon: typeof Coins | typeof TrendingUp | typeof DollarSign | typeof Wheat;
      }
    | NFTMarket
  > = [
    // Cryptocurrencies
    {
      symbol: "CRYPTO:BTCUSD",
      name: "Bitcoin",
      category: "Crypto",
      icon: Coins,
    },
    {
      symbol: "CRYPTO:ETHUSD",
      name: "Ethereum",
      category: "Crypto",
      icon: Coins,
    },
    { symbol: "CRYPTO:BNBUSD", name: "BNB", category: "Crypto", icon: Coins },
    {
      symbol: "CRYPTO:SOLUSD",
      name: "Solana",
      category: "Crypto",
      icon: Coins,
    },
    {
      symbol: "CRYPTO:ADAUSD",
      name: "Cardano",
      category: "Crypto",
      icon: Coins,
    },
    {
      symbol: "CRYPTO:XRPUSD",
      name: "Ripple",
      category: "Crypto",
      icon: Coins,
    },
    // NFTs
    {
      symbol: "NFT:BORED-APE-YACHT-CLUB",
      name: "Bored Ape Yacht Club",
      category: "NFTs",
      id: "bored-ape-yacht-club",
      icon: Images,
    },
    {
      symbol: "NFT:CRYPTOPUNKS",
      name: "CryptoPunks",
      category: "NFTs",
      id: "cryptopunks",
      icon: Images,
    },
    {
      symbol: "NFT:PUDGY-PENGUINS",
      name: "Pudgy Penguins",
      category: "NFTs",
      id: "pudgy-penguins",
      icon: Images,
    },
    {
      symbol: "NFT:MOONBIRDS",
      name: "Moonbirds",
      category: "NFTs",
      id: "moonbirds",
      icon: Images,
    },
    {
      symbol: "NFT:MUTANT-APE-YACHT-CLUB",
      name: "Mutant Ape Yacht Club",
      category: "NFTs",
      id: "mutant-ape-yacht-club",
      icon: Images,
    },
    {
      symbol: "NFT:CLONE-X",
      name: "Clone X",
      category: "NFTs",
      id: "clone-x",
      icon: Images,
    },
    {
      symbol: "NFT:AZUKI",
      name: "Azuki",
      category: "NFTs",
      id: "azuki",
      icon: Images,
    },
    {
      symbol: "NFT:DEGODS",
      name: "DeGods",
      category: "NFTs",
      id: "degods",
      icon: Images,
    },
    {
      symbol: "NFT:CYBERKONGZ",
      name: "CyberKongz",
      category: "NFTs",
      id: "cyberkongz",
      icon: Images,
    },
    {
      symbol: "NFT:COOL-CATS",
      name: "Cool Cats",
      category: "NFTs",
      id: "cool-cats",
      icon: Images,
    },
    // Stocks
    {
      symbol: "NASDAQ:AAPL",
      name: "Apple Inc.",
      category: "Stocks",
      icon: TrendingUp,
    },
    {
      symbol: "NASDAQ:MSFT",
      name: "Microsoft",
      category: "Stocks",
      icon: TrendingUp,
    },
    {
      symbol: "NASDAQ:GOOGL",
      name: "Alphabet",
      category: "Stocks",
      icon: TrendingUp,
    },
    {
      symbol: "NASDAQ:TSLA",
      name: "Tesla",
      category: "Stocks",
      icon: TrendingUp,
    },
    {
      symbol: "NASDAQ:AMZN",
      name: "Amazon",
      category: "Stocks",
      icon: TrendingUp,
    },
    {
      symbol: "NASDAQ:META",
      name: "Meta",
      category: "Stocks",
      icon: TrendingUp,
    },
    // Forex
    {
      symbol: "FX:EURUSD",
      name: "EUR/USD",
      category: "Forex",
      icon: DollarSign,
    },
    {
      symbol: "FX:GBPUSD",
      name: "GBP/USD",
      category: "Forex",
      icon: DollarSign,
    },
    {
      symbol: "FX:USDJPY",
      name: "USD/JPY",
      category: "Forex",
      icon: DollarSign,
    },
    {
      symbol: "FX:AUDUSD",
      name: "AUD/USD",
      category: "Forex",
      icon: DollarSign,
    },
    // Commodities
    {
      symbol: "TVC:GOLD",
      name: "Gold",
      category: "Commodities",
      icon: Wheat,
    },
    {
      symbol: "TVC:SILVER",
      name: "Silver",
      category: "Commodities",
      icon: Wheat,
    },
    {
      symbol: "TVC:USOIL",
      name: "Crude Oil",
      category: "Commodities",
      icon: Wheat,
    },
  ];

const Markets = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [selectedSymbol, setSelectedSymbol] = useState("CRYPTO:BTCUSD");
  const [selectedNFTId, setSelectedNFTId] = useState<string | null>(null);
  const [interval, setInterval] = useState("D");
  const [selectedCategory, setSelectedCategory] = useState("Crypto");

  // Fetch NFT details for selected NFT
  const { data: selectedNFTData, isLoading: nftDataLoading } = useQuery({
    queryKey: ["nftDetail", selectedNFTId],
    queryFn: async () => {
      if (!selectedNFTId) return null;
      try {
        const response = await axios.get(`${COINGECKO_API}/nfts/${selectedNFTId}`);
        const collection = response.data;
        return {
          id: collection.id || selectedNFTId,
          name: collection.name || selectedNFTId,
          image: collection.image?.small || collection.image?.large || "",
          current_price: collection.floor_price?.usd || 0,
          price_change_percentage_24h:
            collection.floor_price_in_usd_24h_percentage_change ||
            collection.floor_price_24h_percentage_change ||
            0,
        };
      } catch (error) {
        console.error("Error fetching NFT detail:", error);
        return null;
      }
    },
    enabled: !!selectedNFTId,
    staleTime: 60000,
  });

  // Update selected NFT when NFT category is selected
  useEffect(() => {
    if (selectedCategory === "NFTs" && !selectedNFTId) {
      const nftMarkets = popularMarkets.filter((m) => "id" in m && m.category === "NFTs") as NFTMarket[];
      if (nftMarkets.length > 0) {
        setSelectedNFTId(nftMarkets[0].id);
        setSelectedSymbol(""); // Clear crypto symbol
      }
    } else if (selectedCategory !== "NFTs" && selectedNFTId) {
      setSelectedNFTId(null);
      if (!selectedSymbol) {
        setSelectedSymbol("CRYPTO:BTCUSD");
      }
    }
  }, [selectedCategory, selectedNFTId, selectedSymbol]);

  const intervals = [
    { label: "1m", value: "1" },
    { label: "5m", value: "5" },
    { label: "15m", value: "15" },
    { label: "1h", value: "60" },
    { label: "4h", value: "240" },
    { label: "1D", value: "D" },
    { label: "1W", value: "W" },
    { label: "1M", value: "M" },
  ];

  const selectedMarket =
    popularMarkets.find((m) => m.symbol === selectedSymbol) ||
    popularMarkets[0];

  // Group markets by category for tabs
  const marketsByCategory = popularMarkets.reduce((acc, market) => {
    if (!acc[market.category]) {
      acc[market.category] = [];
    }
    acc[market.category].push(market);
    return acc;
  }, {} as Record<string, typeof popularMarkets>);

  // Add NFTs category
  const categories = ["Crypto", "NFTs", "Stocks", "Forex", "Commodities"];

  // Authenticated view: Tabs at top, chart as main content
  if (isAuthenticated) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        {/* Category Tabs */}
        <div className="bg-card border border-border rounded-xl p-4">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-5 mb-4">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="text-xs sm:text-sm"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="space-y-2">
              {selectedCategory === "NFTs" ? (
                marketsByCategory["NFTs"]?.map((market) => {
                  const isNFT = "id" in market;
                  if (!isNFT) return null;
                  const Icon = market.icon;
                  const isSelected = selectedNFTId === market.id;
                  return (
                    <button
                      key={market.id}
                      onClick={() => {
                        setSelectedNFTId(market.id);
                        setSelectedSymbol("");
                      }}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        isSelected
                          ? "bg-primary/20 border border-primary"
                          : "bg-secondary/50 hover:bg-secondary border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-primary" />
                        <span className="font-medium text-sm">{market.name}</span>
                        <span className="ml-auto text-xs text-muted-foreground">
                          {selectedNFTData && selectedNFTId === market.id
                            ? `$${selectedNFTData.current_price.toFixed(2)}`
                            : market.symbol}
                        </span>
                      </div>
                    </button>
                  );
                })
              ) : (
                marketsByCategory[selectedCategory]?.map((market) => {
                  const Icon = market.icon;
                  const isSelected = market.symbol === selectedSymbol;
                  return (
                    <button
                      key={market.symbol}
                      onClick={() => {
                        setSelectedSymbol(market.symbol);
                        setSelectedNFTId(null);
                      }}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        isSelected
                          ? "bg-primary/20 border border-primary"
                          : "bg-secondary/50 hover:bg-secondary border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-primary" />
                        <span className="font-medium text-sm">{market.name}</span>
                        <span className="ml-auto text-xs text-muted-foreground">
                          {market.symbol}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </Tabs>
        </div>

        {/* Chart Header */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                {selectedCategory === "NFTs" && selectedNFTId ? (
                  <>
                    {selectedNFTData ? (
                      <>
                        {selectedNFTData.image && (
                          <img
                            src={selectedNFTData.image}
                            alt={selectedNFTData.name}
                            className="w-6 h-6 rounded"
                          />
                        )}
                        {selectedNFTData.name}
                      </>
                    ) : (
                      <>
                        <Images className="h-5 w-5 text-primary" />
                        {popularMarkets.find((m) => "id" in m && m.id === selectedNFTId)?.name ||
                          selectedNFTId}
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {selectedMarket.icon && (
                      <selectedMarket.icon className="h-5 w-5 text-primary" />
                    )}
                    {selectedMarket.name}
                  </>
                )}
              </h2>
              <p className="text-sm text-muted-foreground">
                {selectedCategory === "NFTs" && selectedNFTId && selectedNFTData
                  ? `Floor Price: $${selectedNFTData.current_price.toFixed(2)}`
                  : selectedMarket.symbol}
              </p>
            </div>
            {selectedCategory !== "NFTs" && (
              <div className="flex gap-2 flex-wrap">
                {intervals.map((int) => (
                  <Button
                    key={int.value}
                    variant={interval === int.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setInterval(int.value)}
                    className="h-8"
                  >
                    {int.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chart */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {selectedCategory === "NFTs" && selectedNFTId ? (
            <NFTChart nftId={selectedNFTId} height={600} days={7} />
          ) : (
            <TradingViewWidget
              symbol={selectedSymbol}
              height={600}
              interval={interval}
            />
          )}
        </div>
      </div>
    );
  }

  // Unauthenticated view: Original layout with sidebar and back button
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/">
            <Button
              variant="default"
              size="sm"
              className="gap-2 bg-primary hover:bg-primary/90"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Market List Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-card border border-border rounded-xl p-4">
              <h2 className="text-lg font-semibold mb-4">Popular Markets</h2>
              <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="Crypto" className="text-xs">Crypto</TabsTrigger>
                  <TabsTrigger value="NFTs" className="text-xs">NFTs</TabsTrigger>
                </TabsList>
                <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {selectedCategory === "NFTs" ? (
                    marketsByCategory["NFTs"]?.map((market) => {
                      const isNFT = "id" in market;
                      if (!isNFT) return null;
                      const Icon = market.icon;
                      const isSelected = selectedNFTId === market.id;
                      return (
                        <button
                          key={market.id}
                          onClick={() => {
                            setSelectedNFTId(market.id);
                            setSelectedSymbol("");
                          }}
                          className={`w-full text-left p-3 rounded-lg transition-all ${
                            isSelected
                              ? "bg-primary/20 border border-primary"
                              : "bg-secondary/50 hover:bg-secondary border border-transparent"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Icon className="h-4 w-4 text-primary" />
                            <span className="font-medium text-sm">
                              {market.name}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {selectedNFTData && selectedNFTId === market.id
                              ? `$${selectedNFTData.current_price.toFixed(2)}`
                              : market.symbol}
                          </span>
                        </button>
                      );
                    })
                  ) : (
                    popularMarkets
                      .filter((m) => !("id" in m))
                      .map((market) => {
                        const Icon = market.icon;
                        const isSelected = market.symbol === selectedSymbol;
                        return (
                          <button
                            key={market.symbol}
                            onClick={() => {
                              setSelectedSymbol(market.symbol);
                              setSelectedNFTId(null);
                            }}
                            className={`w-full text-left p-3 rounded-lg transition-all ${
                              isSelected
                                ? "bg-primary/20 border border-primary"
                                : "bg-secondary/50 hover:bg-secondary border border-transparent"
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <Icon className="h-4 w-4 text-primary" />
                              <span className="font-medium text-sm">
                                {market.name}
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {market.category}
                            </span>
                          </button>
                        );
                      })
                  )}
                </div>
              </Tabs>
            </div>
          </div>

          {/* Chart Area */}
          <div className="lg:col-span-3 space-y-4">
            {/* Chart Header */}
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    {selectedCategory === "NFTs" && selectedNFTId ? (
                      <>
                        {selectedNFTData ? (
                          <>
                            {selectedNFTData.image && (
                              <img
                                src={selectedNFTData.image}
                                alt={selectedNFTData.name}
                                className="w-6 h-6 rounded"
                              />
                            )}
                            {selectedNFTData.name}
                          </>
                        ) : (
                          <>
                            <Images className="h-5 w-5 text-primary" />
                            {popularMarkets.find((m) => "id" in m && m.id === selectedNFTId)?.name ||
                              selectedNFTId}
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        {selectedMarket.icon && (
                          <selectedMarket.icon className="h-5 w-5 text-primary" />
                        )}
                        {selectedMarket.name}
                      </>
                    )}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {selectedCategory === "NFTs" && selectedNFTId && selectedNFTData
                      ? `Floor Price: $${selectedNFTData.current_price.toFixed(2)}`
                      : selectedMarket.symbol}
                  </p>
                </div>
                {selectedCategory !== "NFTs" && (
                  <div className="flex gap-2 flex-wrap">
                    {intervals.map((int) => (
                      <Button
                        key={int.value}
                        variant={interval === int.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setInterval(int.value)}
                        className="h-8"
                      >
                        {int.label}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Chart */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              {selectedCategory === "NFTs" && selectedNFTId ? (
                <NFTChart nftId={selectedNFTId} height={600} days={7} />
              ) : (
                <TradingViewWidget
                  symbol={selectedSymbol}
                  height={600}
                  interval={interval}
                />
              )}
            </div>

            {/* Info Banner */}
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
              <p className="text-sm text-muted-foreground text-center">
                <strong className="text-foreground">
                  Want to start trading?
                </strong>{" "}
                <Link to="/auth" className="text-primary hover:underline">
                  Sign up for free
                </Link>{" "}
                to access advanced trading tools, portfolio management, and
                more.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Markets;
