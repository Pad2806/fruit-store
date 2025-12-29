import { useState } from "react";
import { Link } from "react-router-dom";
import { Landmark, Banknote } from "lucide-react";
import styles from "./checkout.module.scss";
import appleImg from "../../assets/images/apple.png";
import grapesImg from "../../assets/images/peonygrapes.png";

export default function Checkout() {
  const [orderData] = useState({
    items: [
      { id: 1, name: "Táo Mỹ", price: 150000, quantity: 2, unit: "kg", image: appleImg },
      { id: 2, name: "Nho Mẫu Đơn", price: 350000, quantity: 1, unit: "500g", image: grapesImg }
    ],
    shippingFee: 0,
    subtotal: 650000
  });

  const [customer, setCustomer] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    province: "",
    district: "",
    ward: "",
    paymentMethod: "cod"
  });

  const handleInput = (e) => {
    const { name, value } = e.target;
    setCustomer({ ...customer, [name]: value });
  };

  return (
    <div className={styles.container}>
      <div className={styles.checkoutWrapper}>
        
        <div className={styles.leftCol}>
          <header className={styles.header}>
            <h1 className={styles.brandTitle}>FRUIT SHOP - TRÁI CÂY CHẤT LƯỢNG CAO</h1>
            <nav className={styles.breadcrumb}>
              <Link to="/cart">Giỏ hàng</Link>
              <span className={styles.separator}>&gt;</span>
              <span className={styles.activeStep}>Thông tin giao hàng</span>
            </nav>
          </header>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Thông tin nhận hàng</h2>
              <p className={styles.loginText}>
                Bạn đã có tài khoản? <Link to="/login">Đăng nhập</Link>
              </p>
            </div>

            <div className={styles.formArea}>
              <div className={styles.formGroup}>
                <input name="fullName" placeholder="Họ và tên" onChange={handleInput} />
              </div>

              <div className={styles.inputGrid2}>
                <div className={styles.formGroup}>
                  <input name="email" type="email" placeholder="Email" onChange={handleInput} />
                </div>
                <div className={styles.formGroup}>
                  <input name="phone" placeholder="Số điện thoại" onChange={handleInput} />
                </div>
              </div>

              <div className={styles.formGroup}>
                <input name="address" placeholder="Địa chỉ" onChange={handleInput} />
              </div>

              <div className={styles.inputGrid3}>
                <div className={styles.formGroup}>
                  <select name="province" onChange={handleInput}>
                    <option value="">Chọn tỉnh / thành</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <select name="district" onChange={handleInput}>
                    <option value="">Chọn quận / huyện</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <select name="ward" onChange={handleInput}>
                    <option value="">Chọn phường / xã</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2>Phương thức vận chuyển</h2>
            <div className={styles.shippingPlaceholder}>
              Vui lòng chọn tỉnh / thành để có danh sách phương thức vận chuyển.
            </div>
          </section>

          <section className={styles.section}>
            <h2>Phương thức thanh toán</h2>
            <div className={styles.paymentContainer}>
              <label className={styles.paymentOption}>
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="cod" 
                  checked={customer.paymentMethod === "cod"}
                  onChange={handleInput} 
                />
                <span className={styles.customRadio}></span>
                <span className={styles.methodName}>Thanh toán khi giao hàng (COD)</span>
                <span className={styles.methodIcon}><Banknote /></span>
              </label>

              <label className={styles.paymentOption}>
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="bank"
                  checked={customer.paymentMethod === "bank"}
                  onChange={handleInput} 
                />
                <span className={styles.customRadio}></span>
                <span className={styles.methodName}>Chuyển khoản qua ngân hàng</span>
                <span className={styles.methodIcon}><Landmark /></span>
              </label>
            </div>
          </section>

          <footer className={styles.formFooter}>
            <Link to="/cart" className={styles.returnCart}>Quay lại giỏ hàng</Link>
            <button className={styles.submitOrderBtn}>HOÀN TẤT ĐƠN HÀNG</button>
          </footer>
        </div>

        <aside className={styles.rightCol}>
          <div className={styles.summaryContent}>
            <div className={styles.productList}>
              {orderData.items.map((item) => (
                <div key={item.id} className={styles.productCard}>
                  <div className={styles.imgContainer}>
                    <img src={item.image} alt={item.name} />
                    <span className={styles.qtyBadge}>{item.quantity}</span>
                  </div>
                  <div className={styles.productMeta}>
                    <h4 className={styles.name}>{item.name}</h4>
                    <p className={styles.unit}>{item.unit}</p>
                  </div>
                  <div className={styles.price}>
                    {(item.price * item.quantity).toLocaleString()}đ
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.priceBreakdown}>
              <div className={styles.row}>
                <span>Tạm tính</span>
                <span>{orderData.subtotal.toLocaleString()}đ</span>
              </div>
              <div className={styles.row}>
                <span>Phí vận chuyển</span>
                <span>—</span>
              </div>
            </div>

            <div className={styles.grandTotal}>
              <span className={styles.totalLabel}>Tổng cộng</span>
              <div className={styles.totalAmount}>
                <small>VND</small>
                <span>{orderData.subtotal.toLocaleString()}đ</span>
              </div>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}