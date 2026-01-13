// import React, { useCallback, useEffect, useState } from 'react';
// import { Edit2, Trash2, Search, X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
// import { orderApi } from '@/services/api';
// import './OrderManagement.css';

// const OrderManagement = ({
//     onOrdersChange // Callback khi orders thay đổi (để sync với parent nếu cần)
// }) => {
//     const [orders, setOrders] = useState([]);
//     const [ordersLoading, setOrdersLoading] = useState(true);
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

//     const [showOrderModal, setShowOrderModal] = useState(false);
//     const [modalMode, setModalMode] = useState('view'); // 'view' | 'edit'
//     const [currentOrder, setCurrentOrder] = useState(null);

//     const [showDeleteModal, setShowDeleteModal] = useState(false);
//     const [deleteTarget, setDeleteTarget] = useState(null);
//     const [deleteError, setDeleteError] = useState('');

//     // Loading states
//     const [updateLoading, setUpdateLoading] = useState(false);
//     const [deleteLoading, setDeleteLoading] = useState(false);

//     const orderStatuses = [
//         { value: 'pending', label: 'Chờ xác nhận', color: '#f39c12' },
//         { value: 'confirmed', label: 'Đã xác nhận', color: '#3498db' },
//         { value: 'shipping', label: 'Đang giao', color: '#9b59b6' },
//         { value: 'completed', label: 'Hoàn thành', color: '#27ae60' },
//         { value: 'cancelled', label: 'Đã hủy', color: '#e74c3c' },
//     ];

//     const getStatusLabel = (status) =>
//         orderStatuses.find((s) => s.value === status)?.label || status;

//     const getStatusColor = (status) =>
//         orderStatuses.find((s) => s.value === status)?.color || '#95a5a6';

//     const formatMoney = (value) => Number(value || 0).toLocaleString('vi-VN') + '₫';

//     const formatDate = (dateString) => {
//         if (!dateString) return '-';
//         const date = new Date(dateString);
//         return date.toLocaleDateString('vi-VN', {
//             day: '2-digit',
//             month: '2-digit',
//             year: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit',
//         });
//     };

//     // Debounce search term
//     useEffect(() => {
//         const timer = setTimeout(() => {
//             setDebouncedSearch(searchTerm);
//             if (searchTerm !== debouncedSearch) {
//                 setPagination(prev => ({ ...prev, currentPage: 1 }));
//             }
//         }, 300);
//         return () => clearTimeout(timer);
//     }, [searchTerm]);

//     // Fetch orders from API with pagination and search
//     const fetchOrders = useCallback(async (page = 1, search = '') => {
//         try {
//             setOrdersLoading(true);
//             const response = await orderApi.getAll({
//                 page,
//                 per_page: pagination.perPage,
//                 search,
//             });

//             // Map orders from API
//             const ordersData = (response.data || []).map((order) => ({
//                 id: order.id,
//                 customer_name: order.recipient_name,
//                 phone: order.recipient_phone_number,
//                 address: order.recipient_address,
//                 total_amount: order.total_amount,
//                 status: order.status,
//                 datetime_order: order.datetime_order,
//                 total_products: order.total_products,
//                 total_quantity: order.total_quantity,
//             }));
//             setOrders(ordersData);

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

//             if (onOrdersChange) {
//                 onOrdersChange(ordersData, response.pagination?.total || 0);
//             }
//         } catch (error) {
//             console.error('Error fetching orders:', error);
//         } finally {
//             setOrdersLoading(false);
//         }
//     }, [pagination.perPage, onOrdersChange]);

//     // Fetch orders when page or search changes
//     useEffect(() => {
//         fetchOrders(pagination.currentPage, debouncedSearch);
//     }, [pagination.currentPage, debouncedSearch]);

//     // Handle page change
//     const goToPage = (page) => {
//         if (page >= 1 && page <= pagination.lastPage) {
//             setPagination(prev => ({ ...prev, currentPage: page }));
//         }
//     };

//     // Modal handlers
//     const openOrderModal = (mode, order) => {
//         setModalMode(mode);
//         setCurrentOrder({ ...order });
//         setShowOrderModal(true);
//     };

//     const closeOrderModal = () => {
//         setShowOrderModal(false);
//         setCurrentOrder(null);
//     };

//     const handleViewOrder = (order) => openOrderModal('view', order);
//     const handleEditOrder = (order) => openOrderModal('edit', order);

//     const handleUpdateStatus = async (newStatus) => {
//         if (!currentOrder) return;
//         setUpdateLoading(true);

