import { motion } from "framer-motion";
import {
  ArrowRight,
  Shield,
  TrendingUp,
  Wallet,
  BarChart3,
  TrendingDown,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/PublicNavigation";
import FeaturesSection from "@/components/features/FeaturesSection";
import LogoCarousel from "@/components/LogoCarousel";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import LighthouseEffect from "@/components/LighthouseEffect";
import TubesBackground from "@/components/TubesBackground";
import bitcoinPrice from "@/assets/bitcoin-price.png";
import { useQuery } from "@tanstack/react-query";
import { fetchTopCryptos, fetchPopularNFTs } from "@/lib/coingecko";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import EmptyState from "@/components/EmptyState";

const Index = () => {
  // Fetch top 24 cryptocurrencies
  const { data: markets, isLoading: marketsLoading, refetch: refetchMarkets } = useQuery({
    queryKey: ["topCryptos", 24],
    queryFn: () => fetchTopCryptos(24),
    staleTime: 30000,
    // Removed refetchInterval to prevent 429 errors
  });

  // Fetch popular NFT collections dynamically
  const { data: popularNFTs = [], isLoading: nftLoading, refetch: refetchNFTs } = useQuery({
    queryKey: ["popularNFTs"],
    queryFn: () => fetchPopularNFTs(5), // Fetch top 5 popular NFTs
    staleTime: 60000, // 1 minute
    // Removed refetchInterval to prevent 429 errors
    retry: 2,
  });

  // Manual refresh handler
  const handleRefresh = async () => {
    refetchMarkets();
    refetchNFTs();
  };

  const isRefreshing = marketsLoading || nftLoading;

  return (
    <div className="min-h-screen bg-white text-foreground relative">
      {/* Subtle background gradient overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `
            linear-gradient(135deg, rgba(36, 99, 235, 0.01) 0%, transparent 50%),
            linear-gradient(45deg, transparent 50%, rgba(36, 99, 235, 0.008) 100%)
          `,
        }}
      />
      <TubesBackground />
      <LighthouseEffect />
      <Navigation />

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative container px-4 pt-40 pb-20"
      >
        {/* Background */}
        <div className="absolute inset-0 -z-10 bg-gray-50" />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-block mb-4 px-4 py-1.5 rounded-full glass"
        >
          <span className="text-sm font-medium">
            <img
              src="/favicon.png"
              alt="Trade Premium"
              className="w-4 h-4 inline-block mr-2"
            />
            Next-gen crypto & stock trading platform
          </span>
        </motion.div>

        <div className="max-w-4xl relative z-10">
          <h1 className="text-5xl md:text-7xl font-normal mb-4 tracking-tight text-left">
            <span className="text-gray-700">
              <TextGenerateEffect words="Trade with" />
            </span>
            <br />
            <span className="text-gray-900 font-medium">
              <TextGenerateEffect words="confidence." />
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-md text-gray-600 mb-8 max-w-2xl text-left font-normal"
          >
            Experience seamless cryptocurrency and stock trading with advanced
            features, real-time analytics, and institutional-grade security.{" "}
            <strong>Start trading in minutes.</strong>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 items-start"
          >
            <Button size="lg" className="button-gradient text-white" asChild>
              <Link to="/dashboard">Start Trading Now</Link>
            </Button>
            <Button size="lg" variant="link" className="text-gray-900" asChild>
              <Link to="/markets">View Markets</Link>
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="relative mx-auto max-w-5xl mt-20"
        >
          <div className="backdrop-blur-lg border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Live Markets</h2>
                <p className="text-sm text-gray-600">Real-time prices and 24h changes</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={marketsLoading || nftLoading}
                className="gap-2 border-gray-300 hover:bg-gray-50 hover:text-primary cursor-pointer"
              >
                <RefreshCw className={`h-4 w-4 ${marketsLoading || nftLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>

            {marketsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : markets && markets.length > 0 ? (
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-100 border border-gray-200 rounded-lg">
                  <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-primary">
                    All Markets
                  </TabsTrigger>
                  <TabsTrigger value="gainers" className="data-[state=active]:bg-white data-[state=active]:text-primary flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Rising
                  </TabsTrigger>
                  <TabsTrigger value="losers" className="data-[state=active]:bg-white data-[state=active]:text-primary flex items-center gap-2">
                    <TrendingDown className="h-4 w-4" />
                    Falling
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {/* Popular NFT Collections - Always First */}
                    {popularNFTs.map((nft) => {
                      const isPositive = nft.price_change_percentage_24h >= 0;
                      return (
                        <Link
                          key={nft.id}
                          to="/markets"
                          className="group bg-white border border-gray-200 rounded-lg p-4 hover:border-primary/50 hover:shadow-md transition-all"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={nft.image}
                                alt={nft.name}
                                className="w-8 h-8 rounded-full object-cover"
                                onError={(e) => {
                                  // Fallback to default logo if image fails to load
                                  (e.target as HTMLImageElement).src = "https://imgur.com/W3nzK2S";
                                }}
                              />
                              <div>
                                <div className="font-semibold text-gray-900 text-sm">
                                  {nft.symbol.toUpperCase()}
                                </div>
                                <div className="text-xs text-gray-500">{nft.name}</div>
                              </div>
                            </div>
                            {isPositive ? (
                              <TrendingUp className="h-4 w-4 text-[#2463eb]" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-sm font-mono font-semibold text-gray-900">
                                ${nft.current_price.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </div>
                            </div>
                            <div
                              className={`text-sm font-semibold ${
                                isPositive ? "text-[#2463eb]" : "text-red-500"
                              }`}
                            >
                              {isPositive ? "+" : ""}
                              {nft.price_change_percentage_24h?.toFixed(2) || "0.00"}%
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                    {/* Crypto Markets */}
                    {markets.map((market) => {
                      const isPositive = market.price_change_percentage_24h >= 0;
                      return (
                        <Link
                          key={market.id}
                          to={`/crypto/${market.id}`}
                          className="group bg-white border border-gray-200 rounded-lg p-4 hover:border-primary/50 hover:shadow-md transition-all"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={market.image}
                                alt={market.name}
                                className="w-8 h-8 rounded-full"
                              />
                              <div>
                                <div className="font-semibold text-gray-900 text-sm">
                                  {market.symbol.toUpperCase()}
                                </div>
                                <div className="text-xs text-gray-500">{market.name}</div>
                              </div>
                            </div>
                            {isPositive ? (
                              <TrendingUp className="h-4 w-4 text-[#2463eb]" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-sm font-mono font-semibold text-gray-900">
                                ${market.current_price.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 6,
                                })}
                              </div>
                            </div>
                            <div
                              className={`text-sm font-semibold ${
                                isPositive ? "text-[#2463eb]" : "text-red-500"
                              }`}
                            >
                              {isPositive ? "+" : ""}
                              {market.price_change_percentage_24h?.toFixed(2) || "0.00"}%
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </TabsContent>

                <TabsContent value="gainers" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {/* Rising NFTs - First */}
                    {popularNFTs
                      .filter((nft) => nft.price_change_percentage_24h >= 0)
                      .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
                      .map((nft) => (
                        <Link
                          key={nft.id}
                          to="/markets"
                          className="group bg-white border border-gray-200 rounded-lg p-4 hover:border-primary/50 hover:shadow-md transition-all"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={nft.image}
                                alt={nft.name}
                                className="w-8 h-8 rounded-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "https://imgur.com/W3nzK2S";
                                }}
                              />
                              <div>
                                <div className="font-semibold text-gray-900 text-sm">
                                  {nft.symbol.toUpperCase()}
                                </div>
                                <div className="text-xs text-gray-500">{nft.name}</div>
                              </div>
                            </div>
                            <TrendingUp className="h-4 w-4 text-[#2463eb]" />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-sm font-mono font-semibold text-gray-900">
                                ${nft.current_price.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </div>
                            </div>
                            <div className="text-sm font-semibold text-[#2463eb]">
                              +{nft.price_change_percentage_24h?.toFixed(2) || "0.00"}%
                            </div>
                          </div>
                        </Link>
                      ))}
                    {/* Rising Crypto Markets */}
                    {markets
                      .filter((m) => m.price_change_percentage_24h >= 0)
                      .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
                      .map((market) => (
                        <Link
                          key={market.id}
                          to={`/crypto/${market.id}`}
                          className="group bg-white border border-gray-200 rounded-lg p-4 hover:border-primary/50 hover:shadow-md transition-all"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={market.image}
                                alt={market.name}
                                className="w-8 h-8 rounded-full"
                              />
                              <div>
                                <div className="font-semibold text-gray-900 text-sm">
                                  {market.symbol.toUpperCase()}
                                </div>
                                <div className="text-xs text-gray-500">{market.name}</div>
                              </div>
                            </div>
                            <TrendingUp className="h-4 w-4 text-[#2463eb]" />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-sm font-mono font-semibold text-gray-900">
                                ${market.current_price.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 6,
                                })}
                              </div>
                            </div>
                            <div className="text-sm font-semibold text-[#2463eb]">
                              +{market.price_change_percentage_24h?.toFixed(2) || "0.00"}%
                            </div>
                          </div>
                        </Link>
                      ))}
                  </div>
                </TabsContent>

                <TabsContent value="losers" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {/* Falling NFTs - First */}
                    {popularNFTs
                      .filter((nft) => nft.price_change_percentage_24h < 0)
                      .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
                      .map((nft) => (
                        <Link
                          key={nft.id}
                          to="/markets"
                          className="group bg-white border border-gray-200 rounded-lg p-4 hover:border-primary/50 hover:shadow-md transition-all"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={nft.image}
                                alt={nft.name}
                                className="w-8 h-8 rounded-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "https://imgur.com/W3nzK2S";
                                }}
                              />
                              <div>
                                <div className="font-semibold text-gray-900 text-sm">
                                  {nft.symbol.toUpperCase()}
                                </div>
                                <div className="text-xs text-gray-500">{nft.name}</div>
                              </div>
                            </div>
                            <TrendingDown className="h-4 w-4 text-red-500" />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-sm font-mono font-semibold text-gray-900">
                                ${nft.current_price.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </div>
                            </div>
                            <div className="text-sm font-semibold text-red-500">
                              {nft.price_change_percentage_24h?.toFixed(2) || "0.00"}%
                            </div>
                          </div>
                        </Link>
                      ))}
                    {/* Falling Crypto Markets */}
                    {markets
                      .filter((m) => m.price_change_percentage_24h < 0)
                      .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
                      .map((market) => (
                        <Link
                          key={market.id}
                          to={`/crypto/${market.id}`}
                          className="group bg-white border border-gray-200 rounded-lg p-4 hover:border-primary/50 hover:shadow-md transition-all"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={market.image}
                                alt={market.name}
                                className="w-8 h-8 rounded-full"
                              />
                              <div>
                                <div className="font-semibold text-gray-900 text-sm">
                                  {market.symbol.toUpperCase()}
                                </div>
                                <div className="text-xs text-gray-500">{market.name}</div>
                              </div>
                            </div>
                            <TrendingDown className="h-4 w-4 text-red-500" />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-sm font-mono font-semibold text-gray-900">
                                ${market.current_price.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 6,
                                })}
                              </div>
                            </div>
                            <div className="text-sm font-semibold text-red-500">
                              {market.price_change_percentage_24h?.toFixed(2) || "0.00"}%
                            </div>
                          </div>
                        </Link>
                      ))}
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <EmptyState 
                type="crypto" 
                title="No Market Data Available"
                description="Unable to load market data at the moment. Please try refreshing or check back later."
              />
            )}
          </div>
        </motion.div>
      </motion.section>

      {/* Logo Carousel */}
      <LogoCarousel />

      {/* Features Section */}
      <div id="features" className="bg-white">
        <FeaturesSection />
      </div>

      {/* Stats Section */}
      <section className="container px-4 py-20">
        <div className="border border-gray-200 rounded-2xl p-8 md:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "$2B+", label: "Trading Volume" },
              { value: "150+", label: "Supported Assets" },
              { value: "50K+", label: "Active Traders" },
              { value: "99.9%", label: "Uptime" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Prices Preview */}
      <section className="container px-4 py-20 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Live Market Prices
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Track real-time prices of your favorite assets directly on our
            platform.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-md mx-auto"
        >
          <div className="glass rounded-xl overflow-hidden">
            <img
              src={bitcoinPrice}
              alt="Bitcoin Live Price"
              className="w-full h-auto"
            />
          </div>
        </motion.div>
      </section>

      {/* Testimonials Section */}
      <div id="testimonials" className="bg-white">
        <TestimonialsSection />
      </div>

      {/* CTA Section */}
      <section className="container px-4 py-20 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className=" backdrop-blur-lg border border-gray-200 rounded-2xl p-8 md:p-12 text-center relative z-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to start trading?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of traders who have already discovered the power of
            Bexprot.
          </p>
          <Button size="lg" className="button-gradient text-white" asChild>
            <Link to="/auth">Create Account</Link>
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <div className="bg-white">
        <Footer />
      </div>
    </div>
  );
};

export default Index;
