import { Link } from "react-router-dom";
import "./ProductCard.css";
import { useCart } from "../../context/CartContext";

const toImageUrl = (img) => {
  if (!img) return "/no-image.png";
  if (img.startsWith("http://") || img.startsWith("https://")) return img;
  if (img.startsWith("/storage/")) return `http://127.0.0.1:8000${img}`;
  return `http://127.0.0.1:8000/storage/products/${img}`;
};

function ProductCard({ product }) {
  const { addToCart } = useCart();

  const firstImg = Array.isArray(product.images) ? product.images[0] : product.images;
  const imgSrc = toImageUrl(firstImg);

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="product-link">
        <img src={imgSrc} alt={product.name} />
        <h3 className="product-name">{product.name}</h3>
      </Link>

      <p className="product-price">{product.price}</p>

      <button className="buy-btn" onClick={() => addToCart(product)}>
        CHỌN MUA
      </button>
    </div>
  );
}

export default ProductCard;
