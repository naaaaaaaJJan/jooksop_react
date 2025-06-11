import styles from './WriteModal.module.css';
import { useEffect, useState, useCallback, useRef } from 'react';
import debounce from 'lodash.debounce';
import { useNavigate } from 'react-router-dom';
import { SlSizeFullscreen } from 'react-icons/sl';
import { TfiClose } from 'react-icons/tfi';
import useDiarySocket from '../hooks/useDiarySocket';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function WriteModal({
  date,
  onClose,
  userId,
  initialTitle = '',
  initialContent = '',
  diaryId,
}) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [taggedUsers, setTaggedUsers] = useState([]);
  const [newTagId, setNewTagId] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);

  const lastSentTitle   = useRef(initialTitle);
  const lastSentContent = useRef(initialContent);
  const isRemoteUpdate  = useRef(false);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleSocketMessage = useCallback((msg) => {
    if (msg.error) {
      alert(msg.error);
      return;
    }

    if (msg.userId === userId) {
      return;
    }

    if (msg.type === 'TAG_ADD') {
      console.log('✅ TAG_ADD 메시지 수신:', msg);
      setTaggedUsers((prev) => {
        const updated = prev.includes(msg.taggedUserId) ? prev : [...prev, msg.taggedUserId];
        console.log('🟢 UI에 반영할 태그 목록:', updated);
        return updated;
      });
    } else if (msg.type === 'TAG_REMOVE') {
      setTaggedUsers((prev) => prev.filter((id) => id !== msg.taggedUserId));
    }  else if (msg.type === 'EDIT') {
      isRemoteUpdate.current = true;
      if (msg.title !== undefined)   setTitle(msg.title);
      if (msg.content !== undefined) setContent(msg.content);
    }
  }, [userId]);

  const { send } = useDiarySocket({
    diaryId,
    token,
    onMessage: handleSocketMessage,
  });

  const handleTagAdd = () => {
    if (!newTagId.trim()) return;

    console.log('📤 TAG 추가 요청:', newTagId.trim());
    send('TAG_ADD', {
      diaryId,
      taggedUserId: newTagId.trim(),
    });

    setNewTagId('');
    setShowTagInput(false);
  };

  useEffect(() => {
    const fetchDiary = async () => {
      if (!diaryId) return;

      try {
        const res = await fetch(`${API_BASE_URL}/diaries/${diaryId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('다이어리 불러오기 실패');

        const data = await res.json();
        console.log('📥 다이어리 데이터:', data);

        setTitle(data.title || '');
        setContent(data.content || '');
        setTaggedUsers(data.taggedUserIds || []);
      } catch (err) {
        console.error('❌ 다이어리 로드 실패:', err.message);
      }
    };

    fetchDiary();
  }, [diaryId, token]);

  const debouncedSendEdit = useCallback(
    debounce((updatedTitle, updatedContent) => {
      if (!diaryId) return;
  
      // 🔒 이전 서버에서 받은 값과 비교해서 달라야 전송
      if (
        updatedTitle !== lastAppliedTitle.current ||
        updatedContent !== lastAppliedContent.current
      ) {
        send('EDIT', {
          diaryId,
          title: updatedTitle,
          content: updatedContent,
        });
        console.log('📨 실시간 EDIT 메시지 전송됨:', { title: updatedTitle, content: updatedContent });
  
        // 💾 내가 보낸 내용을 저장 (서버 반영된 걸로 간주)
        lastAppliedTitle.current = updatedTitle;
        lastAppliedContent.current = updatedContent;
      }
    }, 800),
    [diaryId, send]
  );

  useEffect(() => {
    debouncedSendEdit(title, content);
  }, [title, content, debouncedSendEdit]);

  const handleFullscreen = () => {
    navigate(`/write/${diaryId}`, {
      state: { title, content },
    });
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <div className={styles.header}>
          <button className={styles.fullscreenBtn} onClick={handleFullscreen}>
            <SlSizeFullscreen />
          </button>
          <button className={styles.closeBtn} onClick={onClose}>
            <TfiClose />
          </button>
        </div>

        <div className={styles.editor}>
          {date && <div className={styles.date}>{date}</div>}

          <input
            className={styles.titleInput}
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className={styles.tagArea}>
            {taggedUsers.length > 0 &&
              taggedUsers.map((id) => (
                <span key={id} className={styles.tagChip}>
                  {id}
                  <button
                    className={styles.removeTagBtn}
                    onClick={() => {
                      send('TAG_REMOVE', { diaryId, taggedUserId: id });
                      setTaggedUsers((prev) => prev.filter((v) => v !== id));
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}

            {showTagInput ? (
              <input
                className={styles.tagInput}
                value={newTagId}
                onChange={(e) => setNewTagId(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleTagAdd();
                  if (e.key === 'Escape') setShowTagInput(false);
                }}
                autoFocus
              />
            ) : (
              <button className={styles.tagAddBtn} onClick={() => setShowTagInput(true)}>
                @
              </button>
            )}
          </div>

          <textarea
            className={styles.textarea}
            placeholder="내용을 입력하세요..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
