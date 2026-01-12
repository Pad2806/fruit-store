import { useEffect, useMemo, useState } from "react";
import BannerSlider from "../../components/banner/BannerSlider";
import ProductList from "../../components/product_list/ProductList";
import styles from "./products.module.scss";

import banner1 from "../../assets/banner3.png";
import banner2 from "../../assets/banner2.png";
import banner3 from "../../assets/banner4.png";

const productBanners = [
  { image: banner1, link: "/products" },
  { image: banner2, link: "/products" },
  { image: banner3, link: "/products" },
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

const parsePriceNumber = (priceText) => {
  if (!priceText) return 0;
  if (typeof priceText === "number") return priceText;
  const digits = String(priceText).replace(/[^\d]/g, "");
  return Number(digits || 0);
};

function Products() {
  const PAGE_SIZE = 5;

  const [allProducts, setAllProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const [sortKey, setSortKey] = useState("default");
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
        setAllProducts(normalizeProducts(data));
      } catch (e) {
        if (e?.name !== "AbortError") setError(e?.message || "Fetch failed");
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [sortKey]);

  const sortedProducts = useMemo(() => {
    const arr = [...allProducts];

    switch (sortKey) {
      case "price_asc":
        return arr.sort((a, b) => parsePriceNumber(a.price) - parsePriceNumber(b.price));
      case "price_desc":
        return arr.sort((a, b) => parsePriceNumber(b.price) - parsePriceNumber(a.price));
      case "name_asc":
        return arr.sort((a, b) => String(a.name).localeCompare(String(b.name), "vi"));
      case "name_desc":
        return arr.sort((a, b) => String(b.name).localeCompare(String(a.name), "vi"));
      default:
        return arr;
    }
  }, [allProducts, sortKey]);

  const visibleProducts = useMemo(
    () => sortedProducts.slice(0, visibleCount),
    [sortedProducts, visibleCount]
  );

  return (
    <>
      <BannerSlider banners={productBanners} />

      <section className={styles.productsPage}>
        <div className={styles.productsHeader}>
          <h2>Trái cây ngon hôm nay</h2>

          <select
            className={styles.sortSelect}
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
          >
            <option value="default">Sắp xếp</option>
            <option value="price_asc">Giá tăng dần</option>
            <option value="price_desc">Giá giảm dần</option>
            <option value="name_asc">Tên A-Z</option>
            <option value="name_desc">Tên Z-A</option>
          </select>
        </div>

        {loading && <div>Đang tải sản phẩm...</div>}
        {!loading && error && <div>{error}</div>}
        {!loading && !error && <ProductList products={visibleProducts} />}

        {!loading && !error && visibleCount < sortedProducts.length && (
          <div className={styles.loadMore}>
            <button onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}>
              Xem thêm <strong>trái cây ngon hôm nay</strong>
            </button>
          </div>
        )}
      </section>
    </>
  );
}

export default Products;
