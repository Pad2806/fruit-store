// import React, { useCallback, useEffect, useState } from 'react';
// import { Plus, Edit2, Trash2, Search, X, Save, ChevronLeft, ChevronRight } from 'lucide-react';
// import { originApi } from '@/services/api';
// import './OriginManagement.css';

// const OriginManagement = ({
//     onOriginsChange // Callback khi origins thay đổi (để sync với parent nếu cần)
// }) => {
//     const [origins, setOrigins] = useState([]);
//     const [originsLoading, setOriginsLoading] = useState(true);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [debouncedSearch, setDebouncedSearch] = useState('');

//     // Pagination state
//     const [pagination, setPagination] = useState({
//         currentPage: 1,
//         lastPage: 1,
//         perPage: 5,
//         total: 0,
//         from: null,
//         to: null,
//     });

//     const [showOriginModal, setShowOriginModal] = useState(false);
//     const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit' | 'view'
//     const [originFormError, setOriginFormError] = useState('');
//     const [currentOrigin, setCurrentOrigin] = useState({ id: '', name: '', description: '' });

//     const [showDeleteModal, setShowDeleteModal] = useState(false);
//     const [deleteTarget, setDeleteTarget] = useState(null);
//     const [deleteError, setDeleteError] = useState('');

//     // Loading states
//     const [saveLoading, setSaveLoading] = useState(false);
//     const [deleteLoading, setDeleteLoading] = useState(false);

//     const isView = modalMode === 'view';

//     // Debounce search term
//     useEffect(() => {
//         const timer = setTimeout(() => {
//             setDebouncedSearch(searchTerm);
//             // Reset to page 1 when search changes
//             if (searchTerm !== debouncedSearch) {
//                 setPagination(prev => ({ ...prev, currentPage: 1 }));
//             }
//         }, 300);
//         return () => clearTimeout(timer);
//     }, [searchTerm]);

//     // Fetch origins from API with pagination and search
//     const fetchOrigins = useCallback(async (page = 1, search = '') => {
//         try {
//             setOriginsLoading(true);
//             const response = await originApi.getAll({
//                 page,
//                 per_page: pagination.perPage,
//                 search,
//             });

//             // Map origins from API
//             const originsData = (response.data || []).map((ori) => ({
//                 id: ori.id,
//                 name: ori.name,
//                 description: ori.description || '',
//             }));
//             setOrigins(originsData);

//             // Update pagination
//             if (response.pagination) {
//                 setPagination({
//                     currentPage: response.pagination.current_page,
//                     lastPage: response.pagination.last_page,
//                     perPage: response.pagination.per_page,
//                     total: response.pagination.total,
//                     from: response.pagination.from,
//                     to: response.pagination.to,
//                 });
//             }

//             if (onOriginsChange) {
//                 onOriginsChange(originsData, response.pagination?.total || 0);
//             }
//         } catch (error) {
//             console.error('Error fetching origins:', error);
//         } finally {
//             setOriginsLoading(false);
//         }
//     }, [pagination.perPage, onOriginsChange]);

//     // Fetch origins when page or search changes
//     useEffect(() => {
//         fetchOrigins(pagination.currentPage, debouncedSearch);
//     }, [pagination.currentPage, debouncedSearch]);

//     // Handle page change
//     const goToPage = (page) => {
//         if (page >= 1 && page <= pagination.lastPage) {
//             setPagination(prev => ({ ...prev, currentPage: page }));
//         }
//     };

//     // Modal handlers
//     const openOriginModal = (mode, origin = null) => {
//         setModalMode(mode);
//         setOriginFormError('');

//         if (mode === 'create') {
//             setCurrentOrigin({ id: '', name: '', description: '' });
//         } else if (origin) {
//             setCurrentOrigin({ ...origin });
//         }

//         setShowOriginModal(true);
//     };

//     const closeOriginModal = () => {
//         setShowOriginModal(false);
//         setOriginFormError('');
//     };

//     const handleCreateOrigin = () => openOriginModal('create');
//     const handleEditOrigin = (o) => openOriginModal('edit', o);
//     const handleViewOrigin = (o) => openOriginModal('view', o);

