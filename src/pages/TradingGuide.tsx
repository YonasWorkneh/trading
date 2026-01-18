import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, TrendingUp, Shield, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const TradingGuide = () => {
  return (
    <div className="min-h-screen bg-white text-foreground">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Back Button */}
        <div className="mb-8">
          <Link to="/">
            <Button variant="default" size="sm" className="gap-2 bg-primary hover:bg-primary/90">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Content */}
        <div className="bg-white/80 backdrop-blur-lg border border-gray-200 rounded-xl p-8 md:p-12 shadow-sm">
          <h1 className="text-4xl font-bold mb-4 flex items-center gap-3 text-gray-900">
            <BookOpen className="h-8 w-8 text-primary" />
            Trading Guide
          </h1>
          <p className="text-gray-600 mb-8">
            Learn how to trade effectively on Bexprot platform
          </p>

          <div className="space-y-8">
            {/* Getting Started */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Getting Started
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 text-gray-900">1. Create Your Account</h3>
                  <p className="text-sm text-gray-700">
                    Sign up for a free Bexprot account. Verify your email address and complete the KYC process if required.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-gray-900">2. Fund Your Account</h3>
                  <p className="text-sm text-gray-700">
                    Deposit funds using cryptocurrency or bank transfer. All deposits are processed securely and typically complete within minutes.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-gray-900">3. Explore the Platform</h3>
                  <p className="text-sm text-gray-700">
                    Familiarize yourself with the trading interface, charts, and available markets before placing your first trade.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Trading Modes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Trading Modes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 text-gray-900">Spot Trading</h3>
                  <p className="text-sm text-gray-700">
                    Buy and sell assets at current market prices. Perfect for beginners and long-term investors.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-gray-900">Futures Trading</h3>
                  <p className="text-sm text-gray-700">
                    Trade with leverage using futures contracts. Higher risk but potential for greater returns.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-gray-900">Contract Trading</h3>
                  <p className="text-sm text-gray-700">
                    Binary options trading with fixed payouts. Predict price direction within a set time frame.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Risk Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Risk Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 text-gray-900">Set Stop Losses</h3>
                  <p className="text-sm text-gray-700">
                    Always set stop-loss orders to limit potential losses. Never risk more than you can afford to lose.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-gray-900">Diversify Your Portfolio</h3>
                  <p className="text-sm text-gray-700">
                    Don't put all your funds into a single asset. Spread your investments across different markets and asset types.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-gray-900">Use Leverage Wisely</h3>
                  <p className="text-sm text-gray-700">
                    Leverage can amplify both gains and losses. Start with low leverage and increase gradually as you gain experience.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-gray-900">Keep Learning</h3>
                  <p className="text-sm text-gray-700">
                    Markets are constantly evolving. Stay updated with market news, analysis, and continue learning trading strategies.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Trading Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Pro Trading Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Start with demo trading to practice without risking real money</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Use technical analysis tools and charts to identify trends</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Keep a trading journal to track your performance and learn from mistakes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Don't let emotions drive your trading decisions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Take profits regularly and don't be greedy</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Support */}
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong className="text-gray-900">Need Help?</strong> Our support team is available 24/7 to assist you. Contact us at support@bexprot.com or use the live chat feature in the platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingGuide;

