
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Footer from '@/components/Footer';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileTabs from '@/components/profile/ProfileTabs';
import ProfileContent from '@/components/profile/ProfileContent';
import useUserProfile from '@/hooks/useUserProfile';
import { useToast } from '@/components/ui/use-toast';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'vents' | 'votes' | 'history'>('vents');
  const profile = useUserProfile();
  
  // Show error toast if profile fails to load
  React.useEffect(() => {
    if (profile.error) {
      toast({
        title: 'Error',
        description: profile.error,
        variant: 'destructive',
      });
    }
  }, [profile.error, toast]);
  
  return (
    <div className="min-h-screen bg-vent-bg flex flex-col">
      <header className="fixed top-0 left-0 right-0 h-header bg-vent-bg border-b border-gray-800 z-10">
        <div className="max-w-lg mx-auto px-4 h-full flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)} 
            className="text-white p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          
          <h1 className="text-xl font-bold text-white">Profile</h1>
          
          <div className="w-10" />
        </div>
      </header>
      
      <main className="flex-1 max-w-lg mx-auto w-full pt-[calc(56px+1rem)] pb-footer px-4">
        {profile.isLoading ? (
          // Loading skeleton
          <div className="animate-pulse space-y-4">
            <div className="h-24 bg-gray-700 rounded-lg w-full"></div>
            <div className="h-12 bg-gray-700 rounded-lg w-full"></div>
            <div className="h-32 bg-gray-700 rounded-lg w-full"></div>
          </div>
        ) : (
          <>
            <ProfileHeader 
              username={profile.username}
              walletAddress={profile.walletAddress}
              points={profile.points}
              resetDate={profile.resetDate}
              ventsCount={profile.ventsCount}
              votesCount={profile.votesCount}
            />
            
            <ProfileTabs 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
            
            <ProfileContent 
              activeTab={activeTab}
              userVents={profile.userVents}
              userVotes={profile.userVotes}
              pointsHistory={profile.pointsHistory}
            />
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