//         try {
//             const response = await orderApi.updateStatus(currentOrder.id, newStatus);
//             if (response.success) {
//                 // Refetch current page to update data
//                 await fetchOrders(pagination.currentPage, debouncedSearch);
//                 closeOrderModal();
//             }
//         } catch (error) {
//             console.error('Error updating order status:', error);
//         } finally {
//             setUpdateLoading(false);
//         }
//     };

//     // Delete handlers
//     const openDeleteOrderModal = (order) => {
//         setDeleteError('');
//         setDeleteTarget({
//             id: order.id,
//             title: `Đơn hàng #${order.id}`,
//             subtitle: `Khách: ${order.customer_name}`,
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
//             const response = await orderApi.delete(deleteTarget.id);
//             if (response.success) {
//                 const newPage = orders.length === 1 && pagination.currentPage > 1
//                     ? pagination.currentPage - 1
//                     : pagination.currentPage;
//                 await fetchOrders(newPage, debouncedSearch);
//                 setPagination(prev => ({ ...prev, currentPage: newPage }));

//                 setShowDeleteModal(false);
//                 setDeleteTarget(null);
//                 setDeleteError('');
//             } else {
//                 setDeleteError(response.message || 'Không thể xóa đơn hàng.');
//             }
//         } catch (error) {
//             console.error('Error deleting order:', error);
//             setDeleteError(error.message || 'Có lỗi xảy ra khi xóa đơn hàng.');
//         } finally {
//             setDeleteLoading(false);
//         }
//     };

//     return (
//         <div className="order-management">
//             <div className="toolbar">
//                 <div className="search-box">
//                     <Search size={20} />
//                     <input
//                         type="text"
//                         placeholder="Tìm kiếm theo tên khách hàng..."
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                     />
//                 </div>
//             </div>

//             <div className="order-table">
//                 <table>
//                     <thead>
//                         <tr>
//                             <th>STT</th>
//                             <th>Mã đơn</th>
//                             <th>Khách hàng</th>
//                             <th>SĐT</th>
//                             <th>Tổng tiền</th>
//                             <th>Trạng thái</th>
//                             <th>Ngày đặt</th>
//                             <th>Thao tác</th>
//                         </tr>
//                     </thead>

//                     <tbody>
//                         {ordersLoading ? (
//                             <tr>
//                                 <td colSpan="8" className="table-status">
//                                     Đang tải đơn hàng...
//                                 </td>
//                             </tr>
//                         ) : orders.length === 0 ? (
//                             <tr>
//                                 <td colSpan="8" className="table-status">
//                                     {searchTerm ? 'Không tìm thấy đơn hàng phù hợp.' : 'Không có đơn hàng nào.'}
//                                 </td>
//                             </tr>
//                         ) : (
//                             orders.map((order, index) => (
//                                 <tr
//                                     key={order.id}
//                                     onClick={() => handleViewOrder(order)}
//                                     style={{ cursor: 'pointer' }}
//                                     title="Bấm để xem chi tiết"
//                                 >
//                                     <td className="order-stt">
//                                         {(pagination.from || 0) + index}
//                                     </td>
//                                     <td className="order-id">#{order.id}</td>
//                                     <td className="order-customer">{order.customer_name}</td>
//                                     <td className="order-phone">{order.phone}</td>
//                                     <td className="order-total">{formatMoney(order.total_amount)}</td>
//                                     <td>
//                                         <span
//                                             className="order-status-badge"
//                                             style={{ backgroundColor: getStatusColor(order.status) }}
//                                         >
//                                             {getStatusLabel(order.status)}
//                                         </span>
//                                     </td>
//                                     <td className="order-date">{formatDate(order.datetime_order)}</td>
//                                     <td>
//                                         <div className="action-buttons">
//                                             <button
//                                                 className="btn-view"
//                                                 onClick={(e) => {
//                                                     e.stopPropagation();
//                                                     handleViewOrder(order);
//                                                 }}
//                                                 title="Xem"
//                                             >
//                                                 <Eye size={16} />
//                                             </button>
//                                             <button
//                                                 className="btn-edit"
//                                                 onClick={(e) => {
//                                                     e.stopPropagation();
//                                                     handleEditOrder(order);
//                                                 }}
//                                                 title="Cập nhật trạng thái"
//                                             >
//                                                 <Edit2 size={16} />
//                                             </button>
//                                             <button
//                                                 className="btn-delete"
//                                                 onClick={(e) => {
//                                                     e.stopPropagation();
//                                                     openDeleteOrderModal(order);
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
//             {!ordersLoading && pagination.total > 0 && (
//                 <div className="pagination">
//                     <div className="pagination-info">
//                         Hiển thị {pagination.from} - {pagination.to} / {pagination.total} đơn hàng
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

