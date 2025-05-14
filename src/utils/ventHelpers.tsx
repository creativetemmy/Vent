
import { getIPFSUrl } from '@/utils/ipfs';

export function renderEvidence(ventData: any) {
  if (!ventData) return null;
  if (ventData.ipfs_cid) {
    const cid = ventData.ipfs_cid;
    const url = getIPFSUrl(cid);
    return (
      <div className="mb-3">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-twitter underline font-semibold"
          aria-label="IPFS CID evidence"
        >
          Evidence CID: {cid.slice(0, 8)}...{cid.slice(-6)}
        </a>
      </div>
    );
  }
  if (ventData.evidence) {
    return (
      <div className="mb-3">
        <img
          src={ventData.evidence}
          alt="Evidence image"
          className="w-full h-auto max-h-[200px] object-cover rounded border"
        />
      </div>
    );
  }
  return null;
}

export function renderEtherscan(ventData: any) {
  if (ventData?.tx_hash) {
    return (
      <div className="mb-3">
        <a
          href={`https://optimistic.etherscan.io/tx/${ventData.tx_hash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-yellow-400 underline"
        >
          View on Etherscan
        </a>
      </div>
    );
  }
  return null;
}
