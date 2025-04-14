
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Star, Star as StarIcon, Chain, Wallet } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import ContentInput from './ContentInput';
import EvidenceUpload from './EvidenceUpload';
import TagInput from './TagInput';

const MAX_CHAR_COUNT = 280;
const VENT_COST = 20;

const VentForm: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [evidence, setEvidence] = useState<string | null>(null);
  const [userPoints, setUserPoints] = useState(30); // Mock user points, would come from auth
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      
      // Validate tag starts with # or @
      let newTag = tagInput.trim();
      if (!newTag.startsWith('#') && !newTag.startsWith('@')) {
        newTag = '#' + newTag;
      }
      
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setEvidence(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeEvidence = () => {
    setEvidence(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (userPoints < VENT_COST) {
      toast({
        title: "Insufficient Points",
        description: `You need ${VENT_COST} stars to post a vent. You currently have ${userPoints}.`,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Log on Optimism (mock)
      console.log("Logging vent on Optimism...");
      
      // Deduct points
      setUserPoints(prev => prev - VENT_COST);
      
      toast({
        title: "Vent Posted",
        description: `Your vent has been posted and ${VENT_COST} stars have been deducted.`,
      });
      
      // Navigate back to the home page after posting
      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post your vent. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isOverCharLimit = content.length > MAX_CHAR_COUNT;
  const isSubmitDisabled = !content.trim() || isOverCharLimit || isSubmitting || userPoints < VENT_COST;

  return (
    <form className="w-full max-w-[343px] mx-auto flex flex-col gap-6 animate-fade-in">
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
      
      <div className="flex items-center gap-2 bg-vent-card rounded-lg p-4 pulse">
        <Wallet className="h-5 w-5 text-twitter" />
        <span className="text-base text-white">Account: user.eth</span>
      </div>
      
      <div className="flex items-center gap-2 bg-vent-card rounded-lg p-4 pulse">
        <StarIcon className="h-5 w-5 text-yellow-500" />
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
      
      {userPoints < VENT_COST && (
        <p className="text-red-500 text-center">
          Insufficient stars. You need {VENT_COST} stars to post.
        </p>
      )}
    </form>
  );
};

export default VentForm;
