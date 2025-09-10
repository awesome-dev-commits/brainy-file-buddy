import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { mockCleanupRecommendations, formatFileSize } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, AlertTriangle, Info, Trash2, Eye, Play } from "lucide-react";

export const CleanupRecommendations = () => {
  const { toast } = useToast();

  const handleCleanup = (recommendation: any) => {
    toast({
      title: "Cleanup Permission Required",
      description: `To delete ${recommendation.fileCount} files and free ${formatFileSize(recommendation.potentialSavings)}, connect to Supabase for Google Drive API access.`,
      variant: "destructive",
    });
  };
  const getRiskIcon = (level: string) => {
    switch (level) {
      case "low": return <Info className="h-4 w-4 text-success" />;
      case "medium": return <AlertTriangle className="h-4 w-4 text-warning" />;
      case "high": return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low": return "bg-success/10 text-success";
      case "medium": return "bg-warning/10 text-warning";
      case "high": return "bg-destructive/10 text-destructive";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "duplicates": return "🔄";
      case "large-files": return "📦";
      case "junk": return "🗑️";
      case "archive": return "📁";
      default: return "📄";
    }
  };

  return (
    <Card className="bg-gradient-card border-border shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Sparkles className="h-5 w-5 text-accent" />
          AI Cleanup Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockCleanupRecommendations.map((recommendation) => (
          <div
            key={recommendation.id}
            className="p-4 rounded-lg bg-secondary/30 border border-border/50 hover:bg-secondary/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <span className="text-xl">{getCategoryIcon(recommendation.category)}</span>
                <div className="space-y-1">
                  <h4 className="font-medium text-foreground">{recommendation.title}</h4>
                  <p className="text-sm text-muted-foreground">{recommendation.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className={getRiskColor(recommendation.riskLevel)}>
                      {getRiskIcon(recommendation.riskLevel)}
                      {recommendation.riskLevel} risk
                    </Badge>
                    <Badge variant="outline" className="bg-primary/10 text-primary">
                      {recommendation.fileCount} files
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-success">
                  {formatFileSize(recommendation.potentialSavings)}
                </div>
                <div className="text-xs text-muted-foreground">potential savings</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" className="h-8">
                <Eye className="h-3 w-3 mr-1" />
                Preview
              </Button>
              <Button size="sm" variant="outline" className="h-8">
                <Play className="h-3 w-3 mr-1" />
                Simulate
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    size="sm" 
                    variant={recommendation.riskLevel === "low" ? "default" : "outline"}
                    className="h-8"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    {recommendation.riskLevel === "low" ? "Safe Clean" : "Review"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Cleanup Action</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to {recommendation.title.toLowerCase()}? This will affect {recommendation.fileCount} files and potentially free {formatFileSize(recommendation.potentialSavings)} of space.
                      <br /><br />
                      <strong>Risk Level: {recommendation.riskLevel}</strong>
                      <br />
                      {recommendation.description}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleCleanup(recommendation)}>
                      Proceed with Cleanup
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}

        <div className="mt-6 p-4 rounded-lg bg-gradient-primary/10 border border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-foreground">Total Cleanup Potential</h4>
              <p className="text-sm text-muted-foreground">
                Based on current recommendations
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                {formatFileSize(
                  mockCleanupRecommendations.reduce(
                    (total, rec) => total + rec.potentialSavings,
                    0
                  )
                )}
              </div>
              <div className="text-xs text-muted-foreground">can be freed</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};