//     const handleSaveOrigin = async () => {
//         const name = String(currentOrigin.name || '').trim();
//         const description = String(currentOrigin.description || '').trim();

//         if (!name) {
//             setOriginFormError('Vui lòng nhập tên xuất xứ.');
//             return;
//         }

//         const dup = origins.some(
//             (o) =>
//                 o.id !== currentOrigin.id &&
//                 String(o.name).trim().toLowerCase() === name.toLowerCase()
//         );
//         if (dup) {
//             setOriginFormError('Tên xuất xứ đã tồn tại.');
//             return;
//         }

//         setOriginFormError('');
//         setSaveLoading(true);

//         try {
//             if (modalMode === 'create') {
//                 const response = await originApi.create({ name, description });
//                 if (response.success) {
//                     // Refetch to get updated data with pagination
//                     await fetchOrigins(1, debouncedSearch);
//                     setPagination(prev => ({ ...prev, currentPage: 1 }));
//                 }
//             } else {
//                 const response = await originApi.update(currentOrigin.id, { name, description });
//                 if (response.success) {
//                     // Refetch current page to update data
//                     await fetchOrigins(pagination.currentPage, debouncedSearch);
//                 }
//             }

//             closeOriginModal();
//         } catch (error) {
//             console.error('Error saving origin:', error);
//             setOriginFormError('Có lỗi xảy ra khi lưu xuất xứ.');
//         } finally {
//             setSaveLoading(false);
//         }
//     };

//     // Delete handlers
//     const openDeleteOriginModal = (o) => {
//         setDeleteError('');
//         setDeleteTarget({
//             id: o.id,
//             title: o.name,
//             subtitle: `ID: ${o.id}`,
//         });
//         setShowDeleteModal(true);
//     };

//     const cancelDelete = () => {
//         setShowDeleteModal(false);
//         setDeleteTarget(null);
//         setDeleteError('');
//     };

//     const confirmDelete = async () => {
//         if (!deleteTarget) return;
//         setDeleteLoading(true);

//         try {
//             const response = await originApi.delete(deleteTarget.id);
//             if (response.success) {
//                 // Refetch current page to update data
//                 // If current page becomes empty, go to previous page
//                 const newPage = origins.length === 1 && pagination.currentPage > 1
//                     ? pagination.currentPage - 1
//                     : pagination.currentPage;
//                 await fetchOrigins(newPage, debouncedSearch);
//                 setPagination(prev => ({ ...prev, currentPage: newPage }));

//                 setShowDeleteModal(false);
//                 setDeleteTarget(null);
//                 setDeleteError('');
//             } else {
//                 setDeleteError(response.message || 'Không thể xóa xuất xứ.');
//             }
//         } catch (error) {
//             console.error('Error deleting origin:', error);
//             setDeleteError(error.message || 'Có lỗi xảy ra khi xóa xuất xứ.');
//         } finally {
//             setDeleteLoading(false);
//         }
//     };

//     return (
//         <div className="origin-management">
//             <div className="toolbar">
//                 <div className="search-box">
//                     <Search size={20} />
//                     <input
//                         type="text"
//                         placeholder="Tìm kiếm xuất xứ..."
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                     />
//                 </div>

//                 <button className="btn-create" onClick={handleCreateOrigin}>
//                     <Plus size={20} />
//                     Thêm xuất xứ
//                 </button>
//             </div>

//             <div className="origin-table">
//                 <table>
//                     <thead>
//                         <tr>
//                             <th>STT</th>
//                             <th>Tên xuất xứ</th>
//                             <th>Mô tả</th>
//                             <th>Thao tác</th>
//                         </tr>
//                     </thead>

