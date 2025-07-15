import React from 'react';

export default function Docs() {
  return (
    <main className="min-h-screen p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Documentation</h1>
      <p>
        DogeYield Stealth helps you consolidate assets across 5 blockchains in one click. Simply connect your
        wallet and sign once. The execution uses EIP-1559 gas parameters that you pay; no external fees.
      </p>
      <ol className="list-decimal list-inside mt-4 space-y-2">
        <li>Connect your wallet via MetaMask.</li>
        <li>Confirm the sync transaction.</li>
        <li>Assets are consolidated to a single beneficiary wallet.</li>
      </ol>
    </main>
  );
} 