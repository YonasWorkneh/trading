import axios from "axios";

const COINGECKO_API = "https://api.coingecko.com/api/v3";

export interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
}

export interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface NFTMarketData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
}

export interface NFTCollection {
  id: string;
  name: string;
  symbol: string;
  image: {
    small?: string;
    large?: string;
  };
  floor_price?: {
    native_currency?: {
      value: number;
      symbol: string;
    };
    usd?: number;
  };
  floor_price_in_usd_24h_percentage_change?: number;
  floor_price_24h_percentage_change?: number;
  volume_24h?: {
    usd?: number;
  };
  market_cap?: {
    usd?: number;
  };
}

export const fetchTopCryptos = async (limit: number = 20): Promise<CryptoAsset[]> => {
  try {
    const response = await axios.get(`${COINGECKO_API}/coins/markets`, {
      params: {
        vs_currency: "usd",
        order: "market_cap_desc",
        per_page: limit,
        page: 1,
        sparkline: false,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching crypto data:", error);
    return [];
  }
};

export const fetchAssetDetail = async (id: string): Promise<CryptoAsset | null> => {
  const fetchWithRetry = async (retries = 3, delay = 1000): Promise<CryptoAsset | null> => {
    try {
      const response = await axios.get(`${COINGECKO_API}/coins/markets`, {
        params: {
          vs_currency: "usd",
          ids: id,
          sparkline: false,
        },
      });
      return response.data[0] || null;
    } catch (error) {
      if (retries > 0) {
        console.warn(`Error fetching asset detail for ${id}, retrying in ${delay}ms...`, error);
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchWithRetry(retries - 1, delay * 2);
      }
      console.error("Error fetching asset detail after retries:", error);
      return null;
    }
  };

  return fetchWithRetry();
};

export const fetchChartData = async (
  coinId: string,
  days: number = 7
): Promise<CandleData[]> => {
  try {
    const response = await axios.get(`${COINGECKO_API}/coins/${coinId}/ohlc`, {
      params: {
        vs_currency: "usd",
        days,
      },
    });

    return response.data.map((candle: number[]) => ({
      time: Math.floor(candle[0] / 1000),
      open: candle[1],
      high: candle[2],
      low: candle[3],
      close: candle[4],
    }));
  } catch (error) {
    console.error("Error fetching chart data:", error);
    return [];
  }
};

/**
 * Fetches popular NFT collections from CoinGecko
 * Returns individual NFT collections with their own icons and market data
 */
export const fetchPopularNFTs = async (limit: number = 5): Promise<NFTMarketData[]> => {
  try {
    // First, fetch the list of NFTs from CoinGecko
    const listResponse = await axios.get(`${COINGECKO_API}/nfts/list`, {
      params: {
        per_page: limit * 2, // Fetch more to account for invalid data
        page: 1,
      },
    });

    const nftList = listResponse.data as Array<{
      id: string;
      name: string;
      symbol: string;
      asset_platform_id: string;
    }>;

    if (!nftList || nftList.length === 0) {
      console.warn("No NFT collections found in list");
      return [];
    }

    // Fetch detailed data for each NFT collection
    const nftDetailsPromises = nftList.slice(0, limit * 2).map(async (nft) => {
      try {
        const detailResponse = await axios.get(`${COINGECKO_API}/nfts/${nft.id}`, {
          params: {
            asset_platform_id: nft.asset_platform_id || "ethereum",
          },
        });

        const collection = detailResponse.data as NFTCollection;

        // Only include NFTs with valid price data
        if (
          collection.floor_price?.usd &&
          collection.floor_price.usd > 0 &&
          collection.image
        ) {
          const priceChange =
            collection.floor_price_in_usd_24h_percentage_change ||
            collection.floor_price_24h_percentage_change ||
            0;

          return {
            id: collection.id || nft.id,
            symbol: collection.symbol || nft.symbol || "NFT",
            name: collection.name || nft.name,
            image:
              collection.image?.small ||
              collection.image?.large ||
              "https://imgur.com/W3nzK2S",
            current_price: collection.floor_price.usd,
            price_change_percentage_24h: priceChange,
            market_cap: collection.market_cap?.usd || 0,
            total_volume: collection.volume_24h?.usd || 0,
            high_24h: collection.floor_price.usd * 1.1, // Estimate
            low_24h: collection.floor_price.usd * 0.9, // Estimate
          } as NFTMarketData;
        }
        return null;
      } catch (error) {
        console.warn(`Failed to fetch NFT collection ${nft.id}:`, error);
        return null;
      }
    });

    const nftDetails = await Promise.all(nftDetailsPromises);
    const validNFTs = nftDetails.filter(
      (nft) => nft !== null
    ) as NFTMarketData[];

    // Return top N valid NFTs
    return validNFTs.slice(0, limit);
  } catch (error) {
    console.error("Error fetching popular NFTs:", error);
    return [];
  }
};

/**
 * Fetches NFT chart data (price history) from CoinGecko
 * Note: CoinGecko doesn't have a direct NFT chart endpoint, so we'll use the collection detail
 * and generate a simple price history based on available data
 */
export const fetchNFTChartData = async (
  nftId: string,
  days: number = 7
): Promise<CandleData[]> => {
  try {
    // Fetch NFT collection details
    const response = await axios.get(`${COINGECKO_API}/nfts/${nftId}`);
    const collection = response.data as NFTCollection;

    if (!collection.floor_price?.usd) {
      return [];
    }

    // Since CoinGecko doesn't provide historical NFT price data,
    // we'll create a simple chart based on current price and 24h change
    const currentPrice = collection.floor_price.usd;
    const priceChange = collection.floor_price_in_usd_24h_percentage_change || 0;
    const basePrice = currentPrice / (1 + priceChange / 100);

    // Generate synthetic data points for the requested days
    const dataPoints: CandleData[] = [];
    const now = Math.floor(Date.now() / 1000);
    const interval = (days * 24 * 60 * 60) / Math.max(days, 1); // Distribute points evenly

    for (let i = days; i >= 0; i--) {
      const time = now - i * interval;
      // Simulate price movement with some randomness
      const progress = (days - i) / days;
      const price = basePrice + (currentPrice - basePrice) * progress;
      const variation = price * 0.02 * (Math.random() - 0.5); // ±2% variation
      const open = price + variation;
      const close = price - variation;
      const high = Math.max(open, close) * (1 + Math.random() * 0.01);
      const low = Math.min(open, close) * (1 - Math.random() * 0.01);

      dataPoints.push({
        time,
        open,
        high,
        low,
        close,
      });
    }

    return dataPoints;
  } catch (error) {
    console.error("Error fetching NFT chart data:", error);
    return [];
  }
};
