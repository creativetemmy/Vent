
import React from 'react';
import VentHeader from '@/components/VentNow/VentHeader';
import ContentInput from '@/components/VentNow/ContentInput';
import EvidenceUpload from '@/components/VentNow/EvidenceUpload';
import TagInput from '@/components/VentNow/TagInput';
import LiveVentPreview from '@/components/VentNow/LiveVentPreview';
import PointsInfo from '@/components/VentNow/PointsInfo';
import SubmitButton from '@/components/VentNow/SubmitButton';
import { useVentForm } from '@/hooks/useVentForm';

const MAX_CHAR_COUNT = 280;
const VENT_COST = 20;
const MOCK_USER_ID = "user0011223344"; // Replace this with real user/auth

const VentNow: React.FC = () => {
  const {
    content,
    tags,
    tagInput,
    evidence,
    userPoints,
    isSubmitting,
    fileInputRef,
    handleContentChange,
    handleTagInputChange,
    handleTagInputKeyDown,
    removeTag,
    handleUploadClick,
    handleFileChange,
    removeEvidence,
    handleSubmit,
    isOverCharLimit,
    isSubmitDisabled
  } = useVentForm({
    initialPoints: 30,
    ventCost: VENT_COST,
    userId: MOCK_USER_ID
  });

  return (
    <div className="min-h-screen bg-vent-bg flex flex-col font-sans">
      <VentHeader />
      <main className="flex-1 max-w-lg mx-auto w-full pt-[calc(56px+1rem)] pb-8 px-4">
        <h1 className="text-header text-white text-center font-bold mb-6 mt-4" 
            style={{ marginBottom: 24, fontFamily: "Inter", fontSize: 20 }}>
          Share Your Web3 Experience
        </h1>
        <form className="w-full max-w-[343px] mx-auto flex flex-col gap-6" style={{ gap: 24 }}>
          <ContentInput
            content={content}
            onContentChange={handleContentChange}
            maxCharCount={MAX_CHAR_COUNT}
          />
          <EvidenceUpload
            evidence={evidence}
            onUploadClick={handleUploadClick}
            onRemoveEvidence={removeEvidence}
            fileInputRef={fileInputRef}
            onFileChange={handleFileChange}
          />
          <TagInput
            tags={tags}
            tagInput={tagInput}
            onTagInputChange={handleTagInputChange}
            onTagInputKeyDown={handleTagInputKeyDown}
            onRemoveTag={removeTag}
          />
          <PointsInfo 
            userId={MOCK_USER_ID}
            userPoints={userPoints}
          />
          <SubmitButton
            isSubmitting={isSubmitting}
            isDisabled={isSubmitDisabled}
            ventCost={VENT_COST}
            onClick={handleSubmit}
          />
        </form>
        <div style={{ marginTop: 24 }}>
          <LiveVentPreview
            content={content}
            evidence={evidence}
            tags={tags}
            userId={MOCK_USER_ID}
            points={userPoints}
            createdAt={new Date().toISOString()}
          />
        </div>
      </main>
    </div>
  );
};

export default VentNow;
