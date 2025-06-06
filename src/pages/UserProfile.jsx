import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './UserProfile.module.css';
import ProfileEditor from '../components/ProfileEditor';

function UserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // 서버에서 받아온 유저 정보 저장
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [isEditing, setIsEditing] = useState(false); // 프로필 편집 모달 상태

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('📦 사용자 토큰:', token);

    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    fetch('http://localhost:8080/api/users/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        console.log('🔍 응답 상태:', res.status);
        if (!res.ok) throw new Error('유저 정보 불러오기 실패');
        return res.json();
      })
      .then(data => {
        console.log('✅ 서버에서 받은 데이터:', data);

        // 1. 응답이 success/data 구조일 경우
        if (data.success && data.data) {
          setUser(data.data);
        }
        // 2. 응답이 바로 유저 객체일 경우
        else if (data.userId) {
          setUser(data);
        } else {
          throw new Error(data.message || '유저 정보가 없습니다.');
        }

        setLoading(false);
      })
      .catch(err => {
        console.error('❌ 프로필 로딩 실패:', err);
        alert('유저 정보를 가져오지 못했습니다.');
        navigate('/login');
      });
  }, [navigate]);

  const handleProfileEdit = () => {
    setIsEditing(true);
  };

  if (loading) {
    return <div className={styles.Userscreen}>로딩 중...</div>;
  }

  if (!user) {
    return <div className={styles.Userscreen}>유저 정보를 불러올 수 없습니다.</div>;
  }
  
  return (
    <div className={styles.Userscreen}>
      <button className={styles.homeButton} onClick={() => navigate('/')}>
        HOME
      </button>

      <div className={styles.profileLeft}>
        <div className={styles.profileImageWrapper}>
          <img
            className={styles.image}
            src={user.profileImageUrl || '/default-profile.png'}
            alt={user.nickname}
          />
        </div>

        <div
          className={styles.profileChange}
          onClick={handleProfileEdit}
          style={{ cursor: 'pointer' }}
        >
          프로필 변경
        </div>
      </div>

      <div className={styles.profileRight}>
        <div className={styles.userInfo}>
          <div className={styles.username}>{user.nickname}</div>
          <div className={styles.userId}>{user.userId}</div>
        </div>

        <div className={styles.introgroup}>
          <div className={styles.description}>{user.intro || '소개글이 없습니다.'}</div>
        </div>

        <button className={styles.menuButton} onClick={() => navigate('/setting')}>
          설정
        </button>
        <button className={styles.menuButton} onClick={() => navigate('/friend-list')}>
          친구 목록
        </button>
        <button className={styles.menuButton} onClick={() => navigate('/storagebox')}>
          보관함
        </button>
      </div>

{isEditing && <ProfileEditor user={user} onClose={() => setIsEditing(false)} />}
    </div>
  );
}

export default UserProfile;
