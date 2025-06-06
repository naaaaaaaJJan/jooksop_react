import styles from './Addfmodal.module.css';
import { useState } from 'react';
import { TfiClose } from 'react-icons/tfi';
import axios from 'axios';

export default function Addfmodal({ onClose, requesterUserId }) {
  const [searchId, setSearchId] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!searchId.trim()) {
      setError('아이디를 입력해주세요.');
      setSearchResults([]);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('로그인이 필요합니다.');
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8080/api/friends/search?userId=${searchId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await res.json();
      console.log('📦 받은 응답:', data);

      if (res.status === 401) {
        setError('로그인 세션이 만료되었습니다. 다시 로그인 해주세요.');
        return;
      }

      if (Array.isArray(data)) {
        setSearchResults(data);
        setError('');
      } else {
        console.error('⚠️ 예외 응답:', data);
        setError(data.message || '알 수 없는 오류 발생');
        setSearchResults([]);
      }
    } catch (err) {
      console.error('❌ 검색 실패:', err);
      setError('검색 중 오류가 발생했습니다.');
      setSearchResults([]);
    }
  };

  const handleAddFriend = async (targetUserId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      await axios.post(
        `http://localhost:8080/api/friends/${requesterUserId}`,
        { targetUserId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      alert('친구 요청을 보냈습니다.');
      onClose();
    } catch (err) {
      console.error('❌ 친구 추가 실패:', err.response?.data || err.message);
      alert('친구 추가에 실패했습니다.');
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <button className={styles.closeButton} onClick={onClose}>
          <TfiClose />
        </button>

        <h2 className={styles.modalTitle}>친구 추가</h2>

        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="아이디로 검색"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className={styles.searchInput}
          />
          <button onClick={handleSearch} className={styles.searchButton}>
            검색
          </button>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        {searchResults.length > 0 && (
          <div className={styles.resultBox}>
            {searchResults.map((user) => (
              <div key={user.id} className={styles.userItem}>
                <p>
                  <strong>닉네임:</strong> {user.nickname}
                </p>
                <p>
                  <strong>아이디:</strong> {user.userId}
                </p>
                <button
                  onClick={() => handleAddFriend(user.userId)}
                  className={styles.addButton}
                >
                  친구 추가
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
