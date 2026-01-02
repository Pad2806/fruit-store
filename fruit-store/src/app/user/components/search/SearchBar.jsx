import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { products } from "../../data/products";
import "./SearchBar.css";

function SearchBar() {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const boxRef = useRef(null);

  // Filter realtime
  useEffect(() => {
    if (keyword.trim() === "") {
      setResults([]);
      return;
    }

    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(keyword.toLowerCase())
    );

    setResults(filtered);
  }, [keyword]);

  // Click ngoài → đóng
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="search-wrapper" ref={boxRef}>
      <input
        className="search-input"
        placeholder="Tìm kiếm sản phẩm..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />

      {results.length > 0 && (
        <div className="search-dropdown">
          {results.slice(0, 5).map((item) => (
            <Link
              to={`/products/${item.id}`}
              key={item.id}
              className="search-item"
              onClick={() => setResults([])}
            >
              <img src={item.image} alt={item.name} />
              <div>
                <p className="name">{item.name}</p>
                <p className="price">{item.price}</p>
              </div>
            </Link>
          ))}

          {results.length > 5 && (
            <div className="search-more">
              Xem thêm {results.length - 5} sản phẩm
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
