// src/components/WriteEditor.jsx
import styles from './WriteEditor.module.css';
import { useState } from 'react';

export default function WriteEditor({ date, onSave }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSave = () => {
    const newPost = { title, content, date };
    console.log('저장할 데이터:', newPost);
    onSave?.(newPost);
  };

  return (
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
  );
}