import { useState, useEffect } from "react";
import styles from "./OrderHistory.module.scss";
import api from "../../../../services/axios";
import { message, Modal } from "antd";

export default function OrderItem({ order, onRefresh }) {
  const [canCancel, setCanCancel] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkValidity = () => {
      if (!order.created_at) return;
      const orderTime = new Date(order.created_at).getTime();
      const now = Date.now();
      // Diff in minutes
      const diffMins = (now - orderTime) / (1000 * 60);

      // Cancellable if < 10 mins and status is pending or confirmed
      // Also ensure diffMins is >= 0 to prevent future dates from showing the button
      const isCancellableStatus = ['pending', 'confirmed'].includes(order.status);



      setCanCancel(diffMins >= 0 && diffMins <= 10 && isCancellableStatus);
    };

    checkValidity();
    // Check every 10 seconds to auto-hide button when time expires
    const timer = setInterval(checkValidity, 10000);
    return () => clearInterval(timer);
  }, [order]);

  const handleCancel = () => {
    Modal.confirm({
      title: "Hủy đơn hàng",
      content: "Bạn có chắc chắn muốn hủy đơn hàng này không?",
      okText: "Đồng ý",
      cancelText: "Đóng",
      onOk: async () => {
        try {
          setLoading(true);
          await api.post(`/user/orders/${order.id}/cancel`);
          message.success("Huỷ đơn hàng thành công");
          if (onRefresh) onRefresh();
        } catch (error) {
          console.error(error);
          message.error(error.response?.data?.message || "Huỷ đơn hàng thất bại");
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const getStatusLabel = (status) => {
    const map = {
      pending: "Chờ xác nhận",
      confirmed: "Đã xác nhận",
      shipping: "Đang giao",
      completed: "Đã giao",
      cancelled: "Đã huỷ"
    };
    return map[status] || status;
  };

  return (
    <div className={styles.orderCard}>
      <div className={styles.orderHeader}>
        <span className={styles.orderId}>Mã đơn: <strong>#{order.id?.slice(0, 8)}...</strong></span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {canCancel && (
            <button
              className={styles.btnCancel || "btn-cancel"}
              style={{
                padding: '4px 12px',
                fontSize: '12px',
                borderRadius: '4px',
                border: '1px solid #ff4d4f',
                color: '#ff4d4f',
                background: 'white',
                cursor: 'pointer'
              }}
              onClick={handleCancel}
              disabled={loading}
            >
              Huỷ đơn
            </button>
          )}
          <span className={`${styles.statusBadge} ${styles[order.status]}`}>
            {getStatusLabel(order.status)}
          </span>
        </div>
      </div>

      <div className={styles.productList}>
        {order.details && order.details.map((item, index) => (
          <div key={index} className={styles.productRow}>
            <div className={styles.imgWrapper}>
              {/* Fallback image if product_image is missing */}
              <img
                src={item.product_image ? `http://127.0.0.1:8000/storage/${item.product_image}` : "https://placehold.co/60"}
                alt={item.product_name}
                onError={(e) => e.target.src = "https://placehold.co/60"}
              />
            </div>

            <div className={styles.productInfo}>
              <h4 className={styles.name}>{item.product_name}</h4>
              <span className={styles.unitDetail}>
                Đơn vị: {item.unit} | Số lượng: {item.quantity}
              </span>
            </div>

            <div className={styles.productPrice}>
              {(Number(item.product_price) * item.quantity).toLocaleString()}đ
            </div>
          </div>
        ))}
      </div>

      <div className={styles.orderFooter}>
        <div className={styles.deliveryInfo}>
          <p>Ngày đặt: <strong>{new Date(order.datetime_order || order.created_at).toLocaleString('vi-VN')}</strong></p>
        </div>
        <div className={styles.totalSection}>
          <span className={styles.label}>Tổng tiền:</span>
          <span className={styles.totalAmount}>{Number(order.total_amount).toLocaleString()}đ</span>
        </div>
      </div>
    </div>
  );
}