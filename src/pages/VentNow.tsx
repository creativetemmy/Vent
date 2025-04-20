import React, { useState, useRef } from 'react';
import VentHeader from '@/components/VentNow/VentHeader';
import ContentInput from '@/components/VentNow/ContentInput';
import EvidenceUpload from '@/components/VentNow/EvidenceUpload';
import TagInput from '@/components/VentNow/TagInput';
import LiveVentPreview from '@/components/VentNow/LiveVentPreview';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { Wallet, Star } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { uploadToIPFS } from '@/utils/ipfs';
import { hashContent } from '@/utils/hash';

const MAX_CHAR_COUNT = 280;
const VENT_COST = 20;
const MOCK_USER_ID = "user0011223344"; // Replace this with real user/auth

const VentNow: React.FC = () => {
  const { toast } = useToast();
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [evidence, setEvidence] = useState<string | null>(null);
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [userPoints, setUserPoints] = useState(30); // Replace with auth
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handlers
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value);
  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setTagInput(e.target.value);
  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      let newTag = tagInput.trim();
      if (!newTag.startsWith('#') && !newTag.startsWith('@')) newTag = '#' + newTag;
      if (!tags.includes(newTag)) setTags([...tags, newTag]);
      setTagInput('');
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
    if (userPoints < VENT_COST) {
      toast({
        title: "Insufficient Points",
        description: `You need ${VENT_COST} stars to post a vent.`,
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
        user_id: MOCK_USER_ID,
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
        const newPoints = prevPts - VENT_COST;
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
  const isSubmitDisabled = !content.trim() || isOverCharLimit || isSubmitting || userPoints < VENT_COST;

  return (
    <div className="min-h-screen bg-vent-bg flex flex-col font-sans">
      <VentHeader />
      <main className="flex-1 max-w-lg mx-auto w-full pt-[calc(56px+1rem)] pb-8 px-4">
        <h1 className="text-header text-white text-center font-bold mb-6 mt-4" style={{ marginBottom: 24, fontFamily: "Inter", fontSize: 20 }}>Share Your Web3 Experience</h1>
        <form className="w-full max-w-[343px] mx-auto flex flex-col gap-6" style={{ gap: 24 }}>
          <ContentInput
            content={content}
            onContentChange={handleContentChange}
            maxCharCount={MAX_CHAR_COUNT}
          />
          <EvidenceUpload
            evidence={evidence}
            onUploadClick={handleUploadClick}
            onRemoveEvidence={removeEvidence}
            fileInputRef={fileInputRef}
            onFileChange={handleFileChange}
          />
          <TagInput
            tags={tags}
            tagInput={tagInput}
            onTagInputChange={handleTagInputChange}
            onTagInputKeyDown={handleTagInputKeyDown}
            onRemoveTag={removeTag}
          />
          <div className="flex items-center gap-2 bg-vent-card rounded-lg p-4" style={{ margin: 0 }}>
            <Wallet className="h-5 w-5 text-twitter" />
            <span className="text-base text-white">Account: {MOCK_USER_ID.slice(0, 8)}...{MOCK_USER_ID.slice(-4)}</span>
          </div>
          <div className="flex items-center gap-2 bg-vent-card rounded-lg p-4">
            <Star className="h-5 w-5 text-yellow-500" />
            <span className="text-base text-white">Available: {userPoints} stars</span>
          </div>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            className="w-full h-12 mt-4 rounded-lg text-base font-bold bg-twitter hover:bg-twitter/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Posting..." : `Post Vent (${VENT_COST} ⭐)`}
          </Button>
        </form>
        <div style={{ marginTop: 24 }}>
          <LiveVentPreview
            content={content}
            evidence={evidence}
            tags={tags}
            userId={MOCK_USER_ID}
            points={userPoints}
            createdAt={new Date().toISOString()}
          />
        </div>
      </main>
    </div>
  );
};

export default VentNow;
