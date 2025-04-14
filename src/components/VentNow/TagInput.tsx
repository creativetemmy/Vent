
import React from 'react';
import { X, Hash } from 'lucide-react';
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
    <div className="bg-vent-card rounded-lg p-4 w-full">
      <div className="flex items-center gap-2 mb-3">
        <Hash className="h-5 w-5 text-twitter" />
        <span className="text-base text-white">Tags</span>
      </div>
      
      <Input
        className="w-full h-12 bg-[#1E1E1E] text-white text-base border-none rounded-lg p-3 mb-3"
        placeholder="Add #project or @project..."
        value={tagInput}
        onChange={onTagInputChange}
        onKeyDown={onTagInputKeyDown}
      />
      
      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag, index) => (
            <div 
              key={index} 
              className="flex items-center gap-1 bg-twitter/20 text-twitter rounded-full px-3 py-2"
            >
              <span className="text-base">{tag}</span>
              <button 
                type="button" 
                onClick={() => onRemoveTag(tag)}
                className="hover:bg-black/20 rounded-full p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-vent-muted text-base">No tags added yet</div>
      )}
    </div>
  );
};

export default TagInput;
