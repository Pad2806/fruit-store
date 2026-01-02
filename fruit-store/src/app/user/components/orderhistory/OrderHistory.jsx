import styles from "./OrderHistory.module.scss";
import OrderItem from "./OrderItem";
import appleImg from "../../assets/images/apple.png";
import grapesImg from "../../assets/images/peonygrapes.png";

export default function OrderHistory() {
  const orders = [
    {
      id: "DH1001",
      deliveryDate: "27/12/2025",
      status: "delivered",
      statusLabel: "Đã giao hàng",
      total: 650000,
      items: [
        {
          name: "Táo Mỹ",
          unit: "kg",
          quantity: 2,
          description: "Size lớn / Nhập khẩu Mỹ",
          price: 150000,
          image: appleImg
        },
        {
          name: "Nho Mẫu Đơn",
          unit: "chùm",
          quantity: 1,
          description: "Chùm 500g / Giòn ngọt",
          price: 350000,
          image: grapesImg
        }
      ]
    },
    {
      id: "DH1002",
      deliveryDate: "30/12/2025",
      status: "processing",
      statusLabel: "Đang xử lý",
      total: 240000,
      items: [
        {
          name: "Cherry đỏ Mỹ",
          unit: "500g",
          quantity: 1,
          description: "Size 9 / Tươi ngon",
          price: 240000,
          image: appleImg
        }
      ]
    }
  ];

  return (
    <div className={styles.historyWrapper}>
      <h3 className={styles.title}>Lịch sử mua hàng</h3>
      <div className={styles.listContainer}>
        {orders.map((order) => (
          <OrderItem key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}