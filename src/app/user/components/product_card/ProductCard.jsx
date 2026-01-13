import { Link } from "react-router-dom";
import "./ProductCard.css";
import { useCart } from "../../context/CartContext";

const toImageUrl = (img) => {
  if (!img) return "https://placehold.co/300";
  if (img.startsWith("http")) return img;

  // Clean up if it starts with /storage/ or storage/
  let cleanPath = img.replace(/^\/?storage\//, "");

  // If cleanPath doesn't start with products/, assume it's directly under storage (though our backend returns products/xxx)
  // But wait, our backend returns "products/xxx.png".
  // So we just need to append it to storage/

  return `http://127.0.0.1:8000/storage/${cleanPath}`;
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
