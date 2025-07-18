import React from 'react';

export default function Whitepaper() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-pink-400 to-purple-600 flex flex-col items-center py-12 px-4">
      <div className="max-w-3xl w-full bg-white/10 rounded-2xl shadow-2xl p-8 md:p-12 text-white">
        <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-300 mb-6 text-center">SyncDoge (SDOGE) Whitepaper</h1>
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-yellow-200 mb-2">Introduction</h2>
          <p className="text-yellow-100 text-lg">SyncDoge (SDOGE) is the first cross-chain meme-coin designed to unite the fragmented meme-coin community. Built for degens, by degens, SyncDoge leverages the latest in cross-chain technology to make claiming, syncing, and flexing your meme assets seamless and fun.</p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-yellow-200 mb-2">Vision & Mission</h2>
          <p className="text-yellow-100">Our vision is to create a truly borderless meme-coin that empowers users to move, claim, and use their assets across any major EVM chain. Our mission is to build a fair, transparent, and community-driven ecosystem where every degen can participate and thrive.</p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-yellow-200 mb-2">Tokenomics</h2>
          <ul className="text-yellow-100 list-disc pl-6 space-y-2">
            <li><b>Total Supply:</b> 1,000,000,000 SDOGE</li>
            <li><b>Initial Airdrop:</b> 40% (400,000,000 SDOGE) to early claimers</li>
            <li><b>Community Rewards:</b> 25% (250,000,000 SDOGE) for staking, governance, and events</li>
            <li><b>Liquidity & Listings:</b> 20% (200,000,000 SDOGE) for DEX/CEX liquidity</li>
            <li><b>Team & Development:</b> 10% (100,000,000 SDOGE) (2-year vesting)</li>
            <li><b>Treasury:</b> 5% (50,000,000 SDOGE) for partnerships and future growth</li>
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-yellow-200 mb-2">Roadmap</h2>
          <ul className="text-yellow-100 list-disc pl-6 space-y-2">
            <li><b>Q2 2024:</b> Fairlaunch Airdrop, Multi-chain bridge deployment, Whitepaper release, Initial DEX Listings</li>
            <li><b>Q3 2024:</b> Staking & Rewards, NFT integration, Community governance launch, CEX Listings</li>
            <li><b>Q4 2024:</b> Mobile wallet app, Cross-chain swaps, DAO treasury, Major partnerships</li>
            <li><b>Q1 2025:</b> Layer 2 expansion, DeFi protocol integrations, Full open-source release</li>
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-yellow-200 mb-2">Security & Transparency</h2>
          <ul className="text-yellow-100 list-disc pl-6 space-y-2">
            <li>All contracts are open source and will be audited before mainnet launch.</li>
            <li>No private sales, no VC allocations, no hidden wallets.</li>
            <li>Community governance from day one.</li>
            <li>Multi-sig treasury for maximum security.</li>
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-yellow-200 mb-2">FAQ</h2>
          <ul className="text-yellow-100 list-disc pl-6 space-y-2">
            <li><b>How do I claim SDOGE?</b> Connect your wallet and follow the on-screen instructions. No KYC required.</li>
            <li><b>Which chains are supported?</b> Ethereum, BSC, Polygon, Arbitrum, Optimism.</li>
            <li><b>Is there a team allocation?</b> Yes, 10% with a 2-year vesting schedule.</li>
            <li><b>Is SyncDoge audited?</b> Audits are scheduled before mainnet launch. All code is open source.</li>
            <li><b>How can I get involved?</b> Join our Discord, Telegram, or follow us on Twitter for updates and governance proposals.</li>
          </ul>
        </section>
      </div>
    </div>
  );
} 