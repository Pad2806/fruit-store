import "./Footer.css";
import bctImg from "../../assets/bct.png";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">

        <div className="footer-col">
          <h4>Về FruitStore</h4>
          <p>
            FruitStore là thương hiệu trái cây tươi chất lượng cao, với đa dạng
            sản phẩm phục vụ mọi nhu cầu: đặc sản vùng miền, trái cây nhập khẩu,
            quà tặng trái cây, mâm ngũ quả, nước ép, và trái cây sấy.
          </p>

          <img
            src={bctImg}
            alt="Bộ Công Thương"
            className="bct"
          />

          <p className="small">
            Bản quyền của Công ty TNHH FruitStore<br />
            Giấy chứng nhận ĐKKD số 0316077880 do Sở KH&ĐT TP.HCM cấp.
          </p>
        </div>

        <div className="footer-col">
          <h4>Thông tin liên hệ</h4>
          <p><strong>Chi nhánh 1:</strong> 183 Nguyễn Thái Học, P. Bến Thành</p>
          <p><strong>Chi nhánh 2:</strong> 42B Trần Huy Liệu, P. Phú Nhuận</p>
          <p><strong>Điện thoại:</strong> 0865 666 666</p>
          <p><strong>Email:</strong> info@FruitStore.com.vn</p>
        </div>

        <div className="footer-col">
          <h4>Hỗ trợ khách hàng</h4>
          <ul className="footer-links">
            <li><a href="/#">Tìm kiếm</a></li>
            <li><a href="/about">Câu chuyện thương hiệu</a></li>
            <li><a href="/#">Chính sách thành viên</a></li>
            <li><a href="/#">Chính sách giao hàng</a></li>
            <li><a href="/#">Chính sách thanh toán</a></li>
            <li><a href="/policy-warranty">Chính sách bảo hành</a></li>
            <li><a href="/policy-inspection">Chính sách kiểm hàng</a></li>
            <li><a href="/#">Chính sách bảo mật</a></li>
            <li><a href="/#">Kiến thức trái cây</a></li>
            <li><a href="/#">Hướng dẫn mua hàng Online</a></li>
            <li><a href="/contact">Liên hệ</a></li>
          </ul>
        </div>


        <div className="footer-col footer-hotline">
          <h4>Chăm sóc khách hàng</h4>
          <div className="hotline">0865660775</div>
          <div className="email">hello@FruitStore.com.vn</div>

        </div>

      </div>

      <div className="footer-bottom">
        Copyright © 2025 FruitStore – Trái Cây Chất Lượng Cao
      </div>
    </footer>
  );
}

export default Footer;
