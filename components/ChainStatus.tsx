export const CHAINS = [
  { id: 1, name: 'Ethereum' },
  { id: 56, name: 'BSC' },
  { id: 137, name: 'Polygon' },
  { id: 42161, name: 'Arbitrum' },
  { id: 10, name: 'Optimism' },
];

export default function ChainStatus() {
  return (
    <div className="flex flex-wrap gap-4 justify-center my-4">
      {CHAINS.map((c) => (
        <div key={c.id} className="bg-gray-800 px-4 py-2 rounded text-yellow-200 text-sm flex items-center gap-2">
          <span className="font-bold">{c.name}</span>
          <span className="text-green-400">● Online</span>
        </div>
      ))}
    </div>
  );
} 