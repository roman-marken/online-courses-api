import { useQuery } from '@tanstack/react-query';
import { courseKeys } from '../api/queryKeys';
import { getCourses } from '../api/courseApi';
import type { CourseFilters, CourseLevel } from '../types/course';

interface CourseListProps {
  category: string;
  level: CourseLevel | '';
  onCategoryChange: (value: string) => void;
  onLevelChange: (value: CourseLevel | '') => void;
  onSelectCourse: (courseId: string) => void;
}

export function CourseList({ category, level, onCategoryChange, onLevelChange, onSelectCourse }: CourseListProps) {
  const filters: CourseFilters = { ...(category ? { category } : {}), ...(level ? { level } : {}) };
  const coursesQuery = useQuery({
    queryKey: courseKeys.list(filters),
    queryFn: () => getCourses(filters),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  });
  // Keep the unfiltered result cached to populate category options across filter changes.
  const catalogQuery = useQuery({
    queryKey: courseKeys.list(),
    queryFn: () => getCourses(),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  });
  const courses = coursesQuery.data ?? [];
  const categories = [...new Set((catalogQuery.data ?? []).map((course) => course.category))].sort();

  return (
    <section className="panel" aria-labelledby="courses-heading">
      <div className="section-heading">
        <div><p className="eyebrow">Навчайся у своєму темпі</p><h2 id="courses-heading">Каталог курсів</h2></div>
        <span className="count-pill">{courses.length} курсів</span>
      </div>
      <div className="filter-row">
        <label>Категорія
          <select value={category} onChange={(event) => onCategoryChange(event.target.value)}>
            <option value="">Усі категорії</option>
            {categories.map((item) => <option value={item} key={item}>{item}</option>)}
          </select>
        </label>
        <label>Рівень
          <select value={level} onChange={(event) => onLevelChange(event.target.value as CourseLevel | '')}>
            <option value="">Будь-який рівень</option>
            <option value="Початковий">Початковий</option>
            <option value="Середній">Середній</option>
            <option value="Просунутий">Просунутий</option>
          </select>
        </label>
      </div>
      {coursesQuery.isPending && <p className="state">Завантажуємо курси…</p>}
      {coursesQuery.isError && <p className="alert" role="alert">{coursesQuery.error.message}</p>}
      {coursesQuery.isSuccess && courses.length === 0 && <p className="state">За цими фільтрами курсів не знайдено.</p>}
      {coursesQuery.isFetching && !coursesQuery.isPending && <p className="refresh-note">Оновлюємо результати…</p>}
      <div className="course-grid">
        {courses.map((course, index) => (
          <article className="course-card" key={course.id}>
            <div className={`course-art art-${index % 4}`}><span>{course.category}</span><span className="art-mark">0{index + 1}</span></div>
            <div className="course-copy">
              <div className="course-meta"><span>{course.level}</span><span>{course.durationHours} год</span></div>
              <h3>{course.title}</h3><p>{course.instructor}</p>
              <div className="course-bottom">
                <strong>{course.price === 0 ? 'Безкоштовно' : `${course.price} ₴`}</strong>
                <button className="text-button" onClick={() => onSelectCourse(course.id)}>Деталі ↗</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
