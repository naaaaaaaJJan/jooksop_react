import React, { useEffect, useRef, useState, useCallback } from 'react';
import axios from 'axios';
import styles from './FriendList.module.css';
import { useNavigate } from 'react-router-dom';
import Addfmodal from '../components/Addfmodal';

const API_BASE_URL = 'https://jooksop-backend.onrender.com/api';

export default function FriendList() {
  const [friends, setFriends] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const carouselRef = useRef(null);
  const navigate = useNavigate();

  const requesterUserId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  const fetchFriendProfiles = useCallback(async () => {
    if (!requesterUserId || !token) {
      console.warn('⚠ requesterUserId or token is missing');
      setFriends([]);
      return;
    }

    try {
      // 1. 친구 ID 목록 요청
      const friendIdsResponse = await axios.get(`${API_BASE_URL}/friends/${requesterUserId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const friendIds = friendIdsResponse.data;

      if (!Array.isArray(friendIds) || friendIds.length === 0) {
        setFriends([]);
        return;
      }

      // 친구 ID만 추출 (객체인 경우 키가 userId 또는 id 일 수 있음)
      const ids = friendIds
        .map((friend) => {
          if (typeof friend === 'object' && friend !== null) {
            return friend.userId || friend.id || null;
          }
          return friend;
        })
        .filter(Boolean);

      // 2. 각 친구 프로필 동시 요청
      const profilePromises = ids.map((id) =>
        axios.get(`${API_BASE_URL}/users/${id}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).then((res) => res.data)
      );

      const profiles = await Promise.all(profilePromises);
      setFriends(profiles);
    } catch (error) {
      console.error('❌ 친구 정보 불러오기 실패:', error);
      alert('친구 목록을 불러오는 중 오류가 발생했습니다.');
      setFriends([]);
    }
  }, [requesterUserId, token]);

  const handleAddFriend = async (friendId) => {
    if (!requesterUserId || !token) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/friends/add`,
        { userId: requesterUserId, friendId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        alert('친구 추가 성공!');
        fetchFriendProfiles();
      } else {
        alert('친구 추가 실패: ' + (response.data.message || '알 수 없는 오류'));
      }
    } catch (error) {
      console.error('친구 추가 오류:', error);
      alert('친구 추가 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    fetchFriendProfiles();
  }, [fetchFriendProfiles]);

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
  }, [friends]);

  const handleClick = (friendId) => {
    navigate(`/profile/${friendId}`);
  };

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
