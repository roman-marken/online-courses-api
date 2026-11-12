import type { CourseFilters } from '../types/course';

export const courseKeys = {
  all: ['courses'] as const,
  lists: () => [...courseKeys.all, 'list'] as const,
  list: (filters: CourseFilters = {}) => [...courseKeys.lists(), filters] as const,
  details: () => [...courseKeys.all, 'detail'] as const,
  detail: (courseId: string) => [...courseKeys.details(), courseId] as const,
};

export const enrollmentKeys = {
  all: ['enrollments'] as const,
  mine: () => [...enrollmentKeys.all, 'mine'] as const,
};
