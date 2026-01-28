"use client"

import { useState, useEffect } from 'react';
import { Upload, FileText, File, Calendar, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface Post {
  id: string;
  type: 'file' | 'text';
  title: string;
  content?: string;
  fileName?: string;
  fileSize?: string;
  fileType?: string;
  fileUrl?: string;
  createdAt: string;
}

type FilterType = 'all' | 'file' | 'text';

const ProfilePage = () => {

  const [posts, setPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const user = {email:"jomana@gmail" , username:"jomana"}

  useEffect(() => {
    // Load posts from localStorage
    const storedPosts = JSON.parse(localStorage.getItem('posts') || '[]');
    setPosts(storedPosts);
  }, []);

  const handleDelete = (id: string) => {
    const updatedPosts = posts.filter(post => post.id !== id);
    setPosts(updatedPosts);
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
  };

  const filteredPosts = posts.filter(post => {
    if (filter === 'all') return true;
    return post.type === filter;
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

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-6 mb-8">
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
                : 'bg-white text-[#111827] border border-[#E5E7EB] hover:bg-gray-50'
            }`}
          >
            All ({posts.length})
          </button>
          <button
            onClick={() => setFilter('file')}
            className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
              filter === 'file'
                ? 'bg-[#4F46E5] text-white'
                : 'bg-white text-[#111827] border border-[#E5E7EB] hover:bg-gray-50'
            }`}
          >
            Files ({posts.filter(p => p.type === 'file').length})
          </button>
          <button
            onClick={() => setFilter('text')}
            className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
              filter === 'text'
                ? 'bg-[#4F46E5] text-white'
                : 'bg-white text-[#111827] border border-[#E5E7EB] hover:bg-gray-50'
            }`}
          >
            Text ({posts.filter(p => p.type === 'text').length})
          </button>
        </div>

        {/* Content Grid */}
        {filteredPosts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-12 text-center">
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
            {filteredPosts.map(post => (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all group"
              >
                {/* Preview Area */}
                {post.type === 'file' && (
                  <div className="h-48 bg-[#F3F4F6] flex items-center justify-center">
                    {post.fileUrl ? (
                      <img 
                        src={post.fileUrl} 
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      getFileIcon(post.fileType)
                    )}
                  </div>
                )}

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

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md text-[#EF4444] bg-red-50 hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
  );
}

export default ProfilePage;
