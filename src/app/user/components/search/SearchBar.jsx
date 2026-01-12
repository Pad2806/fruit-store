import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./SearchBar.css";

const API_URL = "http://127.0.0.1:8000/api/search/suggestions";

const normalizeResults = (payload) => {
  const list = Array.isArray(payload) ? payload : payload?.data || [];
  return (list || []).map((p, idx) => ({
    id: p?.id ?? idx,
    name: p?.name ?? "",
    price: p?.price ?? "",
    image: p?.image ?? "",
  }));
};

function SearchBar() {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const boxRef = useRef(null);

  useEffect(() => {
    const k = keyword.trim();
    if (!k) {
      setResults([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const t = setTimeout(async () => {
      try {
        setLoading(true);

        const url = `${API_URL}?keyword=${encodeURIComponent(k)}`;
        const res = await fetch(url, {
          method: "GET",
          headers: { Accept: "application/json" },
          signal: controller.signal,
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setResults(normalizeResults(data));
      } catch (e) {
        if (e?.name !== "AbortError") setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [keyword]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setResults([]);
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

      {(loading || results.length > 0) && (
        <div className="search-dropdown">
          {loading && <div className="search-item">Đang tìm...</div>}

          {!loading &&
            results.slice(0, 5).map((item) => (
              <Link
                to={`/products/${item.id}`}
                key={item.id}
                className="search-item"
                onClick={() => setResults([])}
              >
                <img src={item.image} alt={item.name} />
                <div>
                  <p className="name">{item.name}</p>
                  {item.price ? <p className="price">{item.price}</p> : null}
                </div>
              </Link>
            ))}

          {!loading && results.length === 0 && (
            <div className="search-item">Không tìm thấy sản phẩm phù hợp</div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
