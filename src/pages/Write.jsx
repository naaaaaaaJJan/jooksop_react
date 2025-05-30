import WriteEditor from '../components/WriteEditor';
import styles from './Write.module.css';

export default function Write() {
  const today = new Date().toISOString().split('T')[0]; // yyyy-mm-dd

  const handleSave = (data) => {
    console.log('페이지에서 저장된 데이터:', data);
    // 실제 저장 로직 (ex: API 요청)
  };

  return (
    <div className={styles.pageContainer}>
      <WriteEditor date={today} onSave={handleSave} />
    </div>
  );
}