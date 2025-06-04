// ProfileEditor.jsx
import React, { useState, useRef } from 'react';
import styles from './ProfileEditor.module.css';

function ProfileEditor({ user = {}, onClose }) {
  const [username, setUsername] = useState(user.username || '');
  const [userid, setUserid] = useState(user.userid || '');
  const [intro, setIntro] = useState(user.intro || '');
  const [image, setImage] = useState(user.image || '');
  const [isCheckingId, setIsCheckingId] = useState(false);

  const fileInputRef = useRef();

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIdCheck = () => {
    setIsCheckingId(true);
    setTimeout(() => {
      alert(userid === 'takenID' ? '이미 사용 중인 아이디입니다.' : '사용 가능한 아이디입니다.');
      setIsCheckingId(false);
    }, 1000);
  };

  const handleSave = () => {
    console.log({ username, userid, intro, image });
    alert('프로필이 저장되었습니다.');
    onClose(); // 저장 후 닫기
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <div className={styles.header}>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <div className={styles.left}>
          <img
            src={image}
            alt="프로필"
            className={styles.profileImage}
          />
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageChange}
          />
          <div
            className={styles.imageLabel}
            onClick={handleImageClick}
            style={{ cursor: 'pointer' }}
          >
            IMAGE
          </div>
        </div>

        <div className={styles.right}>
          <input
            className={styles.usernameInput}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onFocus={(e) => e.target.select()}
          />

          <div className={styles.useridRow}>
            <input
              className={styles.useridInput}
              value={userid}
              onChange={(e) => setUserid(e.target.value)}
              onFocus={(e) => e.target.select()}
            />
            <button
              className={styles.checkButton}
              onClick={handleIdCheck}
              disabled={isCheckingId}
            >
              중복확인
            </button>
          </div>

          <div className={styles.introRow}>
            <div className={styles.introLabel}>소개</div>
            <input
              className={styles.introInput}
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
              onFocus={(e) => e.target.select()}
            />
          </div>
        </div>

        <div className={styles.saveButton} onClick={handleSave}>
          변경완료
        </div>
      </div>
    </div>
  );
}

export default ProfileEditor;
