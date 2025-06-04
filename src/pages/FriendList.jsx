import React, { useEffect, useRef, useState } from 'react';
import styles from './FriendList.module.css';
import { friendInfo } from '../mock/friendData';
import { useNavigate } from 'react-router-dom';
import Addfmodal from '../components/Addfmodal';  // 이 컴포넌트 import 필요

export default function FriendList() {
  const friends = friendInfo;
  const carouselRef = useRef(null);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false); // 모달 상태 추가

  useEffect(() => {
    if (carouselRef.current && friends.length >= 3) {
      const container = carouselRef.current;
      const cards = container.querySelectorAll(`.${styles.friendCard}`);

      const middleIndex = Math.floor(friends.length / 2) - (friends.length % 2 === 0 ? 1 : 0);
      const targetCard = cards[middleIndex];

      if (targetCard) {
        const scrollLeft =
          targetCard.offsetLeft - container.offsetWidth / 2 + targetCard.offsetWidth / 2;
        container.scrollLeft = scrollLeft;
      }
    }
  }, [friends]);

  const handleClick = (id) => {
    navigate(`/friend/${id}`);
  };

  const renderCard = (friend) => (
    <div
      className={styles.friendCard}
      key={friend.id}
      onClick={() => handleClick(friend.id)}
    >
      <img
        src={friend.image}
        alt={friend.name}
        className={styles.friendImage}
      />
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

        {friends.length <= 2 ? (
          <div className={styles.centerContainer}>
            {friends.map(renderCard)}
          </div>
        ) : (
          <div className={styles.carouselWrapper} ref={carouselRef}>
            <div className={styles.carousel}>
              {friends.map(renderCard)}
            </div>
          </div>
        )}

        {/* 친구 추가 버튼 */}
        <div
          className={styles.addFriendText}
          onClick={() => setShowModal(true)}
        >
          + 친구 추가
        </div>

        {/* 친구 추가 모달 */}
        {showModal && <Addfmodal onClose={() => setShowModal(false)} />}
      </div>
    </div>
  );
}
