import "./Contact.css";

function Contact() {
  return (
    <div className="contact-page">
      <div className="contact-content">
        <div className="contact-info">
          <h2>Thông tin liên hệ</h2>

          <div className="info-item">
            <span>📍</span>
            <p>
              <b>Chi nhánh 1:</b> 183 Nguyễn Thái Học, Phường Bến Thành, TP.HCM
            </p>
          </div>

          <div className="info-item">
            <span>📍</span>
            <p>
              <b>Chi nhánh 2:</b> 42B Trần Huy Liệu, Phường Phú Nhuận
            </p>
          </div>

          <div className="info-item">
            <span>✉️</span>
            <p>hello@morningfruit.com.vn</p>
          </div>

          <div className="info-item">
            <span>📞</span>
            <p>Hotline: 0865660775</p>
          </div>

          <div className="info-item">
            <span>⏰</span>
            <p>Thứ 2 – Chủ nhật (8h00 – 20h00)</p>
          </div>
        </div>
        <div className="contact-form">
          <h2>Tư vấn Quà Tặng Doanh Nghiệp</h2>
          <p className="desc">
            Nếu bạn có thắc mắc gì, hãy gửi yêu cầu cho chúng tôi.
          </p>

          <form>
            <input type="text" placeholder="Tên của bạn" />
            <div className="row">
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
