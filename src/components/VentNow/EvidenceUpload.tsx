
import React from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EvidenceUploadProps {
  evidence: string | null;
  onUploadClick: () => void;
  onRemoveEvidence: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EvidenceUpload: React.FC<EvidenceUploadProps> = ({
  evidence,
  onUploadClick,
  onRemoveEvidence,
  fileInputRef,
  onFileChange
}) => {
  return (
    <div className="bg-vent-card rounded-lg p-3 w-full">
      <div className="flex justify-between items-center mb-3">
        <Button 
          type="button"
          onClick={onUploadClick}
          className="flex items-center gap-2 bg-twitter hover:bg-twitter/90"
        >
          <Upload className="h-4 w-4" />
          Add Evidence
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={onFileChange}
        />
        <span className="text-sm text-white">Pic/Link, 5MB max</span>
      </div>
      
      {evidence && (
        <div className="relative inline-block">
          <img 
            src={evidence} 
            alt="Evidence" 
            className="h-20 w-20 object-cover rounded"
          />
          <button
            type="button"
            className="absolute -top-2 -right-2 bg-black rounded-full p-0.5"
            onClick={onRemoveEvidence}
          >
            <X className="h-4 w-4 text-white" />
          </button>
        </div>
      )}
    </div>
  );
};

export default EvidenceUpload;
