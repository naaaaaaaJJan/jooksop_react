import React from "react";
import styles from "./Setting.module.css";

export default function Setting() {
  return (
    <div className={styles.SettingScreen}>
      <div className={styles.viewWrapper}>
        <div className={styles.view}>
          <div className={styles.overlapGroup}>
            <div className={styles.Set}>설정</div>
          </div>
        </div>
      </div>
    </div>
  );
}
