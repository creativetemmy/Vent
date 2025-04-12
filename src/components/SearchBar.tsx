
import React from 'react';
import { Search } from 'lucide-react';

const SearchBar: React.FC = () => {
  return (
    <div className="relative w-full max-w-[343px] mx-auto">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-muted-foreground" />
      </div>
      <input
        type="text"
        placeholder="Search vents, #projects..."
        className="w-full h-10 pl-10 pr-4 rounded-lg bg-vent-card text-sm text-foreground placeholder-vent-muted focus:outline-none focus:ring-1 focus:ring-twitter"
      />
    </div>
  );
};

export default SearchBar;
