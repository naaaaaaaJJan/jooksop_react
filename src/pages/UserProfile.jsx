import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './UserProfile.module.css';
import ProfileEditor from '../components/ProfileEditor';
import { userInfo } from '../mock/userData';

function UserProfile() {
  const user = userInfo[0]; // 첫 번째 유저를 현재 유저라고 가정
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false); // 모달 상태

  const today = new Date().toISOString().split('T')[0]; // yyyy-mm-dd

  const handleProfileEdit = () => {
    setIsEditing(true);
  };

  return (
    <div className={styles.Userscreen}>
      <button className={styles.homeButton} onClick={() => navigate('/')}>
        HOME
      </button>

      <div className={styles.profileLeft}>
        <div className={styles.profileImageWrapper}>
          <img className={styles.image} src={user.image} alt={user.name} />
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
          <div className={styles.username}>{user.username}</div>
          <div className={styles.userId}>{user.userid}</div>
        </div>

        <div className={styles.introgroup}>
          <div className={styles.description}>{user.intro}</div>
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

      {/* ✅ 모달로 프로필 에디터 띄우기 */}
      {isEditing && (
        <ProfileEditor user={user} onClose={() => setIsEditing(false)} />
      )}
    </div>
  );
}

export default UserProfile;
