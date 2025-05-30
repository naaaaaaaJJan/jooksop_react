import { useNavigate } from 'react-router-dom';
import styles from './WriteModal.module.css';
import WriteEditor from './WriteEditor';
import { SlSizeFullscreen } from "react-icons/sl";
import { TfiClose } from "react-icons/tfi";

export default function WriteModal({ date, onClose }) {
  const navigate = useNavigate();

  const handleSave = (data) => {
    console.log('모달에서 저장된 데이터:', data);
    onClose();
  };

  const handleFullscreen = () => {
    navigate('/write'); // write 페이지로 이동
    onClose(); // 모달 닫기
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <div className={styles.header}>
          <button className={styles.fullscreenBtn} onClick={handleFullscreen}><SlSizeFullscreen /></button>
          <button className={styles.closeBtn} onClick={onClose}><TfiClose /></button>
        </div>
        <WriteEditor date={date} onSave={handleSave} />
      </div>
    </div>
  );
}