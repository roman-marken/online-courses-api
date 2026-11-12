import { useEffect, useState } from 'react';
import { getCurrentUser } from '../api/userApi';
import type { ApiError } from '../api/axiosInstance';
import type { UserDto } from '../types/user';

export function UserProfile() {
  const [user, setUser] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    getCurrentUser()
      .then((profile) => { if (active) setUser(profile); })
      .catch((reason: ApiError) => { if (active) setError(reason.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <aside className="profile-card" aria-labelledby="profile-heading">
      <div className="profile-top"><span className="profile-icon">✳</span><span className="online-dot" /></div>
      <p className="eyebrow">Особистий кабінет</p><h2 id="profile-heading">Мій профіль</h2>
      {loading && <p className="profile-state">Завантажуємо профіль…</p>}
      {error && <p className="profile-error" role="alert">{error}<br /><small>Переконайтеся, що ви увійшли в систему.</small></p>}
      {user && <div className="user-info">
        {user.avatarUrl ? <img className="avatar" src={user.avatarUrl} alt="" /> :
          <div className="avatar avatar-fallback">{user.fullName.slice(0, 1)}</div>}
        <strong>{user.fullName}</strong><span>{user.email}</span>
        <div className="profile-stat"><span>Мої курси</span><b>{user.enrolledCourseIds.length}</b></div>
      </div>}
      {!loading && !error && !user && <p className="profile-state">Не вдалося отримати профіль.</p>}
      <p className="protected-note">⌑ Захищене з’єднання</p>
    </aside>
  );
}
