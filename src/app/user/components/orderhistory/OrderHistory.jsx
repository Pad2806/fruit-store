import { useState, useEffect } from "react";
import styles from "./OrderHistory.module.scss";
import OrderItem from "./OrderItem";
import api from "../../../../axios";
import { message } from "antd";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get("/user/orders"); // Based on route group
      setOrders(response.data.data); // Assuming paginated resource returns data in .data
    } catch (error) {
      console.error("Failed to fetch orders", error);
      message.error("Không thể tải lịch sử đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <p>Đang tải đơn hàng...</p>;

  return (
    <div className={styles.historyWrapper}>
      <h3 className={styles.title}>Lịch sử mua hàng</h3>
      <div className={styles.listContainer}>
        {orders.length > 0 ? (
          orders.map((order) => (
            <OrderItem key={order.id} order={order} onRefresh={fetchOrders} />
          ))
        ) : (
          <p>Bạn chưa có đơn hàng nào.</p>
        )}
      </div>
    </div>
  );
}