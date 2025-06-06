import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import styles from './FriendList.module.css';
import { useNavigate } from 'react-router-dom';
import Addfmodal from '../components/Addfmodal';

export default function FriendList() {
  const [friends, setFriends] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const carouselRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (carouselRef.current && friends.length >= 3) {
      const container = carouselRef.current;
      const cards = container.querySelectorAll(`.${styles.friendCard}`);
      const middleIndex =
        Math.floor(friends.length / 2) - (friends.length % 2 === 0 ? 1 : 0);
      const targetCard = cards[middleIndex];

      if (targetCard) {
        const scrollLeft =
          targetCard.offsetLeft - container.offsetWidth / 2 + targetCard.offsetWidth / 2;
        container.scrollLeft = scrollLeft;
      }
    }
    console.log('💡 friends 배열 내용:', friends);
  }, [friends]);

  const handleClick = (friendId) => {
    // 친구 카드 클릭 시 동작 예: 친구 프로필 페이지 이동
    navigate(`/profile/${friendId}`);

  const renderCard = (friend) => (
    <div
      className={styles.friendCard}
      key={friend.userId}
      onClick={() => handleClick(friend.userId)}
    >
      <img
        src={friend.profileImageUrl || '/default-profile.png'}
        alt={friend.nickname}
        className={styles.friendImage}
      />
      <div className={styles.friendName}>{friend.nickname}</div>
    </div>
  );

  return (
    <div className={styles.FriendListScreen}>
      <div className={styles.div}>
        <div className={styles.view}>
          <div className={styles.FLGroup}>
            <div className={styles.FL}>친구목록</div>
          </div>
        </div>

        {friends.length === 0 ? (
          <div>🙅 친구가 없습니다</div>
        ) : friends.length <= 2 ? (
          <div className={styles.centerContainer}>{friends.map(renderCard)}</div>
        ) : (
          <div className={styles.carouselWrapper} ref={carouselRef}>
            <div className={styles.carousel}>{friends.map(renderCard)}</div>
          </div>
        )}

        <div className={styles.addFriendText} onClick={() => setShowModal(true)}>
          + 친구 추가
        </div>

        {showModal && (
          <Addfmodal
            onClose={() => setShowModal(false)}
            requesterUserId={requesterUserId}
            onFriendAdded={() => {
              setShowModal(false);
              fetchFriendProfiles();
            }}
          />
        )}
      </div>
    </div>
  );
}
