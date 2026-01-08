import { useState, useRef, useLayoutEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { FaPhoneAlt, FaUser, FaShoppingCart, FaHome, FaEnvelope } from "react-icons/fa";

import SearchBar from "../search/SearchBar";
import "./Header.css";

function Header() {
  const [openMenu, setOpenMenu] = useState(false);
  const [menuTop, setMenuTop] = useState(0);
  const headerRef = useRef(null);
  const { cartCount } = useCart();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (openMenu && headerRef.current) {
      const rect = headerRef.current.getBoundingClientRect();
      setMenuTop(rect.bottom);
    }
  }, [openMenu]);

  return (
    <>
      <header className="header" ref={headerRef}>
        <div className="header-inner">
          <div className="header-left">
            <div
              className={`menu ${openMenu ? "active" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setOpenMenu(!openMenu);
              }}
            >
              <span>MENU</span>
            </div>

            <div className="logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
              <span>FRUIT</span>store
            </div>
          </div>

          <div className="header-search">
            <SearchBar />
          </div>

          <div className="header-actions">
            <div className="action" onClick={() => navigate("/contact")} style={{ cursor: "pointer" }}>
              <span className="icon"><FaPhoneAlt size={16} /></span>
              <span>Hotline 0865666666</span>
            </div>
            <div className="action" onClick={() => navigate("/login")} style={{ cursor: "pointer" }}>
              <span className="icon"><FaUser size={18} /></span>
              <span>Tài khoản</span>
            </div>
            <div className="action cart" onClick={() => navigate("/cart")} style={{ cursor: "pointer" }}>
              <span className="icon"><FaShoppingCart size={18} /></span>
              <span>Giỏ hàng</span>
              <span className="badge">{cartCount}</span>
            </div>
          </div>
        </div>
      </header>

      {openMenu && (
        <>
          <div
            className="menu-overlay"
            onClick={() => setOpenMenu(false)}
          />
          <div
            className="menu-dropdown"
            style={{ top: `${menuTop}px` }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="menu-dropdown-inner">
              <ul className="menu-list">
                <li className="home">
                  <Link to="/" onClick={() => setOpenMenu(false)}>
                    <FaHome size={18} />
                  </Link>
                </li>
                <li>
                  <Link to="/" onClick={() => setOpenMenu(false)}>
                    TRANG CHỦ
                  </Link>
                </li>
                <li>
                  <Link to="/products" onClick={() => setOpenMenu(false)}>
                    TRÁI CÂY NGON HÔM NAY
                  </Link>
                </li>
                <li>
                  <Link to="/about" onClick={() => setOpenMenu(false)}>
                    VỀ CHÚNG TÔI
                  </Link>
                </li>
                <li>
                  <Link to="/contact" onClick={() => setOpenMenu(false)}>
                    LIÊN HỆ
                  </Link>
                </li>
              </ul>

              <div className="menu-support">
                <p>
                  <FaPhoneAlt size={14}  style={{marginRight: "10px"}}/>
                  <span>0865666666</span>
                </p>
                <p>
                  <FaEnvelope size={14}  style={{marginRight: "10px"}}/>
                  <span>hello@fruitstore.com.vn</span>
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Header;