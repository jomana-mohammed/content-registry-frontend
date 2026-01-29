import api from '../api';
import { Content } from '../../types/content'
import { User } from '../../types/user';

export interface UserProfileResponse {
  success: boolean;
  user: User;
  contents: Content[];
}

export const userService = {
  async getUserProfile(username: string): Promise<UserProfileResponse> {
    const response = await api.get(`/user/${username}`);
    return response.data;
  },
};