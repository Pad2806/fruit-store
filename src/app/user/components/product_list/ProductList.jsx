import ProductCard from "../product_card/ProductCard";
import "./ProductList.css";

function ProductList({ products }) {
  return (
    <div className="product-grid">
      {products.map((item) => (
        <ProductCard key={item.id} product={item} />
      ))}
    </div>
  );
}

export default ProductList;
