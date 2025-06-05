import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './FriendProfile.module.css';
import Calendar from '../components/Calendar';
import axios from 'axios';

export default function FriendProfile() {
  const { id: friendId } = useParams();
  const [friendInfo, setFriendInfo] = useState(null);
  const [friendPosts, setFriendPosts] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!friendId || !token) return;

    // 친구 프로필 불러오기
    const fetchFriendProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/users/${friendId}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFriendInfo(res.data);
      } catch (error) {
        console.error('친구 프로필 불러오기 실패:', error);
        setFriendInfo(null);
      }
    };

    // 친구 포스트 불러오기 (예시: 날짜별로 포스트를 받아온다고 가정)
    const fetchFriendPosts = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/users/${friendId}/posts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // 서버가 날짜별로 포스트를 객체 형태로 내려준다고 가정 (예: { "2025-06-05": [{id, title}, ...], ... })
        setFriendPosts(res.data);
      } catch (error) {
        console.error('친구 포스트 불러오기 실패:', error);
        setFriendPosts({});
      }
    };

    fetchFriendProfile();
    fetchFriendPosts();
  }, [friendId, token]);

  if (!friendInfo) {
    return <div className={styles.container}>존재하지 않는 친구입니다.</div>;
  }

  const posts = friendPosts[selectedDate] || [];

  return (
    <div className={styles.container}>
      <div className={styles.profileBox}>
        <img
          src={friendInfo.profileImage || '/default-profile.png'}
          alt="프로필"
          className={styles.image}
        />
        <div className={styles.textBox}>
          <div className={styles.nameRow}>
            <h2 className={styles.username}>{friendInfo.username || friendInfo.nickname}</h2>
            <p className={styles.userid}>{friendInfo.userid || friendInfo.userId}</p>
          </div>
          <p className={styles.intro}>{friendInfo.intro || '소개가 없습니다.'}</p>
        </div>
      </div>

      <div className={styles.mainSection}>
        <div className={styles.calendarBox}>
          <Calendar
            onSelect={(date) => setSelectedDate(date)}
            selectedDate={selectedDate}
          />
        </div>

        <div className={styles.postsBox}>
          <h3>{selectedDate}</h3>
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className={styles.card}>
                <div className={styles.title}>• {post.title}</div>
              </div>
            ))
          ) : (
            <p className={styles.empty}>작성된 글이 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}
