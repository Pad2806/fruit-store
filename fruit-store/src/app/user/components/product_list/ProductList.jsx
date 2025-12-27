import { useState } from "react";
import ProductCard from "../product_card/ProductCard";
import "./ProductList.css";

function ProductList({ products }) {
  const PAGE_SIZE = 6;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const visibleProducts = products.slice(0, visibleCount);

  return (
    <section className="product-list">
      {/* Header */}
      <div className="product-list-header">
        <h2>Trái ngon hôm nay</h2>

        <select className="sort-select">
          <option>Sắp xếp</option>
          <option>Giá tăng dần</option>
          <option>Giá giảm dần</option>
          <option>Tên A-Z</option>
          <option>Tên Z-A</option>
        </select>
      </div>

      {/* Grid */}
      <div className="product-grid">
        {visibleProducts.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>

      {/* Load more */}
      {visibleCount < products.length && (
        <div className="load-more">
          <button onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}>
            Xem thêm sản phẩm trái ngon hôm nay
          </button>
        </div>
      )}
    </section>
  );
}

export default ProductList;
