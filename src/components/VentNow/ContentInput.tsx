
import React from 'react';
import { Textarea } from '@/components/ui/textarea';

interface ContentInputProps {
  content: string;
  onContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  maxCharCount: number;
}

const ContentInput: React.FC<ContentInputProps> = ({
  content,
  onContentChange,
  maxCharCount
}) => {
  const isOverCharLimit = content.length > maxCharCount;
  
  return (
    <div className="relative">
      <Textarea
        placeholder="What's your Web3 experience? Be honest..."
        className="min-h-[150px] w-full bg-vent-card text-white text-base border-none rounded-lg p-4 resize-none"
        value={content}
        onChange={onContentChange}
      />
      <div className={`absolute bottom-3 right-4 text-base ${isOverCharLimit ? 'text-red-500' : 'text-vent-muted'}`}>
        {content.length}/{maxCharCount}
      </div>
    </div>
  );
};

export default ContentInput;
