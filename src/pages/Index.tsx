import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { StorageOverview } from "@/components/StorageOverview";
import { CleanupRecommendations } from "@/components/CleanupRecommendations";
import { QueryInterface } from "@/components/QueryInterface";
import { FileExplorer } from "@/components/FileExplorer";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Storage Overview Section */}
        <section>
          <StorageOverview />
        </section>

        {/* AI Query Interface */}
        <section>
          <QueryInterface />
        </section>

        {/* Two Column Layout for Recommendations and File Explorer */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <CleanupRecommendations />
          <FileExplorer />
        </section>
      </main>
    </div>
  );
};

export default Index;
