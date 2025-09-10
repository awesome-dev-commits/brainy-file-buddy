import { Header } from "@/components/Header";
import { StorageOverview } from "@/components/StorageOverview";
import { CleanupRecommendations } from "@/components/CleanupRecommendations";
import { QueryInterface } from "@/components/QueryInterface";
import { FileExplorer } from "@/components/FileExplorer";

const Index = () => {
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
