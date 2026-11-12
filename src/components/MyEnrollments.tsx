import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cancelEnrollment, getMyEnrollments } from '../api/enrollmentApi';
import { courseKeys, enrollmentKeys } from '../api/queryKeys';
import type { ApiError } from '../api/axiosInstance';

export function MyEnrollments() {
  const queryClient = useQueryClient();
  const enrollmentsQuery = useQuery({
    queryKey: enrollmentKeys.mine(),
    queryFn: getMyEnrollments,
    staleTime: 20_000,
    gcTime: 5 * 60_000,
  });
  const cancelMutation = useMutation({
    mutationFn: cancelEnrollment,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: enrollmentKeys.mine() }),
        queryClient.invalidateQueries({ queryKey: courseKeys.all }),
      ]);
    },
  });
  const mutationError = cancelMutation.error as ApiError | null;
  const enrollments = enrollmentsQuery.data ?? [];

  return <section className="panel enrollment-panel" aria-labelledby="enrollments-heading">
    <div className="section-heading"><div><p className="eyebrow">Твій навчальний шлях</p><h2 id="enrollments-heading">Мої записи</h2></div>
      <span className="count-pill">{enrollments.length} курсів</span></div>
    {enrollmentsQuery.isPending && <p className="state">Завантажуємо записи…</p>}
    {enrollmentsQuery.isError && <p className="alert" role="alert">{enrollmentsQuery.error.message}</p>}
    {mutationError && <p className="alert" role="alert">{mutationError.message}</p>}
    {enrollmentsQuery.isSuccess && enrollments.length === 0 && <p className="state">Тут з’являться курси, на які ти запишешся.</p>}
    {enrollments.length > 0 && <div className="enrollment-list">{enrollments.map((item) => <article className="enrollment-item" key={item.id}>
      <div className="enrollment-index">✳</div>
      <div className="enrollment-copy"><span className="eyebrow">{item.course?.category ?? 'Курс'} · {item.status === 'confirmed' ? 'Підтверджено' : 'Очікує підтвердження'}</span>
        <h3>{item.course?.title ?? `Курс ${item.courseId}`}</h3><p>Запис від {new Date(item.createdAt).toLocaleDateString('uk-UA')}</p></div>
      <button className="cancel-button" disabled={cancelMutation.isPending} onClick={() => cancelMutation.mutate(item.id)}>
        {cancelMutation.isPending && cancelMutation.variables === item.id ? 'Скасовуємо…' : 'Скасувати'}
      </button>
    </article>)}</div>}
  </section>;
}
