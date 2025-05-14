
'use client';

import React from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  counterReply: string;
  setCounterReply: (v: string) => void;
  isPostingReply: boolean;
  handlePostCounterVent: () => void;
  userPoints: number | null;
  COUNTER_VENT_COST: number;
}

const CounterVentForm: React.FC<Props> = ({
  counterReply,
  setCounterReply,
  isPostingReply,
  handlePostCounterVent,
  userPoints,
  COUNTER_VENT_COST
}) => (
  <div className="flex flex-col gap-2 mt-4">
    <textarea
      className="w-full rounded p-2 resize-none bg-[#262626] text-white"
      rows={3}
      placeholder="Write your counter-vent..."
      value={counterReply}
      onChange={e => setCounterReply(e.target.value)}
      disabled={isPostingReply}
    />
    <div className="flex items-center gap-2">
      <Button
        className="bg-twitter hover:bg-twitter/90 h-10 px-4 flex items-center gap-2"
        onClick={handlePostCounterVent}
        disabled={isPostingReply || (userPoints !== null && userPoints < COUNTER_VENT_COST)}
      >
        <MessageSquare className="h-4 w-4" />
        {isPostingReply ? "Posting..." : `Add Counter-Vent (${COUNTER_VENT_COST} 🌟)`}
      </Button>
      <span className="text-white text-xs">
        Available: {userPoints ?? "--"} ⭐
      </span>
    </div>
  </div>
);

export default CounterVentForm;
