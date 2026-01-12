import "./warranty.css";

function WarrantyPolicy() {
  return (
    <div className="policy-page">
      <div className="policy-container">
        <h1>Chính sách bảo hành</h1>
        <p className="policy-desc">
          FruitStore cam kết mang đến trải nghiệm mua sắm an tâm với chính sách
          bảo hành minh bạch, rõ ràng và nhanh chóng.
        </p>

        <section className="policy-section">
          <h3><span>1</span> Phạm vi áp dụng</h3>
          <p>
            Áp dụng cho tất cả sản phẩm được mua tại FruitStore, bao gồm
            trái cây tươi, trái cây nhập khẩu, quà tặng trái cây
            và các sản phẩm chế biến.
          </p>
        </section>

        <section className="policy-section">
          <h3><span>2</span> Điều kiện bảo hành</h3>
          <ul>
            <li>Sản phẩm hư hỏng do lỗi từ phía FruitStore</li>
            <li>Giao sai chủng loại, số lượng so với đơn hàng</li>
            <li>Sản phẩm bị dập, hỏng trong quá trình vận chuyển</li>
          </ul>
        </section>

        <section className="policy-section warning">
          <h3><span>3</span> Trường hợp không áp dụng</h3>
          <ul>
            <li>Sản phẩm hư hỏng do bảo quản sai cách sau khi nhận</li>
            <li>Cung cấp sai thông tin khi đặt hàng</li>
            <li>Sử dụng quá thời gian khuyến nghị</li>
          </ul>
        </section>

        <section className="policy-section highlight">
          <h3><span>4</span> Hình thức bảo hành</h3>
          <p>
            FruitStore hỗ trợ <strong>đổi sản phẩm mới</strong> hoặc
            <strong> hoàn tiền 100%</strong> tùy theo từng trường hợp cụ thể.
          </p>
        </section>

        <section className="policy-section">
          <h3><span>5</span> Thời gian xử lý</h3>
          <p>
            Thời gian xử lý từ <strong>1 – 3 ngày làm việc</strong> kể từ khi
            tiếp nhận phản hồi của khách hàng.
          </p>
        </section>

      </div>
    </div>
  );
}

export default WarrantyPolicy;
