
import React from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface TagInputProps {
  tags: string[];
  tagInput: string;
  onTagInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTagInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onRemoveTag: (tag: string) => void;
}

const TagInput: React.FC<TagInputProps> = ({
  tags,
  tagInput,
  onTagInputChange,
  onTagInputKeyDown,
  onRemoveTag
}) => {
  return (
    <div className="relative">
      <Input
        className="w-full bg-vent-card text-white border-none rounded-lg p-3"
        placeholder="Add #project or @project..."
        value={tagInput}
        onChange={onTagInputChange}
        onKeyDown={onTagInputKeyDown}
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
                onClick={() => onRemoveTag(tag)}
                className="hover:bg-black/20 rounded-full"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagInput;