//             {/* Order Modal */}
//             {showOrderModal && currentOrder && (
//                 <div className="modal-overlay" onClick={closeOrderModal}>
//                     <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//                         <div className="modal-header">
//                             <h2>
//                                 {modalMode === 'view'
//                                     ? `Chi tiết đơn hàng #${currentOrder.id}`
//                                     : `Cập nhật trạng thái #${currentOrder.id}`}
//                             </h2>
//                             <button className="btn-close" onClick={closeOrderModal}>
//                                 <X size={24} />
//                             </button>
//                         </div>

//                         <div className="modal-body">
//                             {modalMode === 'view' ? (
//                                 <div className="order-detail">
//                                     <div className="detail-row">
//                                         <span className="label">Mã đơn hàng:</span>
//                                         <span className="value">#{currentOrder.id}</span>
//                                     </div>
//                                     <div className="detail-row">
//                                         <span className="label">Khách hàng:</span>
//                                         <span className="value">{currentOrder.customer_name}</span>
//                                     </div>
//                                     <div className="detail-row">
//                                         <span className="label">Số điện thoại:</span>
//                                         <span className="value">{currentOrder.phone}</span>
//                                     </div>
//                                     <div className="detail-row">
//                                         <span className="label">Địa chỉ:</span>
//                                         <span className="value">{currentOrder.address || '-'}</span>
//                                     </div>
//                                     <div className="detail-row">
//                                         <span className="label">Tổng tiền:</span>
//                                         <span className="value highlight">{formatMoney(currentOrder.total_amount)}</span>
//                                     </div>
//                                     <div className="detail-row">
//                                         <span className="label">Số sản phẩm:</span>
//                                         <span className="value">{currentOrder.total_products || 0} loại ({currentOrder.total_quantity || 0} sản phẩm)</span>
//                                     </div>
//                                     <div className="detail-row">
//                                         <span className="label">Ngày đặt:</span>
//                                         <span className="value">{formatDate(currentOrder.datetime_order)}</span>
//                                     </div>
//                                     <div className="detail-row">
//                                         <span className="label">Trạng thái:</span>
//                                         <span
//                                             className="order-status-badge"
//                                             style={{ backgroundColor: getStatusColor(currentOrder.status) }}
//                                         >
//                                             {getStatusLabel(currentOrder.status)}
//                                         </span>
//                                     </div>
//                                 </div>
//                             ) : (
//                                 <div className="status-update">
//                                     <p className="status-instruction">Chọn trạng thái mới cho đơn hàng:</p>
//                                     <div className="status-options">
//                                         {orderStatuses.map((status) => (
//                                             <button
//                                                 key={status.value}
//                                                 className={`status-option ${currentOrder.status === status.value ? 'active' : ''}`}
//                                                 style={{
//                                                     borderColor: status.color,
//                                                     backgroundColor: currentOrder.status === status.value ? status.color : 'transparent',
//                                                     color: currentOrder.status === status.value ? 'white' : status.color,
//                                                 }}
//                                                 onClick={() => handleUpdateStatus(status.value)}
//                                                 disabled={updateLoading}
//                                             >
//                                                 {updateLoading && currentOrder.status !== status.value ? '' : status.label}
//                                             </button>
//                                         ))}
//                                         {updateLoading && <p className="updating-text">Đang cập nhật...</p>}
//                                     </div>
//                                 </div>
//                             )}
//                         </div>

//                         <div className="modal-footer">
//                             <button className="btn-cancel" onClick={closeOrderModal}>
//                                 Đóng
//                             </button>
//                             {modalMode === 'view' && (
//                                 <button className="btn-edit-status" onClick={() => setModalMode('edit')}>
//                                     <Edit2 size={18} />
//                                     Cập nhật trạng thái
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
//                                 Bạn có chắc chắn muốn xoá <strong>{deleteTarget?.title}</strong>?
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

// export default OrderManagement;


