
import React from "react";
import { Wallet } from "lucide-react";

interface UserHeaderProps {
  userId: string;
  createdAt?: string | null;
}

const UserHeader: React.FC<UserHeaderProps> = ({ userId, createdAt }) => (
  <div className="flex items-center gap-2">
    <span className="font-bold text-base text-white">
      {userId.slice(0, 6)}...{userId.slice(-4)}
    </span>
    <Wallet className="h-4 w-4 text-twitter" />
    <span className="text-sm text-vent-muted ml-2">
      {createdAt ? new Date(createdAt).toLocaleString() : ""}
    </span>
  </div>
);

export default UserHeader;
