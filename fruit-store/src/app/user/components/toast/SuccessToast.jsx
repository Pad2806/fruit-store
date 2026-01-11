import styles from "./Toast.module.scss";
import toast from "react-hot-toast";

const SuccessToast = ({ t, product }) => {
  const imageUrl = product.images?.[0] || `http://127.0.0.1:8000/images/${product.product?.image || product.image}`;

  return (
    <div className={styles.toastContainer}>
      <div className={styles.header}>
        <span>Đã thêm vào giỏ hàng thành công!</span>
        <button className={styles.closeBtn} onClick={() => toast.dismiss(t.id)}>×</button>
      </div>
      <div className={styles.body}>
        <img src={imageUrl} alt="" />
        <div className={styles.info}>
          <p className={styles.name}>{product.name || product.product_name}</p>
          <p className={styles.price}>
            {product.price || parseFloat(product.product_price).toLocaleString() + "đ"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuccessToast;