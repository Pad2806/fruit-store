import { Link } from "react-router-dom";
import BannerSlider from "../../components/banner/BannerSlider";
import ProductList from "../../components/product_list/ProductList";
import styles from "./home.module.scss";

import banner1 from "../../assets/banner1.png";
import banner2 from "../../assets/banner2.png";
import banner3 from "../../assets/banner3.png";
import banner4 from "../../assets/banner4.png";

import img1 from "../../assets/1.png";
import img2 from "../../assets/2.png";
import img3 from "../../assets/3.png";
import img4 from "../../assets/4.png";
import img5 from "../../assets/5.png";
import img6 from "../../assets/6.png";

const homeBanners = [
  { image: banner1, link: "/products" },
  { image: banner2, link: "/products" },
  { image: banner3, link: "/products" },
  { image: banner4, link: "/products" },
];

const products = [
  { id: 1, name: "Dưa xiêm gọt trọc", price: "19.000đ", image: img1 },
  { id: 2, name: "Cherry đỏ Mỹ", price: "195.000đ", image: img2 },
  { id: 3, name: "Bưởi da xanh", price: "90.000đ", image: img3 },
  { id: 4, name: "Ổi Ruby", price: "65.000đ", image: img4 },
  { id: 5, name: "Me Thái Lan loại 1", price: "99.000đ", image: img5 },
  { id: 6, name: "Cam vàng Úc", price: "129.000đ", image: img6 },
  { id: 7, name: "Xoài cát chu da vàng", price: "125.000đ", image: img1 },
  { id: 8, name: "Vú sữa tím", price: "155.000đ", image: img2 },
];

function Home() {
  return (
    <>
      <BannerSlider banners={homeBanners} />

      <section className={styles.homeProducts}>
        <Link to="/products" className={styles.homeProductsTitle}>
          Trái ngon hôm nay
        </Link>

        <ProductList products={products.slice(0, 6)} />

        <div className={styles.homeProductsMore}>
          <Link to="/products">Xem thêm sản phẩm trái ngon hôm nay</Link>
        </div>
      </section>
    </>
  );
}

export default Home;
