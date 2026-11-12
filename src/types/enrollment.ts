import type { CourseDto } from './course';

export interface EnrollmentDto {
  id: string;
  courseId: string;
  status: 'pending' | 'confirmed';
  createdAt: string;
  /** Backend may include the course summary in GET /enrollments/me. */
  course?: Pick<CourseDto, 'id' | 'title' | 'category' | 'level' | 'durationHours' | 'price'>;
}

export interface EnrollmentRequestDto {
  courseId: string;
  message?: string;
}
