import React from "react";
import styles from "./StorageBox.module.css";

export default function StorageBox() {
  return (
    <div className={styles.StorageBoxScreen}>
      <div className={styles.viewWrapper}>
        <div className={styles.view}>
          <div className={styles.overlapGroup}>
            <div className={styles.StorageBox}>보관함</div>
          </div>
        </div>
      </div>
    </div>
  );
}
