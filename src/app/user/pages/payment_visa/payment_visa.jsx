import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import styles from "./payment_visa.module.scss";
import { ToastService } from "../../components/toast/Toast";
import { confirmOrderStripe } from "../../../../api/orders";
import apiClient from "../../../../api/api";
import { useCart } from "../../context/CartContext";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  import.meta.env.STRIPE_KEY ||
    "pk_test_51SmxkjAjfmLAwcOovm27OG3LMVmkrDlxZcppPPbs50hwmlIjTTx6rP1Yyv1lLvpk67yXwCkaokDjdLtnVqUjSiJM00V4zMsIgl"
);

const cardElementOptions = {
  style: {
    base: {
      fontSize: "16px",
      color: "#1e293b",
      fontFamily: "Inter, sans-serif",
      "::placeholder": { color: "#94a3b8" },
    },
    invalid: { color: "#dc2626" },
  },
};

function PaymentVisaInner() {
  const navigate = useNavigate();
  const location = useLocation();
  const stripe = useStripe();
  const elements = useElements();
  const { refreshCartCount } = useCart();

  const state = location.state || {};
  const { orderId, totalAmount, customer, items = [], deliveryTime, orderPayload } = state;

  const [creatingIntent, setCreatingIntent] = useState(true);
  const [paying, setPaying] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [initError, setInitError] = useState("");

  const summary = useMemo(() => {
    const subtotal =
      items.reduce((sum, it) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 0), 0) || 0;
    const ship = Number(orderPayload?.shipping_fee || 0);
    const total = Number(totalAmount || 0);
    return { subtotal, ship, total };
  }, [items, orderPayload?.shipping_fee, totalAmount]);

  const createIntent = useCallback(async () => {
    setInitError("");
    setCreatingIntent(true);

    try {
      const res = await apiClient.post("/user/checkout/stripe", {
        payment_method: "banking",
        total_amount: Number(totalAmount),
        shipping_fee: Number(orderPayload.shipping_fee || 0),
        user_id: orderPayload.user_id,
        recipient_name: orderPayload.recipient_name,
        recipient_email: orderPayload.recipient_email,
        recipient_address: orderPayload.recipient_address,
        recipient_city: orderPayload.recipient_city || "",
        recipient_ward: orderPayload.recipient_ward || "",
        recipient_district: orderPayload.recipient_district || "",
        recipient_phone_number: orderPayload.recipient_phone_number,
        note: orderPayload.note || "",
        datetime_order: orderPayload.datetime_order || null,
      });

      if (res.data?.status !== "success") {
        throw new Error("Create intent failed");
      }

      setClientSecret(res.data.client_secret);
    } catch (err) {
      setInitError("Không thể khởi tạo thanh toán Stripe");
    } finally {
      setCreatingIntent(false);
    }
  }, [orderPayload, totalAmount]);

  useEffect(() => {
    if (!location.state || !orderPayload || !totalAmount) {
      navigate("/checkouts", { replace: true });
      return;
    }
    createIntent();
  }, [location.state, navigate, orderPayload, totalAmount, createIntent]);

  const handlePay = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    const cardNumber = elements.getElement(CardNumberElement);
    if (!cardNumber) return;

    try {
      setPaying(true);
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardNumber,
          billing_details: {
            name: customer?.fullName || "",
            email: customer?.email || "",
            phone: customer?.phone || "",
            address: { line1: customer?.address || "" },
          },
        },
      });

      if (result?.error) {
        ToastService.error(result.error.message);
        console.log(result.error.message);
        return;
      }

      if (result?.paymentIntent?.status === "succeeded") {
        try {
          const confirmRes = await confirmOrderStripe(result.paymentIntent.id);

          if (confirmRes?.status === "completed" || confirmRes?.status === "confirmed") {
            await refreshCartCount();
            navigate("/order-success", {
              state: {
                orderId,
                customer,
                items,
                totalAmount,
                deliveryTime,
                order_server_id: confirmRes?.order_id,
              },
            });
            return;
          }

          ToastService.error(confirmRes?.message || "Xác nhận đơn hàng thất bại");
          return;
        } catch (e) {
          ToastService.error("Thanh toán thành công nhưng lưu đơn hàng thất bại");
          return;
        }
      }
    } catch (err) {
      ToastService.error("Giao dịch bị từ chối bởi ngân hàng.");
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.topbar}>
          <div className={styles.brand}>
            <div className={styles.brandTitle}>Cổng thanh toán trực tuyến</div>
            <div className={styles.brandSub}>
              <span className={styles.icon}>🔒</span> Kết nối được bảo mật bằng mã hóa SSL 256-bit
            </div>
          </div>
          <Link className={styles.backBtn} to="/checkouts">
            Hủy giao dịch
          </Link>
        </header>

        <div className={styles.layout}>
          <section className={styles.panel}>
            <div className={styles.panelHeader}>
              <h2 className={styles.panelTitle}>Thông tin thẻ thanh toán</h2>
              <div className={styles.cardLogos}>
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                  alt="Visa"
                />
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                  alt="Mastercard"
                />
              </div>
            </div>

            {creatingIntent ? (
              <div className={styles.stateBox}>
                <div className={styles.spinner} />
                <div className={styles.stateText}>
                  <div className={styles.stateTitle}>Đang kết nối...</div>
                </div>
              </div>
            ) : initError ? (
              <div className={styles.errorBox}>
                <div className={styles.errorDesc}>{initError}</div>
                <button className={styles.retryBtn} onClick={createIntent}>
                  Thử lại
                </button>
              </div>
            ) : (
              <form onSubmit={handlePay} className={styles.form}>
                <div className={styles.field}>
                  <label className={styles.label}>Số thẻ ghi trên mặt trước</label>
                  <div className={styles.inputShell}>
                    <CardNumberElement options={cardElementOptions} />
                  </div>
                </div>

                <div className={styles.row2}>
                  <div className={styles.field}>
                    <label className={styles.label}>Ngày hết hạn (MM/YY)</label>
                    <div className={styles.inputShell}>
                      <CardExpiryElement options={cardElementOptions} />
                    </div>
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Mã bảo mật (CVC)</label>
                    <div className={styles.inputShell}>
                      <CardCvcElement options={cardElementOptions} />
                    </div>
                  </div>
                </div>

                <button className={styles.payBtn} type="submit" disabled={!stripe || paying || !clientSecret}>
                  {paying ? "Đang xử lý giao dịch..." : `Thanh toán an toàn ${summary.total.toLocaleString()}đ`}
                </button>

                <div className={styles.pciNote}>Giao dịch của bạn tuân thủ tiêu chuẩn bảo mật PCI-DSS toàn cầu.</div>
              </form>
            )}
          </section>

          <aside className={styles.summary}>
            <h2 className={styles.summaryTitle}>Đơn hàng của bạn</h2>
            <div className={styles.itemList}>
              {items.map((it) => (
                <div className={styles.itemRow} key={it.id}>
                  <span>
                    {it.name} x{it.quantity}
                  </span>
                  <strong>{(Number(it.price) * Number(it.quantity)).toLocaleString()}đ</strong>
                </div>
              ))}
            </div>
            <div className={styles.divider} />
            <div className={styles.breakdown}>
              <div className={styles.line}>
                <span>Tạm tính</span>
                <span>{summary.subtotal.toLocaleString()}đ</span>
              </div>
              <div className={styles.line}>
                <span>Vận chuyển</span>
                <span>{summary.ship.toLocaleString()}đ</span>
              </div>
              <div className={styles.totalLine}>
                <span>Tổng số tiền</span>
                <span>{summary.total.toLocaleString()}đ</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default function PaymentVisa() {
  return (
    <Elements stripe={stripePromise}>
      <PaymentVisaInner />
    </Elements>
  );
}
