import React, { useEffect, useRef } from 'react';
import styles from './FriendList.module.css';
import { friendInfo } from '../mock/friendData';

export default function FriendList() {
  const friends = friendInfo;
  const carouselRef = useRef(null);

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

  return (
    <div className={styles.FriendListScreen}>
      <div className={styles.div}>
        <div className={styles.view}>
          <div className={styles.FLGroup}>
            <div className={styles.FL}>친구목록</div>
          </div>
        </div>

        {/* n = 1 또는 2 */}
        {friends.length <= 2 ? (
          <div className={styles.centerContainer}>
            {friends.map((friend) => (
              <div className={styles.friendCard} key={friend.id}>
                <img
                  src={friend.image}
                  alt={friend.name}
                  className={styles.friendImage}
                />
              </div>
            ))}
          </div>
        ) : (
          // n ≥ 3
          <div className={styles.carouselWrapper} ref={carouselRef}>
            <div className={styles.carousel}>
              {friends.map((friend) => (
                <div className={styles.friendCard} key={friend.id}>
                  <img
                    src={friend.image}
                    alt={friend.name}
                    className={styles.friendImage}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
