import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./cart.module.scss";
import appleImg from "../../assets/images/apple.png";
import grapesImg from "../../assets/images/peonygrapes.png";
import { FaClock } from "react-icons/fa";

export default function Cart() {
  const navigate = useNavigate();
  
  const formatDate = (date) => {
    const d = date.getDate().toString().padStart(2, '0');
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  };

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const dayAfter = new Date();
  dayAfter.setDate(today.getDate() + 2);

  const dateOptions = [
    { label: "Hôm nay", value: formatDate(today) },
    { label: `Ngày mai (${formatDate(tomorrow)})`, value: formatDate(tomorrow) },
    { label: `Ngày kia (${formatDate(dayAfter)})`, value: formatDate(dayAfter) }
  ];

  const timeOptions = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];

  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Táo Mỹ",
      desc: "Size lớn / Nhập khẩu",
      unit: "kg",
      price: 150000,
      quantity: 2,
      image: appleImg
    },
    {
      id: 2,
      name: "Nho Mẫu Đơn",
      desc: "Chùm 500g / Giòn ngọt",
      unit: "500g",
      price: 350000,
      quantity: 1,
      image: grapesImg
    }
  ]);

  const [deliveryOption, setDeliveryOption] = useState("available");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirmedTime, setConfirmedTime] = useState("");
  const [tempDate, setTempDate] = useState(dateOptions[0].label);
  const [tempTime, setTempTime] = useState(timeOptions[0]);

  const updateQuantity = (id, delta) => {
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const handleInputChange = (id, value) => {
    const cleanValue = value.replace(/\D/g, "");
    setCartItems(cartItems.map(item => {
      if (item.id === id) {
        if (cleanValue === "") return { ...item, quantity: "" };
        return { ...item, quantity: parseInt(cleanValue) };
      }
      return item;
    }));
  };

  const handleInputBlur = (id, value) => {
    if (value === "" || parseInt(value) < 1) {
      setCartItems(cartItems.map(item => 
        item.id === id ? { ...item, quantity: 1 } : item
      ));
    }
  };

  const handleConfirmTime = () => {
    if (deliveryOption === "select") {
      setConfirmedTime(`${tempDate} | ${tempTime}`);
      setIsConfirmed(true);
    } else {
      setIsConfirmed(false);
    }
  };

  const handleGoToCheckout = () => {
    navigate("/checkouts");
  };

  const totalPrice = cartItems.reduce((sum, item) => {
    const qty = parseInt(item.quantity) || 0;
    return sum + (item.price * qty);
  }, 0);

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <div className={styles.leftCol}>
          <h2 className={styles.title}>Giỏ hàng của bạn</h2>
          <p className={styles.subTitle}>
            Bạn đang có <strong>{cartItems.length} sản phẩm</strong> trong giỏ hàng
          </p>

          <div className={styles.itemList}>
            {cartItems.map((item) => (
              <div key={item.id} className={styles.itemCard}>
                <div className={styles.imgWrapper}>
                  <img src={item.image} alt={item.name} />
                  <button className={styles.badgeRemove}>Xóa</button>
                </div>
                <div className={styles.itemDetails}>
                  <h3>{item.name}</h3>
                  <p className={styles.readableText}>{item.desc}</p>
                  <span className={styles.price}>{item.price.toLocaleString()}đ / {item.unit}</span>
                </div>
                <div className={styles.rightInfo}>
                  <span className={styles.itemTotal}>
                    {((parseInt(item.quantity) || 0) * item.price).toLocaleString()}đ
                  </span>
                  <div className={styles.quantityGroup}>
                    <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                    <input 
                      type="text" 
                      value={item.quantity} 
                      onChange={(e) => handleInputChange(item.id, e.target.value)}
                      onBlur={(e) => handleInputBlur(item.id, e.target.value)}
                    />
                    <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.noteSection}>
            <h3>Ghi chú đơn hàng</h3>
            <p className={styles.readableNote}>
              <strong>Lưu ý:</strong> Khách hàng đặt quà tặng trái cây, vui lòng ghi rõ thông tin của người được tặng và người đặt để shop thuận tiện liên hệ.
            </p>
            <textarea placeholder="Nhập ghi chú của bạn..."></textarea>
          </div>
        </div>

        <div className={styles.rightCol}>
          <div className={styles.infoBox}>
            <h3>Thông tin đơn hàng</h3>
            <div className={styles.deliveryTime}>
              <p className={styles.sectionLabel}>THỜI GIAN GIAO HÀNG</p>
              <div className={styles.radioGroup}>
                <label>
                  <input 
                    type="radio" 
                    name="time" 
                    checked={deliveryOption === "available"}
                    onChange={() => { setDeliveryOption("available"); setIsConfirmed(false); }}
                  /> 
                  Giao khi có hàng
                </label>
                <label>
                  <input 
                    type="radio" 
                    name="time"
                    checked={deliveryOption === "select"}
                    onChange={() => setDeliveryOption("select")}
                  /> 
                  Chọn thời gian
                </label>
              </div>

              {isConfirmed && deliveryOption === "select" && (
                <div className={styles.confirmedDisplay}>
                   <span className={styles.clockIcon}><FaClock /></span>
                   <strong>{confirmedTime}</strong>
                </div>
              )}

              {!isConfirmed && deliveryOption === "select" && (
                <div className={styles.selectWrapper}>
                  <div className={styles.selectGroup}>
                    <select 
                      value={tempDate} 
                      onChange={(e) => setTempDate(e.target.value)}
                    >
                      {dateOptions.map(opt => (
                        <option key={opt.value} value={opt.label}>{opt.label}</option>
                      ))}
                    </select>
                    <select 
                      value={tempTime} 
                      onChange={(e) => setTempTime(e.target.value)}
                    >
                      {timeOptions.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                  <button className={styles.confirmTimeBtn} onClick={handleConfirmTime}>
                    XÁC NHẬN THỜI GIAN
                  </button>
                </div>
              )}
            </div>

            <div className={styles.totalRow}>
              <span>Tổng tiền:</span>
              <span className={styles.finalPrice}>{totalPrice.toLocaleString()}đ</span>
            </div>

            <button className={styles.checkoutBtn} onClick={handleGoToCheckout}>
              THANH TOÁN
            </button>

            <div className={styles.policyBox}>
              <p><strong>Chính sách mua hàng</strong></p>
              <p>Hiện chúng tôi chỉ áp dụng thanh toán với đơn hàng có giá trị tối thiểu <strong>100.000đ</strong> trở lên.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}