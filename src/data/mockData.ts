export interface FileItem {
  id: string;
  name: string;
  type: "document" | "image" | "video" | "audio" | "other";
  size: number; // in bytes
  source: "google-drive" | "local" | "email";
  lastModified: Date;
  category: "personal" | "work" | "media" | "junk" | "important";
  isDuplicate: boolean;
  similarityScore?: number;
}

export interface StorageStats {
  totalSpace: number;
  usedSpace: number;
  availableSpace: number;
  breakdown: {
    documents: number;
    images: number;
    videos: number;
    audio: number;
    other: number;
  };
}

export const mockStorageStats: StorageStats = {
  totalSpace: 1000 * 1024 * 1024 * 1024, // 1TB
  usedSpace: 650 * 1024 * 1024 * 1024, // 650GB
  availableSpace: 350 * 1024 * 1024 * 1024, // 350GB
  breakdown: {
    documents: 45 * 1024 * 1024 * 1024, // 45GB
    images: 180 * 1024 * 1024 * 1024, // 180GB
    videos: 350 * 1024 * 1024 * 1024, // 350GB
    audio: 25 * 1024 * 1024 * 1024, // 25GB
    other: 50 * 1024 * 1024 * 1024, // 50GB
  },
};

export const mockFiles: FileItem[] = [
  {
    id: "1",
    name: "IMG_2023_vacation_beach_001.jpg",
    type: "image",
    size: 8.5 * 1024 * 1024,
    source: "google-drive",
    lastModified: new Date("2023-08-15"),
    category: "personal",
    isDuplicate: false,
  },
  {
    id: "2",
    name: "IMG_2023_vacation_beach_001 (1).jpg",
    type: "image",
    size: 8.5 * 1024 * 1024,
    source: "local",
    lastModified: new Date("2023-08-15"),
    category: "personal",
    isDuplicate: true,
    similarityScore: 99.8,
  },
  {
    id: "3",
    name: "Project_Proposal_Final_v3.docx",
    type: "document",
    size: 2.3 * 1024 * 1024,
    source: "email",
    lastModified: new Date("2024-01-10"),
    category: "work",
    isDuplicate: false,
  },
  {
    id: "4",
    name: "4K_Movie_Trailer.mp4",
    type: "video",
    size: 1.2 * 1024 * 1024 * 1024,
    source: "local",
    lastModified: new Date("2023-12-01"),
    category: "media",
    isDuplicate: false,
  },
  {
    id: "5",
    name: "Screenshot_2024_temp.png",
    type: "image",
    size: 1.2 * 1024 * 1024,
    source: "local",
    lastModified: new Date("2024-01-20"),
    category: "junk",
    isDuplicate: false,
  },
  {
    id: "6",
    name: "Contract_Signed_2024.pdf",
    type: "document",
    size: 850 * 1024,
    source: "email",
    lastModified: new Date("2024-01-05"),
    category: "important",
    isDuplicate: false,
  },
];

export const mockCleanupRecommendations = [
  {
    id: "1",
    title: "Delete Duplicate Images",
    description: "Found 45 duplicate images that are exact copies",
    potentialSavings: 180 * 1024 * 1024, // 180MB
    riskLevel: "low" as const,
    fileCount: 45,
    category: "duplicates" as const,
  },
  {
    id: "2",
    title: "Remove Large Video Files",
    description: "Videos larger than 1GB that haven't been accessed in 6 months",
    potentialSavings: 15 * 1024 * 1024 * 1024, // 15GB
    riskLevel: "medium" as const,
    fileCount: 8,
    category: "large-files" as const,
  },
  {
    id: "3",
    title: "Clean Temp Screenshots",
    description: "Screenshots and temporary files older than 30 days",
    potentialSavings: 2.5 * 1024 * 1024 * 1024, // 2.5GB
    riskLevel: "low" as const,
    fileCount: 156,
    category: "junk" as const,
  },
  {
    id: "4",
    title: "Archive Old Documents",
    description: "Work documents older than 2 years",
    potentialSavings: 8 * 1024 * 1024 * 1024, // 8GB
    riskLevel: "high" as const,
    fileCount: 89,
    category: "archive" as const,
  },
];

export const formatFileSize = (bytes: number): string => {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 Bytes";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + " " + sizes[i];
};