import axiosInstance from './axiosInstance';
import type { CourseDto, EnrollmentRequestDto, EnrollmentResponseDto } from '../types/course';

export async function getCourses(): Promise<CourseDto[]> {
  const { data } = await axiosInstance.get<CourseDto[]>('/courses');
  return data;
}

export async function getCourseById(courseId: string): Promise<CourseDto> {
  const { data } = await axiosInstance.get<CourseDto>(`/courses/${encodeURIComponent(courseId)}`);
  return data;
}

export async function enrollInCourse(request: EnrollmentRequestDto): Promise<EnrollmentResponseDto> {
  const { data } = await axiosInstance.post<EnrollmentResponseDto>('/enrollments', request);
  return data;
}
