import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Calendar from '../components/Calendar';
import styles from './Home.module.css';
import WriteModal from '../components/WriteModal';

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [posts, setPosts] = useState([]);
  const [showWritePopup, setShowWritePopup] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const userId = token ? jwtDecode(token).sub : null;

  useEffect(() => {
    const fetchPosts = async () => {
      if (!selectedDate || !userId) return;

      const isoDate = selectedDate.replace(/\./g, '-');

      try {
        const res = await fetch(`http://localhost:8080/api/diaries?date=${isoDate}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('글 불러오기 실패');
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error('글 목록 가져오기 실패:', err);
        setPosts([]);
      }
    };

    fetchPosts();
  }, [selectedDate, userId]);

  const handleCreateDiaryAndOpenModal = async () => {
    const isoDate = selectedDate.replace(/\./g, '-');
    const token = localStorage.getItem("token");
  
    const newDiary = {
      content: "na테스트으",
      date: isoDate,
      taggedUserIds: null,
    };
  
    try {
      const res = await fetch("http://localhost:8080/api/diaries", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` // ✅ JWT 토큰을 Authorization 헤더에 추가
        },
        body: JSON.stringify(newDiary),
      });
  
      if (!res.ok) throw new Error('다이어리 생성 실패');
  
      const result = await res.json();
      console.log('✅ 다이어리 생성 성공:', result);
      setShowWritePopup(true);
    } catch (err) {
      console.error('❌ 다이어리 생성 실패:', err);
      alert('다이어리 생성에 실패했습니다.');
    }
  };

  return (
    <div className={styles.container}>
      <button className={styles.myButton} onClick={() => navigate('/user-profile')}>
        MY
      </button>

      <div className={`${styles.calendarWrap} ${selectedDate ? styles.selected : ''}`}>
        <Calendar
          onSelect={(date) => {
            setSelectedDate((prev) => (prev === date ? null : date));
          }}
          selectedDate={selectedDate}
        />
      </div>

      {selectedDate && (
        <div className={styles.sidePanel}>
          <h3>{selectedDate}</h3>
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <div key={index} className={styles.card}>
                <div className={styles.title}>• {post.content || '제목 없음'}</div>
                <div className={styles.author}>@{post.userId}</div>
              </div>
            ))
          ) : (
            <p className={styles.empty}>작성된 글이 없습니다.</p>
          )}
          <button className={styles.writeButton} onClick={handleCreateDiaryAndOpenModal}>
            글작성
          </button>
        </div>
      )}

      {showWritePopup && (
        <WriteModal
          onClose={() => setShowWritePopup(false)}
          date={selectedDate}
          userId={userId}
        />
      )}
    </div>
  );
}