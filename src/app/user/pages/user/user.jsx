import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./user.module.scss";
import Profile from "../../components/profile/Profile";
import OrderHistory from "../../components/orderhistory/OrderHistory";
import { useAuth } from "../../context/AuthContext";
import { BiUser, BiShoppingBag } from "react-icons/bi";

export default function User() {
  const [currentTab, setCurrentTab] = useState("profile");
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading) return <div style={{ textAlign: "center", marginTop: "50px" }}>Đang tải...</div>;
  if (!user) return null;

  return (
    <div className={styles.container}>
      <div className={styles.layout}>

        <aside className={styles.sidebar}>
          <div className={styles.userBrief}>
            <div className={styles.avatar}>
              {/* Fallback avatar if no image */}
              <BiUser size={24} />
            </div>
            <div className={styles.info}>
              <p>Tài khoản của</p>
              <h4>{user?.name}</h4>
            </div>
          </div>
          <nav className={styles.nav}>
            <button
              className={currentTab === "profile" ? styles.active : ""}
              onClick={() => setCurrentTab("profile")}
            >
              <BiUser size={18} style={{ marginRight: '8px' }} />
              Thông tin tài khoản
            </button>
            <button
              className={currentTab === "history" ? styles.active : ""}
              onClick={() => setCurrentTab("history")}
            >
              <BiShoppingBag size={18} style={{ marginRight: '8px' }} />
              Lịch sử mua hàng
            </button>
          </nav>
        </aside>

        <main className={styles.mainContent}>
          {currentTab === "profile" ? <Profile /> : <OrderHistory />}
        </main>

      </div>
    </div>
  );
}