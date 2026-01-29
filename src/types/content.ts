export interface Content {
  _id: string;
  userId: string;
  type: 'file' | 'text';
  title: string;
  content?: string;
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  createdAt: string;
  updatedAt: string;
}