import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import styles from "./online_shopping_guide.module.scss";

export default function OnlineShoppingGuide() {
  const location = useLocation();

  const menuItems = [
    { name: "Chính sách mua hàng", path: "/chinh-sach-mua-hang" },
    { name: "Chính sách thanh toán", path: "/chinh-sach-thanh-toan" },
    { name: "Chính sách bảo hành", path: "/policy-warranty" },
    { name: "Chính sách kiểm hàng", path: "/policy-inspection" },
    { name: "Chính sách bảo mật", path: "/chinh-sach-bao-mat" },
    { name: "Hướng dẫn mua hàng online", path: "/huong-dan-mua-hang" },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <main className={styles.mainContent}>
          <h1 className={styles.title}>Hướng dẫn mua hàng Online</h1>
          
          <div className={styles.contentBody}>
            <section className={styles.guideSection}>
              <h2>Cách 1: Hotline</h2>
              <p>
                Gọi điện đến Hotline <strong>0865 666 666</strong> từ 8h đến 20h tất cả các ngày trong tuần. Nhân viên bán hàng sẽ ghi nhận thông tin đặt hàng của bạn.
              </p>
            </section>
            <section className={styles.guideSection}>
              <h2>Cách 2: Mạng xã hội</h2>
              <ul>
                <li>Truy cập vào trang Facebook hoặc Instagram chính thức của <strong>Fruit Store</strong>.</li>
                <li>Chọn mục "Nhắn tin" để được nhân viên trực chat tư vấn về các loại trái cây và nhận đơn đặt hàng.</li>
              </ul>
            </section>
            <section className={styles.guideSection}>
              <h2>Cách 3: Website</h2>
              <ul>
                <li>Truy cập vào website <strong>fruitstore.com.vn</strong></li>
                <li>
                  Tìm kiếm sản phẩm:
                  <ul className={styles.subList}>
                    <li>Nhập loại trái cây bạn mong muốn vào ô tìm kiếm, bạn sẽ có kết quả ngay sau khi hoàn thành.</li>
                    <li>Click vào từng danh mục sản phẩm để tìm kiếm.</li>
                  </ul>
                </li>
                <li>Với mỗi sản phẩm ưng ý, bạn bấm nút <strong>CHỌN MUA</strong>, sản phẩm sẽ tự động được thêm vào <strong>GIỎ HÀNG</strong>.</li>
                <li>Tại giỏ hàng, bạn có thể bấm nút "Xóa" nếu muốn hủy sản phẩm đã chọn để mua sản phẩm khác.</li>
                <li>Sau khi đã chọn được các loại trái cây cần mua, bấm vào <strong>THANH TOÁN</strong>, và điền đầy đủ, chính xác thông tin cá nhân trong bảng thông tin.</li>
                <li>
                  Chọn hình thức thanh toán:
                  <ul className={styles.subList}>
                    <li>Thanh toán khi nhận hàng.</li>
                    <li>Thanh toán qua VNPAY.</li>
                  </ul>
                </li>
                <li>Sau khi điền đầy đủ thông tin và kiểm tra đơn hàng, giá tiền, bạn bấm vào nút <strong>HOÀN TẤT ĐƠN HÀNG</strong> gửi về cho <strong>Fruit Store</strong>.</li>
                <li><strong>Fruit Store</strong> sẽ gửi cho bạn email hoặc gọi điện xác nhận đơn hàng.</li>
              </ul>
            </section>
          </div>
        </main>

        <aside className={styles.sidebar}>
          <h3 className={styles.sidebarTitle}>DANH MỤC TRANG</h3>
          <nav className={styles.sideNav}>
            {menuItems.map((item, index) => (
              <Link 
                key={index} 
                to={item.path} 
                className={`${styles.navItem} ${location.pathname === item.path ? styles.active : ""}`}
              >
                <span>{item.name}</span>
                <ChevronRight size={16} />
              </Link>
            ))}
          </nav>
        </aside>
      </div>
    </div>
  );
}