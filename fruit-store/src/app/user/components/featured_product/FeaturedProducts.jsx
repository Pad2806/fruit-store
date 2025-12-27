import { Link } from "react-router-dom";
import ProductCard from "../product_card/ProductCard";
import "./FeaturedProducts.css";

import img1 from "../../assets/1.png";
import img2 from "../../assets/2.png";
import img3 from "../../assets/3.png";
import img4 from "../../assets/4.png";
import img5 from "../../assets/5.png";
import img6 from "../../assets/6.png";

function FeaturedProducts() {
  const products = [
    { id: 1, name: "Dưa xiêm gọt trọc", price: "19.000đ", image: img1 },
    { id: 2, name: "Cherry đỏ Mỹ", price: "195.000đ", image: img2 },
    { id: 3, name: "Bưởi da xanh", price: "90.000đ", image: img3 },
    { id: 4, name: "Ổi Ruby", price: "65.000đ", image: img4 },
    { id: 5, name: "Me Thái Lan loại 1", price: "99.000đ", image: img5 },
    { id: 6, name: "Cam vàng Úc", price: "129.000đ", image: img6 },

    { id: 7, name: "Xoài cát chu da vàng", price: "125.000đ", image: img1 },
    { id: 8, name: "Vú sữa tím", price: "155.000đ", image: img2 },
    { id: 9, name: "Táo Envy Mỹ", price: "195.000đ", image: img3 },
    { id: 10, name: "Dưa lưới Hoàng Kim", price: "115.000đ", image: img4 },
    { id: 11, name: "Cherry đỏ Úc", price: "740.000đ", image: img5 },
    { id: 12, name: "Măng cụt Thái", price: "89.000đ", image: img6 },
  ];

  return (
    <section className="featured">
      <Link to="/products" className="featured-title">
        Trái ngon hôm nay
      </Link>

      <div className="featured-grid">
        {products.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
      <div className="featured-more">
        <Link to="/products" className="featured-more-link">
          Xem thêm sản phẩm trái ngon hôm nay
        </Link>
      </div>
    </section>
  );
}

export default FeaturedProducts;
