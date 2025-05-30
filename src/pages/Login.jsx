import { Link, useNavigate } from 'react-router-dom';
import React from "react";
import styles from "./Login.module.css"; 

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/");
  };

  return (
    <div className={styles.screen}>
      <div className={styles.loginContainer}>
        <h1 className={styles.loginTitle}>WITHLOG</h1>
        <h1 className={styles.SubTitle}>기억을 함께 쓰다</h1>

        <input type="text" placeholder="ID" className={styles.loginInput} />
        <input type="password" placeholder="PW" className={styles.loginInput} />

        <button className={styles.loginButton} onClick={handleLogin}>
          로그인
        </button>

        <div className={styles.loginLinks}>
          <Link to="/FindId">아이디찾기</Link>
          <Link to="/signup">회원가입</Link>
          <Link to="/FindPasswd">비밀번호 초기화</Link>
        </div>
      </div>
    </div>
  );
}
