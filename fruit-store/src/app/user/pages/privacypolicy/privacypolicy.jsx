import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import styles from "./privacypolicy.module.scss";

export default function PrivacyPolicy() {
  const location = useLocation();

  const menuItems = [
    { name: "Chính sách mua hàng", path: "/purchasepolicy" },
    { name: "Chính sách thanh toán", path: "/paymentpolicy" },
    { name: "Chính sách bảo hành", path: "/policy-warranty" },
    { name: "Chính sách kiểm hàng", path: "/policy-inspection" },
    { name: "Chính sách bảo mật", path: "/chinh-sach-bao-mat" },
    { name: "Hướng dẫn mua hàng online", path: "/huong-dan-mua-hang" },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <main className={styles.mainContent}>
          <h1 className={styles.title}>Chính sách bảo mật</h1>
          
          <div className={styles.contentBody}>
            <p className={styles.intro}>
              Cảm ơn quý khách đã truy cập vào trang web của <strong>Fruit Store</strong> được vận hành bởi <strong>Công ty TNHH Fruit Store</strong>. 
              Chúng tôi tôn trọng sự riêng tư, mong muốn bảo vệ thông tin cá nhân và thông tin thanh toán của bạn. 
              “Chính sách bảo mật” dưới đây là những cam kết mà chúng tôi thực hiện, nhằm tôn trọng và bảo vệ quyền lợi của người truy cập.
            </p>

            <section>
              <h2>1. Thu thập thông tin cá nhân</h2>
              <p>
                Khi đăng ký thành viên hoặc giao dịch mua hàng tại website fruitstore.com.vn, khách hàng tự nguyện cung cấp một số thông tin cần thiết như họ tên, email, số điện thoại, địa chỉ giao hàng, ngày sinh, chi tiết thanh toán…
              </p>
              <p>
                Chúng tôi thu thập, lưu trữ và xử lý thông tin của bạn để hoàn tất việc mua hàng, hỗ trợ đổi trả/ bảo hành, cũng như thông báo về các chương trình ưu đãi.
              </p>
            </section>

            <section>
              <h2>2. Sử dụng thông tin khách hàng</h2>
              <p>
                Chỉ những bộ phận nội bộ được sử dụng thông tin lưu trữ của khách hàng, bao gồm: Bộ phận Marketing, Bộ phận chăm sóc khách hàng, Bộ phận nhân viên bán hàng và Vận chuyển. 
                <strong> Fruit Store</strong> có quyền sử dụng thông tin khách hàng cung cấp để:
              </p>
              <ul>
                <li>Xử lý đơn đặt hàng và giao hàng theo thông tin mà quý khách cung cấp trên trang web fruitstore.com.vn</li>
                <li>Cung cấp thông tin liên quan đến sản phẩm, lợi ích, ưu đãi hay các thư từ khác</li>
                <li>Sử dụng thông tin đã thu thập được từ các cookies nhằm cải thiện trải nghiệm người dùng và chất lượng dịch vụ tại fruitstore.com.vn</li>
              </ul>
            </section>

            <section>
              <h2>3. Chia sẻ thông tin khách hàng</h2>
              <p>
                <strong>Fruit Store</strong> cam kết sẽ không chia sẻ thông tin của khách hàng cho bất kỳ một công ty và các bên thứ ba, trừ những trường hợp thật sự cần thiết như sau:
              </p>
              <ul>
                <li>Cung cấp địa chỉ và số điện thoại của quý khách cho các đối tác vận chuyển (Ahamove, Lalamove) nhằm mục đích giao hàng.</li>
                <li>Khi có yêu cầu của các cơ quan pháp luật.</li>
                <li>Nghiên cứu thị trường và các báo cáo phân tích và tuyệt đối không chuyển cho bên thứ ba.</li>
              </ul>
            </section>

            <section>
              <h2>4. Chính sách bảo mật thanh toán</h2>
              <p>
                Hệ thống thanh toán thẻ tại fruitstore.com.vn được cung cấp bởi các đối tác cổng thanh toán đã được cấp phép hoạt động hợp pháp tại Việt Nam. 
                Do đó, các tiêu chuẩn bảo mật thanh toán thẻ của fruitstore.com.vn đảm bảo tuân thủ theo các tiêu chuẩn bảo mật của Đối tác cổng thanh toán.
              </p>
            </section>

            <section>
              <h2>5. Sử dụng Cookie</h2>
              <p>
                Cookie là một lượng nhỏ dữ liệu, có thể bao gồm một định danh duy nhất vô danh. Cookie được gửi tới trình duyệt của bạn từ một trang web và được lưu trữ trên ổ đĩa cứng của máy tính.
              </p>
              <p>
                Để xác định bạn trên hệ thống điện tử, một cookie sẽ được lưu trữ trên máy tính của bạn. Chúng tôi có một công cụ "tiếp thị" hoạt động cho phép chúng tôi lưu ý khi bạn viếng thăm trang web và hiển thị quảng cáo có liên quan. Bạn luôn có thể chọn không tham gia.
              </p>
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