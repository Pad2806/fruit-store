import React, { useEffect, useState } from 'react';
import {
  Package,
  ShoppingCart,
  LogOut,
  Tags,
  MapPin,
} from 'lucide-react';
import './sellerdashboard.css';
import CategoryManagement from './category';
import OriginManagement from './origin';
import OrderManagement from './order';
import ProductManagement from './product';
import { categoryApi, originApi, orderApi, productApi } from '@/services/api';

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [originsCount, setOriginsCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);

  // Fetch counts on mount
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [catResponse, oriResponse, orderResponse, productResponse] = await Promise.all([
          categoryApi.getAll(),
          originApi.getAll(),
          orderApi.getAll(),
          productApi.getAll(),
        ]);
        setCategoriesCount(catResponse.pagination?.total || (catResponse.data || []).length);
        setOriginsCount(oriResponse.pagination?.total || (oriResponse.data || []).length);
        setOrdersCount(orderResponse.pagination?.total || (orderResponse.data || []).length);
        setProductsCount(productResponse.pagination?.total || (productResponse.data || []).length);
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    };
    fetchCounts();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="seller-container">
      <div className="seller-header">
        <div className="header-content">
          <h1>FRUITstore Seller</h1>
          <p>Quản lý sản phẩm & đơn hàng</p>
        </div>

        <div className="header-right">
          <div className="header-stats">
            <div className="stat-card">
              <Package size={24} />
              <div>
                <span className="stat-number">{productsCount}</span>
                <span className="stat-label">Sản phẩm</span>
              </div>
            </div>

            <div className="stat-card">
              <ShoppingCart size={24} />
              <div>
                <span className="stat-number">{ordersCount}</span>
                <span className="stat-label">Đơn hàng</span>
              </div>
            </div>

            <div className="stat-card">
              <Tags size={24} />
              <div>
                <span className="stat-number">{categoriesCount}</span>
                <span className="stat-label">Danh mục</span>
              </div>
            </div>

            <div className="stat-card">
              <MapPin size={24} />
              <div>
                <span className="stat-number">{originsCount}</span>
                <span className="stat-label">Xuất xứ</span>
              </div>
            </div>
          </div>

          <div className="header-actions">
            <button
              className="btn-logout"
              onClick={handleLogout}
              aria-label="Logout"
              title="Đăng xuất"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="seller-body">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <Package size={20} />
            Quản lý sản phẩm
          </button>

          <button
            className={`tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <ShoppingCart size={20} />
            Quản lý đơn hàng
          </button>

          <button
            className={`tab ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            <Tags size={20} />
            Quản lý danh mục
          </button>

          <button
            className={`tab ${activeTab === 'origins' ? 'active' : ''}`}
            onClick={() => setActiveTab('origins')}
          >
            <MapPin size={20} />
            Quản lý xuất xứ
          </button>
        </div>

        {activeTab === 'products' && (
          <div className="tab-content">
            <ProductManagement
              onProductsChange={(prods, total) => setProductsCount(total || prods.length)}
            />
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="tab-content">
            <OrderManagement
              onOrdersChange={(ords, total) => setOrdersCount(total || ords.length)}
            />
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="tab-content">
            <CategoryManagement
              onCategoriesChange={(cats, total) => setCategoriesCount(total || cats.length)}
            />
          </div>
        )}

        {activeTab === 'origins' && (
          <div className="tab-content">
            <OriginManagement
              onOriginsChange={(oris, total) => setOriginsCount(total || oris.length)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;
