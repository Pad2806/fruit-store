import { useParams, Link, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { products } from "../../data/products";
import ProductCard from "../../components/product_card/ProductCard";
import { useCart } from "../../context/CartContext";
import { FaCheckCircle, FaTruck, FaPhoneAlt } from "react-icons/fa";
import styles from "./product_detail.module.scss";

function ProductDetail() {
  const { id } = useParams();
  const product = products.find(p => p.id === id);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  if (!product) {
    return <Navigate to="/404" replace />;
  }

  return (
    <>
      <section className={styles.productDetail}>
        <div className={styles.productDetailImage}>
          <img src={product.image} alt={product.name} />
        </div>

        <div className={styles.productDetailInfo}>
          <h1 className={styles.title}>{product.name}</h1>

          <div className={styles.meta}>
            <span>
              Mã sản phẩm: <b>{product.code || "2010302"}</b>
            </span>
            <span className={styles.status}>Còn hàng</span>
          </div>

          <div className={styles.price}>{product.price}</div>

          <div className={styles.quantity}>
            <button onClick={() => qty > 1 && setQty(qty - 1)}>-</button>
            <span>{qty}</span>
            <button onClick={() => setQty(qty + 1)}>+</button>
          </div>

          <button
            className={styles.addCart}
            onClick={() => {
              for (let i = 0; i < qty; i++) addToCart();
            }}
          >
            THÊM VÀO GIỎ HÀNG
          </button>
        </div>
      </section>

      <section className={styles.productExtra}>
        <div className={styles.productDesc}>
          <h3>Thông tin sản phẩm</h3>
          <p>{product.description || "Chưa có mô tả cho sản phẩm này."}</p>
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

      <section className={styles.relatedProducts}>
        <h2>Sản phẩm liên quan</h2>

        <div className={styles.relatedGrid}>
          {products
            .filter(p => p.id !== product.id)
            .slice(0, 5)
            .map(item => (
              <ProductCard key={item.id} product={item} />
            ))}
        </div>
      </section>
    </>
  );
}

export default ProductDetail;
