import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Landmark, Banknote, X, ClipboardCheck } from "lucide-react";
import styles from "./checkout.module.scss";
import { createOrder } from "../../../../api/orders";
import { ToastService } from "../../components/toast/Toast";
import { useCart } from "../../context/CartContext";

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshCartCount } = useCart();

  const [showModal, setShowModal] = useState(false);
  const [orderId] = useState(`FS${Date.now().toString().slice(-6)}`);

  const {
    cartItems = [],
    totalPrice = 0,
    deliveryTime = null,
    datetime_order = null,
    userId,
  } = location.state || {};

  useEffect(() => {
    if (!location.state || cartItems.length === 0 || !userId) {
      navigate("/cart", { replace: true });
    }
  }, [location.state, cartItems.length, userId, navigate]);

  const orderData = useMemo(() => {
    const items = cartItems.map((item) => ({
      id: item.id,
      name: item.product_name,
      price: parseFloat(item.product_price),
      quantity: item.quantity,
      unit: item.unit,
      image: `http://127.0.0.1:8000/images/${item.product?.image}`,
    }));

    return {
      items,
      subtotal: totalPrice,
    };
  }, [cartItems, totalPrice]);

  const [customer, setCustomer] = useState({
    fullName: "",
    email: "user@example.com",
    phone: "",
    address: "",
    shippingMethod: "0",
    paymentMethod: "cod",
    note: "",
  });

  const handleInput = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const shippingFee = parseInt(customer.shippingMethod || "0", 10);
  const totalAmount = orderData.subtotal + shippingFee;

  const splitAddressParts = (fullAddress) => {
    const parts = (fullAddress || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const city = parts.length >= 1 ? parts[parts.length - 1] : "";
    const ward = parts.length >= 2 ? parts[parts.length - 2] : "";
    const district = parts.length >= 3 ? parts[parts.length - 3] : "";

    return { city, ward, district };
  };

  const handleCompleteOrder = () => {
    if (!customer.fullName || !customer.phone || !customer.address || customer.shippingMethod === "0") {
      alert("Vui lòng nhập đầy đủ thông tin và chọn đơn vị vận chuyển!");
      return;
    }
    setShowModal(true);
  };

  const handleFinalConfirm = async () => {
    try {
      const { city, ward, district } = splitAddressParts(customer.address);

      const orderPayload = {
        user_id: userId,
        recipient_name: customer.fullName,
        recipient_email: customer.email,
        recipient_address: customer.address,
        recipient_city: city || undefined,
        recipient_ward: ward || undefined,
        recipient_district: district || undefined,
        recipient_phone_number: customer.phone,
        payment_method: customer.paymentMethod === "VISA" ? "banking" : "cod",
        total_amount: totalAmount,
        shipping_fee: shippingFee,
        note: customer.note || "",
        datetime_order: datetime_order || null,
      };

      if (orderPayload.payment_method === "cod") {
        const res = await createOrder(orderPayload);
        await refreshCartCount();

        navigate("/order-success", {
          state: {
            orderId: res?.order?.id || orderId,
            customer,
            items: orderData.items,
            totalAmount,
            deliveryTime,
          },
        });
        return;
      }

      navigate("/payment-visa", {
        state: {
          orderId,
          totalAmount,
          customer,
          items: orderData.items,
          deliveryTime,
          orderPayload,
        },
      });
    } catch (e) {
      ToastService.error("Tạo đơn hàng thất bại");
    }
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
                  <input name="email" value={customer.email} disabled />
                </div>
                <div className={styles.formGroup}>
                  <input name="phone" placeholder="Số điện thoại" onChange={handleInput} />
                </div>
              </div>
              <div className={styles.formGroup}>
                <input name="address" placeholder="Địa chỉ" onChange={handleInput} />
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2>Phương thức vận chuyển</h2>
            <div className={styles.shippingBox}>
              <label className={styles.radioOption}>
                <input
                  type="radio"
                  name="shippingMethod"
                  value="25000"
                  checked={customer.shippingMethod === "25000"}
                  onChange={handleInput}
                />
                <span className={styles.methodName}>Giao hàng nội thành Đà Nẵng (25.000đ)</span>
              </label>
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
                <span className={styles.methodIcon}>
                  <Banknote />
                </span>
              </label>
              <label className={styles.paymentOption}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="VISA"
                  checked={customer.paymentMethod === "VISA"}
                  onChange={handleInput}
                />
                <span className={styles.customRadio}></span>
                <span className={styles.methodName}>Thanh toán bằng thẻ quốc tế</span>
                <span className={styles.methodIcon}>
                  <Landmark />
                </span>
              </label>
            </div>
          </section>

          <footer className={styles.formFooter}>
            <Link to="/cart" className={styles.returnCart}>
              Quay lại giỏ hàng
            </Link>
            <button className={styles.submitOrderBtn} onClick={handleCompleteOrder}>
              HOÀN TẤT ĐƠN HÀNG
            </button>
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
                  <div className={styles.price}>{(item.price * item.quantity).toLocaleString()}đ</div>
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
                <span>{shippingFee > 0 ? `${shippingFee.toLocaleString()}đ` : "—"}</span>
              </div>
              {deliveryTime && (
                <div className={styles.row}>
                  <span>Thời gian giao</span>
                  <span>{deliveryTime}</span>
                </div>
              )}
            </div>

            <div className={styles.grandTotal}>
              <span className={styles.totalLabel}>Tổng cộng</span>
              <div className={styles.totalAmount}>
                <span>{totalAmount.toLocaleString()}đ</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button className={styles.closeBtn} onClick={() => setShowModal(false)}>
              <X />
            </button>
            <div className={styles.modalHeader}>
              <ClipboardCheck size={32} color="#f36f40" />
              <h3>Xác nhận thông tin đơn hàng</h3>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.infoGrid}>
                <div className={styles.infoGroup}>
                  <label>Mã đơn hàng:</label>
                  <span>{orderId}</span>
                </div>
                <div className={styles.infoGroup}>
                  <label>Khách hàng:</label>
                  <span>{customer.fullName}</span>
                </div>
                <div className={styles.infoGroup}>
                  <label>Số điện thoại:</label>
                  <span>{customer.phone}</span>
                </div>
                <div className={styles.infoGroup}>
                  <label>Email:</label>
                  <span>{customer.email}</span>
                </div>
                <div className={styles.infoGroupFull}>
                  <label>Địa chỉ nhận hàng:</label>
                  <span>{customer.address}</span>
                </div>
              </div>

              {deliveryTime && (
                <div className={styles.modalSummary}>
                  <p>
                    Thời gian giao: <span>{deliveryTime}</span>
                  </p>
                </div>
              )}

              <div className={styles.orderTable}>
                <div className={styles.tableHeader}>
                  <span>Sản phẩm</span>
                  <span>Đơn vị</span>
                  <span>SL</span>
                  <span>Thành tiền</span>
                </div>
                {orderData.items.map((item) => (
                  <div key={item.id} className={styles.tableRow}>
                    <span>{item.name}</span>
                    <span>{item.unit}</span>
                    <span>{item.quantity}</span>
                    <span>{(item.price * item.quantity).toLocaleString()}đ</span>
                  </div>
                ))}
              </div>

              <div className={styles.modalSummary}>
                <p>
                  Phí ship: <span>{shippingFee.toLocaleString()}đ</span>
                </p>
                <p>
                  Thanh toán: <span>{customer.paymentMethod === "cod" ? "Tiền mặt (COD)" : "VISA"}</span>
                </p>
                <h4 className={styles.modalTotal}>Tổng tiền: {totalAmount.toLocaleString()}đ</h4>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => setShowModal(false)}>
                Hủy
              </button>
              <button className={styles.confirmBtn} onClick={handleFinalConfirm}>
                {customer.paymentMethod === "VISA" ? "THANH TOÁN NGAY" : "XÁC NHẬN ĐẶT HÀNG"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
