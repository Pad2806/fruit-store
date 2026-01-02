// import "./about.css";

// function About() {
//   return (
//     <div className="about-page">
//       <section className="about-hero">
//         <h1>Câu chuyện FruitStore</h1>
//         <p>
//           FruitStore được tạo ra với mong muốn mang đến cho khách hàng
//           những loại trái cây tươi ngon, an toàn và chất lượng nhất.
//         </p>
//       </section>

//       <section className="about-section">
//         <h2>Câu chuyện thương hiệu</h2>
//         <p>
//           FruitStore là thương hiệu trái cây tươi chất lượng cao,
//           chuyên cung cấp trái cây nội địa và nhập khẩu được tuyển chọn kỹ lưỡng
//           từ các vùng trồng uy tín trong và ngoài nước.
//         </p>
//         <p>
//           Chúng tôi tin rằng mỗi bữa ăn là một trải nghiệm,
//           và trái cây không chỉ là thực phẩm mà còn là nguồn năng lượng tích cực
//           cho sức khỏe và tinh thần.
//         </p>
//       </section>

//       <section className="about-section highlight">
//         <div className="about-grid">
//           <div>
//             <h3>Sứ mệnh</h3>
//             <p>
//               Mang trái cây sạch – tươi – ngon đến mọi gia đình Việt,
//               góp phần nâng cao chất lượng cuộc sống mỗi ngày.
//             </p>
//           </div>

//           <div>
//             <h3>Tầm nhìn</h3>
//             <p>
//               Trở thành thương hiệu trái cây được khách hàng tin tưởng hàng đầu
//               tại Việt Nam trong lĩnh vực trái cây tươi và quà tặng doanh nghiệp.
//             </p>
//           </div>

//           <div>
//             <h3>Giá trị cốt lõi</h3>
//             <ul>
//               <li>✔ Chất lượng đặt lên hàng đầu</li>
//               <li>✔ Minh bạch nguồn gốc</li>
//               <li>✔ Phục vụ tận tâm</li>
//               <li>✔ Lấy khách hàng làm trung tâm</li>
//             </ul>
//           </div>
//         </div>
//       </section>

//       <section className="about-section">
//         <h2>Cam kết của FruitStore</h2>
//         <div className="about-commit">
//           <div>🍎 Trái cây tươi mới mỗi ngày</div>
//           <div>📦 Đóng gói cẩn thận – giao nhanh</div>
//           <div>🛡️ Nguồn gốc rõ ràng – an toàn</div>
//           <div>💬 Hỗ trợ khách hàng 24/7</div>
//         </div>
//       </section>

//     </div>
//   );
// }

// export default About;


import "./about.css";
import {
  FaCheckCircle,
  FaAppleAlt,
  FaBoxOpen,
  FaShieldAlt,
  FaComments,
} from "react-icons/fa";

function About() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <h1>Câu chuyện FruitStore</h1>
        <p>
          FruitStore được tạo ra với mong muốn mang đến cho khách hàng
          những loại trái cây tươi ngon, an toàn và chất lượng nhất.
        </p>
      </section>

      <section className="about-section">
        <h2>Câu chuyện thương hiệu</h2>
        <p>
          FruitStore là thương hiệu trái cây tươi chất lượng cao,
          chuyên cung cấp trái cây nội địa và nhập khẩu được tuyển chọn kỹ lưỡng
          từ các vùng trồng uy tín trong và ngoài nước.
        </p>
        <p>
          Chúng tôi tin rằng mỗi bữa ăn là một trải nghiệm,
          và trái cây không chỉ là thực phẩm mà còn là nguồn năng lượng tích cực
          cho sức khỏe và tinh thần.
        </p>
      </section>

      <section className="about-section highlight">
        <div className="about-grid">
          <div>
            <h3>Sứ mệnh</h3>
            <p>
              Mang trái cây sạch – tươi – ngon đến mọi gia đình Việt,
              góp phần nâng cao chất lượng cuộc sống mỗi ngày.
            </p>
          </div>

          <div>
            <h3>Tầm nhìn</h3>
            <p>
              Trở thành thương hiệu trái cây được khách hàng tin tưởng hàng đầu
              tại Việt Nam trong lĩnh vực trái cây tươi và quà tặng doanh nghiệp.
            </p>
          </div>

          <div>
            <h3>Giá trị cốt lõi</h3>
            <ul className="about-values">
              <li>
                <FaCheckCircle /> Chất lượng đặt lên hàng đầu
              </li>
              <li>
                <FaCheckCircle /> Minh bạch nguồn gốc
              </li>
              <li>
                <FaCheckCircle /> Phục vụ tận tâm
              </li>
              <li>
                <FaCheckCircle /> Lấy khách hàng làm trung tâm
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="about-section">
        <h2>Cam kết của FruitStore</h2>
        <div className="about-commit">
          <div>
            <FaAppleAlt style={{color: "#f47c4b"}}/> Trái cây tươi mới mỗi ngày
          </div>
          <div>
            <FaBoxOpen style={{color: "#f47c4b"}}/> Đóng gói cẩn thận – giao nhanh
          </div>
          <div>
            <FaShieldAlt style={{color: "#f47c4b"}} /> Nguồn gốc rõ ràng – an toàn
          </div>
          <div>
            <FaComments style={{color: "#f47c4b"}} /> Hỗ trợ khách hàng 24/7
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