//                     <tbody>
//                         {originsLoading ? (
//                             <tr>
//                                 <td colSpan="4" className="table-status">
//                                     Đang tải xuất xứ...
//                                 </td>
//                             </tr>
//                         ) : origins.length === 0 ? (
//                             <tr>
//                                 <td colSpan="4" className="table-status">
//                                     {searchTerm ? 'Không tìm thấy xuất xứ phù hợp.' : 'Không có xuất xứ nào.'}
//                                 </td>
//                             </tr>
//                         ) : (
//                             origins.map((o, index) => (
//                                 <tr
//                                     key={o.id}
//                                     onClick={() => handleViewOrigin(o)}
//                                     style={{ cursor: 'pointer' }}
//                                     title="Bấm để xem chi tiết"
//                                 >
//                                     <td className="origin-stt">
//                                         {(pagination.from || 0) + index}
//                                     </td>
//                                     <td className="origin-name">{o.name}</td>
//                                     <td className="muted-cell">{o.description || '-'}</td>
//                                     <td>
//                                         <div className="action-buttons">
//                                             <button
//                                                 className="btn-edit"
//                                                 onClick={(e) => {
//                                                     e.stopPropagation();
//                                                     handleEditOrigin(o);
//                                                 }}
//                                                 title="Sửa"
//                                             >
//                                                 <Edit2 size={16} />
//                                             </button>
//                                             <button
//                                                 className="btn-delete"
//                                                 onClick={(e) => {
//                                                     e.stopPropagation();
//                                                     openDeleteOriginModal(o);
//                                                 }}
//                                                 title="Xoá"
//                                             >
//                                                 <Trash2 size={16} />
//                                             </button>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             ))
//                         )}
//                     </tbody>
//                 </table>
//             </div>

//             {/* Pagination */}
//             {!originsLoading && pagination.total > 0 && (
//                 <div className="pagination">
//                     <div className="pagination-info">
//                         Hiển thị {pagination.from} - {pagination.to} / {pagination.total} xuất xứ
//                     </div>
//                     <div className="pagination-controls">
//                         <button
//                             className="pagination-btn"
//                             onClick={() => goToPage(pagination.currentPage - 1)}
//                             disabled={pagination.currentPage === 1}
//                         >
//                             <ChevronLeft size={18} />
//                         </button>

//                         {Array.from({ length: pagination.lastPage }, (_, i) => i + 1)
//                             .filter(page => {
//                                 return page === 1 ||
//                                     page === pagination.lastPage ||
//                                     Math.abs(page - pagination.currentPage) <= 1;
//                             })
//                             .map((page, idx, arr) => (
//                                 <React.Fragment key={page}>
//                                     {idx > 0 && arr[idx - 1] !== page - 1 && (
//                                         <span className="pagination-ellipsis">...</span>
//                                     )}
//                                     <button
//                                         className={`pagination-btn ${page === pagination.currentPage ? 'active' : ''}`}
//                                         onClick={() => goToPage(page)}
//                                     >
//                                         {page}
//                                     </button>
//                                 </React.Fragment>
//                             ))
//                         }

//                         <button
//                             className="pagination-btn"
//                             onClick={() => goToPage(pagination.currentPage + 1)}
//                             disabled={pagination.currentPage === pagination.lastPage}
//                         >
//                             <ChevronRight size={18} />
//                         </button>
//                     </div>
//                 </div>
//             )}

//             {/* Origin Modal */}
//             {showOriginModal && (
//                 <div className="modal-overlay" onClick={closeOriginModal}>
//                     <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//                         <div className="modal-header">
//                             <h2>
//                                 {modalMode === 'create'
//                                     ? 'Thêm xuất xứ mới'
//                                     : modalMode === 'edit'
//                                         ? 'Chỉnh sửa xuất xứ'
//                                         : 'Chi tiết xuất xứ'}
//                             </h2>
//                             <button className="btn-close" onClick={closeOriginModal}>
//                                 <X size={24} />
//                             </button>
//                         </div>

//                         <div className="modal-body">
//                             {originFormError && <div className="form-error">{originFormError}</div>}

//                             {isView ? (
//                                 <>
//                                     <div className="origin-detail">
//                                         <div className="detail-row">
//                                             <span className="label">ID:</span>
//                                             <span className="value">{currentOrigin.id}</span>
//                                         </div>

//                                         <div className="detail-row">
//                                             <span className="label">Tên xuất xứ:</span>
//                                             <span className="value">{currentOrigin.name}</span>
//                                         </div>

