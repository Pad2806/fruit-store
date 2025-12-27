import { useCart } from "../../context/CartContext";
import "./ProductCard.css";

function ProductCard({ product }) {
  const { addToCart } = useCart();
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />

      <h3 className="product-name">{product.name}</h3>
      <p className="product-price">{product.price}</p>

      <button className="buy-btn" onClick={addToCart}> CHỌN MUA</button>
    </div>
  );
}

export default ProductCard;
