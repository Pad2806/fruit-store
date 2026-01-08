import React from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import "./payment.css";

function Payment() {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post(
        "http://localhost:8000/api/checkout/stripe",
        {
          user_id: "47c5af89-eba1-11f0-a64b-06f3c06f8a6d",
          total_amount: 500000,
          shipping_fee: 30000,
          recipient_name: "Nguyen Tho Ha",
          recipient_email: "thohayeuthick1@gmail.com",
          recipient_address: "48 Cao Thang",
          recipient_phone_number: "0987654321",
          recipient_city: "Da Nang",
          recipient_ward: "Hoa Khanh Bac",
          recipient_district: "Lien Chieu",
        }
      );
      console.log(data);
      const { client_secret } = data;
      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: "Nguyen Tho Ha",
            email: "thohayeuthick1@gmail.com",
          },
        },
      });

      console.log(result);

      if (result.error) {
        alert(result.error.message);
        setLoading(false);
        return;
      }

      if (result.paymentIntent.status === "failed") {
        alert("Thanh toán thất bại!");
        setLoading(false);
        return;
      }

      if (result.paymentIntent.status === "succeeded") {
        const res = await axios.post(
          "http://localhost:8000/api/orders/confirm",
          {
            payment_intent_id: result.paymentIntent.id,
          }
        );
        console.log(res.data);
        if (res.data.status === "completed") {
          alert("Thanh toán thành công!");
        } else {
          alert("Thanh toán thất bại. Vui lòng liên hệ hỗ trợ!");
        }
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert(error.response.data.message || "Thanh toán thất bại!");
      } else {
        alert("Thanh toán thất bại!");
      }
    } finally {
      setLoading(false);
    }
  };

  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  return (
    <div className="payment-container">
      <div className="payment-card">
        <div className="payment-header">
          <h2>Thanh toán</h2>
          <p>Nhập thông tin thẻ của bạn để hoàn tất thanh toán</p>
        </div>

        <form onSubmit={handleSubmit} className="payment-form">
          <div className="form-group">
            <label htmlFor="card-element">Thông tin thẻ</label>
            <div className="card-element-wrapper">
              <CardElement id="card-element" options={CARD_ELEMENT_OPTIONS} />
            </div>
          </div>

          <button
            type="submit"
            disabled={!stripe || loading}
            className="payment-button"
          >
            {loading ? (
              <span className="loading-spinner"></span>
            ) : (
              <>
                <svg
                  className="lock-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect
                    x="3"
                    y="11"
                    width="18"
                    height="11"
                    rx="2"
                    ry="2"
                  ></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                Thanh toán ngay
              </>
            )}
          </button>

          <div className="secure-notice">
            <svg
              className="shield-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            <span>Thanh toán được bảo mật bởi Stripe</span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Payment;
