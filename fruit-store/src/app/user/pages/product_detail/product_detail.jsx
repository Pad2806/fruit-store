import { useParams, Link } from "react-router-dom";
import { products } from "../../data/products";
import "./product_detail.css";

function ProductDetail() {
  const { id } = useParams();
  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <p style={{ textAlign: "center" }}>
        Sản phẩm không tồn tại. <Link to="/products">Quay lại</Link>
      </p>
    );
  }

  return (
    <section className="product-detail">
      <div className="product-detail-image">
        <img src={product.image} alt={product.name} />
      </div>

      <div className="product-detail-info">
        <h1>{product.name}</h1>
        <p className="price">{product.price}</p>
        <p className="desc">{product.description}</p>

        <button className="buy-btn">CHỌN MUA</button>
      </div>
    </section>
  );
}

export default ProductDetail;
