import React, { useMemo, useState } from 'react';
import {
  Package,
  ShoppingCart,
  Plus,
  Edit2,
  Trash2,
  Search,
  X,
  Save,
  Eye,
  LogOut,
} from 'lucide-react';
import './sellerdashboard.css';

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');

  const [products, setProducts] = useState([
    { id: 1, name: 'Cam Sành Cao Cấp', price: 45000, stock: 150, unit: 'kg', image: '', status: 'available' },
    { id: 2, name: 'Táo Envy New Zealand', price: 85000, stock: 80, unit: 'kg', image: '', status: 'available' },
    { id: 3, name: 'Nho Mỹ Không Hạt', price: 120000, stock: 45, unit: 'kg', image: '', status: 'available' },
    { id: 4, name: 'Dâu Tây Đà Lạt', price: 150000, stock: 0, unit: 'hộp', image: '', status: 'out_of_stock' },
  ]);

  const [orders, setOrders] = useState([
    { id: 1001, customer: 'Nguyễn Văn A', phone: '0901234567', products: 'Cam Sành x2kg, Táo Envy x1kg', total: 175000, status: 'pending', date: '2024-12-27' },
    { id: 1002, customer: 'Trần Thị B', phone: '0912345678', products: 'Nho Mỹ x1kg', total: 120000, status: 'confirmed', date: '2024-12-27' },
    { id: 1003, customer: 'Lê Văn C', phone: '0923456789', products: 'Dâu Tây x2hộp', total: 300000, status: 'shipping', date: '2024-12-26' },
    { id: 1004, customer: 'Phạm Thị D', phone: '0934567890', products: 'Cam Sành x5kg', total: 225000, status: 'completed', date: '2024-12-25' },
  ]);

  const [showProductModal, setShowProductModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); 
  const [searchTerm, setSearchTerm] = useState('');

  const [productFormError, setProductFormError] = useState('');
  const [orderFormError, setOrderFormError] = useState('');

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [currentProduct, setCurrentProduct] = useState({
    id: null,
    name: '',
    price: '',
    stock: '',
    unit: 'kg',
    image: '', 
    status: 'available', 
  });

  const [currentOrder, setCurrentOrder] = useState({
    id: null,
    customer: '',
    phone: '',
    products: '',
    total: '',
    status: 'pending',
    date: new Date().toISOString().split('T')[0],
  });

  const units = ['kg', 'hộp', 'trái', 'bó'];

  const productStatuses = [
    { value: 'available', label: 'Còn hàng' },
    { value: 'low_stock', label: 'Sắp hết' },
    { value: 'out_of_stock', label: 'Hết hàng' },
  ];

  const orderStatuses = [
    { value: 'pending', label: 'Chờ xác nhận', color: '#f39c12' },
    { value: 'confirmed', label: 'Đã xác nhận', color: '#3498db' },
    { value: 'shipping', label: 'Đang giao', color: '#9b59b6' },
    { value: 'completed', label: 'Hoàn thành', color: '#27ae60' },
    { value: 'cancelled', label: 'Đã hủy', color: '#e74c3c' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const statusLabelOfProduct = (status) =>
    productStatuses.find((s) => s.value === status)?.label || status;

  const openProductModal = (mode, product = null) => {
    setModalMode(mode);
    setProductFormError('');

    if (mode === 'create') {
      setCurrentProduct({
        id: null,
        name: '',
        price: '',
        stock: '',
        unit: 'kg',
        image: '',
        status: 'available',
      });
    } else if (product) {
      setCurrentProduct(product);
    }

    setShowProductModal(true);
  };

  const closeProductModal = () => {
    setShowProductModal(false);
    setProductFormError('');
  };

  const handleCreateProduct = () => openProductModal('create');
  const handleEditProduct = (product) => openProductModal('edit', product);

  const openDeleteProductModal = (product) => {
    setDeleteTarget({
      type: 'product',
      id: product.id,
      title: product.name,
      subtitle: `ID: ${product.id}`,
    });
    setShowDeleteModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setProductFormError('Vui lòng chọn file hình ảnh hợp lệ.');
      return;
    }

    setProductFormError('');

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : '';
      setCurrentProduct((prev) => ({ ...prev, image: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setCurrentProduct((prev) => ({ ...prev, image: '' }));
    setProductFormError('');
  };

  const handleSaveProduct = () => {
    const nameOk = currentProduct.name.trim().length > 0;
    const priceOk = String(currentProduct.price).trim().length > 0;
    const stockOk = String(currentProduct.stock).trim().length > 0;
    const statusOk = !!currentProduct.status;

    if (!nameOk || !priceOk || !stockOk || !statusOk) {
      setProductFormError('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    setProductFormError('');

    const payload = {
      ...currentProduct,
      price: Number(currentProduct.price),
      stock: Number(currentProduct.stock),
    };

    if (modalMode === 'create') {
      const newProduct = {
        ...payload,
        id: Math.max(...products.map((p) => p.id), 0) + 1,
      };
      setProducts([...products, newProduct]);
    } else {
      setProducts(products.map((p) => (p.id === payload.id ? payload : p)));
    }

    closeProductModal();
  };

  const openOrderModal = (mode, order) => {
    setModalMode(mode);
    setOrderFormError('');
    setCurrentOrder(order);
    setShowOrderModal(true);
  };

  const closeOrderModal = () => {
    setShowOrderModal(false);
    setOrderFormError('');
  };

  const handleViewOrder = (order) => openOrderModal('view', order);
  const handleEditOrder = (order) => openOrderModal('edit', order);

  const openDeleteOrderModal = (order) => {
    setDeleteTarget({
      type: 'order',
      id: order.id,
      title: `Đơn hàng #${order.id}`,
      subtitle: `Khách: ${order.customer}`,
    });
    setShowDeleteModal(true);
  };

  const handleSaveOrder = () => {

    const customerOk = String(currentOrder.customer).trim().length > 0;
    const phoneOk = String(currentOrder.phone).trim().length > 0;
    const productsOk = String(currentOrder.products).trim().length > 0;
    const totalOk = String(currentOrder.total).trim().length > 0;

    if (!customerOk || !phoneOk || !productsOk || !totalOk) {
      setOrderFormError('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    setOrderFormError('');
    setOrders(orders.map((o) => (o.id === currentOrder.id ? currentOrder : o)));
    closeOrderModal();
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'product') {
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    } else {
      setOrders((prev) => prev.filter((o) => o.id !== deleteTarget.id));
    }

    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  const filteredProducts = useMemo(() => {
    const t = searchTerm.toLowerCase();
    return products.filter((p) => p.name.toLowerCase().includes(t) || p.id.toString().includes(t));
  }, [products, searchTerm]);

  const filteredOrders = useMemo(() => {
    const t = searchTerm.toLowerCase();
    return orders.filter((order) => order.customer.toLowerCase().includes(t) || order.id.toString().includes(searchTerm));
  }, [orders, searchTerm]);

  const getOrderStatusColor = (status) => orderStatuses.find((s) => s.value === status)?.color || '#95a5a6';
  const getOrderStatusLabel = (status) => orderStatuses.find((s) => s.value === status)?.label || status;

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
                <span className="stat-number">{products.length}</span>
                <span className="stat-label">Sản phẩm</span>
              </div>
            </div>

            <div className="stat-card">
              <ShoppingCart size={24} />
              <div>
                <span className="stat-number">{orders.length}</span>
                <span className="stat-label">Đơn hàng</span>
              </div>
            </div>
          </div>

          <div className="header-actions">
            <button className="btn-logout" onClick={handleLogout} aria-label="Logout" title="Đăng xuất">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="seller-body">
        <div className="tabs">
          <button className={`tab ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
            <Package size={20} />
            Quản lý sản phẩm
          </button>

          <button className={`tab ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
            <ShoppingCart size={20} />
            Quản lý đơn hàng
          </button>
        </div>

        {activeTab === 'products' && (
          <div className="tab-content">
            <div className="toolbar">
              <div className="search-box">
                <Search size={20} />
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <button className="btn-create" onClick={handleCreateProduct}>
                <Plus size={20} />
                Thêm sản phẩm
              </button>
            </div>

            <div className="products-table">
              <table>
                <thead>
                  <tr>
                    <th>Hình</th>
                    <th>Tên sản phẩm</th>
                    <th>Giá</th>
                    <th>Tồn kho</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id}>
                      <td>
                        {product.image ? (
                          <img className="product-thumb" src={product.image} alt={product.name} />
                        ) : (
                          <div className="product-thumb placeholder" title="Chưa có hình">
                            <span>🍊</span>
                          </div>
                        )}
                      </td>

                      <td className="product-name">{product.name}</td>

                      <td className="price">
                        {Number(product.price).toLocaleString('vi-VN')}₫/{product.unit}
                      </td>

                      <td>
                        <span className={`stock ${Number(product.stock) <= 10 ? 'low' : ''}`}>
                          {product.stock} {product.unit}
                        </span>
                      </td>

                      <td>
                        <span className={`status-badge ${product.status}`}>
                          {statusLabelOfProduct(product.status)}
                        </span>
                      </td>

                      <td>
                        <div className="action-buttons">
                          <button className="btn-edit" onClick={() => handleEditProduct(product)} aria-label="Edit product" title="Sửa">
                            <Edit2 size={16} />
                          </button>
                          <button className="btn-delete" onClick={() => openDeleteProductModal(product)} aria-label="Delete product" title="Xoá">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="tab-content">
            <div className="toolbar">
              <div className="search-box">
                <Search size={20} />
                <input
                  type="text"
                  placeholder="Tìm kiếm đơn hàng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="orders-table">
              <table>
                <thead>
                  <tr>
                    <th>Mã ĐH</th>
                    <th>Khách hàng</th>
                    <th>Số điện thoại</th>
                    <th>Sản phẩm</th>
                    <th>Tổng tiền</th>
                    <th>Trạng thái</th>
                    <th>Ngày đặt</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="order-id">#{order.id}</td>
                      <td>{order.customer}</td>
                      <td>{order.phone}</td>
                      <td className="order-products">{order.products}</td>
                      <td className="price">{Number(order.total).toLocaleString('vi-VN')}₫</td>

                      <td>
                        <span className="order-status" style={{ backgroundColor: getOrderStatusColor(order.status) }}>
                          {getOrderStatusLabel(order.status)}
                        </span>
                      </td>

                      <td>{order.date}</td>

                      <td>
                        <div className="action-buttons">
                          <button className="btn-view" onClick={() => handleViewOrder(order)} aria-label="View order" title="Xem">
                            <Eye size={16} />
                          </button>
                          <button className="btn-edit" onClick={() => handleEditOrder(order)} aria-label="Edit order" title="Sửa">
                            <Edit2 size={16} />
                          </button>
                          <button className="btn-delete" onClick={() => openDeleteOrderModal(order)} aria-label="Delete order" title="Xoá">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showProductModal && (
        <div className="modal-overlay" onClick={closeProductModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modalMode === 'create' ? 'Thêm sản phẩm mới' : 'Chỉnh sửa sản phẩm'}</h2>
              <button className="btn-close" onClick={closeProductModal}>
                <X size={24} />
              </button>
            </div>

            <div className="modal-body">
              {productFormError && <div className="form-error">{productFormError}</div>}

              <div className="form-row">
                <div className="form-group">
                  <label>Tên sản phẩm *</label>
                  <input
                    type="text"
                    value={currentProduct.name}
                    onChange={(e) => {
                      setCurrentProduct({ ...currentProduct, name: e.target.value });
                      if (productFormError) setProductFormError('');
                    }}
                    placeholder="VD: Cam Sành Cao Cấp"
                  />
                </div>

                <div className="form-group">
                  <label>Trạng thái *</label>
                  <select
                    value={currentProduct.status}
                    onChange={(e) => {
                      setCurrentProduct({ ...currentProduct, status: e.target.value });
                      if (productFormError) setProductFormError('');
                    }}
                  >
                    {productStatuses.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Giá bán *</label>
                  <input
                    type="number"
                    value={currentProduct.price}
                    onChange={(e) => {
                      setCurrentProduct({ ...currentProduct, price: e.target.value });
                      if (productFormError) setProductFormError('');
                    }}
                    placeholder="45000"
                  />
                </div>

                <div className="form-group">
                  <label>Đơn vị</label>
                  <select
                    value={currentProduct.unit}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, unit: e.target.value })}
                  >
                    {units.map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Tồn kho *</label>
                  <input
                    type="number"
                    value={currentProduct.stock}
                    onChange={(e) => {
                      setCurrentProduct({ ...currentProduct, stock: e.target.value });
                      if (productFormError) setProductFormError('');
                    }}
                    placeholder="150"
                  />
                </div>

                <div className="form-group">
                  <label>Hình ảnh</label>

                  <div className="image-upload">
                    <input
                      id="product-image-input"
                      className="file-input"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <label className="btn-file" htmlFor="product-image-input">
                      Chọn hình ảnh
                    </label>

                    {currentProduct.image && (
                      <button type="button" className="btn-clear-image" onClick={clearImage} title="Xoá hình">
                        <X size={16} />
                      </button>
                    )}
                  </div>

                  <div className="image-preview">
                    {currentProduct.image ? (
                      <img src={currentProduct.image} alt="Preview" />
                    ) : (
                      <div className="image-empty">Chưa có hình</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={closeProductModal}>
                Hủy
              </button>
              <button className="btn-save" onClick={handleSaveProduct}>
                <Save size={20} />
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {showOrderModal && (
        <div className="modal-overlay" onClick={closeOrderModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modalMode === 'view' ? 'Chi tiết đơn hàng' : 'Cập nhật đơn hàng'}</h2>
              <button className="btn-close" onClick={closeOrderModal}>
                <X size={24} />
              </button>
            </div>

            <div className="modal-body">
              {orderFormError && <div className="form-error">{orderFormError}</div>}

              <div className="order-detail">
                <div className="detail-row">
                  <span className="label">Mã đơn hàng:</span>
                  <span className="value">#{currentOrder.id}</span>
                </div>

                <div className="detail-row">
                  <span className="label">Khách hàng:</span>
                  <span className="value">{currentOrder.customer}</span>
                </div>

                <div className="detail-row">
                  <span className="label">Số điện thoại:</span>
                  <span className="value">{currentOrder.phone}</span>
                </div>

                <div className="detail-row">
                  <span className="label">Sản phẩm:</span>
                  <span className="value">{currentOrder.products}</span>
                </div>

                <div className="detail-row">
                  <span className="label">Tổng tiền:</span>
                  <span className="value price">{Number(currentOrder.total).toLocaleString('vi-VN')}₫</span>
                </div>

                <div className="detail-row">
                  <span className="label">Ngày đặt:</span>
                  <span className="value">{currentOrder.date}</span>
                </div>
              </div>

              {modalMode === 'edit' && (
                <div className="form-group">
                  <label>Trạng thái đơn hàng</label>
                  <select
                    value={currentOrder.status}
                    onChange={(e) => {
                      setCurrentOrder({ ...currentOrder, status: e.target.value });
                      if (orderFormError) setOrderFormError('');
                    }}
                  >
                    {orderStatuses.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {modalMode === 'view' && (
                <div className="status-display">
                  <span className="order-status large" style={{ backgroundColor: getOrderStatusColor(currentOrder.status) }}>
                    {getOrderStatusLabel(currentOrder.status)}
                  </span>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={closeOrderModal}>
                Đóng
              </button>

              {modalMode === 'edit' && (
                <button className="btn-save" onClick={handleSaveOrder}>
                  <Save size={20} />
                  Cập nhật
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal-overlay" onClick={cancelDelete}>
          <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header delete">
              <h2>Xác nhận xoá</h2>
              <button className="btn-close" onClick={cancelDelete}>
                <X size={24} />
              </button>
            </div>

            <div className="modal-body">
              <p>
                Bạn có chắc chắn muốn xoá{' '}
                <strong>{deleteTarget?.type === 'product' ? 'sản phẩm' : 'đơn hàng'}</strong>: <strong>{deleteTarget?.title}</strong>?
              </p>

              {deleteTarget?.subtitle && <p className="delete-subtitle">{deleteTarget.subtitle}</p>}

              <p className="delete-warning">
                Hành động này <strong>không thể hoàn tác</strong>.
              </p>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={cancelDelete}>
                Huỷ
              </button>
              <button className="btn-delete-confirm" onClick={confirmDelete}>
                Xoá
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
