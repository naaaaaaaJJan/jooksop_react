import styles from './Addfmodal.module.css';
import { useState } from 'react';
import { TfiClose } from 'react-icons/tfi';
import axios from 'axios';

export default function Addfmodal({ onClose }) {
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!searchId.trim()) {
      setError("아이디를 입력해주세요.");
      return;
    }

    try {
      const response = await axios.get("/api/user/search", {
        params: { userId: searchId }
      });
      setSearchResult(response.data);
      setError("");
    } catch (err) {
      setSearchResult(null);
      setError("해당 아이디를 가진 사용자가 없습니다.");
    }
  };

  const handleAddFriend = async () => {
    try {
      await axios.post("/api/friends/add", {
        friendId: searchResult.userId
      });
      alert("친구 요청을 보냈습니다.");
      onClose();
    } catch (err) {
      alert("친구 추가에 실패했습니다.");
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

        {searchResult && (
          <div className={styles.resultBox}>
            <p><strong>닉네임:</strong> {searchResult.nickname}</p>
            <p><strong>아이디:</strong> {searchResult.userId}</p>
            <button onClick={handleAddFriend} className={styles.addButton}>
              친구 추가
            </button>
          </div>
        )}
      </div>
    </div>
  );
}