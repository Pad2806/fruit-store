import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import BannerSlider from "../../components/banner/BannerSlider";
import ProductList from "../../components/product_list/ProductList";
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

const API_URL = "http://127.0.0.1:8000/api/products";

const formatPrice = (value) => {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  const n = Number(value);
  if (Number.isNaN(n)) return String(value);
  return n.toLocaleString("vi-VN") + "đ";
};

const normalizeProducts = (payload) => {
  const list = Array.isArray(payload) ? payload : payload?.data || payload?.products || [];
  return (list || []).map((p, idx) => ({
    id: p?.id ?? p?._id ?? idx,
    name: p?.name ?? p?.title ?? "",
    price: formatPrice(p?.price ?? p?.unit_price ?? p?.sale_price),
    image: p?.image ?? p?.image_url ?? p?.thumbnail ?? p?.cover ?? "",
  }));
};

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(API_URL, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        setProducts(normalizeProducts(data));
      } catch (e) {
        if (e?.name !== "AbortError") setError(e?.message || "Fetch failed");
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, []);

  const top5 = useMemo(() => products.slice(0, 5), [products]);

  return (
    <>
      <BannerSlider banners={homeBanners} />

      <section className={styles.homeProducts}>
        <Link to="/products" className={styles.homeProductsTitle}>
          Trái ngon hôm nay
        </Link>

        {loading && <div>Đang tải sản phẩm...</div>}
        {!loading && error && <div>{error}</div>}
        {!loading && !error && <ProductList products={top5} />}

        <div className={styles.homeProductsMore}>
          <Link to="/products">Xem thêm sản phẩm trái ngon hôm nay</Link>
        </div>
      </section>
    </>
  );
}

export default Home;
