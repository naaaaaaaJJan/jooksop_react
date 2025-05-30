import { useState } from 'react';
import styles from './FriendProfile.module.css';
import Calendar from '../components/Calendar';
import { friendInfo } from '../mock/friendData';
import { friendPosts } from '../mock/friendPosts';

export default function FriendProfile() {
  const [selectedDate, setSelectedDate] = useState(null);
  const posts = selectedDate ? friendPosts[selectedDate] || [] : [];

  return (
    <div className={`${styles.container}`}>
      {/* 프로필 + 달력 묶는 영역 */}
      <div className={`${styles.leftBox} ${selectedDate ? styles.expanded : ''}`}>
        <div className={`${styles.profileBox} ${selectedDate ? styles.profileExpanded : ''}`}>
          <img src={friendInfo.profileImage} alt="프로필" className={styles.image} />
          <div className={styles.textBox}>
            <div className={styles.nameRow}>
              <h2 className={styles.username}>{friendInfo.username}</h2>
              <p className={styles.userid}>{friendInfo.userid}</p>
            </div>
            <p className={styles.intro}>{friendInfo.intro}</p>
          </div>
        </div>

        <div className={styles.calendarBox}>
          <Calendar
            onSelect={(date) => {
              setSelectedDate(prev => prev === date ? null : date);
            }}
            selectedDate={selectedDate}
          />
        </div>
      </div>

      {/* 글 목록 */}
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