import { useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './FriendProfile.module.css';
import Calendar from '../components/Calendar';
import { friendInfo } from '../mock/friendData';
import { friendPosts } from '../mock/friendPosts';

export default function FriendProfile() {
  const [selectedDate, setSelectedDate] = useState(null);
  const { id } = useParams();

  const friend = friendInfo.find((f) => f.id === id);
  const posts = selectedDate ? friendPosts[selectedDate] || [] : [];

  if (!friend) {
    return <div className={styles.container}>존재하지 않는 친구입니다.</div>;
  }

  return (
    <div className={`${styles.container}`}>
      <div className={`${styles.leftBox} ${selectedDate ? styles.expanded : ''}`}>
        <div className={`${styles.profileBox} ${selectedDate ? styles.profileExpanded : ''}`}>
          <img src={friend.image} alt="프로필" className={styles.image} />
          <div className={styles.textBox}>
            <div className={styles.nameRow}>
              <h2 className={styles.username}>{friend.username}</h2>
              <p className={styles.userid}>{friend.userid}</p>
            </div>
            <p className={styles.intro}>{friend.intro}</p>
          </div>
        </div>

        <div className={styles.calendarBox}>
          <Calendar
            onSelect={(date) => {
              setSelectedDate((prev) => (prev === date ? null : date));
            }}
            selectedDate={selectedDate}
          />
        </div>
      </div>

      {selectedDate && (
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
      )}
    </div>
  );
}
