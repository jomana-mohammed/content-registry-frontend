"use client"

import { contentService } from "@/src/lib/services/content.service";
import { Content } from "@/src/types/content";
import { Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface EditPopUpProps {
    post: Content;
    onClose: () => void;
}

const EditPopUp = ({ post, onClose }: EditPopUpProps) => {
    const [title, setTitle] = useState(post.title);
    const [textContent, setTextContent] = useState(post.content || '');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(post.fileUrl || null);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const router = useRouter();

    const fullUrl = post.fileUrl;

    const handleFileSelect = (file: File) => {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result;
            if (result) {
                setFilePreview(result as string);
            }
        };
        reader.readAsDataURL(file);
    };
    
    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUploading(true);
        setError('');

        try {
            let response;
            
            if (post.type === 'file') {
                 response = await contentService.updateContent(
                    post._id,
                    { title },
                    selectedFile || undefined
                );
            } else {
                 response = await contentService.updateContent(
                    post._id,
                    { title, content: textContent }
                );
            }

            if (response.success) {
                //console.log('Updated successfully:', response);
                setShowSuccess(true);
                // Refresh page or data
                router.refresh();
                setTimeout(() => {
                    onClose();
                    // Optional: force reload if router.refresh is not enough for the usage context
                    window.location.reload(); 
                }, 1000);
            } else {
                 throw new Error(response.message || 'Update failed');
            }
        } catch (error: any) {
            //console.error('Error updating:', error);
            // Use the enhanced error message from API interceptor
            setError(error.userMessage || error.message || 'Failed to update content');
        } finally {
            setIsUploading(false);
        }
    };

     const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };
    
    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl border border-[#E5E7EB] p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <X className="w-6 h-6" />
                </button>
                
                <h1 className="text-2xl font-bold mb-6">Edit Content</h1>
                
                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
                        {error}
                    </div>
                )}
                
                {showSuccess && (
                     <div className="bg-green-50 text-green-600 p-3 rounded-md mb-4 text-sm">
                        Content updated successfully!
                    </div>
                )}

                <form onSubmit={handleUpdate} className="space-y-6">
                    {/* Title Input */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-[#111827] mb-2">
                            Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-[#E5E7EB] rounded-md bg-white text-[#111827] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                            placeholder="Enter title"
                        />
                    </div>

                    {/* File Upload Section */}
                    {post.type === 'file' && (
                        <div>
                            <label className="block text-sm font-medium text-[#111827] mb-2">
                                File (Optional - Upload to replace)
                            </label>
                            {!selectedFile && !filePreview ? (
                            <div
                                onDrop={(e) => {
                                    e.preventDefault();
                                    setIsDragging(false);
                                    if(e.dataTransfer.files?.[0]) handleFileSelect(e.dataTransfer.files[0]);
                                }}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                                isDragging
                                    ? 'border-[#4F46E5] bg-[#EEF2FF]'
                                    : 'border-[#E5E7EB] hover:border-[#4F46E5] hover:bg-gray-50'
                                }`}
                            >
                                <Upload className="w-12 h-12 mx-auto mb-4 text-[#6B7280]" />
                                <p className="text-gray-600 mb-2">Drag & drop to replace file</p>
                                <input
                                    type="file"
                                    onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
                                    className="hidden"
                                    id="file-input"
                                />
                                <label
                                    htmlFor="file-input"
                                    className="inline-block px-4 py-2 bg-[#4F46E5] text-white rounded-md cursor-pointer hover:bg-[#4338CA] transition-colors"
                                >
                                    Browse Files
                                </label>
                            </div>
                            ) : (
                                <div className="border border-[#E5E7EB] rounded-lg p-4">
                                    {/* Image Preview Area */}
                                    {((filePreview && post.type === 'file' && post.fileType?.startsWith('image/') && !selectedFile) || 
                                      (selectedFile && selectedFile.type.startsWith('image/') && filePreview)) && (
                                        <div className="mb-4 bg-gray-50 rounded-lg p-2 border border-gray-100 relative group">
                                            <img 
                                                src={selectedFile ? filePreview : post.fileUrl} 
                                                alt="Preview" 
                                                className="w-full max-h-[200px] object-contain rounded-md"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                }}
                                            />
                                        </div>
                                    )}

                                    {/* File Info Block - Always visible */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-3 bg-gray-100 rounded-lg">
                                            <Upload className="w-6 h-6 text-gray-500" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm text-[#111827] break-all line-clamp-1">
                                                {selectedFile ? selectedFile.name : (post.fileName || 'Current File')}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {selectedFile ? formatFileSize(selectedFile.size) : (post.fileSize ? post.fileSize : '')}
                                            </p>
                                            
                                            {/* View link for existing file if no new file is selected */}
                                            {!selectedFile && post.fileUrl && (
                                                <a 
                                                    href={post.fileUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-[#4F46E5] hover:underline flex items-center gap-1 mt-1 font-medium"
                                                >
                                                    View {post.fileType?.startsWith('image/') ? 'Image' : 'File'} 
                                                    <span className="text-[10px]">↗</span>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-end pt-2 border-t border-gray-100">
                                        {selectedFile ? (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedFile(null);
                                                    setFilePreview(post.fileUrl || null);
                                                }}
                                                className="text-sm text-red-600 hover:text-red-700 font-medium px-3 py-1.5 rounded-md hover:bg-red-50 transition-colors"
                                            >
                                                Cancel Selection
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setFilePreview(null); // Clear preview to show upload box
                                                }}
                                                className="text-sm text-[#4F46E5] hover:text-[#4338CA] font-medium px-3 py-1.5 rounded-md hover:bg-indigo-50 transition-colors"
                                            >
                                                Replace File
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Text Content Section */}
                    {post.type === 'text' && (
                        <div>
                            <label htmlFor="text-content" className="block text-sm font-medium text-[#111827] mb-2">
                                Content
                            </label>
                            <textarea
                                id="text-content"
                                value={textContent}
                                onChange={(e) => setTextContent(e.target.value)}
                                required
                                rows={10}
                                className="w-full px-4 py-3 border border-[#E5E7EB] rounded-md bg-white text-[#111827] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent resize-none"
                                placeholder="Edit your content..."
                            />
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex gap-3 justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isUploading}
                            className="px-4 py-2 bg-[#4F46E5] text-white rounded-md hover:bg-[#4338CA] disabled:opacity-50"
                        >
                            {isUploading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPopUp;
