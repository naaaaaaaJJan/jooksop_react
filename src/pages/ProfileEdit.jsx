import React from "react";
import styles from "./ProfileEdit.module.css";
// import image from '경로/이미지1.png';  // 이미지 경로 맞게 import 필요
// import image1 from '경로/이미지2.png';

export default function ProfileEdit() {
  return (
    <div className={styles.edit}>
      <div className={styles.editWrapper}>
        <div className={styles.overlap}>
          <div className={styles.view}>
            <div className={styles.overlapGroup}>
              <div className={styles.div}>
                <div className={styles.duplicationCheck}>중복확인</div>
              </div>
              {/* <img className={styles.image} alt="Image" src={image} /> */}
            </div>
          </div>

          <div className={styles.eComplete}>변경완료</div>

          {/* <img className={styles.img} alt="Image" src={image1} /> */}

          <div className={styles.eImage}>IMAGE</div>
          <div className={styles.eName}>USERNAME</div>
          <div className={styles.eId}>USERID</div>

          <div className={styles.view2}>
            <div className={styles.eText}>안녕하세요?</div>
            <div className={styles.overlapGroupWrapper}>
              <div className={styles.overlapGroup2}>
                <div className={styles.eIntroduction}>소개</div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
