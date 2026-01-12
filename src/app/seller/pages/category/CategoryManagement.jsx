import React, { useCallback, useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Search, X, Save, ChevronLeft, ChevronRight } from 'lucide-react';
import { categoryApi } from '@/services/api';
import './CategoryManagement.css';

const CategoryManagement = ({
    onDeleteRequest, // Callback để request delete (sẽ được parent xử lý nếu cần)
    onCategoriesChange // Callback khi categories thay đổi (để sync với parent nếu cần)
}) => {
    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Pagination state
    const [pagination, setPagination] = useState({
        currentPage: 1,
        lastPage: 1,
        perPage: 5,
        total: 0,
        from: null,
        to: null,
    });

    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit' | 'view'
    const [categoryFormError, setCategoryFormError] = useState('');
    const [currentCategory, setCurrentCategory] = useState({ id: '', name: '', description: '' });

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteError, setDeleteError] = useState('');

    // Loading states
    const [saveLoading, setSaveLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const isView = modalMode === 'view';

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to page 1 when search changes
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Fetch categories from API with pagination
    const fetchCategories = useCallback(async (page = 1, search = '') => {
        try {
            setCategoriesLoading(true);
            const response = await categoryApi.getAll({
                page,
                per_page: pagination.perPage,
                search,
            });

            // Map categories from API
            const categoriesData = (response.data || []).map((cat) => ({
                id: cat.id,
                name: cat.name,
                description: cat.description || '',
            }));
            setCategories(categoriesData);

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

            if (onCategoriesChange) {
                onCategoriesChange(categoriesData, response.pagination?.total || 0);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setCategoriesLoading(false);
        }
    }, [pagination.perPage, onCategoriesChange]);

    // Fetch categories when page or search changes
    useEffect(() => {
        fetchCategories(pagination.currentPage, debouncedSearch);
    }, [pagination.currentPage, debouncedSearch]);

    // Handle page change
    const goToPage = (page) => {
        if (page >= 1 && page <= pagination.lastPage) {
            setPagination(prev => ({ ...prev, currentPage: page }));
        }
    };

    // Modal handlers
    const openCategoryModal = (mode, category = null) => {
        setModalMode(mode);
        setCategoryFormError('');

        if (mode === 'create') {
            setCurrentCategory({ id: '', name: '', description: '' });
        } else if (category) {
            setCurrentCategory({ ...category });
        }

        setShowCategoryModal(true);
    };

    const closeCategoryModal = () => {
        setShowCategoryModal(false);
        setCategoryFormError('');
    };

    const handleCreateCategory = () => openCategoryModal('create');
    const handleEditCategory = (c) => openCategoryModal('edit', c);
    const handleViewCategory = (c) => openCategoryModal('view', c);

    const handleSaveCategory = async () => {
        const name = String(currentCategory.name || '').trim();
        const description = String(currentCategory.description || '').trim();

        if (!name) {
            setCategoryFormError('Vui lòng nhập tên danh mục.');
            return;
        }

        const dup = categories.some(
            (c) =>
                c.id !== currentCategory.id &&
                String(c.name).trim().toLowerCase() === name.toLowerCase()
        );
        if (dup) {
            setCategoryFormError('Tên danh mục đã tồn tại.');
            return;
        }

        setCategoryFormError('');
        setSaveLoading(true);

        try {
            if (modalMode === 'create') {
                const response = await categoryApi.create({ name, description });
                if (response.success) {
                    // Refetch to get updated data with pagination
                    await fetchCategories(1, debouncedSearch);
                    setPagination(prev => ({ ...prev, currentPage: 1 }));
                }
            } else {
                const response = await categoryApi.update(currentCategory.id, { name, description });
                if (response.success) {
                    // Refetch current page to update data
                    await fetchCategories(pagination.currentPage, debouncedSearch);
                }
            }

            closeCategoryModal();
        } catch (error) {
            console.error('Error saving category:', error);
            setCategoryFormError('Có lỗi xảy ra khi lưu danh mục.');
        } finally {
            setSaveLoading(false);
        }
    };

    // Delete handlers
    const openDeleteCategoryModal = (c) => {
        setDeleteError('');
        setDeleteTarget({
            id: c.id,
            title: c.name,
            subtitle: `ID: ${c.id}`,
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
        setDeleteLoading(true);

        try {
            const response = await categoryApi.delete(deleteTarget.id);
            if (response.success) {
                // Refetch current page to update data
                // If current page becomes empty, go to previous page
                const newPage = categories.length === 1 && pagination.currentPage > 1
                    ? pagination.currentPage - 1
                    : pagination.currentPage;
                await fetchCategories(newPage, debouncedSearch);
                setPagination(prev => ({ ...prev, currentPage: newPage }));

                setShowDeleteModal(false);
                setDeleteTarget(null);
                setDeleteError('');
            } else {
                setDeleteError(response.message || 'Không thể xóa danh mục.');
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            setDeleteError(error.message || 'Có lỗi xảy ra khi xóa danh mục.');
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <div className="category-management">
            <div className="toolbar">
                <div className="search-box">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Tìm kiếm danh mục..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <button className="btn-create" onClick={handleCreateCategory}>
                    <Plus size={20} />
                    Thêm danh mục
                </button>
            </div>

            <div className="category-table">
                <table>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Tên danh mục</th>
                            <th>Mô tả</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>

                    <tbody>
                        {categoriesLoading ? (
                            <tr>
                                <td colSpan="4" className="table-status">
                                    Đang tải danh mục...
                                </td>
                            </tr>
                        ) : categories.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="table-status">
                                    Không có danh mục nào.
                                </td>
                            </tr>
                        ) : (
                            categories.map((c, index) => (
                                <tr
                                    key={c.id}
                                    onClick={() => handleViewCategory(c)}
                                    style={{ cursor: 'pointer' }}
                                    title="Bấm để xem chi tiết"
                                >
                                    <td className="category-stt">
                                        {(pagination.from || 0) + index}
                                    </td>
                                    <td className="category-name">{c.name}</td>
                                    <td className="muted-cell">{c.description || '-'}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="btn-edit"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditCategory(c);
                                                }}
                                                title="Sửa"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                className="btn-delete"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openDeleteCategoryModal(c);
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
            {!categoriesLoading && pagination.total > 0 && (
                <div className="pagination">
                    <div className="pagination-info">
                        Hiển thị {pagination.from} - {pagination.to} / {pagination.total} danh mục
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
                                // Show first, last, current, and pages around current
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

            {/* Category Modal */}
            {showCategoryModal && (
                <div className="modal-overlay" onClick={closeCategoryModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>
                                {modalMode === 'create'
                                    ? 'Thêm danh mục mới'
                                    : modalMode === 'edit'
                                        ? 'Chỉnh sửa danh mục'
                                        : 'Chi tiết danh mục'}
                            </h2>
                            <button className="btn-close" onClick={closeCategoryModal}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="modal-body">
                            {categoryFormError && <div className="form-error">{categoryFormError}</div>}

                            {isView ? (
                                <>
                                    <div className="category-detail">
                                        <div className="detail-row">
                                            <span className="label">ID:</span>
                                            <span className="value">{currentCategory.id}</span>
                                        </div>

                                        <div className="detail-row">
                                            <span className="label">Tên danh mục:</span>
                                            <span className="value">{currentCategory.name}</span>
                                        </div>

                                        <div className="detail-row">
                                            <span className="label">Mô tả:</span>
                                            <span className="value">{currentCategory.description || '-'}</span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="form-row">
                                        {modalMode === 'edit' && (
                                            <div className="form-group">
                                                <label>ID</label>
                                                <input type="text" value={currentCategory.id} disabled />
                                            </div>
                                        )}

                                        <div className="form-group">
                                            <label>Tên danh mục *</label>
                                            <input
                                                type="text"
                                                value={currentCategory.name}
                                                onChange={(e) => {
                                                    setCurrentCategory({ ...currentCategory, name: e.target.value });
                                                    if (categoryFormError) setCategoryFormError('');
                                                }}
                                                placeholder="VD: Trái cây nội địa"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row single">
                                        <div className="form-group">
                                            <label>Mô tả</label>
                                            <textarea
                                                className="textarea"
                                                value={currentCategory.description}
                                                onChange={(e) =>
                                                    setCurrentCategory({ ...currentCategory, description: e.target.value })
                                                }
                                                placeholder="Mô tả danh mục..."
                                                rows={4}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={closeCategoryModal}>
                                Đóng
                            </button>

                            {!isView && (
                                <button
                                    className="btn-save"
                                    onClick={handleSaveCategory}
                                    disabled={saveLoading}
                                >
                                    {saveLoading ? (
                                        <span className="loading-spinner"></span>
                                    ) : (
                                        <Save size={20} />
                                    )}
                                    {saveLoading ? 'Đang lưu...' : 'Lưu'}
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
                                Bạn có chắc chắn muốn xoá danh mục <strong>{deleteTarget?.title}</strong>?
                            </p>
                            <p className="delete-subtitle">{deleteTarget?.subtitle}</p>
                            {deleteError && <p className="delete-warning">{deleteError}</p>}
                        </div>

                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={cancelDelete} disabled={deleteLoading}>
                                Huỷ
                            </button>
                            <button
                                className="btn-delete-confirm"
                                onClick={confirmDelete}
                                disabled={deleteLoading}
                            >
                                {deleteLoading ? (
                                    <><span className="loading-spinner"></span> Đang xoá...</>
                                ) : 'Xoá'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryManagement;
