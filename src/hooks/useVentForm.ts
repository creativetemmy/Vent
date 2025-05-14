
import { useState, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { uploadToIPFS } from '@/utils/ipfs';
import { hashContent } from '@/utils/hash';

interface UseVentFormProps {
  initialPoints: number;
  ventCost: number;
  userId: string;
}

interface UseVentFormReturn {
  content: string;
  setContent: (content: string) => void;
  tags: string[];
  tagInput: string;
  evidence: string | null;
  evidenceFile: File | null;
  userPoints: number;
  isSubmitting: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleTagInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTagInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  removeTag: (tagToRemove: string) => void;
  handleUploadClick: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeEvidence: () => void;
  handleSubmit: () => Promise<void>;
  isOverCharLimit: boolean;
  isSubmitDisabled: boolean;
}

export const useVentForm = ({ 
  initialPoints, 
  ventCost,
  userId 
}: UseVentFormProps): UseVentFormReturn => {
  const { toast } = useToast();
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [evidence, setEvidence] = useState<string | null>(null);
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [userPoints, setUserPoints] = useState(initialPoints);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const MAX_CHAR_COUNT = 280;
  
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value);

  const isValidTag = (tag: string) => {
    if (!tag.trim() || tags.includes(tag)) return false;
    return /^([#@][a-zA-Z0-9_]{1,30})$/.test(tag.trim());
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setTagInput(e.target.value);
  
  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      let newTag = tagInput.trim();
      if (!newTag.startsWith('#') && !newTag.startsWith('@')) newTag = '#' + newTag;
      if (isValidTag(newTag)) {
        setTags([...tags, newTag]);
        setTagInput('');
      } else {
        toast({
          title: "Invalid Tag",
          description: "Tags must be #word or @word, no spaces or special characters, and cannot be duplicates.",
          variant: "destructive",
        });
      }
    }
  };
  
  const removeTag = (tagToRemove: string) => setTags(tags.filter(tag => tag !== tagToRemove));
  
  const handleUploadClick = () => fileInputRef.current?.click();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        });
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onload = () => setEvidence(reader.result as string);
      reader.readAsDataURL(file);
      setEvidenceFile(file);
    }
  };
  
  const removeEvidence = () => {
    setEvidence(null);
    setEvidenceFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Submit real function with Optimism and IPFS
  const handleSubmit = async () => {
    if (userPoints < ventCost) {
      toast({
        title: "Insufficient Points",
        description: `You need ${ventCost} stars to post a vent.`,
        variant: "destructive"
      });
      return;
    }
    setIsSubmitting(true);

    let ipfsCid = null;
    let txHash = null;
    try {
      // Hash the content
      const contentHash = await hashContent(content);

      // Upload evidence to IPFS via Pinata if there is a file
      if (evidenceFile) {
        ipfsCid = await uploadToIPFS(evidenceFile);
      }

      // Here, you would submit a transaction to Optimism and get a txHash.
      // We'll mock this for now; replace with actual onchain code if needed.
      txHash = "0x" + Math.random().toString(16).slice(2).padEnd(64, "0"); // Mock tx hash

      // Store to Supabase
      const { error } = await supabase.from('vents').insert([{
        user_id: userId,
        content,
        content_hash: contentHash,
        hashtags: tags.filter(t => t.startsWith('#')),
        mentions: tags.filter(t => t.startsWith('@')),
        evidence: ipfsCid ? `ipfs://${ipfsCid}` : null,
        ipfs_cid: ipfsCid,
        tx_hash: txHash,
      }]);
      if (error) throw new Error(error.message);

      setUserPoints(prevPts => {
        const newPoints = prevPts - ventCost;
        toast({
          title: "Vent Posted!",
          description: `Your vent was posted! Points left: ${newPoints}`,
          variant: "default"
        });
        return newPoints;
      });

      setContent("");
      setTags([]);
      setEvidence(null);
      setEvidenceFile(null);
    } catch (err: any) {
      toast({
        title: "Submission Error",
        description: err.message || "Failed to post your vent.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isOverCharLimit = content.length > MAX_CHAR_COUNT;
  const isSubmitDisabled = !content.trim() || isOverCharLimit || isSubmitting || userPoints < ventCost;

  return {
    content,
    setContent,
    tags,
    tagInput,
    evidence,
    evidenceFile,
    userPoints,
    isSubmitting,
    fileInputRef,
    handleContentChange,
    handleTagInputChange,
    handleTagInputKeyDown,
    removeTag,
    handleUploadClick,
    handleFileChange,
    removeEvidence,
    handleSubmit,
    isOverCharLimit,
    isSubmitDisabled
  };
};
