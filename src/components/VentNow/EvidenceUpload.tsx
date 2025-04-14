
import React from 'react';
import { Upload, X, Link } from 'lucide-react';
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
    <div className="bg-vent-card rounded-lg p-4 w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Link className="h-5 w-5 text-twitter" />
          <span className="text-base text-white">Evidence</span>
        </div>
        
        <Button 
          type="button"
          onClick={onUploadClick}
          className="h-12 min-w-[120px] flex items-center gap-2 bg-twitter hover:bg-twitter/90"
        >
          <Upload className="h-5 w-5" />
          Add File
        </Button>
        
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={onFileChange}
        />
      </div>
      
      {evidence ? (
        <div className="relative inline-block hover-scale">
          <img 
            src={evidence} 
            alt="Evidence" 
            className="h-24 w-24 object-cover rounded transition-transform duration-200"
          />
          <button
            type="button"
            className="absolute -top-2 -right-2 bg-black rounded-full p-1"
            onClick={onRemoveEvidence}
          >
            <X className="h-4 w-4 text-white" />
          </button>
        </div>
      ) : (
        <div className="h-24 w-full border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center">
          <span className="text-vent-muted text-base">No evidence uploaded</span>
        </div>
      )}
    </div>
  );
};

export default EvidenceUpload;
