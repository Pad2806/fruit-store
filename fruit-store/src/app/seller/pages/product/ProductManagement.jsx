import React, { useCallback, useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Search, X, Save, ChevronLeft, ChevronRight, Upload, Eye } from 'lucide-react';
import { productApi, categoryApi, originApi } from '@/services/api';
import './ProductManagement.css';

const MAX_IMAGES = 5;

const ProductManagement = ({
    onProductsChange // Callback khi products thay đổi (để sync với parent nếu cần)
}) => {
    const [products, setProducts] = useState([]);
    const [productsLoading, setProductsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Categories and Origins for select dropdowns
    const [categories, setCategories] = useState([]);
    const [origins, setOrigins] = useState([]);

    // Pagination state
    const [pagination, setPagination] = useState({
        currentPage: 1,
        lastPage: 1,
        perPage: 5,
        total: 0,
        from: null,
        to: null,
    });

    const [showProductModal, setShowProductModal] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit' | 'view'
    const [productFormError, setProductFormError] = useState('');
    const [currentProduct, setCurrentProduct] = useState({
        id: null,
        name: '',
        price: '',
        stock_quantity: '',
        unit: 'kg',
        images: [],
        newImages: [],
        deleteImages: [],
        status: 'active',
        short_desc: '',
        detail_desc: '',
        category_id: '',
        origin_id: '',
        sold_quantity: 0,
    });

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteError, setDeleteError] = useState('');

    const isView = modalMode === 'view';

    const units = ['kg', 'hộp', 'trái', 'bó'];

    const productStatuses = [
        { value: 'active', label: 'Đang bán', color: '#27ae60' },
        { value: 'inactive', label: 'Ngừng bán', color: '#e74c3c' },
    ];

    const getStatusLabel = (status) =>
        productStatuses.find((s) => s.value === status)?.label || status;

    const getStatusColor = (status) =>
        productStatuses.find((s) => s.value === status)?.color || '#95a5a6';

    const formatMoney = (value) => Number(value || 0).toLocaleString('vi-VN') + '₫';

    // Fetch categories and origins for dropdowns
    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const [catRes, oriRes] = await Promise.all([
                    categoryApi.getAll({ per_page: 100 }),
                    originApi.getAll({ per_page: 100 }),
                ]);
                setCategories(catRes.data || []);
                setOrigins(oriRes.data || []);
            } catch (error) {
                console.error('Error fetching dropdown data:', error);
            }
        };
        fetchDropdownData();
    }, []);

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            if (searchTerm !== debouncedSearch) {
                setPagination(prev => ({ ...prev, currentPage: 1 }));
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Fetch products from API with pagination and search
    const fetchProducts = useCallback(async (page = 1, search = '') => {
        try {
            setProductsLoading(true);
            const response = await productApi.getAll({
                page,
                per_page: pagination.perPage,
                search,
            });

            // Map products from API
            const productsData = (response.data || []).map((product) => ({
                id: product.id,
                name: product.name,
                price: product.price,
                stock_quantity: product.stock_quantity,
                sold_quantity: product.sold_quantity,
                unit: product.unit,
                images: product.images || [],
                status: product.status,
                short_desc: product.short_desc,
                detail_desc: product.detail_desc,
                category_id: product.category?.id || '',
                category_name: product.category?.name || '',
                origin_id: product.origin?.id || '',
                origin_name: product.origin?.name || '',
            }));
            setProducts(productsData);

            // Update pagination
            if (response.pagination) {
                setPagination({
                    currentPage: response.pagination.current_page,
                    lastPage: response.pagination.last_page,
                    perPage: response.pagination.per_page,
                    total: response.pagination.total,
                    from: response.pagination.from,
                    to: response.pagination.to,
                });
            }

            if (onProductsChange) {
                onProductsChange(productsData, response.pagination?.total || 0);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setProductsLoading(false);
        }
    }, [pagination.perPage, onProductsChange]);

    // Fetch products when page or search changes
    useEffect(() => {
        fetchProducts(pagination.currentPage, debouncedSearch);
    }, [pagination.currentPage, debouncedSearch]);

    // Handle page change
    const goToPage = (page) => {
        if (page >= 1 && page <= pagination.lastPage) {
            setPagination(prev => ({ ...prev, currentPage: page }));
        }
    };

    // Modal handlers
    const openProductModal = (mode, product = null) => {
        setModalMode(mode);
        setProductFormError('');

        if (mode === 'create') {
            setCurrentProduct({
                id: null,
                name: '',
                price: '',
                stock_quantity: '',
                unit: 'kg',
                images: [],
                newImages: [],
                deleteImages: [],
                status: 'active',
                short_desc: '',
                detail_desc: '',
                category_id: categories[0]?.id || '',
                origin_id: origins[0]?.id || '',
                sold_quantity: 0,
            });
        } else if (product) {
            setCurrentProduct({
                ...product,
                newImages: [],
                deleteImages: [],
            });
        }

        setShowProductModal(true);
    };

    const closeProductModal = () => {
        setShowProductModal(false);
        setProductFormError('');
    };

    const handleCreateProduct = () => openProductModal('create');
    const handleEditProduct = (p) => openProductModal('edit', p);
    const handleViewProduct = (p) => openProductModal('view', p);

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const currentTotal = (currentProduct.images?.length || 0) + (currentProduct.newImages?.length || 0);
        const remaining = MAX_IMAGES - currentTotal;

        if (remaining <= 0) {
            setProductFormError(`Chỉ được upload tối đa ${MAX_IMAGES} ảnh.`);
            return;
        }

        const filesToAdd = files.slice(0, remaining);
        setCurrentProduct(prev => ({
            ...prev,
            newImages: [...(prev.newImages || []), ...filesToAdd],
        }));
        setProductFormError('');
    };

    const removeNewImage = (index) => {
        setCurrentProduct(prev => ({
            ...prev,
            newImages: prev.newImages.filter((_, i) => i !== index),
        }));
    };

    const removeExistingImage = (imagePath) => {
        // Extract relative path from full URL for delete_images
        // Full URL: http://localhost:8000/storage/products/xxx.jpg
        // Need: products/xxx.jpg
        let relativePath = imagePath;
        if (imagePath.includes('/storage/')) {
            relativePath = imagePath.split('/storage/')[1];
        }

        setCurrentProduct(prev => ({
            ...prev,
            images: prev.images.filter(img => img !== imagePath),
            deleteImages: [...(prev.deleteImages || []), relativePath],
        }));
    };

    const handleSaveProduct = async () => {
        const name = String(currentProduct.name || '').trim();
        const price = parseFloat(currentProduct.price) || 0;
        const stock_quantity = parseInt(currentProduct.stock_quantity) || 0;

        if (!name) {
            setProductFormError('Vui lòng nhập tên sản phẩm.');
            return;
        }
        if (price <= 0) {
            setProductFormError('Vui lòng nhập giá hợp lệ.');
            return;
        }
        if (!currentProduct.category_id) {
            setProductFormError('Vui lòng chọn danh mục.');
            return;
        }
        if (!currentProduct.origin_id) {
            setProductFormError('Vui lòng chọn xuất xứ.');
            return;
        }

        setProductFormError('');

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('price', price);
            formData.append('stock_quantity', stock_quantity);
            formData.append('unit', currentProduct.unit);
            formData.append('status', currentProduct.status);
            formData.append('short_desc', currentProduct.short_desc || '');
            formData.append('detail_desc', currentProduct.detail_desc || '');
            formData.append('category_id', currentProduct.category_id);
            formData.append('origin_id', currentProduct.origin_id);
            formData.append('sold_quantity', currentProduct.sold_quantity || 0);

            // Add new images
            if (currentProduct.newImages && currentProduct.newImages.length > 0) {
                currentProduct.newImages.forEach((file) => {
                    formData.append('images[]', file);
                });
            }

            // Add images to delete (for update)
            if (modalMode === 'edit' && currentProduct.deleteImages && currentProduct.deleteImages.length > 0) {
                currentProduct.deleteImages.forEach((path) => {
                    formData.append('delete_images[]', path);
                });
            }

            if (modalMode === 'create') {
                const response = await productApi.create(formData);
                if (response.success) {
                    await fetchProducts(1, debouncedSearch);
                    setPagination(prev => ({ ...prev, currentPage: 1 }));
                } else {
                    setProductFormError(response.message || 'Có lỗi xảy ra khi tạo sản phẩm.');
                    return;
                }
            } else {
                const response = await productApi.update(currentProduct.id, formData);
                if (response.success) {
                    await fetchProducts(pagination.currentPage, debouncedSearch);
                } else {
                    setProductFormError(response.message || 'Có lỗi xảy ra khi cập nhật sản phẩm.');
                    return;
                }
            }

            closeProductModal();
        } catch (error) {
            console.error('Error saving product:', error);
            setProductFormError('Có lỗi xảy ra khi lưu sản phẩm.');
        }
    };

    // Delete handlers
    const openDeleteProductModal = (p) => {
        setDeleteError('');
        setDeleteTarget({
            id: p.id,
            title: p.name,
            subtitle: `Giá: ${formatMoney(p.price)}`,
        });
        setShowDeleteModal(true);
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setDeleteTarget(null);
        setDeleteError('');
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;

        try {
            const response = await productApi.delete(deleteTarget.id);
            if (response.success) {
                const newPage = products.length === 1 && pagination.currentPage > 1
                    ? pagination.currentPage - 1
                    : pagination.currentPage;
                await fetchProducts(newPage, debouncedSearch);
                setPagination(prev => ({ ...prev, currentPage: newPage }));

                setShowDeleteModal(false);
                setDeleteTarget(null);
                setDeleteError('');
            } else {
                setDeleteError(response.message || 'Không thể xóa sản phẩm.');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            setDeleteError(error.message || 'Có lỗi xảy ra khi xóa sản phẩm.');
        }
    };

    return (
        <div className="product-management">
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

            <div className="product-table">
                <table>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Ảnh</th>
                            <th>Tên sản phẩm</th>
                            <th>Giá</th>
                            <th>Tồn kho</th>
                            <th>Danh mục</th>
                            <th>Xuất xứ</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>

                    <tbody>
                        {productsLoading ? (
                            <tr>
                                <td colSpan="9" className="table-status">
                                    Đang tải sản phẩm...
                                </td>
                            </tr>
                        ) : products.length === 0 ? (
                            <tr>
                                <td colSpan="9" className="table-status">
                                    {searchTerm ? 'Không tìm thấy sản phẩm phù hợp.' : 'Không có sản phẩm nào.'}
                                </td>
                            </tr>
                        ) : (
                            products.map((product, index) => (
                                <tr
                                    key={product.id}
                                    onClick={() => handleViewProduct(product)}
                                    style={{ cursor: 'pointer' }}
                                    title="Bấm để xem chi tiết"
                                >
                                    <td className="product-stt">
                                        {(pagination.from || 0) + index}
                                    </td>
                                    <td className="product-image">
                                        {product.images && product.images[0] ? (
                                            <img src={product.images[0]} alt={product.name} />
                                        ) : (
                                            <div className="no-image">No img</div>
                                        )}
                                    </td>
                                    <td className="product-name">{product.name}</td>
                                    <td className="product-price">{formatMoney(product.price)}</td>
                                    <td className="product-stock">{product.stock_quantity} {product.unit}</td>
                                    <td className="product-category">{product.category_name || '-'}</td>
                                    <td className="product-origin">{product.origin_name || '-'}</td>
                                    <td>
                                        <span
                                            className="product-status-badge"
                                            style={{ backgroundColor: getStatusColor(product.status) }}
                                        >
                                            {getStatusLabel(product.status)}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="btn-view"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleViewProduct(product);
                                                }}
                                                title="Xem"
                                            >
                                                <Eye size={16} />
                                            </button>
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
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {!productsLoading && pagination.total > 0 && (
                <div className="pagination">
                    <div className="pagination-info">
                        Hiển thị {pagination.from} - {pagination.to} / {pagination.total} sản phẩm
                    </div>
                    <div className="pagination-controls">
                        <button
                            className="pagination-btn"
                            onClick={() => goToPage(pagination.currentPage - 1)}
                            disabled={pagination.currentPage === 1}
                        >
                            <ChevronLeft size={18} />
                        </button>

                        {Array.from({ length: pagination.lastPage }, (_, i) => i + 1)
                            .filter(page => {
                                return page === 1 ||
                                    page === pagination.lastPage ||
                                    Math.abs(page - pagination.currentPage) <= 1;
                            })
                            .map((page, idx, arr) => (
                                <React.Fragment key={page}>
                                    {idx > 0 && arr[idx - 1] !== page - 1 && (
                                        <span className="pagination-ellipsis">...</span>
                                    )}
                                    <button
                                        className={`pagination-btn ${page === pagination.currentPage ? 'active' : ''}`}
                                        onClick={() => goToPage(page)}
                                    >
                                        {page}
                                    </button>
                                </React.Fragment>
                            ))
                        }

                        <button
                            className="pagination-btn"
                            onClick={() => goToPage(pagination.currentPage + 1)}
                            disabled={pagination.currentPage === pagination.lastPage}
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            )}

            {/* Product Modal */}
            {showProductModal && (
                <div className="modal-overlay" onClick={closeProductModal}>
                    <div className="modal-content product-modal" onClick={(e) => e.stopPropagation()}>
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
                                <div className="product-detail">
                                    <div className="detail-images">
                                        {currentProduct.images && currentProduct.images.length > 0 ? (
                                            <div className="images-grid">
                                                {currentProduct.images.map((img, idx) => (
                                                    <img key={idx} src={img} alt={`Product ${idx + 1}`} />
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="no-images">Không có ảnh</div>
                                        )}
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Tên sản phẩm:</span>
                                        <span className="value">{currentProduct.name}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Giá:</span>
                                        <span className="value highlight">{formatMoney(currentProduct.price)}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Tồn kho:</span>
                                        <span className="value">{currentProduct.stock_quantity} {currentProduct.unit}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Đã bán:</span>
                                        <span className="value">{currentProduct.sold_quantity} {currentProduct.unit}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Danh mục:</span>
                                        <span className="value">{currentProduct.category_name || '-'}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Xuất xứ:</span>
                                        <span className="value">{currentProduct.origin_name || '-'}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Trạng thái:</span>
                                        <span
                                            className="product-status-badge"
                                            style={{ backgroundColor: getStatusColor(currentProduct.status) }}
                                        >
                                            {getStatusLabel(currentProduct.status)}
                                        </span>
                                    </div>
                                    <div className="detail-row full">
                                        <span className="label">Mô tả ngắn:</span>
                                        <span className="value">{currentProduct.short_desc || '-'}</span>
                                    </div>
                                    <div className="detail-row full">
                                        <span className="label">Mô tả chi tiết:</span>
                                        <span className="value">{currentProduct.detail_desc || '-'}</span>
                                    </div>
                                </div>
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
                                                placeholder="VD: Cam sành"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Giá (VNĐ) *</label>
                                            <input
                                                type="number"
                                                value={currentProduct.price}
                                                onChange={(e) => setCurrentProduct({ ...currentProduct, price: e.target.value })}
                                                placeholder="VD: 50000"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Tồn kho</label>
                                            <input
                                                type="number"
                                                value={currentProduct.stock_quantity}
                                                onChange={(e) => setCurrentProduct({ ...currentProduct, stock_quantity: e.target.value })}
                                                placeholder="VD: 100"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Đơn vị</label>
                                            <select
                                                value={currentProduct.unit}
                                                onChange={(e) => setCurrentProduct({ ...currentProduct, unit: e.target.value })}
                                            >
                                                {units.map((u) => (
                                                    <option key={u} value={u}>{u}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Danh mục *</label>
                                            <select
                                                value={currentProduct.category_id}
                                                onChange={(e) => setCurrentProduct({ ...currentProduct, category_id: e.target.value })}
                                            >
                                                <option value="">-- Chọn danh mục --</option>
                                                {categories.map((cat) => (
                                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Xuất xứ *</label>
                                            <select
                                                value={currentProduct.origin_id}
                                                onChange={(e) => setCurrentProduct({ ...currentProduct, origin_id: e.target.value })}
                                            >
                                                <option value="">-- Chọn xuất xứ --</option>
                                                {origins.map((ori) => (
                                                    <option key={ori.id} value={ori.id}>{ori.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="form-row single">
                                        <div className="form-group">
                                            <label>Trạng thái</label>
                                            <select
                                                value={currentProduct.status}
                                                onChange={(e) => setCurrentProduct({ ...currentProduct, status: e.target.value })}
                                            >
                                                {productStatuses.map((s) => (
                                                    <option key={s.value} value={s.value}>{s.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="form-row single">
                                        <div className="form-group">
                                            <label>Mô tả ngắn</label>
                                            <input
                                                type="text"
                                                value={currentProduct.short_desc}
                                                onChange={(e) => setCurrentProduct({ ...currentProduct, short_desc: e.target.value })}
                                                placeholder="Mô tả ngắn gọn về sản phẩm..."
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row single">
                                        <div className="form-group">
                                            <label>Mô tả chi tiết</label>
                                            <textarea
                                                value={currentProduct.detail_desc}
                                                onChange={(e) => setCurrentProduct({ ...currentProduct, detail_desc: e.target.value })}
                                                placeholder="Mô tả chi tiết về sản phẩm..."
                                                rows={4}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row single">
                                        <div className="form-group">
                                            <label>Hình ảnh (tối đa {MAX_IMAGES} ảnh)</label>

                                            {/* Existing images */}
                                            {currentProduct.images && currentProduct.images.length > 0 && (
                                                <div className="existing-images">
                                                    {currentProduct.images.map((img, idx) => (
                                                        <div key={idx} className="image-preview">
                                                            <img src={img} alt={`Product ${idx + 1}`} />
                                                            <button
                                                                type="button"
                                                                className="remove-image"
                                                                onClick={() => removeExistingImage(img)}
                                                            >
                                                                <X size={14} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* New images preview */}
                                            {currentProduct.newImages && currentProduct.newImages.length > 0 && (
                                                <div className="new-images">
                                                    {currentProduct.newImages.map((file, idx) => (
                                                        <div key={idx} className="image-preview">
                                                            <img src={URL.createObjectURL(file)} alt={`New ${idx + 1}`} />
                                                            <button
                                                                type="button"
                                                                className="remove-image"
                                                                onClick={() => removeNewImage(idx)}
                                                            >
                                                                <X size={14} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Upload button */}
                                            {((currentProduct.images?.length || 0) + (currentProduct.newImages?.length || 0)) < MAX_IMAGES && (
                                                <label className="upload-btn">
                                                    <Upload size={20} />
                                                    <span>Chọn ảnh</span>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        multiple
                                                        onChange={handleImageUpload}
                                                        style={{ display: 'none' }}
                                                    />
                                                </label>
                                            )}
                                        </div>
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

            {/* Delete Confirmation Modal */}
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
                                Bạn có chắc chắn muốn xoá sản phẩm <strong>{deleteTarget?.title}</strong>?
                            </p>
                            <p className="delete-subtitle">{deleteTarget?.subtitle}</p>
                            {deleteError && <p className="delete-warning">{deleteError}</p>}
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

export default ProductManagement;