//                                         <div className="detail-row">
//                                             <span className="label">Mô tả:</span>
//                                             <span className="value">{currentOrigin.description || '-'}</span>
//                                         </div>
//                                     </div>
//                                 </>
//                             ) : (
//                                 <>
//                                     <div className="form-row">
//                                         {modalMode === 'edit' && (
//                                             <div className="form-group">
//                                                 <label>ID</label>
//                                                 <input type="text" value={currentOrigin.id} disabled />
//                                             </div>
//                                         )}

//                                         <div className="form-group">
//                                             <label>Tên xuất xứ *</label>
//                                             <input
//                                                 type="text"
//                                                 value={currentOrigin.name}
//                                                 onChange={(e) => {
//                                                     setCurrentOrigin({ ...currentOrigin, name: e.target.value });
//                                                     if (originFormError) setOriginFormError('');
//                                                 }}
//                                                 placeholder="VD: Việt Nam"
//                                             />
//                                         </div>
//                                     </div>

//                                     <div className="form-row single">
//                                         <div className="form-group">
//                                             <label>Mô tả</label>
//                                             <textarea
//                                                 className="textarea"
//                                                 value={currentOrigin.description}
//                                                 onChange={(e) =>
//                                                     setCurrentOrigin({ ...currentOrigin, description: e.target.value })
//                                                 }
//                                                 placeholder="Mô tả xuất xứ..."
//                                                 rows={4}
//                                             />
//                                         </div>
//                                     </div>
//                                 </>
//                             )}
//                         </div>

//                         <div className="modal-footer">
//                             <button className="btn-cancel" onClick={closeOriginModal}>
//                                 Đóng
//                             </button>

//                             {!isView && (
//                                 <button
//                                     className="btn-save"
//                                     onClick={handleSaveOrigin}
//                                     disabled={saveLoading}
//                                 >
//                                     {saveLoading ? (
//                                         <span className="loading-spinner"></span>
//                                     ) : (
//                                         <Save size={20} />
//                                     )}
//                                     {saveLoading ? 'Đang lưu...' : 'Lưu'}
//                                 </button>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Delete Confirmation Modal */}
//             {showDeleteModal && (
//                 <div className="modal-overlay" onClick={cancelDelete}>
//                     <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
//                         <div className="modal-header delete">
//                             <h2>Xác nhận xoá</h2>
//                             <button className="btn-close" onClick={cancelDelete}>
//                                 <X size={24} />
//                             </button>
//                         </div>

//                         <div className="modal-body">
//                             <p>
//                                 Bạn có chắc chắn muốn xoá xuất xứ <strong>{deleteTarget?.title}</strong>?
//                             </p>
//                             <p className="delete-subtitle">{deleteTarget?.subtitle}</p>
//                             {deleteError && <p className="delete-warning">{deleteError}</p>}
//                         </div>

//                         <div className="modal-footer">
//                             <button className="btn-cancel" onClick={cancelDelete} disabled={deleteLoading}>
//                                 Huỷ
//                             </button>
//                             <button
//                                 className="btn-delete-confirm"
//                                 onClick={confirmDelete}
//                                 disabled={deleteLoading}
//                             >
//                                 {deleteLoading ? (
//                                     <><span className="loading-spinner"></span> Đang xoá...</>
//                                 ) : 'Xoá'}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default OriginManagement;


import React, { useCallback, useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Search, X, Save, ChevronLeft, ChevronRight } from 'lucide-react';
import { originApi } from '@/services/api';
import './OriginManagement.css';

