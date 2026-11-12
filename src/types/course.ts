export type CourseLevel = 'Початковий' | 'Середній' | 'Просунутий';

export interface CourseDto {
  id: string;
  title: string;
  description: string;
  instructor: string;
  durationHours: number;
  level: CourseLevel;
  category: string;
  price: number;
  imageUrl?: string;
}

export interface CourseFilters {
  category?: string;
  level?: CourseLevel;
}
