import React from "react";
import styles from "./paymentpolicy.module.scss";

const PaymentPolicy = () => {
  return (
    <div className={styles.page}>

      <main className={styles.content}>
        <section className={styles.section}>
          <h1 className={styles.pageTitle}>Chính sách thanh toán</h1>

          <article className={styles.card}>
            <h2 className={styles.h2}>1. Các hình thức thanh toán</h2>
            <p>FruitStore hỗ trợ nhiều hình thức thanh toán linh hoạt để phù hợp với nhu cầu của mọi khách hàng:</p>

            <div className={styles.methods}>
              <div className={styles.methodCard}>
                <div className={styles.methodIcon}>💵</div>
                <h3 className={styles.h3Accent}>Thanh toán khi nhận hàng (COD)</h3>
                <p>Thanh toán bằng tiền mặt trực tiếp cho nhân viên giao hàng</p>
              </div>
                <div className={styles.methodCard}>
                <div className={styles.methodIcon}>🏦</div>
                <h3 className={styles.h3Accent}>Chuyển khoản ngân hàng</h3>
                <p>Chuyển khoản qua tài khoản ngân hàng của FruitStore</p>
              </div>
            </div>
          </article>

          <article className={styles.card}>
            <h2 className={styles.h2}>2. Thanh toán khi nhận hàng (COD)</h2>
            <p>Đây là hình thức thanh toán phổ biến và thuận tiện nhất cho khách hàng.</p>

            <h3 className={styles.h3}>Ưu điểm:</h3>
            <ul className={styles.ul}>
              <li>Không cần thanh toán trước</li>
              <li>Kiểm tra sản phẩm trước khi thanh toán</li>
              <li>An toàn và tiện lợi</li>
              <li>Không phát sinh phí giao dịch</li>
            </ul>

            <h3 className={styles.h3}>Quy trình:</h3>
            <ul className={styles.ul}>
              <li>Đặt hàng online hoặc qua hotline</li>
              <li>Nhận cuộc gọi xác nhận từ nhân viên</li>
              <li>Nhận hàng tại địa chỉ đã đăng ký</li>
              <li>Kiểm tra sản phẩm</li>
              <li>Thanh toán tiền mặt cho nhân viên giao hàng</li>
            </ul>

            <p className={styles.note}>
              <strong>Lưu ý:</strong> Vui lòng chuẩn bị đủ tiền mặt để thanh toán. Nhân viên giao hàng có thể không có đủ tiền lẻ để thối.
            </p>
          </article>

          <article className={styles.card}>
            <h2 className={styles.h2}>3. Chuyển khoản ngân hàng</h2>
            <p>Khách hàng vui lòng chuyển khoản theo thông tin sau:</p>

            <div className={styles.bankBox}>
              <div className={styles.bankRow}>
                <span className={styles.label}>🏦 Ngân hàng:</span>
                <span className={styles.value}>Vietcombank - Chi nhánh TP.HCM</span>
              </div>
              <div className={styles.bankRow}>
                <span className={styles.label}>💳 Số tài khoản:</span>
                <span className={styles.value}>0123456789</span>
              </div>
              <div className={styles.bankRow}>
                <span className={styles.label}>👤 Chủ tài khoản:</span>
                <span className={styles.value}>CÔNG TY TNHH FRUITSTORE</span>
              </div>
              <div className={`${styles.bankRow} ${styles.bankHighlight}`}>
                <span className={styles.label}>✍️ Nội dung chuyển khoản:</span>
                <span className={styles.value}>Họ tên + Số điện thoại + Mã đơn hàng</span>
              </div>
            </div>

            <p className={styles.example}>
              Ví dụ: <em>Nguyen Van A 0901234567 DH12345</em>
            </p>

            <h3 className={styles.h3}>Sau khi chuyển khoản:</h3>
            <ul className={styles.ul}>
              <li>Chụp ảnh hoặc chụp màn hình biên lai chuyển khoản</li>
              <li>Gửi về email: info@FruitStore.com.vn</li>
              <li>Hoặc nhắn tin qua hotline: 0865 666 666</li>
              <li>Đơn hàng sẽ được xử lý ngay sau khi xác nhận thanh toán</li>
            </ul>
          </article>

          <article className={styles.card}>
            <h2 className={styles.h2}>4. Thanh toán qua ví điện tử</h2>
            <p>FruitStore hỗ trợ thanh toán qua các ví điện tử phổ biến tại Việt Nam:</p>

            <div className={styles.walletGrid}>
              
              <div className={styles.walletCard}>
                <div className={styles.walletLogo}>V</div>
                <h4 className={styles.h4}>VNPay</h4>
                <p>Liên kết thẻ ngân hàng</p>
              </div>
            </div>

            <h3 className={styles.h3}>Ưu điểm thanh toán ví điện tử:</h3>
            <ul className={styles.ul}>
              <li>Nhanh chóng, tiện lợi</li>
              <li>An toàn và bảo mật cao</li>
              <li>Có thể hưởng ưu đãi từ ví điện tử</li>
              <li>Xác nhận thanh toán tự động</li>
            </ul>
          </article>

          <article className={styles.card}>
            <h2 className={styles.h2}>5. Bảo mật thông tin thanh toán</h2>

            <div className={styles.securityGrid}>
              <div className={styles.securityCard}>
                <div className={styles.securityIcon}>🔒</div>
                <h3 className={styles.securityTitle}>Mã hóa SSL</h3>
                <p>Tất cả giao dịch được mã hóa theo tiêu chuẩn SSL 256-bit</p>
              </div>
              <div className={styles.securityCard}>
                <div className={styles.securityIcon}>🛡️</div>
                <h3 className={styles.securityTitle}>Không lưu trữ thẻ</h3>
                <p>Chúng tôi không lưu trữ thông tin thẻ ngân hàng của khách hàng</p>
              </div>
              <div className={styles.securityCard}>
                <div className={styles.securityIcon}>✓</div>
                <h3 className={styles.securityTitle}>Xác thực 2 lớp</h3>
                <p>Hệ thống xác thực đa yếu tố bảo vệ tài khoản</p>
              </div>
              <div className={styles.securityCard}>
                <div className={styles.securityIcon}>👁️</div>
                <h3 className={styles.securityTitle}>Giám sát 24/7</h3>
                <p>Hệ thống giám sát giao dịch bất thường liên tục</p>
              </div>
            </div>

            <p className={styles.assurance}>FruitStore cam kết bảo mật tuyệt đối thông tin thanh toán và thông tin cá nhân của khách hàng.</p>
          </article>

          <article className={styles.card}>
            <h2 className={styles.h2}>6. Chính sách hoàn tiền</h2>
            <p>Trong trường hợp cần hoàn tiền, FruitStore cam kết xử lý nhanh chóng và minh bạch:</p>

            <h3 className={styles.h3}>Các trường hợp hoàn tiền:</h3>
            <ul className={styles.ul}>
              <li>Sản phẩm không đạt chất lượng</li>
              <li>Giao sai sản phẩm</li>
              <li>Hủy đơn hàng trước khi giao</li>
              <li>Thanh toán thừa</li>
            </ul>

            <div className={styles.timeline}>
              <div className={styles.timelineItem}>
                <div className={styles.step}>1</div>
                <div className={styles.stepContent}>
                  <h4 className={styles.h4}>Yêu cầu hoàn tiền</h4>
                  <p>Liên hệ hotline hoặc email với thông tin đơn hàng</p>
                </div>
              </div>
              <div className={styles.timelineItem}>
                <div className={styles.step}>2</div>
                <div className={styles.stepContent}>
                  <h4 className={styles.h4}>Xác nhận</h4>
                  <p>Nhân viên kiểm tra và xác nhận yêu cầu trong 24h</p>
                </div>
              </div>
              <div className={styles.timelineItem}>
                <div className={styles.step}>3</div>
                <div className={styles.stepContent}>
                  <h4 className={styles.h4}>Hoàn tiền</h4>
                  <p>Xử lý hoàn tiền trong 3-7 ngày làm việc</p>
                </div>
              </div>
            </div>

            <p>
              <strong>Thời gian hoàn tiền:</strong> 3-7 ngày làm việc kể từ khi xác nhận yêu cầu
            </p>
            <p>
              <strong>Hình thức hoàn tiền:</strong> Chuyển khoản ngân hàng hoặc ví điện tử theo yêu cầu
            </p>
          </article>

          <article className={styles.card}>
            <h2 className={styles.h2}>7. Hóa đơn VAT</h2>
            <p>FruitStore cung cấp dịch vụ xuất hóa đơn VAT cho khách hàng có nhu cầu:</p>

            <h3 className={styles.h3}>Yêu cầu xuất hóa đơn:</h3>
            <ul className={styles.ul}>
              <li>Thông báo trước khi đặt hàng hoặc trong vòng 7 ngày kể từ ngày mua</li>
              <li>Cung cấp đầy đủ thông tin: Tên công ty, Mã số thuế, Địa chỉ, Email</li>
              <li>Hóa đơn được gửi qua email hoặc kèm theo đơn hàng</li>
            </ul>

            <div className={styles.invoice}>
              <h4 className={styles.h4}>Thông tin cần cung cấp:</h4>
              <div className={styles.formRow}>
                <span className={styles.formLabel}>• Tên công ty:</span>
                <span className={styles.formPlaceholder}>___________________________</span>
              </div>
              <div className={styles.formRow}>
                <span className={styles.formLabel}>• Mã số thuế:</span>
                <span className={styles.formPlaceholder}>___________________________</span>
              </div>
              <div className={styles.formRow}>
                <span className={styles.formLabel}>• Địa chỉ:</span>
                <span className={styles.formPlaceholder}>___________________________</span>
              </div>
              <div className={styles.formRow}>
                <span className={styles.formLabel}>• Email nhận hóa đơn:</span>
                <span className={styles.formPlaceholder}>___________________________</span>
              </div>
            </div>

            <p className={styles.note}>
              <strong>Lưu ý:</strong> Hóa đơn không thể được xuất lại sau 7 ngày kể từ ngày mua hàng theo quy định của pháp luật.
            </p>
          </article>

          <article className={styles.card}>
            <h2 className={styles.h2}>8. Hỗ trợ thanh toán</h2>
            <p>Nếu bạn gặp bất kỳ vấn đề nào trong quá trình thanh toán, vui lòng liên hệ với chúng tôi:</p>

            <div className={styles.support}>
              <div className={styles.supportItem}>
                <div className={styles.supportIcon}>📞</div>
                <div>
                  <h4 className={styles.h4}>Hotline</h4>
                  <p className={styles.supportValue}>0865 666 666</p>
                  <p className={styles.supportTime}>(7:00 - 22:00 hàng ngày)</p>
                </div>
              </div>

              <div className={styles.supportItem}>
                <div className={styles.supportIcon}>✉️</div>
                <div>
                  <h4 className={styles.h4}>Email</h4>
                  <p className={styles.supportValue}>info@FruitStore.com.vn</p>
                  <p className={styles.supportTime}>(Phản hồi trong 24h)</p>
                </div>
              </div>

              <div className={styles.supportItem}>
                <div className={styles.supportIcon}>💬</div>
                <div>
                  <h4 className={styles.h4}>Chat trực tuyến</h4>
                  <p className={styles.supportValue}>Website FruitStore.com.vn</p>
                  <p className={styles.supportTime}>(8:00 - 21:00)</p>
                </div>
              </div>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
};

export default PaymentPolicy;
