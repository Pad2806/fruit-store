import styles from "./contact.module.scss";
import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaClock,
} from "react-icons/fa";

function Contact() {
  return (
    <div className={styles.contactPage}>
      <div className={styles.contactContent}>
        <div className={styles.contactInfo}>
          <h2>Thông tin liên hệ</h2>

          <div className={styles.infoItem}>
            <span className={styles.icon}>
              <FaMapMarkerAlt />
            </span>
            <p>
              <b>Chi nhánh 1:</b> 183 Hoàng Văn Thái, P. Hòa Khánh Nam, TP. Đà Nẵng
            </p>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.icon}>
              <FaMapMarkerAlt />
            </span>
            <p>
              <b>Chi nhánh 2:</b> 111 Nguyễn Văn Linh, P. Phước Ninh, TP. Đà Nẵng
            </p>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.icon}>
              <FaEnvelope />
            </span>
            <p>hello@fruitstore.com.vn</p>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.icon}>
              <FaPhoneAlt />
            </span>
            <p>Hotline: 0865666666</p>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.icon}>
              <FaClock />
            </span>
            <p>Thứ 2 – Chủ nhật (8h00 – 20h00)</p>
          </div>
        </div>

        <div className={styles.contactForm}>
          <h2>Tư vấn Quà Tặng Doanh Nghiệp</h2>
          <p className={styles.desc}>
            Nếu bạn có thắc mắc gì, hãy gửi yêu cầu cho chúng tôi.
          </p>

          <form>
            <input type="text" placeholder="Tên của bạn" />

            <div className={styles.row}>
              <input type="email" placeholder="Email của bạn" />
              <input type="tel" placeholder="Số điện thoại của bạn" />
            </div>

            <textarea placeholder="Nội dung" rows="5"></textarea>

            <button type="submit">GỬI CHO CHÚNG TÔI</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;
