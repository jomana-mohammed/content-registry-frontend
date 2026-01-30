import api from '../api';
import { Content } from '../../types/content';

export interface ContentResponse {
    success: boolean;
    data?: Content | Content[];
    count?: number;
    message?: string;
}

export const contentService = {

    // Create new content (file or text)
    // POST /api/content
    async createContent(data: { title: string; content?: string; type: 'file' | 'text' }, file?: File): Promise<ContentResponse> {
        if (data.type === 'file' && file) {
            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('type', 'file');
            formData.append('file', file);

            const response = await api.post('/content', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / (progressEvent.total || 100)
                    );
                    //console.log('📤 Upload progress:', percentCompleted + '%');
                },
            });
            return response.data;
        } else if (data.type === 'text') {
            const response = await api.post('/content', {
                title: data.title,
                content: data.content,
                type: 'text',
            });
            return response.data;
        } else {
            throw new Error('Invalid content type or missing file');
        }
    },

    // Legacy method for backward compatibility
    async createTextPost(title: string, content: string): Promise<ContentResponse> {
        return this.createContent({ title, content, type: 'text' });
    },

    // Legacy method for backward compatibility
    async uploadFile(title: string, file: File): Promise<ContentResponse> {
        return this.createContent({ title, type: 'file' }, file);
    },

    // Get current user's content
    // GET /api/content/my-content
    async getMyContent(): Promise<ContentResponse> {
        const response = await api.get('/content/my-content');
        return response.data;
    },

    // Get all content of specific user
    // GET /api/content/user/:userId
    async getUserContent(userId: string): Promise<ContentResponse> {
        const response = await api.get(`/content/user/${userId}`);
        return response.data;
    },

    // Get specific content by ID
    // GET /api/content/:id
    async getContentById(id: string): Promise<ContentResponse> {
        const response = await api.get(`/content/${id}`);
        return response.data;
    },

    // Update content (title, content text, or replace file)
    // PATCH /api/content/:id
    async updateContent(
        id: string,
        data: { title?: string; content?: string },
        file?: File
    ): Promise<ContentResponse> {
        if (file) {
            // Update with file replacement
            const formData = new FormData();
            if (data.title) formData.append('title', data.title);
            formData.append('file', file);

            const response = await api.patch(`/content/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } else {
            // Update text content or title only
            const response = await api.patch(`/content/${id}`, data);
            return response.data;
        }
    },

    // Legacy method for backward compatibility
    async updateContentFile(id: string, title: string, file: File): Promise<ContentResponse> {
        return this.updateContent(id, { title }, file);
    },

    // Delete specific content by ID
    // DELETE /api/content/:id
    async deleteContent(id: string): Promise<ContentResponse> {
        const response = await api.delete(`/content/${id}`);
        return response.data;
    },
};