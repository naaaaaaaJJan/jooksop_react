import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ useNavigate import
import Calendar from '../components/Calendar';
import styles from './Home.module.css';
import WriteModal from '../components/WriteModal';

const mockData = {
  '2025.06.05': [
    {
      id: 1,
      title: '죽숲과 쌀나무 탈출',
      author: '죽숲',
    },
  ],
  '2025.06.07': [
    {
      id: 2,
      title: '하늘이 맑았던 날',
      author: '은하',
    },
    {
      id: 4,
      title: '레전드 시간낭비 간담회 참석',
      author: '나연, 윤나, 예은, 혜원, 태영',
    },
  ],
  '2025.06.04': [
    {
      id: 3,
      title: '우리 과가 통폐합된다고?',
      author: '죽솦',
    },
  ],
};

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showWritePopup, setShowWritePopup] = useState(false);
  const navigate = useNavigate(); 

  const posts = selectedDate ? mockData[selectedDate] || [] : [];

  const handleCreateDiaryAndOpenModal = async () => {
    const isoDate = selectedDate.replace(/\./g, '-');
  
    const newDiary = {
      content: "안녕하세요",
      date: isoDate, // 문자열로 그대로 전달
      taggedUserIds: null,
    };
  
    try {
      const res = await fetch(`http://localhost:8080/api/diaries/test123`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDiary),
      });
  
      if (!res.ok) throw new Error('다이어리 생성 실패');
  
      const result = await res.json();
      console.log('✅ 다이어리 생성 성공:', result);
      setShowWritePopup(true); // 모달 띄우기
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
            posts.map((post) => (
              <div key={post.id} className={styles.card}>
                <div className={styles.title}>• {post.title}</div>
                <div className={styles.author}>@{post.author}</div>
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
          userId="test123"
        />
      )}
    </div>
  );
}
