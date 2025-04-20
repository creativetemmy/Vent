
import React from "react";

interface VentContentProps {
  content: string;
}

const VentContent: React.FC<VentContentProps> = ({ content }) => (
  <p className="text-base mb-3 line-clamp-2 text-white">{content}</p>
);

export default VentContent;
