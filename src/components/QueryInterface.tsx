import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Send, MessageCircle, Zap, FileSearch } from "lucide-react";

export const QueryInterface = () => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [responses, setResponses] = useState([
    {
      id: "1",
      query: "How much space will I save if I delete videos larger than 1GB?",
      response: "Based on your storage analysis, deleting videos larger than 1GB would free up approximately 15.2 GB across 8 files. These files haven't been accessed in the last 6 months and are considered safe to remove.",
      timestamp: new Date("2024-01-20T10:30:00"),
      type: "analysis" as const,
    },
    {
      id: "2",
      query: "Find pictures shared on WhatsApp from last year",
      response: "Found 247 images from WhatsApp in 2023, totaling 1.8 GB. These include 45 duplicates that could save 180 MB if removed. Most are screenshots and low-quality images.",
      timestamp: new Date("2024-01-20T09:15:00"),
      type: "search" as const,
    },
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const newResponse = {
        id: Date.now().toString(),
        query,
        response: `Analyzing your request: "${query}". Based on your file metadata and storage patterns, I'm processing this query using GPT-OSS-120B. This would typically involve scanning file metadata, applying semantic search, and providing actionable insights.`,
        timestamp: new Date(),
        type: "analysis" as const,
      };
      
      setResponses([newResponse, ...responses]);
      setQuery("");
      setIsLoading(false);
    }, 2000);
  };

  const suggestionQueries = [
    "Show me duplicate photos from vacation trips",
    "What files are taking up the most space?",
    "Find old work documents I can archive",
    "Identify screenshots older than 30 days",
  ];

  return (
    <Card className="bg-gradient-card border-border shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Brain className="h-5 w-5 text-accent" />
          AI Query Interface
          <Badge variant="outline" className="bg-accent/10 text-accent ml-auto">
            GPT-OSS-120B
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Query Input */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask me anything about your files... e.g., 'Find large videos I haven't watched in months'"
              className="pr-12 bg-background/50 border-border/50 focus:border-primary"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="sm"
              disabled={!query.trim() || isLoading}
              className="absolute right-1 top-1 h-8 w-8 p-0"
            >
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              ) : (
                <Send className="h-3 w-3" />
              )}
            </Button>
          </div>

          {/* Quick Suggestions */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Quick suggestions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestionQueries.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => setQuery(suggestion)}
                  disabled={isLoading}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        </form>

        {/* Response History */}
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {responses.map((response) => (
            <div key={response.id} className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <MessageCircle className="h-3 w-3 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground mb-1">
                    {response.query}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {response.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                <Badge 
                  variant="outline" 
                  className={response.type === "analysis" ? "bg-accent/10 text-accent" : "bg-info/10 text-info"}
                >
                  {response.type === "analysis" ? <Zap className="h-3 w-3 mr-1" /> : <FileSearch className="h-3 w-3 mr-1" />}
                  {response.type}
                </Badge>
              </div>
              
              <div className="ml-9 p-3 rounded-lg bg-background/30 border border-border/30">
                <p className="text-sm text-foreground">{response.response}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};