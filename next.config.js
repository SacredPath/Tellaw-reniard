/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  env: { BENEFICIARY_WALLET: process.env.BENEFICIARY_WALLET || '0xYourExitAddress' },
};