import React, { useCallback, useEffect, useState } from 'react';
import { Edit2, Trash2, Search, X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { orderApi } from '@/services/api';
import './OrderManagement.css';

const OrderManagement = ({
    onOrdersChange // Callback khi orders thay đổi (để sync với parent nếu cần)
}) => {
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(true);
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

    const [showOrderModal, setShowOrderModal] = useState(false);
    const [modalMode, setModalMode] = useState('view'); // 'view' | 'edit'
    const [currentOrder, setCurrentOrder] = useState(null);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteError, setDeleteError] = useState('');

    // Loading states
    const [updateLoading, setUpdateLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const orderStatuses = [
        { value: 'pending', label: 'Chờ xác nhận', color: '#f39c12' },
        { value: 'confirmed', label: 'Đã xác nhận', color: '#3498db' },
        { value: 'shipping', label: 'Đang giao', color: '#9b59b6' },
        { value: 'completed', label: 'Hoàn thành', color: '#27ae60' },
        { value: 'cancelled', label: 'Đã hủy', color: '#e74c3c' },
    ];

    const getStatusLabel = (status) =>
        orderStatuses.find((s) => s.value === status)?.label || status;

    const getStatusColor = (status) =>
        orderStatuses.find((s) => s.value === status)?.color || '#95a5a6';

    const formatMoney = (value) => Number(value || 0).toLocaleString('vi-VN') + '₫';

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

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

    // Fetch orders from API with pagination and search
    const fetchOrders = useCallback(async (page, search, perPage) => {
        // Increment request ID to track this specific request
        requestIdRef.current += 1;
        const currentRequestId = requestIdRef.current;

        try {
            setOrdersLoading(true);
            setOrders([]); // Clear old data immediately

            const response = await orderApi.getAll({
                page,
                per_page: perPage,
                search,
            });

            // IMPORTANT: Check if this is still the latest request
            // If not, ignore this response (a newer request was made)
            if (currentRequestId !== requestIdRef.current) {
                return;
            }

            // Map orders from API
            const ordersData = (response.data || []).map((order) => ({
                id: order.id,
                customer_name: order.recipient_name,
                phone: order.recipient_phone_number,
                address: order.recipient_address,
                total_amount: order.total_amount,
                status: order.status,
                datetime_order: order.datetime_order,
                total_products: order.total_products,
                total_quantity: order.total_quantity,
            }));
            setOrders(ordersData);

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

            if (onOrdersChange) {
                onOrdersChange(ordersData, response.pagination?.total || 0);
            }
        } catch (error) {
            // Only handle error if this is still the latest request
            if (currentRequestId === requestIdRef.current) {
                console.error('Error fetching orders:', error);
            }
        } finally {
            // Only update loading state if this is still the latest request
            if (currentRequestId === requestIdRef.current) {
                setOrdersLoading(false);
            }
        }
    }, [onOrdersChange]);

    // Fetch orders when page or search changes
    useEffect(() => {
        fetchOrders(pagination.currentPage, debouncedSearch, pagination.perPage);
    }, [pagination.currentPage, debouncedSearch, pagination.perPage, fetchOrders]);

    // Handle page change
    const goToPage = (page) => {
        if (page >= 1 && page <= pagination.lastPage) {
            setPagination(prev => ({ ...prev, currentPage: page }));
        }
    };

    // Modal handlers
    const openOrderModal = (mode, order) => {
        setModalMode(mode);
        setCurrentOrder({ ...order });
        setShowOrderModal(true);
    };

    const closeOrderModal = () => {
        setShowOrderModal(false);
        setCurrentOrder(null);
    };

    const handleViewOrder = (order) => openOrderModal('view', order);
    const handleEditOrder = (order) => openOrderModal('edit', order);

    const handleUpdateStatus = async (newStatus) => {
        if (!currentOrder) return;
        setUpdateLoading(true);

        try {
            const response = await orderApi.updateStatus(currentOrder.id, newStatus);
            if (response.success) {
                // Refetch current page to update data
                await fetchOrders(pagination.currentPage, debouncedSearch);
                closeOrderModal();
            }
        } catch (error) {
            console.error('Error updating order status:', error);
        } finally {
            setUpdateLoading(false);
        }
    };

    // Delete handlers
    const openDeleteOrderModal = (order) => {
        setDeleteError('');
        setDeleteTarget({
            id: order.id,
            title: `Đơn hàng #${order.id}`,
            subtitle: `Khách: ${order.customer_name}`,
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
            const response = await orderApi.delete(deleteTarget.id);
            if (response.success) {
                const newPage = orders.length === 1 && pagination.currentPage > 1
                    ? pagination.currentPage - 1
                    : pagination.currentPage;
                await fetchOrders(newPage, debouncedSearch);
                setPagination(prev => ({ ...prev, currentPage: newPage }));

                setShowDeleteModal(false);
                setDeleteTarget(null);
                setDeleteError('');
            } else {
                setDeleteError(response.message || 'Không thể xóa đơn hàng.');
            }
        } catch (error) {
            console.error('Error deleting order:', error);
            setDeleteError(error.message || 'Có lỗi xảy ra khi xóa đơn hàng.');
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <div className="order-management">
            <div className="toolbar">
                <div className="search-box">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên khách hàng..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="order-table">
                <table>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Mã đơn</th>
                            <th>Khách hàng</th>
                            <th>SĐT</th>
                            <th>Tổng tiền</th>
                            <th>Trạng thái</th>
                            <th>Ngày đặt</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>

                    <tbody>
                        {ordersLoading ? (
                            <tr>
                                <td colSpan="8" className="table-status">
                                    Đang tải đơn hàng...
                                </td>
                            </tr>
                        ) : orders.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="table-status">
                                    {searchTerm ? 'Không tìm thấy đơn hàng phù hợp.' : 'Không có đơn hàng nào.'}
                                </td>
                            </tr>
                        ) : (
                            orders.map((order, index) => (
                                <tr
                                    key={order.id}
                                    onClick={() => handleViewOrder(order)}
                                    style={{ cursor: 'pointer' }}
                                    title="Bấm để xem chi tiết"
                                >
                                    <td className="order-stt">
                                        {(pagination.from || 0) + index}
                                    </td>
                                    <td className="order-id">#{order.id}</td>
                                    <td className="order-customer">{order.customer_name}</td>
                                    <td className="order-phone">{order.phone}</td>
                                    <td className="order-total">{formatMoney(order.total_amount)}</td>
                                    <td>
                                        <span
                                            className="order-status-badge"
                                            style={{ backgroundColor: getStatusColor(order.status) }}
                                        >
                                            {getStatusLabel(order.status)}
                                        </span>
                                    </td>
                                    <td className="order-date">{formatDate(order.datetime_order)}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="btn-view"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleViewOrder(order);
                                                }}
                                                title="Xem"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                className="btn-edit"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditOrder(order);
                                                }}
                                                title="Cập nhật trạng thái"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                className="btn-delete"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openDeleteOrderModal(order);
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
            {!ordersLoading && pagination.total > 0 && (
                <div className="pagination">
                    <div className="pagination-info">
                        Hiển thị {pagination.from} - {pagination.to} / {pagination.total} đơn hàng
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

            {/* Order Modal */}
            {showOrderModal && currentOrder && (
                <div className="modal-overlay" onClick={closeOrderModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>
                                {modalMode === 'view'
                                    ? `Chi tiết đơn hàng #${currentOrder.id}`
                                    : `Cập nhật trạng thái #${currentOrder.id}`}
                            </h2>
                            <button className="btn-close" onClick={closeOrderModal}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="modal-body">
                            {modalMode === 'view' ? (
                                <div className="order-detail">
                                    <div className="detail-row">
                                        <span className="label">Mã đơn hàng:</span>
                                        <span className="value">#{currentOrder.id}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Khách hàng:</span>
                                        <span className="value">{currentOrder.customer_name}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Số điện thoại:</span>
                                        <span className="value">{currentOrder.phone}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Địa chỉ:</span>
                                        <span className="value">{currentOrder.address || '-'}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Tổng tiền:</span>
                                        <span className="value highlight">{formatMoney(currentOrder.total_amount)}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Số sản phẩm:</span>
                                        <span className="value">{currentOrder.total_products || 0} loại ({currentOrder.total_quantity || 0} sản phẩm)</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Ngày đặt:</span>
                                        <span className="value">{formatDate(currentOrder.datetime_order)}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Trạng thái:</span>
                                        <span
                                            className="order-status-badge"
                                            style={{ backgroundColor: getStatusColor(currentOrder.status) }}
                                        >
                                            {getStatusLabel(currentOrder.status)}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="status-update">
                                    <p className="status-instruction">Chọn trạng thái mới cho đơn hàng:</p>
                                    <div className="status-options">
                                        {orderStatuses.map((status) => (
                                            <button
                                                key={status.value}
                                                className={`status-option ${currentOrder.status === status.value ? 'active' : ''}`}
                                                style={{
                                                    borderColor: status.color,
                                                    backgroundColor: currentOrder.status === status.value ? status.color : 'transparent',
                                                    color: currentOrder.status === status.value ? 'white' : status.color,
                                                }}
                                                onClick={() => handleUpdateStatus(status.value)}
                                                disabled={updateLoading}
                                            >
                                                {updateLoading && currentOrder.status !== status.value ? '' : status.label}
                                            </button>
                                        ))}
                                        {updateLoading && <p className="updating-text">Đang cập nhật...</p>}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={closeOrderModal}>
                                Đóng
                            </button>
                            {modalMode === 'view' && (
                                <button className="btn-edit-status" onClick={() => setModalMode('edit')}>
                                    <Edit2 size={18} />
                                    Cập nhật trạng thái
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
                                Bạn có chắc chắn muốn xoá <strong>{deleteTarget?.title}</strong>?
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

export default OrderManagement;
