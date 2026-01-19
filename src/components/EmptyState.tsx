import { BarChart3, Image } from "lucide-react";

interface EmptyStateProps {
  type: "crypto" | "nft";
  title?: string;
  description?: string;
}

const EmptyState = ({ type, title, description }: EmptyStateProps) => {
  const defaultTitle = type === "crypto" 
    ? "No Cryptocurrency Data Available" 
    : "No NFT Data Available";
  
  const defaultDescription = type === "crypto"
    ? "Unable to load cryptocurrency market data at the moment. Please try again later."
    : "Unable to load NFT market data at the moment. Please try again later.";

  const Icon = type === "crypto" ? BarChart3 : Image;

  return (
    <div className="flex flex-col items-center justify-center h-64 rounded-lg p-8">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl" />
        <div className="relative bg-primary/5 border-2 border-primary/20 rounded-full p-6">
          <Icon className="h-12 w-12 text-primary/60" />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {title || defaultTitle}
      </h3>
      <p className="text-sm text-muted-foreground text-center max-w-md">
        {description || defaultDescription}
      </p>
    </div>
  );
};

export default EmptyState;

