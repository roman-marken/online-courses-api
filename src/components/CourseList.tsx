import { useEffect, useState } from 'react';
import { enrollInCourse, getCourseById, getCourses } from '../api/courseApi';
import type { ApiError } from '../api/axiosInstance';
import type { CourseDto } from '../types/course';

export function CourseList() {
  const [courses, setCourses] = useState<CourseDto[]>([]);
  const [selected, setSelected] = useState<CourseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let active = true;
    getCourses()
      .then((items) => { if (active) setCourses(items); })
      .catch((reason: ApiError) => { if (active) setError(reason.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  async function showDetails(id: string) {
    setError('');
    setNotice('');
    setDetailLoading(true);
    try { setSelected(await getCourseById(id)); }
    catch (reason) { setError((reason as ApiError).message); }
    finally { setDetailLoading(false); }
  }

  async function enroll() {
    if (!selected) return;
    setError('');
    setNotice('');
    setEnrolling(true);
    try {
      const result = await enrollInCourse({ courseId: selected.id });
      setNotice(result.status === 'confirmed' ? 'Ви записані на курс!' : 'Запит на запис надіслано.');
    } catch (reason) { setError((reason as ApiError).message); }
    finally { setEnrolling(false); }
  }

  return (
    <section className="panel" aria-labelledby="courses-heading">
      <div className="section-heading">
        <div><p className="eyebrow">Навчайся у своєму темпі</p><h2 id="courses-heading">Популярні курси</h2></div>
        <span className="count-pill">{courses.length} курсів</span>
      </div>
      {loading && <p className="state">Завантажуємо курси…</p>}
      {error && <p className="alert" role="alert">{error}</p>}
      {notice && <p className="success" role="status">{notice}</p>}
      {!loading && !error && courses.length === 0 && <p className="state">Поки що курсів немає.</p>}
      <div className="course-grid">
        {courses.map((course, index) => (
          <article className="course-card" key={course.id}>
            <div className={`course-art art-${index % 4}`}>
              <span>{course.category}</span><span className="art-mark">0{index + 1}</span>
            </div>
            <div className="course-copy">
              <div className="course-meta"><span>{course.level}</span><span>{course.durationHours} год</span></div>
              <h3>{course.title}</h3><p>{course.instructor}</p>
              <div className="course-bottom">
                <strong>{course.price === 0 ? 'Безкоштовно' : `${course.price} ₴`}</strong>
                <button className="text-button" onClick={() => void showDetails(course.id)}>Деталі ↗</button>
              </div>
            </div>
          </article>
        ))}
      </div>
      {detailLoading && <p className="state">Завантажуємо опис курсу…</p>}
      {selected && <div className="detail-box">
        <div><p className="eyebrow">Детальніше про курс</p><h3>{selected.title}</h3><p>{selected.description}</p></div>
        <button className="button button-small" disabled={enrolling} onClick={() => void enroll()}>
          {enrolling ? 'Надсилаємо…' : 'Записатися'}
        </button>
      </div>}
    </section>
  );
}
