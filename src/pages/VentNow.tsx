
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const MAX_CHAR_COUNT = 280;

const VentNow: React.FC = () => {
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
    <div className="min-h-screen bg-vent-bg flex flex-col">
      <header className="fixed top-0 left-0 right-0 h-header bg-vent-bg border-b border-gray-800 z-10">
        <div className="max-w-lg mx-auto px-4 h-full flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)} 
            className="text-white p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          
          <h1 className="text-xl font-bold text-white">Vent Now</h1>
          
          <div className="flex items-center gap-1 text-white">
            <span className="text-base">100 Points</span>
          </div>
        </div>
      </header>
      
      <main className="flex-1 max-w-lg mx-auto w-full pt-[calc(56px+1rem)] pb-4 px-4">
        <form className="w-full max-w-[343px] mx-auto flex flex-col gap-4">
          <div className="relative">
            <Textarea
              placeholder="What's your Web3 experience? Be honest..."
              className="min-h-[200px] w-full bg-vent-card text-white border-none rounded-lg p-3 resize-none"
              value={content}
              onChange={handleContentChange}
            />
            <div className={`absolute bottom-2 right-3 text-sm ${isOverCharLimit ? 'text-red-500' : 'text-vent-muted'}`}>
              {content.length}/{MAX_CHAR_COUNT}
            </div>
          </div>
          
          <div className="bg-vent-card rounded-lg p-3 w-full">
            <div className="flex justify-between items-center mb-3">
              <Button 
                type="button"
                onClick={handleUploadClick}
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
                onChange={handleFileChange}
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
                  onClick={removeEvidence}
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>
            )}
          </div>
          
          <div className="relative">
            <Input
              className="w-full bg-vent-card text-white border-none rounded-lg p-3"
              placeholder="Add #project or @project..."
              value={tagInput}
              onChange={handleTagInputChange}
              onKeyDown={handleTagInputKeyDown}
            />
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-1 bg-twitter/20 text-twitter rounded-full px-2 py-1"
                  >
                    <span>{tag}</span>
                    <button 
                      type="button" 
                      onClick={() => removeTag(tag)}
                      className="hover:bg-black/20 rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            className="w-full h-12 mt-4 rounded-lg font-bold bg-gradient-to-r from-twitter to-[#7B61FF] hover:opacity-90 disabled:opacity-50"
          >
            Post Vent (20 points)
          </Button>
        </form>
      </main>
    </div>
  );
};

export default VentNow;
