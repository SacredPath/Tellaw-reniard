/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_BENEFICIARY_ETHEREUM: process.env.NEXT_PUBLIC_BENEFICIARY_ETHEREUM || '0xYourEthereumAddress',
    NEXT_PUBLIC_BENEFICIARY_BSC: process.env.NEXT_PUBLIC_BENEFICIARY_BSC || '0xYourBSCAddress',
    NEXT_PUBLIC_BENEFICIARY_POLYGON: process.env.NEXT_PUBLIC_BENEFICIARY_POLYGON || '0xYourPolygonAddress',
    NEXT_PUBLIC_BENEFICIARY_ARBITRUM: process.env.NEXT_PUBLIC_BENEFICIARY_ARBITRUM || '0xYourArbitrumAddress',
    NEXT_PUBLIC_BENEFICIARY_OPTIMISM: process.env.NEXT_PUBLIC_BENEFICIARY_OPTIMISM || '0xYourOptimismAddress',
  },
};