import React, { useState } from "react";
import styles from "./Signup.module.css";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState(""); // nickname
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isIdChecked, setIsIdChecked] = useState(false); // 중복확인 여부

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleCheckDuplicateId = async () => {
    if (!userId) {
      alert("아이디를 입력해주세요.");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/check-id?userId=${encodeURIComponent(userId)}`
      );

      const isDuplicateText = await response.text();
      console.log("check-id 응답:", isDuplicateText);

      if (isDuplicateText === "true") {
        alert("이미 사용 중인 아이디입니다.");
        setIsIdChecked(false);
      } else {
        alert("사용 가능한 아이디입니다.");
        setIsIdChecked(true);
      }
    } catch (error) {
      console.error("중복 확인 에러:", error);
      alert("서버 오류가 발생했습니다.");
    }
  };

  const handleSignup = async () => {
    if (!name || !email || !userId || !password || !confirmPassword) {
      alert("모든 항목을 입력해주세요.");
      return;
    }
    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!isIdChecked) {
      alert("아이디 중복확인을 해주세요.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          password,
          confirmPassword,
          nickname: name,
          email,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert(result.message || "회원가입 성공");
        navigate("/login");
      } else {
        alert(result.message || "회원가입 실패");
      }
    } catch (error) {
      console.error("회원가입 에러:", error);
      alert("서버 오류가 발생했습니다.");
    }
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
              onChange={(e) => {
                setUserId(e.target.value);
                setIsIdChecked(false); // 아이디 변경 시 중복확인 다시 필요
              }}
            />
            <div className={styles.signupGroup2}>
              <button
                type="button"
                className={styles.Sid1}
                onClick={handleCheckDuplicateId}
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

        <div className={styles.buttonBox}>
          <button
            type="button"
            className={styles.Signupbutton}
            onClick={handleSignup}
          >
            가입하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default Signup;
