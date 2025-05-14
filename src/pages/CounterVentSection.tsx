
import React from 'react';
import CounterVentItem from './CounterVentItem';
import CounterVentForm from './CounterVentForm';
import { COUNTER_VENT_COST } from '@/hooks/useVentDetails';

interface CounterVentSectionProps {
  counterVents: any[];
  counterReply: string;
  setCounterReply: (value: string) => void;
  isPostingReply: boolean;
  handlePostCounterVent: () => void;
  userPoints: number | null;
}

const CounterVentSection: React.FC<CounterVentSectionProps> = ({
  counterVents,
  counterReply,
  setCounterReply,
  isPostingReply,
  handlePostCounterVent,
  userPoints,
}) => {
  return (
    <div className="mb-4">
      <h2 className="text-white text-lg font-semibold mb-3" style={{ fontFamily: "Inter" }}>Counter-Vents</h2>
      {counterVents.map(cv => (
        <CounterVentItem key={cv.id} counterVent={cv} />
      ))}
      <CounterVentForm
        counterReply={counterReply}
        setCounterReply={setCounterReply}
        isPostingReply={isPostingReply}
        handlePostCounterVent={handlePostCounterVent}
        userPoints={userPoints}
        COUNTER_VENT_COST={COUNTER_VENT_COST}
      />
    </div>
  );
};

export default CounterVentSection;
