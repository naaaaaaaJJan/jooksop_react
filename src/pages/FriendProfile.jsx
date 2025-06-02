import { useState } from 'react';
import styles from './FriendProfile.module.css';
import Calendar from '../components/Calendar';
import { friendInfo } from '../mock/friendData';
import { friendPosts } from '../mock/friendPosts';

export default function FriendProfile() {
  const today = new Date().toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState(today);
  const posts = friendPosts[selectedDate] || [];

  return (
    <div className={styles.container}>
      <div className={styles.profileBox}>
        <img
          src={friendInfo.profileImage}
          alt="프로필"
          className={styles.image}
        />
        <div className={styles.textBox}>
          <div className={styles.nameRow}>
            <h2 className={styles.username}>{friendInfo.username}</h2>
            <p className={styles.userid}>{friendInfo.userid}</p>
          </div>
          <p className={styles.intro}>{friendInfo.intro}</p>
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