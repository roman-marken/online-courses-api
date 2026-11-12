export interface UserDto {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  enrolledCourseIds: string[];
}
