import { useState } from "react";
import styles from "./user.module.scss";
import Profile from "../../components/profile/Profile";
import OrderHistory from "../../components/orderhistory/OrderHistory";

export default function User() {
  const [currentTab, setCurrentTab] = useState("profile");

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        
        <aside className={styles.sidebar}>
          <div className={styles.userBrief}>
            <div className={styles.avatar}>A</div>
            <div className={styles.info}>
              <p>Tài khoản của</p>
              <h4>Nguyễn Văn A</h4>
            </div>
          </div>
          <nav className={styles.nav}>
            <button 
              className={currentTab === "profile" ? styles.active : ""}
              onClick={() => setCurrentTab("profile")}
            >
              Thông tin tài khoản
            </button>
            <button 
              className={currentTab === "history" ? styles.active : ""}
              onClick={() => setCurrentTab("history")}
            >
              Lịch sử mua hàng
            </button>
            <button className={styles.logout}>Đăng xuất</button>
          </nav>
        </aside>

        <main className={styles.mainContent}>
          {currentTab === "profile" ? <Profile /> : <OrderHistory />}
        </main>

      </div>
    </div>
  );
}