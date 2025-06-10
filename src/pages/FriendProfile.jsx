import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './FriendProfile.module.css';
import Calendar from '../components/Calendar';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function FriendProfile() {
  const { id: friendId } = useParams();
  const [friendInfo, setFriendInfo] = useState(null);
  const [friendPosts, setFriendPosts] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [errorMsg, setErrorMsg] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!friendId || !token) {
      setErrorMsg('유효하지 않은 접근입니다.');
      return;
    }
    setErrorMsg('');

    const fetchFriendProfile = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/users/${friendId}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFriendInfo(res.data);
      } catch (error) {
        console.error('친구 프로필 불러오기 실패:', error);
        setErrorMsg('친구 프로필을 불러오는데 실패했습니다.');
        setFriendInfo(null);
      }
    };

    const fetchFriendPosts = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/users/${friendId}/posts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFriendPosts(res.data);
      } catch (error) {
        console.error('친구 포스트 불러오기 실패:', error);
        setErrorMsg('친구 게시글을 불러오는데 실패했습니다.');
        setFriendPosts({});
      }
    };

    fetchFriendProfile();
    fetchFriendPosts();
  }, [friendId, token]);

  if (errorMsg) {
    return <div className={styles.container}>{errorMsg}</div>;
  }

  if (!friendInfo) {
    return <div className={styles.container}>존재하지 않는 친구입니다.</div>;
  }

  // posts 날짜별로 객체로 받아온다고 가정
  const posts = friendPosts[selectedDate] || [];

  return (
    <div className={styles.container}>
      <div className={styles.profileBox}>
        <img
          src={friendInfo.profileImageUrl || '/default-profile.png'}
          alt="프로필"
          className={styles.image}
        />
        <div className={styles.textBox}>
          <div className={styles.nameRow}>
            <h2 className={styles.username}>{friendInfo.nickname || friendInfo.username}</h2>
            <p className={styles.userid}>{friendInfo.userId || friendInfo.userid}</p>
          </div>
          <p className={styles.intro}>{friendInfo.intro || '소개가 없습니다.'}</p>
        </div>
      </div>

      <div className={styles.mainSection}>
        <div className={styles.calendarBox}>
          <Calendar
            selectedDate={selectedDate}
            onSelect={(date) => setSelectedDate(date)}
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
