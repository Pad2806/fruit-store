import { Link } from "react-router-dom";
import BannerSlider from "../../components/banner/BannerSlider";
import ProductList from "../../components/product_list/ProductList";
import { products } from "../../data/products";
import styles from "./home.module.scss";

import banner1 from "../../assets/banner1.png";
import banner2 from "../../assets/banner2.png";
import banner3 from "../../assets/banner3.png";
import banner4 from "../../assets/banner4.png";

const homeBanners = [
  { image: banner1, link: "/products" },
  { image: banner2, link: "/products" },
  { image: banner3, link: "/products" },
  { image: banner4, link: "/products" },
];


function Home() {
  return (
    <>
      <BannerSlider banners={homeBanners} />

      <section className={styles.homeProducts}>
        <Link to="/products" className={styles.homeProductsTitle}>
          Trái ngon hôm nay
        </Link>

        <ProductList products={products.slice(0, 5)} />

        <div className={styles.homeProductsMore}>
          <Link to="/products">Xem thêm sản phẩm trái ngon hôm nay</Link>
        </div>
      </section>
    </>
  );
}

export default Home;
