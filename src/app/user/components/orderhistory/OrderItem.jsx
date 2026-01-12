import styles from "./OrderHistory.module.scss";

export default function OrderItem({ order }) {
  return (
    <div className={styles.orderCard}>
      <div className={styles.orderHeader}>
        <span className={styles.orderId}>Mã đơn hàng: <strong>#{order.id}</strong></span>
        <span className={`${styles.statusBadge} ${styles[order.status]}`}>
          {order.statusLabel}
        </span>
      </div>

      <div className={styles.productList}>
        {order.items.map((item, index) => (
          <div key={index} className={styles.productRow}>
            <div className={styles.imgWrapper}>
              <img src={item.image} alt={item.name} />
            </div>

            <div className={styles.productInfo}>
              <h4 className={styles.name}>{item.name}</h4>
              <p className={styles.description}>{item.description}</p>
              <span className={styles.unitDetail}>
                Đơn vị: {item.unit} | Số lượng: {item.quantity}
              </span>
            </div>
            
            <div className={styles.productPrice}>
              {(item.price * item.quantity).toLocaleString()}đ
            </div>
          </div>
        ))}
      </div>

      <div className={styles.orderFooter}>
        <div className={styles.deliveryInfo}>
          <p> Ngày giao: <strong>{order.deliveryDate}</strong></p>
        </div>
        <div className={styles.totalSection}>
          <span className={styles.label}>Tổng tiền:</span>
          <span className={styles.totalAmount}>{order.total.toLocaleString()}đ</span>
        </div>
      </div>
    </div>
  );
}