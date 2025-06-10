import { useEffect, useRef, useState } from 'react';

// ✅ 환경변수에서 WebSocket 주소 불러오기
const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:8080';

export default function useDiarySocket({ diaryId, token, onMessage }) {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!diaryId || !token) return;

    // ✅ 환경변수 기반으로 주소 설정
    const socket = new WebSocket(`${WS_BASE_URL}/ws/diary?diaryId=${diaryId}&token=${token}`);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('🟢 WebSocket 연결됨');
      setIsConnected(true);
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.error) {
          console.error('❌ 서버 메시지 오류:', message.error);
        } else {
          console.log('📩 서버로부터 받은 메시지:', message);
          if (onMessage) onMessage(message);
        }
      } catch (e) {
        console.error('❌ 메시지 파싱 실패:', e);
      }
    };

    socket.onclose = () => {
      console.log('🔌 WebSocket 연결 종료');
      setIsConnected(false);
    };

    socket.onerror = (err) => {
      console.error('⚠️ WebSocket 오류:', err);
      setIsConnected(false);
    };

    return () => {
      socket.close();
    };
  }, [diaryId, token]);

  const send = (type, data = {}) => {
    const socket = socketRef.current;
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type, ...data }));
    } else {
      console.warn('🛑 WebSocket이 아직 열리지 않았습니다. 메시지 전송 실패:', { type, ...data });
    }
  };

  return { send, isConnected };
}