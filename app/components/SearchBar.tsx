
'use client';

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

const MOCK_HASHTAGS = [
  "#web3", "#blockchain", "#nft", "#solidity", "#optimism", "#defi", "#crypto", "#dao"
];
const MOCK_MENTIONS = [
  "@vitalik", "@satoshi", "@zksync", "@arbitrum", "@dankrad"
];

const SearchBar: React.FC = () => {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  useEffect(() => {
    if (!value) {
      setSuggestions([]);
      return;
    }
    const input = value.toLowerCase();
    let tagSugs = MOCK_HASHTAGS.filter(tag => tag.toLowerCase().includes(input));
    let menSugs = MOCK_MENTIONS.filter(tag => tag.toLowerCase().includes(input));
    setSuggestions([...tagSugs, ...menSugs].slice(0, 5));
  }, [value]);

  return (
    <div className="relative w-full max-w-[343px] mx-auto">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-twitter" />
      </div>
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Search vents, #projects..."
        className="w-full h-10 pl-10 pr-4 rounded-lg bg-vent-card text-base text-white placeholder-vent-muted focus:outline-none focus:ring-1 focus:ring-twitter"
        aria-label="Search"
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-10 bg-vent-card border border-twitter w-full mt-1 rounded shadow-lg">
          {suggestions.map((item, idx) => (
            <li
              key={item + idx}
              className="cursor-pointer px-3 py-2 hover:bg-twitter hover:text-white text-white text-meta"
              onMouseDown={() => setValue(item)}
              tabIndex={0}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
