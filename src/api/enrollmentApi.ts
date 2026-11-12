import axiosInstance from './axiosInstance';
import type { EnrollmentDto, EnrollmentRequestDto } from '../types/enrollment';

export async function getMyEnrollments(): Promise<EnrollmentDto[]> {
  const { data } = await axiosInstance.get<EnrollmentDto[]>('/enrollments/me');
  return data;
}

export async function enrollInCourse(request: EnrollmentRequestDto): Promise<EnrollmentDto> {
  const { data } = await axiosInstance.post<EnrollmentDto>('/enrollments', request);
  return data;
}

export async function cancelEnrollment(enrollmentId: string): Promise<void> {
  await axiosInstance.delete(`/enrollments/${encodeURIComponent(enrollmentId)}`);
}
