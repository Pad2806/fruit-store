import styles from "./Toast.module.scss";
import toast from "react-hot-toast";

const ConfirmToast = ({ t, message, onConfirm }) => {
  return (
    <div className={styles.confirmContainer}>
      <p>{message}</p>
      <div className={styles.actions}>
        <button className={styles.cancel} onClick={() => toast.dismiss(t.id)}>Hủy</button>
        <button className={styles.confirm} onClick={() => { onConfirm(); toast.dismiss(t.id); }}>
          Xác nhận
        </button>
      </div>
    </div>
  );
};

export default ConfirmToast;