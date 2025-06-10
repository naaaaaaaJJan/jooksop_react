import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import useDiarySocket from '../hooks/useDiarySocket';
import debounce from 'lodash.debounce';
import styles from './Write.module.css';

export default function WritePage() {
  const { state } = useLocation();
  const { diaryId } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const userId = token ? jwtDecode(token).sub : null;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const date = new Date().toLocaleDateString();

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://jooksop-backend.onrender.com';

  // ✅ 최초 진입 시 서버에서 다이어리 가져오기
  useEffect(() => {
    const fetchDiary = async () => {
      if (!diaryId || !token) return;
      try {
        const res = await fetch(`${API_BASE_URL}/api/diaries/${diaryId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('다이어리 불러오기 실패');
        const data = await res.json();
        setTitle(data.title || '');
        setContent(data.content || '');
      } catch (err) {
        console.error('❌ 다이어리 불러오기 실패:', err);
      }
    };

    fetchDiary();
  }, [diaryId, token, API_BASE_URL]);

  // ✅ WebSocket 연결 및 수신
  const { send } = useDiarySocket({
    diaryId,
    token,
    onMessage: (msg) => {
      if (msg.type === 'EDIT') {
        setTitle(msg.title ?? '');
        setContent(msg.content ?? '');
      }
    },
  });

  // ✅ 변경사항을 디바운스해서 WebSocket으로 전송
  const debouncedSend = useCallback(
    debounce((updatedTitle, updatedContent) => {
      send('EDIT', {
        diaryId,
        title: updatedTitle,
        content: updatedContent,
      });
      console.log('📡 전송됨:', { title: updatedTitle, content: updatedContent });
    }, 500),
    [send, diaryId]
  );

  useEffect(() => {
    if (diaryId) debouncedSend(title, content);
  }, [title, content, diaryId, debouncedSend]);

  if (!token) {
    alert('로그인이 필요합니다.');
    navigate('/login');
    return null;
  }

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
          e.target.style.height = 'auto';
          e.target.style.height = `${e.target.scrollHeight}px`;
        }}
      />
    </div>
  );
}
