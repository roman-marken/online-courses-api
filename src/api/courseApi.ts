import axiosInstance from './axiosInstance';
import type { CourseDto, CourseFilters } from '../types/course';

export async function getCourses(filters: CourseFilters = {}): Promise<CourseDto[]> {
  const { data } = await axiosInstance.get<CourseDto[]>('/courses', { params: filters });
  return data;
}

export async function getCourseById(courseId: string): Promise<CourseDto> {
  const { data } = await axiosInstance.get<CourseDto>(`/courses/${encodeURIComponent(courseId)}`);
  return data;
}
