"use client"

import { useState, useEffect} from 'react';
import { Upload, FileText, File, Calendar, Trash2, ExternalLink, Edit } from 'lucide-react';
import Link from 'next/link';
import { Content } from '@/src/types/content';
import { authService } from '@/src/lib/services/auth.service';
import { User } from '@/src/types/user';
import { ContentResponse, contentService } from '@/src/lib/services/content.service';
import EditPopUp from '../components/editPopUp';
import Spinner from '../components/spinner';

type FilterType = 'all' | 'file' | 'text';

const ProfilePage = () => {

  const [content, setContent] = useState<ContentResponse>();
  const [filter, setFilter] = useState<FilterType>('all');
  const [user , setUser] = useState<User>();

  const [editingPost, setEditingPost] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getUser = async() =>{
    try {
      const response = await authService.getMe();
      setUser(response.user);
    } catch (error: any) {
      //console.error('Failed to get user:', error);
      setError(error.userMessage || 'Failed to load profile');
    }
  }

  const getContent = async() =>{
    try{
        const response = await contentService.getMyContent();
        setContent(response);
    }
    catch(error: any){
      //console.error('Failed to get content:', error);
      setError(error.userMessage || 'Failed to load content');
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([getUser(), getContent()]);
      setLoading(false);
    };
    loadData();
  }, []);


  const handleDelete = async (id: string) => {
    try {
      await contentService.deleteContent(id);
      // Update local state to remove the deleted content
      if (content?.data && Array.isArray(content.data)) {
        const updatedData = content.data.filter(item => item._id !== id);
        setContent({ ...content, data: updatedData });
      }
    } catch (error: any) {
      //console.error('Failed to delete content:', error);
      setError(error.userMessage || 'Failed to delete content');
    }
  };

  // Ensure content.data is an array before filtering
  const contentArray = Array.isArray(content?.data) ? content.data : [];
  
  const filteredContents = contentArray.filter(item => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getFileIcon = (fileType?: string) => {
    if (!fileType) return <File className="w-16 h-16 text-[#6B7280]" />;
    
    if (fileType.startsWith('image/')) {
      return null; // Will show image instead
    }
    if (fileType.includes('pdf')) {
      return <div className="text-6xl">📄</div>;
    }
    if (fileType.includes('word') || fileType.includes('document')) {
      return <div className="text-6xl">📝</div>;
    }
    if (fileType.includes('sheet') || fileType.includes('excel')) {
      return <div className="text-6xl">📊</div>;
    }
    return <File className="w-16 h-16 text-[#6B7280]" />;
  };

  return (

      <div className="max-w-7xl mx-auto px-4 py-8 relative">
        {/* Loading Spinner */}
        {loading && (
          <Spinner fullScreen size="xl" message="Loading your profile..." />
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Edit PopUp */}
        {editingPost && (
            <EditPopUp 
                post={editingPost} 
                onClose={() => {
                    setEditingPost(null);
                    getContent(); // Refresh content after close
                }} 
            />
        )}

        {/* Profile Header */}
        <div className="bg-gray-200 rounded-lg shadow-sm border border-[#E5E7EB] p-6 mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-[#4F46E5] text-white flex items-center justify-center text-2xl font-bold">
                {user?.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#111827]">{user?.username}</h1>
                <p className="text-[#6B7280]">{user?.email}</p>
              </div>
            </div>
            <Link
              href="/upload"
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#4F46E5] text-white font-semibold hover:bg-[#4338CA] transition-all hover:-translate-y-0.5"
            >
              <Upload className="w-4 h-4" />
              Upload Content
            </Link>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
              filter === 'all'
                ? 'bg-[#4F46E5] text-white'
                : 'bg-gray-200 text-[#111827] border border-[#E5E7EB] hover:bg-gray-50'
            }`}
          >
            All ({contentArray.length})
          </button>
          <button
            onClick={() => setFilter('file')}
            className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
              filter === 'file'
                ? 'bg-[#4F46E5] text-white'
                : 'bg-gray-200 text-[#111827] border border-[#E5E7EB] hover:bg-gray-50'
            }`}
          >
            Files ({contentArray.filter(c => c.type === 'file').length})
          </button>
          <button
            onClick={() => setFilter('text')}
            className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
              filter === 'text'
                ? 'bg-[#4F46E5] text-white'
                : 'bg-gray-200 text-[#111827] border border-[#E5E7EB] hover:bg-gray-50'
            }`}
          >
            Text ({contentArray.filter(c => c.type === 'text').length})
          </button>
        </div>

        {/* Content Grid */}
        {filteredContents.length === 0 ? (
          <div className="bg-gray-200 rounded-lg shadow-sm border border-[#E5E7EB] p-12 text-center">
            <Upload className="w-16 h-16 mx-auto mb-4 text-[#6B7280]" />
            <h2 className="text-xl font-semibold text-[#111827] mb-2">No content yet</h2>
            <p className="text-[#6B7280] mb-6">Start by uploading your first file or posting some text</p>
            <Link
              href='/upload'
              className="px-6 py-3 rounded-md bg-[#4F46E5] text-white font-semibold hover:bg-[#4338CA] transition-colors"
            >
              Upload Content
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContents.map(post => (
              <div
                key={post._id}
                className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all group"
              >
                {/* Preview Area */}
                {/* Preview Area - Unified for both Text and File */}
                <div className="h-48 bg-[#F3F4F6] relative group flex items-center justify-center text-center">
                  
                  {/* TEXT POST PREVIEW */}
                  {post.type === 'text' && (
                    <div className="flex flex-col items-center justify-center text-[#6B7280]">
                       <FileText className="w-16 h-16 mb-2" />
                       <span className="text-sm font-medium">Text Post</span>
                    </div>
                  )}

                  {/* FILE POST PREVIEW */}
                  {post.type === 'file' && (
                     post.fileUrl ? (
                      <>
                        {/* 1. IMAGE FILES */}
                        {post.fileType?.startsWith('image/') ? (
                           <img 
                             src={post.fileUrl} 
                             alt={post.title}
                             className="w-full h-full object-cover"
                             onError={(e) => {
                               const target = e.target as HTMLImageElement;
                               target.outerHTML = `<div class="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-500">
                                  <div class="mb-2">
                                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-16 h-16 text-gray-400"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                                  </div>
                                  <span class="font-medium text-sm px-4">Image File</span>
                               </div>`;
                             }}
                           />
                        ) : post.fileType === 'application/pdf' ? (
                        /* 2. PDF FILES */
                           <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-500">
                              <div className="text-6xl mb-2">📄</div>
                              <span className="font-semibold text-sm">PDF Document</span>
                           </div>
                        ) 
                          : post.fileType === 'application/docx' || post.fileType?.includes('word') ? (
                        /* 2. PDF FILES */
                           <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-500">
                              <div className="text-6xl mb-2">📝</div>
                              <span className="font-semibold text-sm">DOCX Document</span>
                           </div>
                        ) 
                        : post.fileType === 'application/txt' ? (
                        /* 2. PDF FILES */
                           <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-500">
                              <div className="text-6xl mb-2">📝</div>
                              <span className="font-semibold text-sm">TEXT Document</span>
                           </div>
                        ) 
                        : (
                        /* 3. OTHER FILES (Word, Excel, etc) */
                           <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-500">
                              <div className="mb-2">
                                {getFileIcon(post.fileType)}
                              </div>
                              <span className="font-medium text-sm px-4 truncate max-w-full">
                                {post.fileType?.split('/')[1]?.toUpperCase() || 'FILE'}
                              </span>
                           </div>
                        )}
                        
                        {/* Overlay with direct link (Hover effect) */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                            <a 
                              href={post.fileUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="bg-white text-gray-900 px-4 py-2 rounded-full font-medium hover:bg-gray-100 flex items-center gap-2 transform hover:scale-105 transition-transform shadow-lg"
                            >
                               <ExternalLink className="w-4 h-4" />
                               {post.fileType?.startsWith('image/') ? 'View Image' : 'Open File'}
                            </a>
                        </div>
                      </>
                    ) : (
                       // No URL (Fallback)
                      <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        {getFileIcon(post.fileType)}
                        <span className="text-xs mt-2">No Preview</span>
                      </div>
                    )
                  )}
                </div>

                {/* Content Info */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-[#111827] mb-2 line-clamp-2">
                    {post.title}
                  </h3>

                  {post.type === 'text' && post.content && (
                    <p className="text-[#6B7280] text-sm mb-4 line-clamp-3">
                      {post.content}
                    </p>
                  )}

                  {post.type === 'file' && (
                    <div className="mb-4">
                      <p className="text-sm text-[#6B7280]">{post.fileName}</p>
                      <p className="text-xs text-[#6B7280]">{post.fileSize}</p>
                    </div>
                  )}

                  {/* Badges */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                      <Calendar className="w-4 h-4" />
                      {formatDate(post.createdAt)}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      post.type === 'file' 
                        ? 'bg-[#EEF2FF] text-[#4F46E5]'
                        : 'bg-green-50 text-green-600'
                    }`}>
                      {post.type === 'file' ? 'File' : 'Text'}
                    </span>
                  </div>

                  <div className='flex gap-2 '>
                    <button
                    onClick={() => setEditingPost(post)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md text-green-600 bg-green-50 hover:bg-green-100 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md text-[#EF4444] bg-red-50 hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
  );
}

export default ProfilePage;
