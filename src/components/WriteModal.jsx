import styles from './WriteModal.module.css';
import { useState } from 'react';

export default function WriteModal({ onClose, date }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSave = () => {
    console.log('작성 날짜:', date);
    console.log('제목:', title);
    console.log('내용:', content);
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <button className={styles.closeBtn} onClick={onClose}>✕</button>
        
        <div className={styles.date}>{date}</div>

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
  );
}