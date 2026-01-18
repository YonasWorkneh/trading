import { motion } from "framer-motion";
import { ShieldX, Lock, ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const AccessDenied = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 relative overflow-hidden">
      {/* Subtle background effects */}
      <div 
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: `
            linear-gradient(135deg, rgba(36, 99, 235, 0.03) 0%, transparent 50%),
            linear-gradient(45deg, transparent 50%, rgba(36, 99, 235, 0.02) 100%)
          `,
        }}
      />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full text-center relative z-10"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl" />
            <div className="relative bg-white border-2 border-gray-200 rounded-full p-6">
              <ShieldX className="h-16 w-16 text-primary/70" />
            </div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
        >
          Access Restricted
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl mx-auto"
        >
           Please contact the developer to get access.
        </motion.p>

        {/* Features Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/80 backdrop-blur-lg border border-gray-200 rounded-xl p-8 mb-8 shadow-sm"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            What You're Missing Out On
          </h2>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-primary">
                <Lock className="h-5 w-5" />
                <span className="font-semibold text-gray-900">Secure Trading</span>
              </div>
              <p className="text-sm text-gray-600">
                Institutional-grade security for your assets
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-primary">
                <Lock className="h-5 w-5" />
                <span className="font-semibold text-gray-900">Real-Time Markets</span>
              </div>
              <p className="text-sm text-gray-600">
                Live prices and instant execution
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-primary">
                <Lock className="h-5 w-5" />
                <span className="font-semibold text-gray-900">Advanced Tools</span>
              </div>
              <p className="text-sm text-gray-600">
                Professional trading features and analytics
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button
            size="lg"
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-inherit hover:text-primary gap-2"
            asChild
          >
            <a href="mailto:support@tradepremium.com" target="_blank" rel="noopener noreferrer">
              <Mail className="h-4 w-4" />
              Contact Admin
            </a>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AccessDenied;

