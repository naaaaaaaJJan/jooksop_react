import styles from './WriteModal.module.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SlSizeFullscreen } from 'react-icons/sl';
import { TfiClose } from 'react-icons/tfi';

export default function WriteModal({ date, onClose, userId }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleSave = () => {
    console.log("작성한 제목:", title);
    console.log("작성한 내용:", content);
    onClose(); // 저장 후 모달 닫기
  };

  const handleFullscreen = () => {
    navigate('/write');
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <div className={styles.header}>
          <button className={styles.fullscreenBtn} onClick={handleFullscreen}><SlSizeFullscreen /></button>
          <button className={styles.closeBtn} onClick={onClose}><TfiClose /></button>
        </div>

        <div className={styles.editor}>
          {date && <div className={styles.date}>{date}</div>}
          <input
            className={styles.titleInput}
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className={styles.textarea}
            placeholder="내용을 입력하세요..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button className={styles.saveBtn} onClick={handleSave}>저장</button>
        </div>
      </div>
    </div>
  );
}