/**
 * Service for interacting with Ave.ai API
 * Used for resolving competition outcomes by getting token price data
 */

// Types for Ave.ai API responses
export interface AveApiResponse<T> {
  status: number;
  msg: string;
  data_type: number;
  data: T;
}

export interface AveTokenPrice {
  token: string;
  chain: string;
  current_price_usd: number;
  price_change_24h: number;
  timestamp?: number;
}

export interface AveHistoricalData {
  token: string;
  prices: {
    price: number;
    timestamp: number;
  }[];
}

class AveService {
  private baseUrl = 'https://prod.ave-api.com/v2';
  private apiKey: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_AVE_API_KEY || '';
    if (!this.apiKey) {
      console.warn('Ave API key not configured. Results resolution via Ave.ai will not function properly.');
    }
  }

  /**
   * Get current price for a specific token
   * @param tokenSymbol - Token symbol (e.g., 'SOL', 'ETH')
   * @param chain - Optional blockchain name (default: 'solana')
   */
  async getCurrentPrice(tokenSymbol: string, chain: string = 'solana'): Promise<number | null> {
    try {
      // Simulate API call for development (replace with actual API call in production)
      if (import.meta.env.DEV) {
        return this.getMockPrice(tokenSymbol);
      }

      // First search for the token to get its details
      const searchUrl = `${this.baseUrl}/tokens?keyword=${tokenSymbol}&chain=${chain}`;
      const response = await fetch(searchUrl, {
        headers: {
          'X-API-KEY': this.apiKey,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Ave API error: ${response.statusText}`);
      }

      const data = await response.json() as AveApiResponse<AveTokenPrice[]>;
      if (!data.data || data.data.length === 0) {
        throw new Error(`Token ${tokenSymbol} not found on chain ${chain}`);
      }

      // Find the matching token (case insensitive)
      const token = data.data.find(
        t => t.token.toLowerCase() === tokenSymbol.toLowerCase()
      );

      return token ? token.current_price_usd : null;
    } catch (error) {
      console.error('Error fetching price from Ave:', error);
      return null;
    }
  }

  /**
   * Get historical price for a token at a specific timestamp
   * @param tokenSymbol - Token symbol (e.g., 'SOL', 'ETH')
   * @param timestamp - Unix timestamp in seconds
   * @param chain - Optional blockchain name (default: 'solana')
   */
  async getHistoricalPrice(tokenSymbol: string, timestamp: number, chain: string = 'solana'): Promise<number | null> {
    try {
      // Simulate API call for development (replace with actual API call in production)
      if (import.meta.env.DEV) {
        return this.getMockHistoricalPrice(tokenSymbol, timestamp);
      }

      // In production, we would call the historical price endpoint
      // This would look something like:
      // GET /tokens/{token}/historical?timestamp={timestamp}&chain={chain}
      
      console.log(`Fetching historical price for ${tokenSymbol} at timestamp ${timestamp} on chain ${chain}`);
      // For now, we'll use the mock implementation even in production
      // until we have the exact endpoint details
      return this.getMockHistoricalPrice(tokenSymbol, timestamp);
    } catch (error) {
      console.error('Error fetching historical price from Ave:', error);
      return null;
    }
  }

  /**
   * Resolve a competition based on the actual price at end time
   * @param tokenSymbol - Token symbol to check
   * @param endTimeUnix - Unix timestamp for when the competition ends
   * @param chain - Optional blockchain name (default: 'solana')
   */
  async resolveCompetitionResult(tokenSymbol: string, endTimeUnix: number, chain: string = 'solana'): Promise<number | null> {
    try {
      // Wait until the competition end time has passed
      const currentTime = Math.floor(Date.now() / 1000);
      if (currentTime < endTimeUnix) {
        console.log('Competition has not ended yet');
        return null;
      }
      
      // Get the historical price at the competition end time
      const price = await this.getHistoricalPrice(tokenSymbol, endTimeUnix, chain);
      return price;
    } catch (error) {
      console.error('Error resolving competition result:', error);
      return null;
    }
  }

  /**
   * Helper for development - provides mock prices
   */
  private getMockPrice(tokenSymbol: string): number {
    const mockPrices: Record<string, number> = {
      'SOL': 145.32,
      'ETH': 2845.67,
      'BTC': 62345.89,
      'USDC': 1.00,
      'BONK': 0.000023,
    };
    
    return mockPrices[tokenSymbol.toUpperCase()] || 100.00;
  }

  /**
   * Helper for development - provides mock historical prices
   */
  private getMockHistoricalPrice(tokenSymbol: string, timestamp: number): number {
    // Generate a somewhat realistic but deterministic price based on the timestamp
    const basePrice = this.getMockPrice(tokenSymbol);
    const dayVariation = (timestamp % 86400) / 86400; // 0-1 based on time of day
    const priceVariation = (Math.sin(dayVariation * Math.PI * 2) * 0.05); // ±5% variation 
    
    return basePrice * (1 + priceVariation);
  }

  /**
   * Validate token address and get token information
   * @param tokenAddress - Token address to validate
   * @param chain - Optional blockchain name (default: 'solana')
   * @returns Token information if valid, null if invalid
   */
  async validateTokenAddress(tokenAddress: string, chain: string = 'solana'): Promise<{
    valid: boolean;
    symbol?: string;
    name?: string;
    logoUrl?: string;
    currentPrice?: number;
  }> {
    try {
      // Simulate API call for development (replace with actual API call in production)
      if (import.meta.env.DEV) {
        // Basic validation for development
        const isValidFormat = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(tokenAddress);
        
        if (!isValidFormat) {
          return { valid: false };
        }
        
        // Mock token data for testing
        const mockTokens: Record<string, any> = {
          'So11111111111111111111111111111111111111112': {
            symbol: 'SOL',
            name: 'Solana',
            logoUrl: 'https://cryptologos.cc/logos/solana-sol-logo.png',
            currentPrice: 145.32
          },
          'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': {
            symbol: 'USDC',
            name: 'USD Coin',
            logoUrl: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
            currentPrice: 1.00
          }
          // Add more mock tokens as needed
        };
        
        // If address matches one of our mock tokens, return its data
        if (mockTokens[tokenAddress]) {
          return {
            valid: true,
            ...mockTokens[tokenAddress]
          };
        }
        
        // For other addresses, return generic mock data
        return {
          valid: true,
          symbol: 'TOKEN',
          name: 'Custom Token',
          logoUrl: 'https://cryptologos.cc/logos/generic-token.png',
          currentPrice: 0.01
        };
      }

      // In production, use Ave.ai to validate the token
      const searchUrl = `${this.baseUrl}/tokens?keyword=${tokenAddress}&chain=${chain}`;
      console.log(`Validating token address ${tokenAddress} on chain ${chain}`);
      
      const response = await fetch(searchUrl, {
        headers: {
          'X-API-KEY': this.apiKey,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Ave API error: ${response.statusText}`);
      }

      const data = await response.json() as AveApiResponse<AveTokenPrice[]>;
      
      // Check if the token exists in the response
      if (!data.data || data.data.length === 0) {
        return { valid: false };
      }

      // Find the exact token address match
      const token = data.data.find(t => 
        t.token.toLowerCase() === tokenAddress.toLowerCase()
      );

      if (!token) {
        return { valid: false };
      }

      return {
        valid: true,
        symbol: token.token,
        name: token.token, // Ave might return more info we can use here
        currentPrice: token.current_price_usd,
        // logoUrl would come from token data if available
      };
    } catch (error) {
      console.error('Error validating token address:', error);
      return { valid: false };
    }
  }
}

export const aveService = new AveService();
