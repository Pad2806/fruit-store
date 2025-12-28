import { Link } from "react-router-dom";
import "./ProductCard.css";
import { useCart } from "../../context/CartContext";

function ProductCard({ product }) {
  const { addToCart } = useCart(); 

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="product-link">
        <img src={product.image} alt={product.name} />
        <h3 className="product-name">{product.name}</h3>
      </Link>

      <p className="product-price">{product.price}</p>

      <button className="buy-btn" 
      onClick={addToCart} 
      >
        CHỌN MUA</button>
    </div>
  );
}

export default ProductCard;
