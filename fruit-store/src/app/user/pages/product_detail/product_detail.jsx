import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { products } from "../../data/products";
import "./product_detail.css";
import ProductCard from "../../components/product_card/ProductCard";
import { useCart } from "../../context/CartContext";

function ProductDetail() {
  const { id } = useParams();
  const product = products.find(p => p.id === id);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
  }, [id]);

  if (!product) {
    return (
      <p style={{ textAlign: "center" }}>
        Sản phẩm không tồn tại. <Link to="/products">Quay lại</Link>
      </p>
    );
  }

  return (
    <>
      <section className="product-detail">
        <div className="product-detail-image">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="product-detail-info">
          <h1 className="title">{product.name}</h1>

          <div className="meta">
            <span>Mã sản phẩm: <b>{product.code || "2010302"}</b></span>
            <span className="status">Còn hàng</span>
          </div>

          <div className="voucher">
            <span>FREESHIP40K</span>
            <span>FREESHIPMF</span>
          </div>

          <div className="price">{product.price}</div>

          <div className="quantity">
            <button onClick={() => qty > 1 && setQty(qty - 1)}>-</button>
            <span>{qty}</span>
            <button onClick={() => setQty(qty + 1)}>+</button>
          </div>

          <button 
            className="add-cart"
            onClick={() => {
              for (let i = 0; i < qty; i++) addToCart();
            }}
          >THÊM VÀO GIỎ</button>
        </div>
      </section>


      <section className="product-extra">
        <div className="product-desc">
          <h3>Thông tin sản phẩm</h3>
          <p>
            {product.description || "Chưa có mô tả cho sản phẩm này."}
          </p>
        </div>

        <div className="delivery-box">
          <h3>Dịch vụ giao hàng</h3>

          <ul>
            <li>✔ Cam kết 100% chính hãng</li>
            <li>🚚 Giao hàng dự kiến: Thứ 2 - Chủ nhật (8h00 - 21h00)</li>
            <li>📞 Hỗ trợ 24/7 qua Facebook, Zalo & Hotline</li>
          </ul>
        </div>
      </section>,

      <section className="related-products">
        <h2>Sản phẩm liên quan</h2>

        <div className="related-grid">
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
