
import React from "react";

const supabaseProjectId = "gxqazwlpoxjnhhdflibz";

const AdminDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-vent-bg flex flex-col items-center pt-20">
      <h1 className="text-2xl font-bold text-white mb-8">Supabase Usage Stats</h1>
      <iframe
        title="Supabase Usage"
        src={`https://supabase.com/dashboard/project/${supabaseProjectId}/settings/usage`}
        className="w-full max-w-3xl h-[700px] rounded border"
      />
      <div className="text-vent-muted mt-3">
        View detailed usage stats directly in your Supabase dashboard.
      </div>
    </div>
  );
};
export default AdminDashboard;
