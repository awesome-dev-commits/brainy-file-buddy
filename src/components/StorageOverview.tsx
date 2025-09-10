import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { mockStorageStats, formatFileSize } from "@/data/mockData";
import { HardDrive, Database, FolderOpen } from "lucide-react";

export const StorageOverview = () => {
  const { totalSpace, usedSpace, availableSpace, breakdown } = mockStorageStats;
  const usagePercentage = (usedSpace / totalSpace) * 100;

  const fileTypeData = [
    { type: "Videos", size: breakdown.videos, color: "bg-file-videos", icon: "🎬" },
    { type: "Images", size: breakdown.images, color: "bg-file-images", icon: "🖼️" },
    { type: "Documents", size: breakdown.documents, color: "bg-file-documents", icon: "📄" },
    { type: "Audio", size: breakdown.audio, color: "bg-file-audio", icon: "🎵" },
    { type: "Other", size: breakdown.other, color: "bg-file-other", icon: "📦" },
  ];

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
            <div className="text-2xl font-bold text-foreground">127,432</div>
            <p className="text-xs text-muted-foreground">Across all sources</p>
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
            <div className="text-2xl font-bold text-warning">2,847</div>
            <p className="text-xs text-muted-foreground">~{formatFileSize(5.2 * 1024 * 1024 * 1024)} potential savings</p>
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
            <div className="text-2xl font-bold text-success">{formatFileSize(25.7 * 1024 * 1024 * 1024)}</div>
            <p className="text-xs text-muted-foreground">Safe to remove</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};