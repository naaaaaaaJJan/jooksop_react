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

  // ✅ 태그 목록 초기 불러오기
  useEffect(() => {
    const fetchTags = async () => {
      if (!diaryId) return;

      try {
        const res = await fetch(`${API_BASE_URL}/diaries/${diaryId}/tags`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('태그 불러오기 실패');

        const data = await res.json();
        setTaggedUsers(data);
        console.log('✅ 기존 태그 불러오기 완료:', data);
      } catch (err) {
        console.error('❌ 태그 로드 실패:', err.message);
      }
    };
    fetchTags();
  }, [diaryId, token]);

  const handleTagAdd = () => {
    const trimmedId = newTagId.trim();
    if (!trimmedId || taggedUsers.includes(trimmedId)) return;
    send('TAG_ADD', { diaryId, taggedUserId: trimmedId });
    setNewTagId('');
    setShowTagInput(false);
  };

  const debouncedSendEdit = useCallback(
    debounce((updatedTitle, updatedContent) => {
      if (!diaryId) return;
      if (
        updatedTitle !== lastAppliedTitle.current ||
        updatedContent !== lastAppliedContent.current
      ) {
        send('EDIT', { diaryId, title: updatedTitle, content: updatedContent });
        lastAppliedTitle.current = updatedTitle;
        lastAppliedContent.current = updatedContent;
      }
    }, 800),
    [diaryId, send]
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