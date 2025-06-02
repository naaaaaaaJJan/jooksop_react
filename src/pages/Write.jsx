import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './write.module.css';

export default function WritePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const date = new Date().toLocaleDateString();
  const navigate = useNavigate();

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
        onInput={(e) => {
          e.target.style.height = 'auto'; // 초기화
          e.target.style.height = `${e.target.scrollHeight}px`; // 내용에 맞게 높이 조절
        }}
      />

      <button className={styles.saveBtn} onClick={handleSave}>저장</button>
    </div>
  );
}