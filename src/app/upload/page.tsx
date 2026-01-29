"use client"
import { FileText, Upload, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { contentService } from "@/src/lib/services/content.service";
import Spinner from "../components/spinner";

type TabType = 'file' | 'text';

const UploadPage = () =>{
 const [activeTab, setActiveTab] = useState<TabType>('file');
  const [title, setTitle] = useState('');
  const [textContent, setTextContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    
    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
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

  const handleFileUpload = async (e: React.FormEvent) =>{
    e.preventDefault();
    
    if (!selectedFile || !title) {
      setError('Please provide both title and file');
      return;
    }
    
    setIsUploading(true);
    setError('');
    
    try {
      const response = await contentService.createContent(
        { title, type: 'file' },
        selectedFile
      );
      
      console.log('File uploaded successfully:', response);
      setShowSuccess(true);
      
      // Reset form
      setTitle('');
      setTextContent('');
      setSelectedFile(null);
      setFilePreview(null);
      
      // Redirect to profile after 1.5 seconds
      setTimeout(() =>{
        router.push('/profile');
      }, 1500);
    } catch (error: any) {
      console.error('File upload error:', error);
      // Use the enhanced error message from API interceptor
      setError(error.userMessage || error.response?.data?.message || 'Failed to upload file. Please try again.');
      setIsUploading(false);
    }
  };
  const handleTextPost = async (e: React.FormEvent) =>{
    e.preventDefault();
    
    if (!title || !textContent) {
      setError('Please provide both title and content');
      return;
    }
    
    setIsUploading(true);
    setError('');
    
    try {
      const response = await contentService.createContent({
        title,
        content: textContent,
        type: 'text'
      });
      
      console.log('Text posted successfully:', response);
      setShowSuccess(true);
      
      // Reset form
      setTitle('');
      setTextContent('');
      setSelectedFile(null);
      setFilePreview(null);
      
      // Redirect to profile after 1.5 seconds
      setTimeout(() =>{
        router.push('/profile');
      }, 1500);
    } catch (error: any) {
      console.error('Text post error:', error);
      // Use the enhanced error message from API interceptor
      setError(error.userMessage || error.response?.data?.message || 'Failed to post content. Please try again.');
      setIsUploading(false);
    }
  };


    return (
      <>
        {/* Full-screen spinner during upload */}
        {isUploading && (
          <Spinner fullScreen size="xl" message="Uploading... Please wait" />
        )}
        
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Upload Content</h1>
        
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        {/* Success Message */}
        {showSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            ✅ Content uploaded successfully! Redirecting to your profile...
          </div>
        )}
            {/* Tab Switcher */}
                <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setActiveTab('file')}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-md font-semibold transition-all ${
                    activeTab === 'file'
                        ? 'bg-[#4F46E5] text-white'
                        : 'bg-white text-[#111827] hover:bg-gray-50 border border-[#E5E7EB]'
                    }`}
                >
                    <Upload className="w-5 h-5" />
                    Upload File
                </button>
                <button
                    onClick={() => setActiveTab('text')}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-md font-semibold transition-all ${
                    activeTab === 'text'
                        ? 'bg-[#4F46E5] text-white'
                        : 'bg-white text-[#111827] hover:bg-gray-50 border border-[#E5E7EB]'
                    }`}
                >
                    <FileText className="w-5 h-5" />
                    Post Text
                </button>
                </div>
                  {/* Upload File Tab */}
        {activeTab === 'file' && (
          <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-6">
            <form onSubmit={handleFileUpload} className="space-y-6">
              {/* Title Input */}
              <div>
                <label htmlFor="file-title" className="block text-sm font-medium text-[#111827] mb-2">
                  Title
                </label>
                <input
                  id="file-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-[#E5E7EB] rounded-md bg-white text-[#111827] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                  placeholder="Enter a title for your file"
                />
              </div>

              {/* Drag & Drop Zone */}
              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  File
                </label>
                {!selectedFile ? (
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                      isDragging
                        ? 'border-[#4F46E5] bg-[#EEF2FF]'
                        : 'border-[#E5E7EB] hover:border-[#4F46E5] hover:bg-gray-50'
                    }`}
                  >
                    <Upload className="w-12 h-12 mx-auto mb-4 text-[#6B7280]" />
                    <p className="text-lg text-[#111827] mb-2">Drag & drop your file here</p>
                    <p className="text-sm text-[#6B7280] mb-4">or click to browse</p>
                    <input
                      type="file"
                      onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
                      className="hidden"
                      id="file-input"
                    />
                    <label
                      htmlFor="file-input"
                      className="inline-block px-6 py-2 bg-[#4F46E5] text-white rounded-md cursor-pointer hover:bg-[#4338CA] transition-colors"
                    >
                      Browse Files
                    </label>
                    <p className="text-xs text-[#6B7280] mt-4">
                      Accepted formats: images, documents, PDFs
                    </p>
                  </div>
                ) : (
                  <div className="border border-[#E5E7EB] rounded-lg p-4">
                    {filePreview && (
                      <img 
                        src={filePreview} 
                        alt="Preview" 
                        className="w-full max-h-[300px] object-contain mb-4 rounded-md"
                      />
                    )}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-[#111827]">{selectedFile.name}</p>
                        <p className="text-sm text-[#6B7280]">{formatFileSize(selectedFile.size)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null);
                          setFilePreview(null);
                        }}
                        className="p-2 text-[#EF4444] hover:bg-red-50 rounded-md transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!selectedFile || !title || isUploading}
                className="w-full bg-[#4F46E5] text-white font-semibold py-3 rounded-md hover:bg-[#4338CA] transition-all hover:-translate-y-0.5 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isUploading ? 'Uploading...' : 'Upload File'}
              </button>
            </form>
          </div>
        )}

        {/* Post Text Tab */}
        {activeTab === 'text' && (
          <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-6">
            <form onSubmit={handleTextPost} className="space-y-6">
              {/* Title Input */}
              <div>
                <label htmlFor="text-title" className="block text-sm font-medium text-[#111827] mb-2">
                  Title
                </label>
                <input
                  id="text-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-[#E5E7EB] rounded-md bg-white text-[#111827] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                  placeholder="Enter a title for your post"
                />
              </div>

              {/* Text Content */}
              <div>
                <label htmlFor="text-content" className="block text-sm font-medium text-[#111827] mb-2">
                  Content
                </label>
                <textarea
                  id="text-content"
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  required
                  rows={12}
                  className="w-full px-4 py-3 border border-[#E5E7EB] rounded-md bg-white text-[#111827] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent resize-none"
                  placeholder="Write your content here..."
                />
                <p className="text-sm text-[#6B7280] mt-2">{textContent.length} characters</p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!title || !textContent || isUploading}
                className="w-full bg-[#4F46E5] text-white font-semibold py-3 rounded-md hover:bg-[#4338CA] transition-all hover:-translate-y-0.5 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isUploading ? 'Posting...' : 'Post Content'}
              </button>
            </form>
          </div>
        )}
      </div>
      </>
    )
}

export default UploadPage