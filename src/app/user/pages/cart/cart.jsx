import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./cart.module.scss";
import { FaClock } from "react-icons/fa";
import { getCartDetails } from "../../../../api/cart";
import { createCart } from "../../../../api/cart";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { updateItemQuantity, removeCartItem } from "../../../../api/cart_items";
import { ToastService } from "../../components/toast/Toast";
import { CartPageSkeleton } from "../../components/skeleton/Skeleton";

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const { refreshCartCount } = useCart();

  const fetchCartData = async () => {
    if (!user) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      let cartId = localStorage.getItem("cart_id");
      if (!cartId) {
        const cartResp = await createCart(user.id);
        cartId = cartResp.id || cartResp.data?.id;
        if (cartId) localStorage.setItem("cart_id", cartId);
      }

      if (!cartId) {
        ToastService.error("Không tìm thấy giỏ hàng");
        setCartItems([]);
        return;
      }

      const data = await getCartDetails(cartId);
      setCartItems(data.cart_items || []);
    } catch (error) {
      ToastService.error("Không thể tải dữ liệu giỏ hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  const handleUpdateQuantity = async (cartItemId, newQty) => {
    if (newQty < 1) return;
    try {
      await updateItemQuantity(cartItemId, newQty);
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity: newQty } : item
        )
      );
      await refreshCartCount();
    } catch (error) {
      ToastService.error("Cập nhật số lượng thất bại");
    }
  };

  const handleRemoveItem = (cartItemId) => {
    ToastService.confirmDelete(
      "Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?",
      async () => {
        try {
          await removeCartItem(cartItemId);
          setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
          // Cập nhật cart count trên header
          await refreshCartCount();
          ToastService.success("Đã xóa sản phẩm thành công");
        } catch (error) {
          console.log(error);
          ToastService.error("Lỗi khi xóa sản phẩm");
        }
      }
    );
  };
  const userId = user?.id || null;

  const totalPrice = cartItems.reduce((sum, item) => {
    return sum + parseFloat(item.product_price) * item.quantity;
  }, 0);

  const formatDate = (date) => {
    const d = date.getDate().toString().padStart(2, "0");
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
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
    {
      label: `Ngày mai (${formatDate(tomorrow)})`,
      value: formatDate(tomorrow),
    },
    {
      label: `Ngày kia (${formatDate(dayAfter)})`,
      value: formatDate(dayAfter),
    },
  ];

  const timeOptions = [
    "09:00",
    "10:00",
    "11:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

  const [deliveryOption, setDeliveryOption] = useState("available");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirmedTime, setConfirmedTime] = useState("");
  const [tempDateValue, setTempDateValue] = useState(dateOptions[0].value);
  const [tempTime, setTempTime] = useState(timeOptions[0]);
  const [datetimeOrder, setDatetimeOrder] = useState("");

  const parseTimeToMinutes = (t) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const isToday = tempDateValue === formatDate(today);

  const getValidTimes = () => {
    if (!isToday) return timeOptions;
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    return timeOptions.filter((t) => parseTimeToMinutes(t) > nowMinutes);
  };

  const validTimes = getValidTimes();

  useEffect(() => {
    if (deliveryOption !== "select") return;
    if (isToday && !validTimes.includes(tempTime)) {
      setTempTime(validTimes[0] || "");
    }
    if (!isToday && !tempTime) {
      setTempTime(timeOptions[0]);
    }
  }, [tempDateValue, deliveryOption]);

  const toMysqlDatetime = (ddmmyyyy, hhmm) => {
    const [d, m, y] = ddmmyyyy.split("/").map(Number);
    const [hh, mm] = hhmm.split(":").map(Number);
    const dt = new Date(y, m - 1, d, hh, mm, 0);

    const pad = (n) => String(n).padStart(2, "0");
    return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())} ${pad(
      dt.getHours()
    )}:${pad(dt.getMinutes())}:00`;
  };

  const handleConfirmTime = () => {
    if (deliveryOption !== "select") {
      setIsConfirmed(false);
      setConfirmedTime("");
      setDatetimeOrder("");
      return;
    }
    if (isToday && validTimes.length === 0) {
      ToastService.error("Hôm nay đã hết khung giờ giao hàng");
      return;
    }
    if (!tempTime) {
      ToastService.error("Vui lòng chọn giờ giao hàng hợp lệ");
      return;
    }

    setConfirmedTime(`${tempDateValue} | ${tempTime}`);
    setDatetimeOrder(toMysqlDatetime(tempDateValue, tempTime));
    setIsConfirmed(true);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      ToastService.error("Giỏ hàng trống");
      return;
    }

    navigate("/checkouts", {
      state: {
        cartItems,
        totalPrice,
        deliveryTime: isConfirmed ? confirmedTime : null,
        datetime_order: isConfirmed ? datetimeOrder : "",
        userId,
      },
    });
  };

  if (loading)
    return (
      <div className={styles.container}>
        <CartPageSkeleton />
      </div>
    );

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <div className={styles.leftCol}>
          <h2 className={styles.title}>Giỏ hàng của bạn</h2>
          <p className={styles.subTitle}>
            Bạn đang có <strong>{cartItems.length} sản phẩm</strong> trong giỏ
            hàng
          </p>

          <div className={styles.itemList}>
            {cartItems.map((item) => (
              <div key={item.id} className={styles.itemCard}>
                <div className={styles.imgWrapper}>
                  <img
                    src={item.product?.image ? `http://127.0.0.1:8000/storage/${item.product.image}` : "https://placehold.co/100"}
                    alt={item.product_name}
                    onError={(e) => e.target.src = "https://placehold.co/100"}
                  />
                  <button className={styles.badgeRemove} onClick={() => handleRemoveItem(item.id)}>
                    Xóa
                  </button>
                </div>
                <div className={styles.itemDetails}>
                  <h3>{item.product_name}</h3>
                  <p className={styles.readableText}>
                    {item?.product?.short_desc}
                  </p>
                  <span className={styles.price}>
                    {parseFloat(item.product_price).toLocaleString()}đ /{" "}
                    {item.unit}
                  </span>
                </div>
                <div className={styles.rightInfo}>
                  <span className={styles.itemTotal}>
                    {(
                      item.quantity * parseFloat(item.product_price)
                    ).toLocaleString()}
                    đ
                  </span>
                  <div className={styles.quantityGroup}>
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity - 1)
                      }
                    >
                      -
                    </button>
                    <input type="text" value={item.quantity} readOnly />
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.noteSection}>
            <h3>Ghi chú đơn hàng</h3>
            <p className={styles.readableNote}>
              <strong>Lưu ý:</strong> Khách hàng đặt quà tặng trái cây, vui lòng ghi rõ thông tin của người
              được tặng và người đặt để shop thuận tiện liên hệ.
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
                    onChange={() => {
                      setDeliveryOption("available");
                      setIsConfirmed(false);
                      setConfirmedTime("");
                      setDatetimeOrder("");
                    }}
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
                  <span className={styles.clockIcon}>
                    <FaClock />
                  </span>
                  <strong>{confirmedTime}</strong>
                </div>
              )}

              {!isConfirmed && deliveryOption === "select" && (
                <div className={styles.selectWrapper}>
                  <div className={styles.selectGroup}>
                    <select
                      value={tempDateValue}
                      onChange={(e) => setTempDateValue(e.target.value)}
                    >
                      {dateOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>

                    <select
                      value={tempTime}
                      onChange={(e) => setTempTime(e.target.value)}
                      disabled={isToday && validTimes.length === 0}
                    >
                      {timeOptions.map((time) => {
                        const disabled = isToday && !validTimes.includes(time);
                        return (
                          <option key={time} value={time} disabled={disabled}>
                            {time}
                            {disabled ? " (đã qua)" : ""}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <button
                    className={styles.confirmTimeBtn}
                    onClick={handleConfirmTime}
                  >
                    XÁC NHẬN THỜI GIAN
                  </button>
                </div>
              )}
            </div>

            <div className={styles.totalRow}>
              <span>Tổng tiền:</span>
              <span className={styles.finalPrice}>
                {totalPrice.toLocaleString()}đ
              </span>
            </div>

            <button className={styles.checkoutBtn} onClick={handleCheckout}>
              THANH TOÁN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
