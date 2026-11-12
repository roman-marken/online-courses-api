import { useEffect, useState } from 'react';
import { CourseList } from './components/CourseList';
import { CourseDetails } from './components/CourseDetails';
import { MyEnrollments } from './components/MyEnrollments';
import { UserProfile } from './components/UserProfile';
import type { CourseLevel } from './types/course';

export default function App() {
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState<CourseLevel | ''>('');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  useEffect(() => {
    const onUnauthorized = () => console.info('Сесію завершено. Потрібен повторний вхід.');
    window.addEventListener('auth:unauthorized', onUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', onUnauthorized);
  }, []);

  return <main className="app-shell">
    <header className="topbar">
      <a className="brand" href="#top"><span className="brand-mark">m</span> mai<span className="brand-dot">.</span></a>
      <nav aria-label="Основна навігація"><a className="nav-active" href="#courses">Каталог</a><a href="#profile">Мій кабінет</a></nav>
      <a className="topbar-cta" href="#courses">Знайти свій курс ↗</a>
    </header>
    <section className="hero" id="top">
      <div className="hero-copy">
        <p className="eyebrow"><span className="eyebrow-line" /> ОСВІТА, ЩО РУХАЄ ВПЕРЕД</p>
        <h1>Знання — це<br /><em>твій наступний</em><br />крок.</h1>
        <p className="hero-description">Обирай напрям, навчайся у практиків та перетворюй цікавість на нові можливості.</p>
        <a className="button" href="#courses">Переглянути курси <span>↓</span></a>
        <div className="hero-footnote"><span className="avatar-stack"><i>А</i><i>М</i><i>І</i></span><span>Приєднуйся до <b>2 400+</b> студентів</span></div>
      </div>
      <div className="hero-visual" aria-label="Освіта відкриває нові горизонти">
        <div className="visual-orbit orbit-one" /><div className="visual-orbit orbit-two" /><div className="visual-sun" />
        <div className="visual-disc"><span>LEARN<br />GROW<br />REPEAT</span><b>✳</b></div>
        <div className="visual-note note-top">Ідеї стають<br />навичками <span>↗</span></div>
        <div className="visual-note note-bottom"><span className="note-dot" /> Твій темп. Твій шлях.</div>
        <div className="visual-index">01 / 04</div>
      </div>
    </section>
    <section className="content-section" id="courses">
      <div className="content-intro"><span>01 — НАВЧАЙСЯ</span><p>Курси, що відкривають<br />нові горизонти<span className="brand-dot">.</span></p></div>
      <div className="catalog-layout">
        <CourseList category={category} level={level} onCategoryChange={setCategory} onLevelChange={setLevel} onSelectCourse={setSelectedCourseId} />
        <div className="course-sidebar"><CourseDetails courseId={selectedCourseId} /><div id="profile"><UserProfile /></div></div>
      </div>
      <MyEnrollments />
    </section>
    <footer><a className="brand" href="#top"><span className="brand-mark">m</span> mai<span className="brand-dot">.</span></a><span>Навчайся. Рости. Створюй своє.</span><span>© 2026</span></footer>
  </main>;
}
