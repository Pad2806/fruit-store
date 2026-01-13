import { Link, useLocation } from "react-router-dom";
import { CheckCircle, Home, Package, Truck, CreditCard } from "lucide-react";
import styles from "./order_success.module.scss";

export default function OrderSuccess() {
  const location = useLocation();
  const { orderId, customer, items, totalAmount, order_server_id } =
    location.state || {
      orderId: "N/A",
      customer: {},
      items: [],
      totalAmount: 0,
      order_server_id,
    };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.successHeader}>
          <CheckCircle size={80} color="#27ae60" />
          <h1>ĐẶT HÀNG THÀNH CÔNG!</h1>
          <p>
            Cảm ơn <strong>{customer.fullName}</strong> đã tin tưởng Fruit
            Store.
          </p>
          <div className={styles.orderCode}>
            Mã đơn hàng: <span>{order_server_id}</span>
          </div>
        </div>

        <div className={styles.contentGrid}>
          <div className={styles.infoCol}>
            <div className={styles.infoCard}>
              <div className={styles.cardHeader}>
                <Truck size={20} />
                <h3>Thông tin giao hàng</h3>
              </div>
              <div className={styles.cardBody}>
                <p>
                  <strong>Người nhận:</strong> {customer.fullName}
                </p>
                <p>
                  <strong>Số điện thoại:</strong> {customer.phone}
                </p>
                <p>
                  <strong>Email:</strong> {customer.email}
                </p>
                <p>
                  <strong>Địa chỉ:</strong> {customer.address}
                </p>
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.cardHeader}>
                <CreditCard size={20} />
                <h3>Phương thức thanh toán</h3>
              </div>
              <div className={styles.cardBody}>
                <p>
                  {customer.paymentMethod === "cod"
                    ? "Thanh toán khi nhận hàng (COD)"
                    : "Đã thanh toán qua thẻ quốc tế VISA"}
                </p>
              </div>
            </div>
          </div>

          <div className={styles.summaryCol}>
            <div className={styles.infoCard}>
              <div className={styles.cardHeader}>
                <Package size={20} />
                <h3>Chi tiết đơn hàng</h3>
              </div>
              <div className={styles.itemList}>
                {items.map((item, index) => (
                  <div key={index} className={styles.item}>
                    <div className={styles.itemMain}>
                      <span className={styles.itemName}>{item.name}</span>
                      <span className={styles.itemSub}>
                        {item.unit} x {item.quantity}
                      </span>
                    </div>
                    <span className={styles.itemPrice}>
                      {(item.price * item.quantity).toLocaleString()}đ
                    </span>
                  </div>
                ))}
              </div>
              <div className={styles.totalSection}>
                <div className={styles.totalRow}>
                  <span>Phí vận chuyển:</span>
                  <span>
                    {parseInt(customer.shippingMethod || 0).toLocaleString()}đ
                  </span>
                </div>
                <div className={styles.grandTotal}>
                  <span>Tổng thanh toán:</span>
                  <span>{totalAmount.toLocaleString()}đ</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.actionButtons}>
          <Link to="/" className={styles.homeBtn}>
            <Home size={18} />
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    </div>
  );
}
