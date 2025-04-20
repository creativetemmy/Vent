
/**
 * Utility for uploading image files to IPFS using Pinata.
 * Stores and returns the resulting IPFS CID (string).
 *
 * NOTE: Requires PINATA_JWT secret (must be set as an edge function secret).
 */

export async function uploadToIPFS(file: File): Promise<string> {
  // We'll call a Supabase Edge Function ('pinata-upload') to avoid exposing secrets in frontend.
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/functions/v1/pinata-upload", {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    throw new Error("IPFS upload failed: " + (await response.text()));
  }
  const data = await response.json();
  return data.cid as string;
}

/**
 * Returns a public IPFS gateway URL from a CID.
 */
export function getIPFSUrl(cid: string): string {
  return `https://ipfs.io/ipfs/${cid}`;
}
