import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatFileSize } from "@/data/mockData";
import { HardDrive, Database, FolderOpen } from "lucide-react";
import { useRealTimeData } from "@/hooks/useRealTimeData";

export const StorageOverview = () => {
  const { stats, breakdown, loading } = useRealTimeData();
  
  // Use real data or fallback to reasonable defaults
  const totalSpace = 15 * 1024 * 1024 * 1024 * 1024; // 15TB typical Google Drive
  const usedSpace = stats.totalSize || 0;
  const availableSpace = totalSpace - usedSpace;
  const usagePercentage = totalSpace > 0 ? (usedSpace / totalSpace) * 100 : 0;

  const fileTypeData = [
    { type: "Videos", size: breakdown.videos, color: "bg-file-videos", icon: "🎬" },
    { type: "Images", size: breakdown.images, color: "bg-file-images", icon: "🖼️" },
    { type: "Documents", size: breakdown.documents, color: "bg-file-documents", icon: "📄" },
    { type: "Audio", size: breakdown.audio, color: "bg-file-audio", icon: "🎵" },
    { type: "Other", size: breakdown.other, color: "bg-file-other", icon: "📦" },
  ].filter(item => item.size > 0); // Only show types with data

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-1/3"></div>
              <div className="h-3 bg-muted rounded"></div>
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-8 bg-muted rounded"></div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-8 bg-muted rounded w-1/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Main Storage Card */}
      <Card className="md:col-span-2 bg-gradient-card border-border shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <HardDrive className="h-5 w-5 text-primary" />
            Storage Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Used Space</span>
              <span className="text-foreground font-medium">
                {formatFileSize(usedSpace)} of {formatFileSize(totalSpace)}
              </span>
            </div>
            <Progress value={usagePercentage} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{usagePercentage.toFixed(1)}% used</span>
              <span>{formatFileSize(availableSpace)} available</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Breakdown by Type</h4>
            {fileTypeData.map((item) => {
              const percentage = (item.size / usedSpace) * 100;
              return (
                <div key={item.type} className="flex items-center gap-3">
                  <span className="text-lg">{item.icon}</span>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground">{item.type}</span>
                      <span className="text-muted-foreground">
                        {formatFileSize(item.size)} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="space-y-4">
        <Card className="bg-gradient-card border-border shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm text-foreground">
              <Database className="h-4 w-4 text-info" />
              Total Files
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.totalFiles.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">In your Google Drive</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm text-foreground">
              <FolderOpen className="h-4 w-4 text-warning" />
              Duplicates Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{stats.duplicateCount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">~{formatFileSize(stats.potentialSavings)} potential savings</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm text-foreground">
              <HardDrive className="h-4 w-4 text-success" />
              Cleanup Potential
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{formatFileSize(stats.potentialSavings)}</div>
            <p className="text-xs text-muted-foreground">Safe to remove</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};