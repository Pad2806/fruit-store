import { useState } from "react";
import styles from "./Profile.module.scss";

export default function Profile() {
  const [userData, setUserData] = useState({
    name: "Nguyễn Văn A",
    phone: "0123456789",
    email: "nguyenvana@gmail.com",
    address: "99 Tô Hiến Thành, Đà Nẵng"
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h3 className={styles.title}>Thông tin tài khoản</h3>
        <p className={styles.subtitle}>Quản lý thông tin cá nhân</p>
      </div>

      <div className={styles.formCard}>
        <div className={styles.formBody}>
          <div className={styles.group}>
            <label>Họ và tên</label>
            <input 
              type="text" 
              placeholder="Nhập họ và tên"
              value={userData.name} 
              onChange={(e) => setUserData({...userData, name: e.target.value})} 
            />
          </div>

          <div className={styles.row}>
            <div className={styles.group}>
              <label>Số điện thoại</label>
              <input 
                type="text" 
                placeholder="Nhập số điện thoại"
                value={userData.phone} 
                onChange={(e) => setUserData({...userData, phone: e.target.value})} 
              />
            </div>

            <div className={styles.group}>
              <label>Email</label>
              <input 
                type="email" 
                value={userData.email} 
                disabled 
              />
            </div>
          </div>

          <div className={styles.group}>
            <label>Địa chỉ nhận hàng</label>
            <textarea 
              rows="3"
              placeholder="Nhập địa chỉ chi tiết"
              value={userData.address} 
              onChange={(e) => setUserData({...userData, address: e.target.value})} 
            />
          </div>
        </div>

        <div className={styles.formFooter}>
          <button className={styles.btnUpdate}>Lưu thay đổi</button>
        </div>
      </div>
    </div>
  );
}