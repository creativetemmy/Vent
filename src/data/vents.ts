
export interface Vent {
  id: string;
  username: string;
  timeAgo: string;
  content: string;
  image?: string;
  hashtags: string[];
  mentions: string[];
  upvotes: number;
  downvotes: number;
  comments: number;
}

export const ventData: Vent[] = [
  {
    id: "1",
    username: "crypto_whale.eth",
    timeAgo: "2h ago",
    content: "Uniswap fees ate my ETH! Swapped 1 ETH for some obscure token and got charged 0.15 ETH in fees. Is this normal?",
    image: "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?q=80&w=2946&auto=format&fit=crop&ixlib=rb-4.0.3",
    hashtags: ["#Uniswap", "#ETH", "#DeFiProblems"],
    mentions: ["@Uniswap"],
    upvotes: 12,
    downvotes: 3,
    comments: 5
  },
  {
    id: "2",
    username: "nft_collector.eth",
    timeAgo: "3h ago",
    content: "OpenSea just delisted my entire collection without warning! Months of work gone in an instant. Anyone else experiencing this?",
    image: "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?q=80&w=2897&auto=format&fit=crop&ixlib=rb-4.0.3",
    hashtags: ["#OpenSea", "#NFT", "#Censorship"],
    mentions: ["@OpenSea"],
    upvotes: 34,
    downvotes: 2,
    comments: 12
  },
  {
    id: "3",
    username: "defi_degen.eth",
    timeAgo: "5h ago",
    content: "Just got liquidated on Aave because their oracle price feed lagged during market volatility. Lost 5 ETH in seconds!",
    hashtags: ["#Aave", "#Liquidation", "#Oracle"],
    mentions: ["@AaveAave"],
    upvotes: 28,
    downvotes: 5,
    comments: 8
  },
  {
    id: "4",
    username: "solana_maxi.eth",
    timeAgo: "8h ago",
    content: "Solana network went down AGAIN for 6 hours. This is the third time this month! How is this acceptable for a top blockchain?",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop&ixlib=rb-4.0.3",
    hashtags: ["#Solana", "#Downtime", "#Reliability"],
    mentions: ["@Solana"],
    upvotes: 56,
    downvotes: 14,
    comments: 23
  },
  {
    id: "5",
    username: "btc_hodler.eth",
    timeAgo: "12h ago",
    content: "My hardware wallet just bricked during a firmware update and support isn't responding! 2 BTC potentially lost forever.",
    hashtags: ["#Bitcoin", "#HardwareWallet", "#Ledger"],
    mentions: ["@Ledger"],
    upvotes: 89,
    downvotes: 7,
    comments: 42
  }
];
