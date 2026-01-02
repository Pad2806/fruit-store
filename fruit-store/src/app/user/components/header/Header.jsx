import "./Header.css";

function Header() {
  return (
    <header className="header">
      <div className="header-inner">    
            <div className="header-left">
            <div className="menu">
                <span>MENU</span>
            </div>
            <div className="logo">
                <span>FRUIT</span>store
            </div>
            </div>

            <div className="header-search">
            <input placeholder="Tìm kiếm sản phẩm..." />
            <span className="search-icon">🔍</span>
            </div>

        <div className="header-actions">
          <div className="action">
            <span className="icon">📞</span>
            <span>Hotline 0865660775</span>
          </div>

          <div className="action">
            <span className="icon">👤</span>
            <span>Tài khoản</span>
          </div>

          <div className="action cart">
            <span className="icon">🛒</span>
            <span>Giỏ hàng</span>
            <span className="badge">0</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
