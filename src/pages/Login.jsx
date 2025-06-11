import React, { useState } from "react";
import {Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Login.module.css";

export default function Login({ setIsLoggedIn }) {
  const navigate = useNavigate();

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

 const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/login`,
        {
          userId,
          password,
        }
      );
      console.log('로그인 응답:', response.data);
      const { success, message, data } = response.data;

      if (success) {
        localStorage.setItem("token", data);
        localStorage.setItem("userId", userId);

        alert("로그인 성공: " + message);
        //setIsLoggedIn(true);
        navigate("/home");
      } else {
        alert("로그인 실패: " + message);
      }
    } catch (error) {
      console.error("로그인 요청 중 오류:", error);
      alert("서버 오류가 발생했습니다.");
    }
  };

  return (
    <div className={styles.screen}>
      <div className={styles.loginContainer}>
        <h1 className={styles.loginTitle}>WITHLOG</h1>
        <h1 className={styles.SubTitle}>기억을 함께 쓰다</h1>

        <input
          type="text"
          placeholder="ID"
          className={styles.loginInput}
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />

        <input
          type="password"
          placeholder="PW"
          className={styles.loginInput}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className={styles.loginButton} onClick={handleLogin}>
          로그인
        </button>

        <div className={styles.loginLinks}>
          <Link to="/Findid">아이디 찾기</Link>
          <Link to="/signup">회원가입</Link>
          <Link to="/FindPasswd">비밀번호 초기화</Link>
        </div>
      </div>
    </div>
  );
}
