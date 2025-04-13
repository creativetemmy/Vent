
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Share, ThumbsUp, ThumbsDown, MessageSquare, Check, Star } from 'lucide-react';
import { ventData } from '../data/vents';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

const VentDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  // Find the vent with the matching ID
  const vent = ventData.find(v => v.id === id);
  
  if (!vent) {
    return (
      <div className="min-h-screen bg-vent-bg flex flex-col items-center justify-center">
        <p className="text-white text-xl">Vent not found</p>
        <Button 
          onClick={() => navigate('/')} 
          className="mt-4 bg-twitter hover:bg-twitter/90"
        >
          Go Home
        </Button>
      </div>
    );
  }

  // Mock project response data
  const projectResponse = vent.mentions.length > 0 ? {
    name: vent.mentions[0].replace('@', ''),
    content: "We've optimized fees in our latest upgrade. The gas prices were unusually high at the time of your transaction. Please contact our support team for assistance.",
    evidence: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop&ixlib=rb-4.0.3",
    verified: true
  } : null;

  // Mock counter-vents data
  const counterVents = [
    {
      id: "cv1",
      username: "defi_insider.eth",
      content: "Actually, fees were pretty fair considering the network congestion. I swapped around the same time and paid similar fees.",
      evidence: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3",
      timeAgo: "1h ago"
    },
    {
      id: "cv2",
      username: "eth_newbie.eth",
      content: "I had the same issue! Gas fees are killing me lately. Anyone knows a better alternative?",
      timeAgo: "30m ago"
    }
  ];

  return (
    <div className="min-h-screen bg-vent-bg flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-header bg-vent-bg border-b border-gray-800 z-10">
        <div className="max-w-lg mx-auto px-4 h-full flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)} 
            className="text-white p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          
          <h1 className="text-xl font-bold text-white">Vent Details</h1>
          
          <button className="text-white p-2">
            <Share className="h-5 w-5" />
          </button>
        </div>
      </header>
      
      {/* Content */}
      <main className="flex-1 max-w-lg mx-auto w-full pt-[calc(56px+1rem)] pb-[72px] px-4">
        <ScrollArea className="w-full max-w-[343px] mx-auto h-[calc(100vh-56px-64px-32px)]">
          {/* Main Vent Card */}
          <div className="w-full max-w-[343px] bg-[#4A4A4A] rounded-lg p-4 mb-4">
            <div className="flex justify-between items-start mb-2">
              <span className="font-bold text-base text-white">{vent.username}</span>
              <span className="text-sm text-vent-muted">{vent.timeAgo}</span>
            </div>
            
            <p className="text-base mb-3 text-white">{vent.content}</p>
            
            <div className="flex flex-wrap gap-1 mb-3">
              {vent.hashtags.map((tag, index) => (
                <span key={index} className="text-twitter text-sm cursor-pointer hover:underline">
                  {tag}
                </span>
              ))}
              {vent.mentions.map((mention, index) => (
                <span key={index} className="text-twitter text-sm cursor-pointer hover:underline ml-1">
                  {mention}
                </span>
              ))}
            </div>
            
            {vent.image && (
              <div className="mb-3">
                <img 
                  src={vent.image} 
                  alt="Vent evidence" 
                  className="w-full h-auto max-h-[200px] object-cover rounded"
                />
              </div>
            )}
          </div>
          
          {/* Project Response Card (if exists) */}
          {projectResponse && (
            <div className="w-full max-w-[343px] bg-vent-card rounded-lg p-4 mb-4 border-2 border-yellow-500">
              <div className="flex items-center gap-2 mb-2">
                {projectResponse.verified && (
                  <div className="bg-yellow-500 rounded-full p-0.5">
                    <Check className="h-3 w-3 text-black" />
                  </div>
                )}
                <span className="font-bold text-base text-white">@{projectResponse.name}</span>
              </div>
              
              <p className="text-base mb-3 text-white">{projectResponse.content}</p>
              
              {projectResponse.evidence && (
                <div className="mb-2">
                  <img 
                    src={projectResponse.evidence} 
                    alt="Project response evidence" 
                    className="h-20 w-20 object-cover rounded"
                  />
                </div>
              )}
            </div>
          )}
          
          {/* Counter-Vents Section */}
          <div className="mb-4">
            <h2 className="text-white text-lg font-semibold mb-3">Counter-Vents</h2>
            
            {counterVents.map((cv) => (
              <div key={cv.id} className="w-full max-w-[343px] bg-vent-card rounded-lg p-3 mb-3 ml-4 border-l-2 border-gray-600">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-sm text-white">{cv.username}</span>
                  <span className="text-xs text-vent-muted">{cv.timeAgo}</span>
                </div>
                
                <p className="text-sm mb-2 text-white">{cv.content}</p>
                
                {cv.evidence && (
                  <div className="mb-2">
                    <img 
                      src={cv.evidence} 
                      alt="Counter vent evidence" 
                      className="h-16 w-16 object-cover rounded"
                    />
                  </div>
                )}
              </div>
            ))}
            
            {/* Add Counter-Vent Button */}
            <Button 
              className="bg-twitter hover:bg-twitter/90 h-10 px-4 flex items-center gap-2 mt-3"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Add Counter-Vent (20 🌟)</span>
            </Button>
          </div>
        </ScrollArea>
      </main>
      
      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 h-footer bg-vent-bg border-t border-gray-800 z-10">
        <div className="max-w-lg mx-auto h-full flex justify-center items-center gap-8 px-4">
          <div className="flex flex-col items-center">
            <button className="flex flex-col items-center gap-1">
              <ThumbsUp className="h-6 w-6 text-green-500" />
              <div className="flex items-center">
                <span className="text-green-500 text-sm">{vent.upvotes}</span>
                <Star className="h-3 w-3 text-twitter ml-1" />
                <span className="text-twitter text-xs">10</span>
              </div>
            </button>
          </div>
          
          <div className="flex flex-col items-center">
            <button className="flex flex-col items-center gap-1">
              <ThumbsDown className="h-6 w-6 text-red-500" />
              <div className="flex items-center">
                <span className="text-red-500 text-sm">{vent.downvotes}</span>
                <Star className="h-3 w-3 text-twitter ml-1" />
                <span className="text-twitter text-xs">10</span>
              </div>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default VentDetails;
