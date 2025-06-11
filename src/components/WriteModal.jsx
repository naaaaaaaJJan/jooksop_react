// WriteModal.jsx
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
  readOnly = false,
}) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [taggedUsers, setTaggedUsers] = useState([]);
  const [newTagId, setNewTagId] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);

  const lastAppliedTitle = useRef(initialTitle);
  const lastAppliedContent = useRef(initialContent);
  const isRemoteUpdate = useRef(false);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleSocketMessage = useCallback((msg) => {
    if (msg.error) {
      alert(msg.error);
      return;
    }
    if (msg.userId === userId) return;

    if (msg.type === 'TAG_ADD') {
      setTaggedUsers((prev) => {
        const updated = prev.includes(msg.taggedUserId) ? prev : [...prev, msg.taggedUserId];
        return updated;
      });
    } else if (msg.type === 'TAG_REMOVE') {
      setTaggedUsers((prev) => prev.filter((id) => id !== msg.taggedUserId));
    } else if (msg.type === 'EDIT') {
      isRemoteUpdate.current = true;
      if (msg.title !== undefined) setTitle(msg.title);
      if (msg.content !== undefined) setContent(msg.content);
    }
  }, [userId]);

  const { send } = useDiarySocket({
    diaryId,
    token,
    onMessage: handleSocketMessage,
  });

  // ✅ 일기 전체 불러오기 (제목, 내용, 태그 포함)
  useEffect(() => {
    if (!diaryId || !token) return;

    const fetchDiary = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/diaries/${diaryId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('다이어리 불러오기 실패');

        const data = await res.json();
        setTitle(data.title || '');
        setContent(data.content || '');
        setTaggedUsers(data.taggedUserIds || []);
        console.log('✅ 일기 전체 데이터 로딩 성공:', data);
      } catch (err) {
        console.error('❌ 일기 불러오기 실패:', err.message);
      }
    };

    fetchDiary();
  }, [diaryId, token]);

  const handleTagAdd = () => {
    if (readOnly) return; // 🔒 readOnly일 때 동작 막기

    const trimmedId = newTagId.trim();
    if (!trimmedId || taggedUsers.includes(trimmedId)) return;

    send('TAG_ADD', { diaryId, taggedUserId: trimmedId });
    setNewTagId('');
    setShowTagInput(false);
  };

  const debouncedSendEdit = useCallback(
    debounce((updatedTitle, updatedContent) => {
      if (!diaryId || readOnly) return; // 🔒 readOnly일 땐 전송 막기
      if (
        updatedTitle !== lastAppliedTitle.current ||
        updatedContent !== lastAppliedContent.current
      ) {
        send('EDIT', { diaryId, title: updatedTitle, content: updatedContent });
        lastAppliedTitle.current = updatedTitle;
        lastAppliedContent.current = updatedContent;
      }
    }, 800),
    [diaryId, send, readOnly] // readOnly 의존성도 추가해야 반영됨
  );

  useEffect(() => {
    if (isRemoteUpdate.current) {
      isRemoteUpdate.current = false;
      return;
    }
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
            disabled={readOnly}
          />

          <div className={styles.tagArea}>
            {taggedUsers.length > 0 &&
              taggedUsers.map((id) => (
                <span key={id} className={styles.tagChip}>
                  {id}
                  {!readOnly && (
                    <button
                      className={styles.removeTagBtn}
                      onClick={() => {
                        send('TAG_REMOVE', { diaryId, taggedUserId: id });
                        setTaggedUsers((prev) => prev.filter((v) => v !== id));
                      }}
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}

            {!readOnly && showTagInput ? (
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
              !readOnly && (
                <button className={styles.tagAddBtn} onClick={() => setShowTagInput(true)}>
                  @
                </button>
              )
            )}
          </div>

          <textarea
            className={styles.textarea}
            placeholder="내용을 입력하세요..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={readOnly}
          />
        </div>
      </div>
    </div>
  );
}