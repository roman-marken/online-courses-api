import axiosInstance from './axiosInstance';
import type { UserDto } from '../types/user';

/** Захищений endpoint: сервер перевіряє токен/cookie і повертає поточного користувача. */
export async function getCurrentUser(): Promise<UserDto> {
  const { data } = await axiosInstance.get<UserDto>('/users/me');
  return data;
}
