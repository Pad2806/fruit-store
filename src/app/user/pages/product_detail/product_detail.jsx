import { useParams, Link, Navigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import ProductCard from "../../components/product_card/ProductCard";
import { useCart } from "../../context/CartContext";
import { FaCheckCircle, FaTruck, FaPhoneAlt } from "react-icons/fa";
import styles from "./product_detail.module.scss";

const API_BASE = "http://127.0.0.1:8000/api/products";

const formatPrice = (value) => {
  if (value === null || value === undefined) return "";
  const n = Number(value);
  if (Number.isNaN(n)) return String(value);
  return n.toLocaleString("vi-VN") + "đ";
};

function ProductDetail() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();

  const images = useMemo(() => {
    if (!product) return [];
    const subs = Array.isArray(product.sub_images) ? product.sub_images : [];
    const main = product.main_image ? [product.main_image] : [];
    return [...main, ...subs].filter(Boolean);
  }, [product]);

  const [activeIndex, setActiveIndex] = useState(0);
  const activeImg = images[activeIndex] || "";

  const prevImage = () => setActiveIndex((p) => (p === 0 ? images.length - 1 : p - 1));
  const nextImage = () => setActiveIndex((p) => (p === images.length - 1 ? 0 : p + 1));

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setNotFound(false);
        setProduct(null);
        setActiveIndex(0);

        const res = await fetch(`${API_BASE}/${id}`, {
          method: "GET",
          headers: { Accept: "application/json" },
          signal: controller.signal,
        });

        if (res.status === 404) {
          setNotFound(true);
          return;
        }

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        const normalized = {
          id: data.id,
          name: data.name,
          price: formatPrice(data.price),
          main_image: data.main_image,
          sub_images: data.sub_images || [],
          short_desc: data.short_desc,
          detail_desc: data.detail_desc,
          unit: data.unit,
          in_stock: data.in_stock,
        };

        setProduct(normalized);
      } catch (e) {
        if (e?.name !== "AbortError") setNotFound(true);
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [id]);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [images.length]);

  if (notFound) return <Navigate to="/404" replace />;

  return (
    <>
      {loading && <div style={{ padding: 24 }}>Đang tải sản phẩm...</div>}

      {!loading && product && (
        <>
          <section className={styles.productDetail}>
            <div className={styles.productDetailImage}>
              <div className={styles.imageWrapper}>
                <img src={activeImg} alt={product.name} />

                {images.length > 1 && (
                  <>
                    <button className={`${styles.navBtn} ${styles.prev}`} onClick={prevImage}>
                      ‹
                    </button>
                    <button className={`${styles.navBtn} ${styles.next}`} onClick={nextImage}>
                      ›
                    </button>
                  </>
                )}
              </div>

              {images.length > 1 && (
                <div className={styles.thumbList}>
                  {images.map((img, index) => (
                    <img
                      key={img}
                      src={img}
                      className={index === activeIndex ? styles.activeThumb : ""}
                      onClick={() => setActiveIndex(index)}
                      alt=""
                    />
                  ))}
                </div>
              )}
            </div>

            <div className={styles.productDetailInfo}>
              <h1 className={styles.title}>{product.name}</h1>

              <div className={styles.meta}>
                <span>
                  Mã sản phẩm: <b>{product.id}</b>
                </span>
                <span className={styles.status}>{product.in_stock ? "Còn hàng" : "Hết hàng"}</span>
              </div>

              <div className={styles.price}>{product.price}</div>

              <div className={styles.quantityRow}>
                <div className={styles.quantity}>
                  <button onClick={() => qty > 1 && setQty(qty - 1)}>-</button>
                  <span>{qty}</span>
                  <button onClick={() => setQty(qty + 1)}>+</button>
                </div>

                <span className={styles.unit}>{product.unit || "đơn vị"}</span>
              </div>

              <button
                className={styles.addCart}
                disabled={!product.in_stock}
                onClick={() => addToCart(product, qty)}
              >
                THÊM VÀO GIỎ HÀNG
              </button>

              {product.short_desc && (
                <div className={styles.shortDescBox}>
                  <h4 className={styles.shortDescTitle}>Điểm nổi bật</h4>
                  <p className={styles.shortDesc}>{product.short_desc}</p>
                </div>
              )}
            </div>
          </section>

          <section className={styles.productExtra}>
            <div className={styles.productDesc}>
              <h3>Thông tin sản phẩm</h3>
              <p>{product.detail_desc || "Chưa có mô tả cho sản phẩm này."}</p>
            </div>

            <div className={styles.deliveryBox}>
              <h3>Dịch vụ giao hàng</h3>
              <ul>
                <li>
                  <FaCheckCircle /> Cam kết 100% chính hãng
                </li>
                <li>
                  <FaTruck /> Giao hàng dự kiến: Thứ 2 - Chủ nhật (8h00 - 21h00)
                </li>
                <li>
                  <FaPhoneAlt /> Hỗ trợ 24/7 qua Facebook, Zalo & Hotline
                </li>
              </ul>
            </div>
          </section>
        </>
      )}
    </>
  );
}

export default ProductDetail;
