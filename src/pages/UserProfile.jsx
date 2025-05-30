import React from 'react';
import styles from './UserProfile.module.css';
import { userInfo } from '../mock/userData';
import { useNavigate } from 'react-router-dom'; // ✅ 추가

function UserProfile() {
  const user = userInfo[0]; // 첫 번째 유저를 현재 유저라고 가정
  const navigate = useNavigate(); // ✅ navigate 훅 사용

  return (
    <div className={styles['Userscreen']}>
      {/* 왼쪽 프로필 이미지 영역 */} 
      <div className={styles.profileLeft}> 
        <div className={styles.profileImageWrapper}> 
          <img className={styles.image} src={user.image} alt={user.name} />
        </div>
        <div className={styles.profileChange}>프로필 변경</div>
      </div>

      {/* 오른쪽 유저 정보 및 메뉴 */}
      <div className={styles.profileRight}>
        <div className={styles.userInfo}>
          <div className={styles.username}>{user.username}</div>
          <div className={styles.userId}>{user.userid}</div>
        </div>

        <div className={styles.introgroup}>
          <div className={styles.description}>{user.intro}</div>
        </div>

        <button 
          className={styles.menuButton}
          onClick={() => navigate('/setting')}
          >
            설정
        </button>

        <button
          className={styles.menuButton}
          onClick={() => navigate('/friend-list')}
        >
          친구 목록
        </button>

        <button
          className={styles.menuButton}
          onClick={() => navigate('/storagebox')}
        >
          보관함
        </button>

      </div>
    </div>
  );
}

export default UserProfile;
