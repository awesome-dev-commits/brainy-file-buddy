import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockFiles, formatFileSize, FileItem } from "@/data/mockData";
import { Search, Filter, FolderOpen, File, AlertCircle } from "lucide-react";

export const FileExplorer = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const filteredFiles = mockFiles.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || file.type === typeFilter;
    const matchesSource = sourceFilter === "all" || file.source === sourceFilter;
    const matchesCategory = categoryFilter === "all" || file.category === categoryFilter;
    
    return matchesSearch && matchesType && matchesSource && matchesCategory;
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case "document": return "📄";
      case "image": return "🖼️";
      case "video": return "🎬";
      case "audio": return "🎵";
      default: return "📦";
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "google-drive": return "☁️";
      case "local": return "💻";
      case "email": return "📧";
      default: return "📁";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "important": return "bg-destructive/10 text-destructive";
      case "work": return "bg-info/10 text-info";
      case "personal": return "bg-success/10 text-success";
      case "junk": return "bg-warning/10 text-warning";
      case "media": return "bg-accent/10 text-accent";
      default: return "bg-muted/10 text-muted-foreground";
    }
  };

  return (
    <Card className="bg-gradient-card border-border shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <FolderOpen className="h-5 w-5 text-primary" />
          Smart File Explorer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search files by name or content..."
              className="pl-10 bg-background/50 border-border/50 focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="File type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="document">Documents</SelectItem>
                <SelectItem value="image">Images</SelectItem>
                <SelectItem value="video">Videos</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="google-drive">Google Drive</SelectItem>
                <SelectItem value="local">Local Storage</SelectItem>
                <SelectItem value="email">Email</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="important">Important</SelectItem>
                <SelectItem value="work">Work</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="media">Media</SelectItem>
                <SelectItem value="junk">Junk</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" className="h-9">
              <Filter className="h-3 w-3 mr-1" />
              Advanced
            </Button>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Showing {filteredFiles.length} of {mockFiles.length} files
          </span>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-warning/10 text-warning">
              {filteredFiles.filter(f => f.isDuplicate).length} duplicates
            </Badge>
            <Badge variant="outline" className="bg-destructive/10 text-destructive">
              {filteredFiles.filter(f => f.category === "important").length} important
            </Badge>
          </div>
        </div>

        {/* File List */}
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-background/30 border border-border/30 hover:bg-background/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{getFileIcon(file.type)}</span>
                {file.isDuplicate && (
                  <AlertCircle className="h-4 w-4 text-warning" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-foreground truncate">
                    {file.name}
                  </p>
                  {file.isDuplicate && (
                    <Badge variant="outline" className="bg-warning/10 text-warning text-xs">
                      {file.similarityScore}% match
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{formatFileSize(file.size)}</span>
                  <span className="flex items-center gap-1">
                    {getSourceIcon(file.source)}
                    {file.source}
                  </span>
                  <span>{file.lastModified.toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="outline" className={getCategoryColor(file.category)}>
                  {file.category}
                </Badge>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <File className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredFiles.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No files match your current filters</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};