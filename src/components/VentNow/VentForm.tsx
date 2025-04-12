
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ContentInput from './ContentInput';
import EvidenceUpload from './EvidenceUpload';
import TagInput from './TagInput';

const MAX_CHAR_COUNT = 280;

const VentForm: React.FC = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [evidence, setEvidence] = useState<string | null>(null);
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

  const handleSubmit = () => {
    // Here you would typically send the vent data to your backend
    console.log({
      content,
      tags,
      evidence
    });
    
    // Navigate back to the home page after posting
    navigate('/');
  };

  const isOverCharLimit = content.length > MAX_CHAR_COUNT;
  const isSubmitDisabled = !content.trim() || isOverCharLimit;

  return (
    <form className="w-full max-w-[343px] mx-auto flex flex-col gap-4">
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
      
      <Button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitDisabled}
        className="w-full h-12 mt-4 rounded-lg font-bold bg-gradient-to-r from-twitter to-[#7B61FF] hover:opacity-90 disabled:opacity-50"
      >
        Post Vent (20 points)
      </Button>
    </form>
  );
};

export default VentForm;
