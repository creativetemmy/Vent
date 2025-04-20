
import React from "react";

interface EvidenceImageProps {
  url: string;
  onClick?: (e: React.MouseEvent) => void;
  alt?: string;
}

const EvidenceImage: React.FC<EvidenceImageProps> = ({ url, onClick, alt }) => (
  <img
    src={url}
    alt={alt || "Evidence image"}
    className="h-24 w-24 object-cover rounded cursor-pointer border border-white"
    style={{ background: "#222" }}
    onClick={onClick}
  />
);

export default EvidenceImage;
