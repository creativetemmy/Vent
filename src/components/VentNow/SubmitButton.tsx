
import React from 'react';
import { Button } from '@/components/ui/button';

interface SubmitButtonProps {
  isSubmitting: boolean;
  isDisabled: boolean;
  ventCost: number;
  onClick: () => void;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  isSubmitting,
  isDisabled,
  ventCost,
  onClick
}) => {
  return (
    <Button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      className="w-full h-12 mt-4 rounded-lg text-base font-bold bg-twitter hover:bg-twitter/90 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isSubmitting ? "Posting..." : `Post Vent (${ventCost} ⭐)`}
    </Button>
  );
};

export default SubmitButton;
