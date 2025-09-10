import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Settings, RefreshCw } from "lucide-react";

export const Header = () => {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-primary">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">AI Data De-Clutter</h1>
                <p className="text-sm text-muted-foreground">Intelligent file management assistant</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-accent/10 text-accent">
              GPT-OSS-120B Powered
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Scan Sources
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};