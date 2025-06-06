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

  const requesterUserId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  // 친구 목록과 프로필을 불러오는 함수
  const fetchFriendProfiles = async () => {
    if (!requesterUserId || !token) {
      console.warn('⚠ requesterUserId or token is missing');
      return;
    }

    try {
      console.log('📡 Fetching friend IDs for user:', requesterUserId);

      const res = await fetch(`http://localhost:8080/api/friends/${requesterUserId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('🔍 친구 ID 목록 응답 상태:', res.status);

      if (!res.ok) {
        throw new Error('친구 ID 목록 불러오기 실패');
      }

      const friendIds = await res.json();
      console.log('👥 친구 ID 배열 (raw):', friendIds);

      if (!Array.isArray(friendIds) || friendIds.length === 0) {
        setFriends([]);
        return;
      }

      console.log('👀 friendIds 배열 요소 예:', friendIds[0]);

      // friendIds 가 객체 배열일 경우 userId 필드 추출, 아니면 그대로 id 사용
      const ids = friendIds.map((friend) => {
        if (typeof friend === 'object' && friend !== null) {
          return friend.userId || friend.id || JSON.stringify(friend); // 안전하게 아이디 꺼내기
        }
        return friend; // 문자열 아이디인 경우
      });

      console.log('🆔 추출된 친구 ID 배열:', ids);

      console.log('📦 친구 프로필들 불러오기 시작');

      const fetchedProfiles = await Promise.all(
        ids.map(async (id) => {
          console.log('🔗 프로필 요청 URL:', `http://localhost:8080/api/users/${id}/profile`);

          const profileRes = await fetch(`http://localhost:8080/api/users/${id}/profile`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          console.log(`📝 프로필 응답 상태(${id}):`, profileRes.status);

          if (!profileRes.ok) {
            throw new Error(`프로필 불러오기 실패: ${id}`);
          }

          return await profileRes.json();
        })
      );

      setFriends(fetchedProfiles);
    } catch (error) {
      console.error('❌ 친구 정보 불러오기 실패:', error);
      setFriends([]);
    }
  };

  // 친구 추가 함수
  const handleAddFriend = async (friendId) => {
    if (!requesterUserId || !token) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8080/api/friends/add',
        {
          userId: requesterUserId,
          friendId: friendId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('친구 추가 응답:', response.data);

      if (response.data.success) {
        alert('친구 추가 성공!');
        // 친구 목록 재조회 호출
        fetchFriendProfiles();
      } else {
        alert('친구 추가 실패: ' + response.data.message);
      }
    } catch (error) {
      console.error('친구 추가 오류:', error);
      alert('친구 추가 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    fetchFriendProfiles();
  }, [requesterUserId]);

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
