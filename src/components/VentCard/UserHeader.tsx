
import React from "react";
import { Wallet, BadgeCheck } from "lucide-react";

interface UserHeaderProps {
  userId: string;
  createdAt?: string | null;
  ensVerified?: boolean;
}

const UserHeader: React.FC<UserHeaderProps> = ({ userId, createdAt, ensVerified }) => (
  <div className="flex items-center gap-2">
    <span className="font-bold text-base text-white" style={{ fontFamily: "Inter" }}>
      {userId.slice(0, 6)}...{userId.slice(-4)}
    </span>
    {ensVerified &&
      <BadgeCheck className="h-4 w-4 text-yellow-400" aria-label="Verified ENS Project" />
    }
    <Wallet className="h-4 w-4 text-twitter" />
    <span className="text-sm text-vent-muted ml-2" style={{ fontFamily: "Inter" }}>
      {createdAt ? new Date(createdAt).toLocaleString() : ""}
    </span>
  </div>
);

export default UserHeader;
