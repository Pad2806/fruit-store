import React from "react";
import styles from "./purchase_policy.module.scss";

const PurchasePolicy = () => {
    return (
        <div className={styles.page}>
            <main className={styles.content}>
                <section className={styles.section}>
                    <h1 className={styles.pageTitle}>Chính sách mua hàng</h1>

                    <article className={styles.card}>
                        <h2 className={styles.h2}>1. Quy trình đặt hàng</h2>
                        <p>
                            Khách hàng có thể đặt hàng trực tuyến qua website hoặc gọi điện đến hotline của chúng tôi. Sau khi nhận đơn hàng,
                            nhân viên sẽ liên hệ xác nhận trong vòng 30 phút.
                        </p>
                        <p>Các bước đặt hàng online:</p>
                        <ul className={styles.ul}>
                            <li>Chọn sản phẩm và thêm vào giỏ hàng</li>
                            <li>Điền thông tin giao hàng</li>
                            <li>Chọn phương thức thanh toán</li>
                            <li>Xác nhận đơn hàng</li>
                            <li>Nhận cuộc gọi xác nhận từ nhân viên</li>
                        </ul>
                    </article>

                    <article className={styles.card}>
                        <h2 className={styles.h2}>2. Thời gian giao hàng</h2>
                        <p>
                            <strong>Nội thành TP. Đà Nẵng:</strong> Giao hàng trong vòng 2-4 giờ kể từ khi xác nhận đơn hàng.
                        </p>
                        <p>
                            Thời gian giao hàng có thể thay đổi tùy theo điều kiện thời tiết và lưu lượng giao thông. Chúng tôi sẽ liên hệ thông
                            báo nếu có sự thay đổi.
                        </p>
                    </article>

                    <article className={styles.card}>
                        <h2 className={styles.h2}>3. Phí vận chuyển</h2>

                        <div className={styles.table}>
                            <div className={`${styles.tableRow} ${styles.tableHeader}`}>
                                <div className={styles.cell}>Khu vực</div>
                                <div className={styles.cell}>Điều kiện</div>
                                <div className={styles.cell}>Phí ship</div>
                            </div>

                            <div className={styles.tableRow}>
                                <div className={styles.cell}>Nội thành TP. Đà Nẵng</div>
                                <div className={styles.cell}>mọi đơn hàng</div>
                                <div className={styles.cell}>25.000đ</div>
                            </div>

                        </div>
                    </article>

                    <article className={styles.card}>
                        <h2 className={styles.h2}>4. Chính sách đổi trả</h2>
                        <p>
                            FruitStore cam kết mang đến sản phẩm chất lượng tốt nhất. Trong trường hợp sản phẩm có vấn đề, chúng tôi hỗ trợ đổi trả
                            theo các điều kiện sau:
                        </p>

                        <h3 className={styles.h3}>Điều kiện đổi trả:</h3>
                        <ul className={styles.ul}>
                            <li>Sản phẩm bị hư hỏng, không đảm bảo chất lượng khi nhận hàng</li>
                            <li>Sản phẩm không đúng với đơn hàng đã đặt</li>
                            <li>Thời gian đổi trả: trong vòng 24 giờ kể từ khi nhận hàng</li>
                            <li>Giữ nguyên bao bì và chụp ảnh sản phẩm lỗi</li>
                        </ul>

                        <h3 className={styles.h3}>Quy trình đổi trả:</h3>
                        <ul className={styles.ul}>
                            <li>Liên hệ hotline: 0865 666 666 hoặc email: info@FruitStore.com.vn</li>
                            <li>Gửi ảnh chụp sản phẩm và mô tả vấn đề</li>
                            <li>Nhân viên xác nhận và hẹn lịch đổi hàng</li>
                            <li>Nhận sản phẩm mới hoặc hoàn tiền 100%</li>
                        </ul>

                        <p className={styles.highlight}>FruitStore cam kết hoàn tiền 100% nếu sản phẩm không đạt chất lượng.</p>
                    </article>

                    <article className={styles.card}>
                        <h2 className={styles.h2}>5. Cam kết chất lượng</h2>

                        <div className={styles.grid}>
                            <div className={styles.gridCard}>
                                <div className={styles.icon}>🍎</div>
                                <h3 className={styles.h3Accent}>Tươi ngon</h3>
                                <p>Tất cả trái cây đều được tuyển chọn kỹ lưỡng, đảm bảo độ tươi ngon cao nhất</p>
                            </div>

                            <div className={styles.gridCard}>
                                <div className={styles.icon}>📋</div>
                                <h3 className={styles.h3Accent}>Nguồn gốc rõ ràng</h3>
                                <p>Có chứng nhận an toàn thực phẩm và nguồn gốc xuất xứ minh bạch</p>
                            </div>

                            <div className={styles.gridCard}>
                                <div className={styles.icon}>❄️</div>
                                <h3 className={styles.h3Accent}>Bảo quản đúng cách</h3>
                                <p>Hệ thống kho lạnh hiện đại, bảo quản tối ưu từ kho đến tay khách hàng</p>
                            </div>

                            <div className={styles.gridCard}>
                                <div className={styles.icon}>✓</div>
                                <h3 className={styles.h3Accent}>Kiểm tra kỹ lưỡng</h3>
                                <p>Mỗi đơn hàng đều được kiểm tra chất lượng trước khi giao</p>
                            </div>
                        </div>
                    </article>

                    <article className={styles.card}>
                        <h2 className={styles.h2}>6. Hủy đơn hàng</h2>
                        <p>Khách hàng có thể hủy đơn hàng miễn phí trước khi đơn hàng được giao cho đơn vị vận chuyển.</p>
                        <p>
                            <strong>Cách hủy đơn hàng:</strong>
                        </p>
                        <ul className={styles.ul}>
                            <li>Gọi hotline: 0865 666 666</li>
                            <li>Email: info@FruitStore.com.vn với tiêu đề "Hủy đơn hàng + Mã đơn"</li>
                            <li>Nhắn tin qua fanpage Facebook</li>
                        </ul>
                        <p>
                            <strong>Lưu ý:</strong> Sau khi hàng đã xuất kho và đang trên đường giao, việc hủy đơn có thể phát sinh chi phí vận
                            chuyển. Vui lòng liên hệ hotline để được hỗ trợ cụ thể.
                        </p>
                    </article>

                    <article className={styles.card}>
                        <h2 className={styles.h2}>7. Chăm sóc khách hàng</h2>
                        <p>Đội ngũ chăm sóc khách hàng của FruitStore luôn sẵn sàng hỗ trợ bạn:</p>

                        <div className={styles.contact}>
                            <div className={styles.contactRow}>
                                <strong>📞 Hotline:</strong>
                                <span>0865 666 666 (7:00 - 22:00 hàng ngày)</span>
                            </div>

                            <div className={styles.contactRow}>
                                <strong>✉️ Email:</strong>
                                <span>info@FruitStore.com.vn</span>
                            </div>

                            <div className={styles.contactRow}>
                                <strong>🏢 Chi nhánh 1:</strong>
                                <span>183 Nguyễn Thái Học, P. Bến Thành</span>
                            </div>

                            <div className={styles.contactRow}>
                                <strong>🏢 Chi nhánh 2:</strong>
                                <span>42B Trần Huy Liệu, P. Phú Nhuận</span>
                            </div>
                        </div>
                    </article>
                </section>
            </main>
        </div>
    );
};

export default PurchasePolicy;
