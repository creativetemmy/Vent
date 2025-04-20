
import React from "react";
import { Link } from "lucide-react";

interface EvidenceImageProps {
  url: string;
  onClick?: (e: React.MouseEvent) => void;
}

const EvidenceImage: React.FC<EvidenceImageProps> = ({ url, onClick }) => (
  <div className="hover-scale" onClick={onClick}>
    <div className="relative">
      <img
        src={url}
        alt="Vent evidence"
        className="h-16 w-16 object-cover rounded"
      />
      <Link className="absolute bottom-1 right-1 h-4 w-4 text-white bg-black/50 rounded-full p-0.5" />
    </div>
  </div>
);

export default EvidenceImage;
