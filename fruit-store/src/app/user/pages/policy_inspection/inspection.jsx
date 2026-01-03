import "./inspection.css";
import {
  FiPackage,
  FiSearch,
  FiAlertTriangle,
  FiCheckCircle,
  FiCamera
} from "react-icons/fi";


function InspectionPolicy() {
  return (
    <div className="inspection-page">
      <div className="inspection-container">

        <div className="inspection-header">
          <span className="inspection-tag">POLICY</span>
          <h1>Chính sách kiểm hàng</h1>
          <p>
            Quy trình kiểm tra sản phẩm khi nhận hàng tại FruitStore nhằm đảm bảo
            quyền lợi và sự minh bạch cho khách hàng.
          </p>
        </div>

        <div className="inspection-timeline">

          <div className="timeline-item">
            <div className="timeline-icon"><FiPackage /></div>
            <div className="timeline-content">
              <h3>Thời điểm kiểm hàng</h3>
              <p>
                Khách hàng được kiểm tra sản phẩm ngay khi nhận hàng và
                trước khi thanh toán (đối với đơn COD).
              </p>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-icon"><FiSearch /></div>
            <div className="timeline-content">
              <h3>Nội dung kiểm tra</h3>
              <ul>
                <li>Số lượng sản phẩm theo đơn hàng</li>
                <li>Tình trạng trái cây (dập, hỏng, nứt)</li>
                <li>Chủng loại, quy cách, đóng gói</li>
              </ul>
            </div>
          </div>

          <div className="timeline-item warning">
            <div className="timeline-icon"><FiAlertTriangle /></div>
            <div className="timeline-content">
              <h3>Trường hợp không áp dụng</h3>
              <ul>
                <li>Đã ký nhận và rời khỏi điểm giao hàng</li>
                <li>Sản phẩm đã sử dụng hoặc bảo quản sai cách</li>
                <li>Không có hình ảnh / video khi phản hồi</li>
              </ul>
            </div>
          </div>

          <div className="timeline-item success">
            <div className="timeline-icon"><FiCheckCircle /></div>
            <div className="timeline-content">
              <h3>Xử lý khi có sai sót</h3>
              <p>
                Khách hàng có thể từ chối nhận hàng hoặc liên hệ FruitStore để
                được đổi mới hoặc hoàn tiền theo chính sách.
              </p>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-icon"><FiCamera /></div>
            <div className="timeline-content">
              <h3>Lưu ý quan trọng</h3>
              <p>
                Vui lòng chụp ảnh hoặc quay video sản phẩm tại thời điểm nhận
                hàng và gửi về FruitStore trong vòng <strong>24 giờ</strong>.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default InspectionPolicy;
