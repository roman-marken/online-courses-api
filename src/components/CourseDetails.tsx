import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { enrollInCourse } from '../api/enrollmentApi';
import { getCourseById } from '../api/courseApi';
import { courseKeys, enrollmentKeys } from '../api/queryKeys';
import type { ApiError } from '../api/axiosInstance';

interface CourseDetailsProps { courseId: string | null }

export function CourseDetails({ courseId }: CourseDetailsProps) {
  const queryClient = useQueryClient();
  const courseQuery = useQuery({
    queryKey: courseKeys.detail(courseId ?? ''),
    queryFn: () => getCourseById(courseId!),
    enabled: Boolean(courseId),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });
  const enrollmentMutation = useMutation({
    mutationFn: (id: string) => enrollInCourse({ courseId: id }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: enrollmentKeys.mine() }),
        queryClient.invalidateQueries({ queryKey: courseKeys.all }),
      ]);
    },
  });

  if (!courseId) return <section className="panel detail-empty"><p className="eyebrow">Картка курсу</p><h2>Обери курс зі списку</h2><p>Тут з’являться опис, програма та кнопка запису.</p></section>;
  if (courseQuery.isPending) return <section className="panel"><p className="state">Завантажуємо курс…</p></section>;
  if (courseQuery.isError) return <section className="panel"><p className="alert" role="alert">{courseQuery.error.message}</p></section>;

  const course = courseQuery.data;
  const mutationError = enrollmentMutation.error as ApiError | null;
  return <section className="panel course-details" aria-labelledby="detail-title">
    <p className="eyebrow">{course.category} · {course.level}</p>
    <h2 id="detail-title">{course.title}</h2>
    <p className="detail-description">{course.description}</p>
    <dl className="detail-facts">
      <div><dt>Викладач</dt><dd>{course.instructor}</dd></div>
      <div><dt>Тривалість</dt><dd>{course.durationHours} годин</dd></div>
      <div><dt>Вартість</dt><dd>{course.price === 0 ? 'Безкоштовно' : `${course.price} ₴`}</dd></div>
    </dl>
    {mutationError && <p className="alert" role="alert">{mutationError.message}</p>}
    {enrollmentMutation.isSuccess && <p className="success" role="status">Запис створено. Перевір його у розділі «Мої записи».</p>}
    <button className="button" disabled={enrollmentMutation.isPending} onClick={() => enrollmentMutation.mutate(course.id)}>
      {enrollmentMutation.isPending ? 'Записуємо…' : 'Записатися на курс'} <span aria-hidden="true">↗</span>
    </button>
  </section>;
}
