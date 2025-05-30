import React, { useState } from "react";
import styles from "./Signup.module.css";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = () => {
    if (!name || !email || !userId || !password || !confirmPassword) {
      alert("모든 항목을 입력해주세요.");
      return;
    }
    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    console.log({ name, email, userId, password });
    navigate("/login");
  };

  return (
    <div className={styles.SignupScreen}>
      <div className={styles.signupContainer}>
        <div className={styles.Signup}>회원가입</div>

        <div className={styles.inputBox}>
          <div className={styles.signupGroup}>
            <input
              type="text"
              placeholder="이름"
              className={styles.inputField}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.inputBox}>
          <div className={styles.signupGroup}>
            <input
              type="email"
              placeholder="이메일"
              className={styles.inputField}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.inputBox}>
          <div className={styles.signupGroup}>
            <input
              type="text"
              placeholder="아이디"
              className={styles.inputField}
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <div className={styles.signupGroup2}>
              <button
                type="button"
                className={styles.Sid1}
                onClick={() => alert("중복확인 기능 구현 필요")}
              >
                중복확인
              </button>
            </div>
          </div>
        </div>

        <div className={styles.inputBox}>
          <div className={styles.signupGroup}>
            <input
              type="password"
              placeholder="비밀번호 (8자리 이상)"
              className={styles.inputField}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className={styles.Spasswd1}>8자리 이상</div>
          </div>
        </div>

        <div className={styles.inputBox}>
          <div className={styles.signupGroup}>
            <input
              type="password"
              placeholder="비밀번호 확인"
              className={styles.inputField}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.buttonBox} onClick={handleSignup}>
          <div className={styles.signupGroup3}>
            <div className={styles.Signupbutton}>가입하기</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