const OriginManagement = ({
    onOriginsChange // Callback khi origins thay đổi (để sync với parent nếu cần)
}) => {
    const [origins, setOrigins] = useState([]);
    const [originsLoading, setOriginsLoading] = useState(true);
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

    const [showOriginModal, setShowOriginModal] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit' | 'view'
    const [originFormError, setOriginFormError] = useState('');
    const [currentOrigin, setCurrentOrigin] = useState({ id: '', name: '', description: '' });

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteError, setDeleteError] = useState('');

    // Loading states
    const [saveLoading, setSaveLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const isView = modalMode === 'view';

    // Ref to track previous search for proper page reset
    const prevSearchRef = React.useRef(debouncedSearch);
    // Ref to track request ID for ignoring stale responses
    const requestIdRef = React.useRef(0);

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Reset to page 1 when search term changes (not on initial mount)
    useEffect(() => {
        if (prevSearchRef.current !== debouncedSearch) {
            prevSearchRef.current = debouncedSearch;
            setPagination(prev => ({ ...prev, currentPage: 1 }));
        }
    }, [debouncedSearch]);

    // Fetch origins from API with pagination and search
    const fetchOrigins = useCallback(async (page, search, perPage) => {
        // Increment request ID to track this specific request
        requestIdRef.current += 1;
        const currentRequestId = requestIdRef.current;

        try {
            setOriginsLoading(true);
            setOrigins([]); // Clear old data immediately

            const response = await originApi.getAll({
                page,
                per_page: perPage,
                search,
            });

            // IMPORTANT: Check if this is still the latest request
            if (currentRequestId !== requestIdRef.current) {
                return;
            }

            // Map origins from API
            const originsData = (response.data || []).map((ori) => ({
                id: ori.id,
                name: ori.name,
                description: ori.description || '',
            }));
            setOrigins(originsData);

            // Update pagination metadata only (not currentPage to avoid re-trigger)
            if (response.pagination) {
                setPagination(prev => ({
                    ...prev,
                    lastPage: response.pagination.last_page,
                    perPage: response.pagination.per_page,
                    total: response.pagination.total,
                    from: response.pagination.from,
                    to: response.pagination.to,
                }));
            }

            if (onOriginsChange) {
                onOriginsChange(originsData, response.pagination?.total || 0);
            }
        } catch (error) {
            if (currentRequestId === requestIdRef.current) {
                console.error('Error fetching origins:', error);
            }
        } finally {
            if (currentRequestId === requestIdRef.current) {
                setOriginsLoading(false);
            }
        }
    }, [onOriginsChange]);

    // Fetch origins when page or search changes
    useEffect(() => {
        fetchOrigins(pagination.currentPage, debouncedSearch, pagination.perPage);
    }, [pagination.currentPage, debouncedSearch, pagination.perPage, fetchOrigins]);

    // Handle page change
    const goToPage = (page) => {
        if (page >= 1 && page <= pagination.lastPage) {
            setPagination(prev => ({ ...prev, currentPage: page }));
        }
    };

    // Modal handlers
    const openOriginModal = (mode, origin = null) => {
        setModalMode(mode);
        setOriginFormError('');

        if (mode === 'create') {
            setCurrentOrigin({ id: '', name: '', description: '' });
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

    const handleSaveOrigin = async () => {
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
        setSaveLoading(true);

        try {
            if (modalMode === 'create') {
                const response = await originApi.create({ name, description });
                if (response.success) {
                    // Refetch to get updated data with pagination
                    await fetchOrigins(1, debouncedSearch);
                    setPagination(prev => ({ ...prev, currentPage: 1 }));
                }
            } else {
                const response = await originApi.update(currentOrigin.id, { name, description });
                if (response.success) {
                    // Refetch current page to update data
                    await fetchOrigins(pagination.currentPage, debouncedSearch);
                }
            }

            closeOriginModal();
        } catch (error) {
            console.error('Error saving origin:', error);
            setOriginFormError('Có lỗi xảy ra khi lưu xuất xứ.');
        } finally {
            setSaveLoading(false);
        }
    };

    // Delete handlers
    const openDeleteOriginModal = (o) => {
        setDeleteError('');
        setDeleteTarget({
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

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        setDeleteLoading(true);

        try {
            const response = await originApi.delete(deleteTarget.id);
            if (response.success) {
                // Refetch current page to update data
                // If current page becomes empty, go to previous page
                const newPage = origins.length === 1 && pagination.currentPage > 1
                    ? pagination.currentPage - 1
                    : pagination.currentPage;
                await fetchOrigins(newPage, debouncedSearch);
                setPagination(prev => ({ ...prev, currentPage: newPage }));

                setShowDeleteModal(false);
                setDeleteTarget(null);
                setDeleteError('');
            } else {
                setDeleteError(response.message || 'Không thể xóa xuất xứ.');
            }
        } catch (error) {
            console.error('Error deleting origin:', error);
            setDeleteError(error.message || 'Có lỗi xảy ra khi xóa xuất xứ.');
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <div className="origin-management">
            <div className="toolbar">
                <div className="search-box">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Tìm kiếm xuất xứ..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <button className="btn-create" onClick={handleCreateOrigin}>
                    <Plus size={20} />
                    Thêm xuất xứ
                </button>
            </div>

            <div className="origin-table">
                <table>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Tên xuất xứ</th>
                            <th>Mô tả</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>

                    <tbody>
                        {originsLoading ? (
                            <tr>
                                <td colSpan="4" className="table-status">
                                    Đang tải xuất xứ...
                                </td>
                            </tr>
                        ) : origins.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="table-status">
                                    {searchTerm ? 'Không tìm thấy xuất xứ phù hợp.' : 'Không có xuất xứ nào.'}
                                </td>
                            </tr>
                        ) : (
                            origins.map((o, index) => (
                                <tr
                                    key={o.id}
                                    onClick={() => handleViewOrigin(o)}
                                    style={{ cursor: 'pointer' }}
                                    title="Bấm để xem chi tiết"
                                >
                                    <td className="origin-stt">
                                        {(pagination.from || 0) + index}
                                    </td>
                                    <td className="origin-name">{o.name}</td>
                                    <td className="muted-cell">{o.description || '-'}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="btn-edit"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditOrigin(o);
                                                }}
                                                title="Sửa"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                className="btn-delete"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openDeleteOriginModal(o);
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
            {!originsLoading && pagination.total > 0 && (
                <div className="pagination">
                    <div className="pagination-info">
                        Hiển thị {pagination.from} - {pagination.to} / {pagination.total} xuất xứ
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

            {/* Origin Modal */}
            {showOriginModal && (
                <div className="modal-overlay" onClick={closeOriginModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>
                                {modalMode === 'create'
                                    ? 'Thêm xuất xứ mới'
                                    : modalMode === 'edit'
                                        ? 'Chỉnh sửa xuất xứ'
                                        : 'Chi tiết xuất xứ'}
                            </h2>
                            <button className="btn-close" onClick={closeOriginModal}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="modal-body">
                            {originFormError && <div className="form-error">{originFormError}</div>}

                            {isView ? (
                                <>
                                    <div className="origin-detail">
                                        <div className="detail-row">
                                            <span className="label">ID:</span>
                                            <span className="value">{currentOrigin.id}</span>
                                        </div>

                                        <div className="detail-row">
                                            <span className="label">Tên xuất xứ:</span>
                                            <span className="value">{currentOrigin.name}</span>
                                        </div>

                                        <div className="detail-row">
                                            <span className="label">Mô tả:</span>
                                            <span className="value">{currentOrigin.description || '-'}</span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="form-row">
                                        {modalMode === 'edit' && (
                                            <div className="form-group">
                                                <label>ID</label>
                                                <input type="text" value={currentOrigin.id} disabled />
                                            </div>
                                        )}

                                        <div className="form-group">
                                            <label>Tên xuất xứ *</label>
                                            <input
                                                type="text"
                                                value={currentOrigin.name}
                                                onChange={(e) => {
                                                    setCurrentOrigin({ ...currentOrigin, name: e.target.value });
                                                    if (originFormError) setOriginFormError('');
                                                }}
                                                placeholder="VD: Việt Nam"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row single">
                                        <div className="form-group">
                                            <label>Mô tả</label>
                                            <textarea
                                                className="textarea"
                                                value={currentOrigin.description}
                                                onChange={(e) =>
                                                    setCurrentOrigin({ ...currentOrigin, description: e.target.value })
                                                }
                                                placeholder="Mô tả xuất xứ..."
                                                rows={4}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={closeOriginModal}>
                                Đóng
                            </button>

                            {!isView && (
                                <button
                                    className="btn-save"
                                    onClick={handleSaveOrigin}
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
                                Bạn có chắc chắn muốn xoá xuất xứ <strong>{deleteTarget?.title}</strong>?
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

export default OriginManagement;
