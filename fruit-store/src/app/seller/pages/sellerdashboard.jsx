import React, { useEffect, useMemo, useState } from 'react';
import {
  Package,
  ShoppingCart,
  Plus,
  Edit2,
  Trash2,
  Search,
  X,
  Save,
  LogOut,
  Tags,
  MapPin,
} from 'lucide-react';
import './sellerdashboard.css';
import CategoryManagement from './category';
import OriginManagement from './origin';
import OrderManagement from './order';
import { categoryApi, originApi, orderApi } from '@/services/api';

const MAX_IMAGES = 5;

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [originsCount, setOriginsCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);

  // Fetch categories, origins and orders count on mount
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [catResponse, oriResponse, orderResponse] = await Promise.all([
          categoryApi.getAll(),
          originApi.getAll(),
          orderApi.getAll(),
        ]);
        setCategoriesCount(catResponse.pagination?.total || (catResponse.data || []).length);
        setOriginsCount(oriResponse.pagination?.total || (oriResponse.data || []).length);
        setOrdersCount(orderResponse.pagination?.total || (orderResponse.data || []).length);
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    };
    fetchCounts();
  }, []);

  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Cam Sành Cao Cấp',
      price: 45000,
      stock: 150,
      unit: 'kg',
      images: [],
      status: 'available',
      short_desc: 'Cam sành ngọt, nhiều nước.',
      detail_desc: 'Cam sành tuyển chọn, phù hợp ép nước hoặc ăn trực tiếp.',
      category_id: 'cate_1',
      origin_id: 'ori_1',
      sold_quantity: 20,
    },
    {
      id: 2,
      name: 'Táo Envy New Zealand',
      price: 85000,
      stock: 80,
      unit: 'kg',
      images: [],
      status: 'available',
      short_desc: 'Táo giòn ngọt.',
      detail_desc: 'Táo Envy nhập khẩu, giòn, thơm, độ ngọt cao.',
      category_id: 'cate_2',
      origin_id: 'ori_2',
      sold_quantity: 10,
    },
    {
      id: 3,
      name: 'Nho Mỹ Không Hạt',
      price: 120000,
      stock: 45,
      unit: 'kg',
      images: [],
      status: 'available',
      short_desc: 'Nho không hạt, dễ ăn.',
      detail_desc: 'Nho Mỹ không hạt, vị ngọt nhẹ, vỏ mỏng.',
      category_id: 'cate_2',
      origin_id: 'ori_2',
      sold_quantity: 5,
    },
    {
      id: 4,
      name: 'Dâu Tây Đà Lạt',
      price: 150000,
      stock: 0,
      unit: 'hộp',
      images: [],
      status: 'out_of_stock',
      short_desc: 'Dâu tươi mỗi ngày.',
      detail_desc: 'Dâu Đà Lạt loại 1, giao nhanh trong ngày.',
      category_id: 'cate_3',
      origin_id: 'ori_3',
      sold_quantity: 30,
    },
  ]);

  const [showProductModal, setShowProductModal] = useState(false);

  const [modalMode, setModalMode] = useState('create');
  const [searchTerm, setSearchTerm] = useState('');

  const [productFormError, setProductFormError] = useState('');

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState('');

  const [currentProduct, setCurrentProduct] = useState({
    id: null,
    name: '',
    price: '',
    stock: '',
    unit: 'kg',
    images: [],
    status: 'available',
    short_desc: '',
    detail_desc: '',
    category_id: '',
    origin_id: '',
    sold_quantity: 0,
  });

  const units = ['kg', 'hộp', 'trái', 'bó'];

  const productStatuses = [
    { value: 'available', label: 'Còn hàng', color: '#27ae60' },
    { value: 'low_stock', label: 'Sắp hết', color: '#f39c12' },
    { value: 'out_of_stock', label: 'Hết hàng', color: '#e74c3c' },
  ];

  const isView = modalMode === 'view';

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const statusLabelOfProduct = (status) =>
    productStatuses.find((s) => s.value === status)?.label || status;

  const getProductStatusColor = (status) =>
    productStatuses.find((s) => s.value === status)?.color || '#95a5a6';

  const formatMoney = (value) => Number(value || 0).toLocaleString('vi-VN') + '₫';

  // ===== Helpers =====
  const nextCodeId = (prefix, items) => {
    const nums = (items || [])
      .map((x) => {
        const m = String(x.id || '').match(new RegExp(`^${prefix}_(\\d+)$`));
        return m ? Number(m[1]) : 0;
      })
      .filter((n) => Number.isFinite(n));
    const next = Math.max(0, ...nums) + 1;
    return `${prefix}_${next}`;
  };

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
        images: [],
        status: 'available',
        short_desc: '',
        detail_desc: '',
        category_id: categories[0]?.id || '',
        origin_id: origins[0]?.id || '',
        sold_quantity: 0,
      });
    } else if (product) {
      setCurrentProduct({
        ...product,
        images: Array.isArray(product.images) ? product.images : [],
      });
    }

    setShowProductModal(true);
  };

  const closeProductModal = () => {
    setShowProductModal(false);
    setProductFormError('');
  };

  const handleCreateProduct = () => openProductModal('create');
  const handleEditProduct = (product) => openProductModal('edit', product);
  const handleViewProduct = (product) => openProductModal('view', product);

  const openDeleteProductModal = (product) => {
    setDeleteError('');
    setDeleteTarget({
      type: 'product',
      id: product.id,
      title: product.name,
      subtitle: `ID: ${product.id}`,
    });
    setShowDeleteModal(true);
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const currentCount = currentProduct.images?.length || 0;
    const remaining = MAX_IMAGES - currentCount;

    if (remaining <= 0) {
      setProductFormError(`Bạn chỉ được tối đa ${MAX_IMAGES} ảnh.`);
      e.target.value = '';
      return;
    }

    const picked = files.slice(0, remaining);

    const invalid = picked.find((f) => !f.type.startsWith('image/'));
    if (invalid) {
      setProductFormError('Vui lòng chọn file hình ảnh hợp lệ.');
      e.target.value = '';
      return;
    }

    setProductFormError('');

    const readers = picked.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () =>
            resolve(typeof reader.result === 'string' ? reader.result : '');
          reader.readAsDataURL(file);
        })
    );

    Promise.all(readers).then((dataUrls) => {
      const cleaned = dataUrls.filter(Boolean);
      setCurrentProduct((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...cleaned].slice(0, MAX_IMAGES),
      }));
      e.target.value = '';
    });
  };

  const removeImageAt = (idx) => {
    setCurrentProduct((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== idx),
    }));
    setProductFormError('');
  };

  const clearAllImages = () => {
    setCurrentProduct((prev) => ({ ...prev, images: [] }));
    setProductFormError('');
  };

  const handleSaveProduct = () => {
    const nameOk = currentProduct.name.trim().length > 0;
    const priceOk = String(currentProduct.price).trim().length > 0;
    const stockOk = String(currentProduct.stock).trim().length > 0;
    const statusOk = !!currentProduct.status;
    const categoryOk = String(currentProduct.category_id).trim().length > 0;
    const originOk = String(currentProduct.origin_id).trim().length > 0;

    if (!nameOk || !priceOk || !stockOk || !statusOk || !categoryOk || !originOk) {
      setProductFormError('Vui lòng điền đầy đủ thông tin bắt buộc.');
      return;
    }

    if ((currentProduct.images || []).length > MAX_IMAGES) {
      setProductFormError(`Bạn chỉ được tối đa ${MAX_IMAGES} ảnh.`);
      return;
    }

    setProductFormError('');

    const payload = {
      ...currentProduct,
      price: Number(currentProduct.price),
      stock: Number(currentProduct.stock),
      sold_quantity: Number(currentProduct.sold_quantity || 0),
      images: Array.isArray(currentProduct.images) ? currentProduct.images : [],
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
    setCurrentOrder({ ...order });
    setShowOrderModal(true);
  };

  const closeOrderModal = () => {
    setShowOrderModal(false);
    setOrderFormError('');
  };

  const handleViewOrder = (order) => openOrderModal('view', order);
  const handleEditOrder = (order) => openOrderModal('edit', order);

  const openDeleteOrderModal = (order) => {
    setDeleteError('');
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

  const openOriginModal = (mode, origin = null) => {
    setModalMode(mode);
    setOriginFormError('');

    if (mode === 'create') {
      setCurrentOrigin({ id: nextCodeId('ori', origins), name: '', description: '' });
    } else if (origin) {
      setCurrentOrigin({ ...origin });
    }

    setShowOriginModal(true);
  };

  const closeOriginModal = () => {
    setShowOriginModal(false);
    setOriginFormError('');
  };

  const handleCreateOrigin = () => openOriginModal('create');
  const handleEditOrigin = (o) => openOriginModal('edit', o);
  const handleViewOrigin = (o) => openOriginModal('view', o);

  const handleSaveOrigin = () => {
    const name = String(currentOrigin.name || '').trim();
    const description = String(currentOrigin.description || '').trim();

    if (!name) {
      setOriginFormError('Vui lòng nhập tên xuất xứ.');
      return;
    }

    const dup = origins.some(
      (o) =>
        o.id !== currentOrigin.id &&
        String(o.name).trim().toLowerCase() === name.toLowerCase()
    );
    if (dup) {
      setOriginFormError('Tên xuất xứ đã tồn tại.');
      return;
    }

    setOriginFormError('');

    const payload = { ...currentOrigin, name, description };

    if (modalMode === 'create') {
      setOrigins((prev) => [...prev, payload]);
    } else {
      setOrigins((prev) => prev.map((o) => (o.id === payload.id ? payload : o)));
    }

    closeOriginModal();
  };

  const openDeleteOriginModal = (o) => {
    setDeleteError('');
    setDeleteTarget({
      type: 'origin',
      id: o.id,
      title: o.name,
      subtitle: `ID: ${o.id}`,
    });
    setShowDeleteModal(true);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteTarget(null);
    setDeleteError('');
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'product') {
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    }

    setShowDeleteModal(false);
    setDeleteTarget(null);
    setDeleteError('');
  };

  const filteredProducts = useMemo(() => {
    const t = searchTerm.toLowerCase().trim();
    return products.filter(
      (p) => p.name.toLowerCase().includes(t) || p.id.toString().includes(t)
    );
  }, [products, searchTerm]);

  const deleteLabel = 'sản phẩm';

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
            <div className="toolbar">
              <div className="search-box">
                <Search size={20} />
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  name="seller-search"
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
                  {filteredProducts.map((product) => {
                    const firstImage =
                      Array.isArray(product.images) && product.images.length > 0
                        ? product.images[0]
                        : '';
                    return (
                      <tr
                        key={product.id}
                        onClick={() => handleViewProduct(product)}
                        style={{ cursor: 'pointer' }}
                        title="Bấm để xem chi tiết"
                      >
                        <td>
                          {firstImage ? (
                            <img
                              className="product-thumb"
                              src={firstImage}
                              alt={product.name}
                            />
                          ) : (
                            <div className="product-thumb placeholder" title="Chưa có hình">
                              <span>🍊</span>
                            </div>
                          )}
                        </td>

                        <td className="product-name">{product.name}</td>

                        <td className="price">
                          {formatMoney(product.price)}/{product.unit}
                        </td>

                        <td>
                          <span
                            className={`stock ${Number(product.stock) <= 10 ? 'low' : ''}`}
                          >
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
                            <button
                              className="btn-edit"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditProduct(product);
                              }}
                              title="Sửa"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              className="btn-delete"
                              onClick={(e) => {
                                e.stopPropagation();
                                openDeleteProductModal(product);
                              }}
                              title="Xoá"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
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

      {showProductModal && (
        <div className="modal-overlay" onClick={closeProductModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {modalMode === 'create'
                  ? 'Thêm sản phẩm mới'
                  : modalMode === 'edit'
                    ? 'Chỉnh sửa sản phẩm'
                    : 'Chi tiết sản phẩm'}
              </h2>
              <button className="btn-close" onClick={closeProductModal}>
                <X size={24} />
              </button>
            </div>

            <div className="modal-body">
              {productFormError && <div className="form-error">{productFormError}</div>}

              {isView ? (
                <>
                  <div className="detail-media">
                    <div className="detail-media-title">Hình ảnh</div>
                    <div className="image-preview view">
                      {(currentProduct.images || []).length > 0 ? (
                        <div className="image-grid">
                          {(currentProduct.images || []).map((src, idx) => (
                            <div key={idx} className="image-tile">
                              <img src={src} alt={`product-${idx}`} />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="image-empty">Chưa có hình</div>
                      )}
                    </div>
                  </div>

                  <div className="order-detail">
                    <div className="detail-row">
                      <span className="label">Mã sản phẩm:</span>
                      <span className="value">#{currentProduct.id}</span>
                    </div>

                    <div className="detail-row">
                      <span className="label">Tên sản phẩm:</span>
                      <span className="value">{currentProduct.name}</span>
                    </div>

                    <div className="detail-row">
                      <span className="label">Danh mục:</span>
                      <span className="value">{categoryNameOf(currentProduct.category_id)}</span>
                    </div>

                    <div className="detail-row">
                      <span className="label">Xuất xứ:</span>
                      <span className="value">{originNameOf(currentProduct.origin_id)}</span>
                    </div>

                    <div className="detail-row">
                      <span className="label">Giá bán:</span>
                      <span className="value price">
                        {formatMoney(currentProduct.price)}/{currentProduct.unit}
                      </span>
                    </div>

                    <div className="detail-row">
                      <span className="label">Tồn kho:</span>
                      <span className="value">
                        {currentProduct.stock} {currentProduct.unit}
                      </span>
                    </div>

                    <div className="detail-row">
                      <span className="label">Đã bán:</span>
                      <span className="value">{currentProduct.sold_quantity}</span>
                    </div>

                    <div className="detail-row">
                      <span className="label">Mô tả ngắn:</span>
                      <span className="value">{currentProduct.short_desc || '-'}</span>
                    </div>

                    <div className="detail-row">
                      <span className="label">Mô tả chi tiết:</span>
                      <span className="value">{currentProduct.detail_desc || '-'}</span>
                    </div>
                  </div>

                  <div className="status-display">
                    <span
                      className="order-status large"
                      style={{ backgroundColor: getProductStatusColor(currentProduct.status) }}
                    >
                      {statusLabelOfProduct(currentProduct.status)}
                    </span>
                  </div>
                </>
              ) : (

                <>
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
                      <label>Danh mục *</label>
                      <select
                        value={currentProduct.category_id}
                        onChange={(e) =>
                          setCurrentProduct({ ...currentProduct, category_id: e.target.value })
                        }
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Xuất xứ *</label>
                      <select
                        value={currentProduct.origin_id}
                        onChange={(e) =>
                          setCurrentProduct({ ...currentProduct, origin_id: e.target.value })
                        }
                      >
                        {origins.map((o) => (
                          <option key={o.id} value={o.id}>
                            {o.name}
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
                        onChange={(e) =>
                          setCurrentProduct({ ...currentProduct, unit: e.target.value })
                        }
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
                      <label>Đã bán</label>
                      <input
                        type="number"
                        value={currentProduct.sold_quantity}
                        onChange={(e) =>
                          setCurrentProduct({ ...currentProduct, sold_quantity: e.target.value })
                        }
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Mô tả ngắn</label>
                      <input
                        type="text"
                        value={currentProduct.short_desc}
                        onChange={(e) =>
                          setCurrentProduct({ ...currentProduct, short_desc: e.target.value })
                        }
                        placeholder="VD: Cam sành ngọt, nhiều nước"
                      />
                    </div>

                    <div className="form-group">
                      <label>Mô tả chi tiết</label>
                      <input
                        type="text"
                        value={currentProduct.detail_desc}
                        onChange={(e) =>
                          setCurrentProduct({ ...currentProduct, detail_desc: e.target.value })
                        }
                        placeholder="VD: Cam tuyển chọn, phù hợp ép nước..."
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Hình ảnh (tối đa {MAX_IMAGES})</label>

                      <div className="image-upload">
                        <input
                          id="product-images-input"
                          className="file-input"
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImagesChange}
                        />
                        <label className="btn-file" htmlFor="product-images-input">
                          Chọn hình ảnh
                        </label>

                        {(currentProduct.images || []).length > 0 && (
                          <button
                            type="button"
                            className="btn-clear-image"
                            onClick={clearAllImages}
                            title="Xoá tất cả"
                          >
                            <X size={16} />
                          </button>
                        )}

                        <div className="image-count">
                          {(currentProduct.images || []).length}/{MAX_IMAGES}
                        </div>
                      </div>

                      <div className="image-preview">
                        {(currentProduct.images || []).length > 0 ? (
                          <div className="image-grid">
                            {(currentProduct.images || []).map((src, idx) => (
                              <div key={idx} className="image-tile">
                                <img src={src} alt={`preview-${idx}`} />
                                <button
                                  type="button"
                                  className="btn-remove-image"
                                  onClick={() => removeImageAt(idx)}
                                  title="Xoá ảnh"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="image-empty">Chưa có hình</div>
                        )}
                      </div>
                    </div>

                    <div className="form-group" />
                  </div>
                </>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={closeProductModal}>
                Đóng
              </button>

              {!isView && (
                <button className="btn-save" onClick={handleSaveProduct}>
                  <Save size={20} />
                  Lưu
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
                Bạn có chắc chắn muốn xoá <strong>{deleteLabel}</strong>:{' '}
                <strong>{deleteTarget?.title}</strong>?
              </p>

              {deleteTarget?.subtitle && (
                <p className="delete-subtitle">{deleteTarget.subtitle}</p>
              )}

              {deleteError && <div className="form-error">{deleteError}</div>}

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
