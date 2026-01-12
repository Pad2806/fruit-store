import React, { useMemo, useState, useEffect } from 'react';
import { UserPlus, Edit2, Trash2, Search, X, Save, LogOut, Eye, EyeOff, ChevronLeft, ChevronRight } from 'lucide-react';
import './adminpanel.css';
import { getUsers, createUser, updateUser, deleteUser } from '../services/userService';

// Skeleton Row Component
const SkeletonRow = () => (
  <tr className="skeleton-row">
    <td>
      <div className="skeleton skeleton-text short"></div>
    </td>
    <td>
      <div className="skeleton skeleton-text medium"></div>
    </td>
    <td>
      <div className="skeleton skeleton-text long"></div>
    </td>
    <td>
      <div className="skeleton skeleton-badge"></div>
    </td>
    <td>
      <div className="skeleton-action-buttons">
        <div className="skeleton skeleton-button"></div>
        <div className="skeleton skeleton-button"></div>
      </div>
    </td>
  </tr>
);

// Skeleton Pagination Component
const SkeletonPagination = () => (
  <div className="skeleton-pagination">
    <div className="skeleton-pagination-info">
      <div className="skeleton skeleton-select"></div>
      <div className="skeleton skeleton-pagination-text"></div>
    </div>
    <div className="skeleton-pagination-buttons">
      <div className="skeleton skeleton-page-btn"></div>
      <div className="skeleton skeleton-page-btn"></div>
      <div className="skeleton skeleton-page-btn"></div>
      <div className="skeleton skeleton-page-btn"></div>
    </div>
  </div>
);

const AdminPanel = () => {
  const roles = [
    { value: 'seller', label: 'Chủ cửa hàng', color: '#f4e94bff' },
    { value: 'user', label: 'Người dùng', color: '#27ae60' },
    { value: 'admin', label: 'Quản trị viên', color: '#e74c3c' },
  ];

  const validRoleValues = new Set(roles.map((r) => r.value));
  const normalizeRole = (role) => (validRoleValues.has(role) ? role : 'user');

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Pagination State
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 5
  });

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [searchTerm, setSearchTerm] = useState('');

  const [currentUser, setCurrentUser] = useState({
    id: null,
    name: '',
    email: '',
    phone_number: '',
    address: '',
    dob: '',
    password: '',
    password_confirmation: '',
    role: 'user',
    status: 'active',
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const isView = modalMode === 'view';

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers(1, 5); // Default start with 5
  }, []);

  const fetchUsers = async (page = 1, pageSize = pagination.per_page) => {
    setLoading(true);
    try {
      // Pass pagination params
      const response = await getUsers({ page, page_size: pageSize });
      const userList = response.data || [];
      const meta = response.meta || {};

      const mappedUsers = userList.map(u => ({
        ...u,
        role: u.role?.name || 'user'
      }));
      setUsers(mappedUsers);
      setPagination({
        current_page: meta.current_page || 1,
        last_page: meta.last_page || 1,
        total: meta.total || 0,
        per_page: meta.per_page || pageSize
      });
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.last_page) {
      fetchUsers(newPage);
    }
  };

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    fetchUsers(1, newSize); // Return to page 1 when changing size
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFieldErrors({});
    setGeneralError('');
    setShowPassword(false);
  };

  const handleCreate = () => {
    setModalMode('create');
    setCurrentUser({
      id: null,
      name: '',
      email: '',
      phone_number: '',
      address: '',
      dob: '',
      password: '',
      password_confirmation: '',
      role: 'user',
      status: 'active',
    });
    setFieldErrors({});
    setGeneralError('');
    setShowPassword(false);
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setModalMode('edit');
    setCurrentUser({
      ...user,
      role: normalizeRole(user.role),
      password: '',
      password_confirmation: '',
    });
    setFieldErrors({});
    setGeneralError('');
    setShowPassword(false);
    setShowModal(true);
  };

  const handleView = (user) => {
    setModalMode('view');
    setCurrentUser({
      ...user,
      role: normalizeRole(user.role),
      password: '',
      password_confirmation: '',
    });
    setFieldErrors({});
    setGeneralError('');
    setShowPassword(false);
    setShowModal(true);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await deleteUser(userToDelete.id);
      await fetchUsers(pagination.current_page);
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (error) {
      console.error("Failed to delete user", error);
      alert("Xoá thất bại! Có thể do lỗi kết nối hoặc quyền truy cập.");
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const validatePhone = (s) => {
    const t = String(s || '').trim();
    if (!t) return true;
    return /^[0-9]{9,11}$/.test(t);
  };

  const translateError = (msg) => {
    if (!msg) return "";
    if (Array.isArray(msg)) msg = msg[0];

    const lower = String(msg).toLowerCase();
    if (lower.includes('required')) return 'Trường này là bắt buộc.';
    if (lower.includes('email has already been taken')) return 'Email này đã được sử dụng.';
    if (lower.includes('email is invalid') || lower.includes('valid email')) return 'Email không hợp lệ.';
    if (lower.includes('password must be at least')) return 'Mật khẩu quá ngắn (tối thiểu 8 ký tự).';
    if (lower.includes('verification code')) return 'Mã xác thực không đúng.';
    if (lower.includes('phone number')) return 'Số điện thoại không hợp lệ.';
    if (lower.includes('password confirmation does not match')) return 'Mật khẩu xác nhận không khớp.';

    return msg;
  };

  const handleSave = async () => {
    let errors = {};
    const nameOk = currentUser.name.trim().length > 0;

    if (!nameOk) {
      errors.name = 'Vui lòng điền Họ tên.';
    }

    if (modalMode === 'create' && !currentUser.email.trim()) {
      errors.email = 'Vui lòng điền Email.';
    }

    if (!currentUser.dob) {
      errors.dob = 'Vui lòng chọn ngày sinh.';
    } else {
      const birthDate = new Date(currentUser.dob);

      if (isNaN(birthDate.getTime())) {
        errors.dob = 'Ngày sinh không hợp lệ';
      } else {
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }

        if (age < 18) {
          errors.dob = 'Người dùng phải từ 18 tuổi trở lên.';
        }
      }
    }

    if (!validatePhone(currentUser.phone_number)) {
      errors.phone_number = 'Số điện thoại không hợp lệ (9-11 chữ số).';
    }

    if (modalMode === 'create') {
      if (String(currentUser.password).trim().length < 8) {
        errors.password = 'Mật khẩu tối thiểu 8 ký tự.';
      }
      if (currentUser.password !== currentUser.password_confirmation) {
        errors.password_confirmation = 'Mật khẩu xác nhận không khớp.';
      }
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setGeneralError('');

    try {
      if (modalMode === 'create') {
        const payload = {
          name: currentUser.name,
          email: currentUser.email,
          password: currentUser.password,
          password_confirmation: currentUser.password_confirmation,
          phone_number: currentUser.phone_number,
          address: currentUser.address,
          dob: currentUser.dob,
          role: currentUser.role,
        };
        await createUser(payload);
        fetchUsers(1);
      } else {
        const payload = {
          name: currentUser.name,
          phone_number: currentUser.phone_number,
          address: currentUser.address,
          dob: currentUser.dob,
          role: currentUser.role,
        };
        await updateUser(currentUser.id, payload);
        fetchUsers(pagination.current_page);
      }

      handleCloseModal();
    } catch (error) {
      console.error("Save failed", error);
      if (error.response?.data?.errors) {
        const apiErrors = error.response.data.errors;
        const mappedErrors = {};
        Object.keys(apiErrors).forEach(key => {
          mappedErrors[key] = translateError(apiErrors[key]);
        });
        setFieldErrors(mappedErrors);
      } else if (error.response?.data?.message) {
        setGeneralError(translateError(error.response.data.message));
      } else {
        setGeneralError('Có lỗi xảy ra, vui lòng thử lại.');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    window.location.href = '/login';
  };

  const filteredUsers = useMemo(() => {
    const t = searchTerm.toLowerCase().trim();
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(t) ||
        u.email?.toLowerCase().includes(t) ||
        String(u.id).includes(t) ||
        String(u.phone_number || '').includes(t)
    );
  }, [users, searchTerm]);

  const getRoleColor = (role) => roles.find((r) => r.value === role)?.color || '#95a5a6';
  const getRoleLabel = (role) => roles.find((r) => r.value === role)?.label || role;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div className="header-content">
          <h1>FRUITstore Admin</h1>
          <p>Quản lý người dùng & phân quyền</p>
        </div>

        <div className="header-actions">
          <button className="btn-logout" onClick={handleLogout} aria-label="Logout" title="Đăng xuất">
            <LogOut size={18} />
          </button>
        </div>
      </div>

      <div className="admin-body">
        <div className="toolbar">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm người dùng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              name="admin-user-search"
            />
          </div>

          <button className="btn-create" onClick={handleCreate}>
            <UserPlus size={20} />
            Thêm người dùng
          </button>
        </div>

        <div className={`users-table ${loading && !isInitialLoad ? 'table-loading-overlay' : ''}`}>
          {/* Loading spinner for refresh */}
          {loading && !isInitialLoad && (
            <div className="loading-spinner-container">
              <div className="loading-spinner"></div>
              <span className="loading-text">Đang tải...</span>
            </div>
          )}

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {/* Initial Loading - Show Skeleton */}
              {loading && isInitialLoad ? (
                <>
                  {[...Array(5)].map((_, index) => (
                    <SkeletonRow key={`skeleton-${index}`} />
                  ))}
                </>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    onClick={() => handleView(user)}
                    style={{ cursor: 'pointer' }}
                    title="Bấm để xem chi tiết"
                  >
                    <td className="col-id" title={user.id}>{String(user.id).substring(0, 8)}...</td>
                    <td>{user.name}</td>
                    <td title={user.email}>{user.email}</td>
                    <td>
                      <span className="role-badge" style={{ backgroundColor: getRoleColor(user.role) }}>
                        {getRoleLabel(user.role)}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-edit"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(user);
                          }}
                          aria-label="Edit"
                          title="Sửa"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="btn-delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(user);
                          }}
                          aria-label="Delete"
                          title="Xoá"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                    Không tìm thấy người dùng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination - Show Skeleton when initial loading */}
          {loading && isInitialLoad ? (
            <SkeletonPagination />
          ) : (
            pagination.last_page >= 1 && (
              <div className="pagination-controls">
                <div className="pagination-info">
                  <select
                    value={pagination.per_page}
                    onChange={handlePageSizeChange}
                    className="page-size-select"
                    title="Số dòng trên mỗi trang"
                    disabled={loading}
                  >
                    <option value="5">5 dòng/trang</option>
                    <option value="10">10 dòng/trang</option>
                    <option value="20">20 dòng/trang</option>
                    <option value="50">50 dòng/trang</option>
                  </select>
                  <span style={{ marginLeft: '10px' }}>
                    Hiển thị {users.length} trên tổng số {pagination.total} người dùng
                  </span>
                </div>
                <div className="pagination-buttons">
                  <button
                    className="btn-page"
                    onClick={() => handlePageChange(pagination.current_page - 1)}
                    disabled={pagination.current_page === 1 || loading}
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      className={`btn-page ${page === pagination.current_page ? 'active' : ''}`}
                      onClick={() => handlePageChange(page)}
                      disabled={loading}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    className="btn-page"
                    onClick={() => handlePageChange(pagination.current_page + 1)}
                    disabled={pagination.current_page === pagination.last_page || loading}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {modalMode === 'create'
                  ? 'Thêm người dùng mới'
                  : modalMode === 'edit'
                    ? 'Chỉnh sửa người dùng'
                    : 'Chi tiết người dùng'}
              </h2>
              <button className="btn-close" onClick={handleCloseModal} aria-label="Close" title="Đóng">
                <X size={24} />
              </button>
            </div>

            <div className="modal-body">
              {generalError && <div className="form-error">{generalError}</div>}

              <div className="form-group">
                <label>Họ tên *</label>
                <input
                  type="text"
                  value={currentUser.name}
                  disabled={isView}
                  onChange={(e) => {
                    setCurrentUser({ ...currentUser, name: e.target.value });
                    setFieldErrors({ ...fieldErrors, name: '' });
                  }}
                  placeholder="Nhập họ tên"
                  className={fieldErrors.name ? 'input-error' : ''}
                />
                {fieldErrors.name && <span className="field-error-msg" style={{ color: 'red', fontSize: '12px', marginTop: '4px', display: 'block' }}>{fieldErrors.name}</span>}
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={currentUser.email}
                  disabled={modalMode === 'edit' || isView}
                  onChange={(e) => {
                    setCurrentUser({ ...currentUser, email: e.target.value });
                    setFieldErrors({ ...fieldErrors, email: '' });
                  }}
                  placeholder="Nhập email"
                  title={modalMode === 'edit' ? 'Email không thể chỉnh sửa' : undefined}
                  autoComplete="off"
                  className={fieldErrors.email ? 'input-error' : ''}
                />
                {fieldErrors.email && <span className="field-error-msg" style={{ color: 'red', fontSize: '12px', marginTop: '4px', display: 'block' }}>{fieldErrors.email}</span>}
              </div>

              <div className="form-group">
                <label>Số điện thoại *</label>
                <input
                  type="tel"
                  value={currentUser.phone_number}
                  disabled={isView}
                  onChange={(e) => {
                    setCurrentUser({ ...currentUser, phone_number: e.target.value });
                    setFieldErrors({ ...fieldErrors, phone_number: '' });
                  }}
                  placeholder="VD: 0901234567"
                  autoComplete="off"
                  className={fieldErrors.phone_number ? 'input-error' : ''}
                />
                {fieldErrors.phone_number && <span className="field-error-msg" style={{ color: 'red', fontSize: '12px', marginTop: '4px', display: 'block' }}>{fieldErrors.phone_number}</span>}
              </div>

              <div className="form-group">
                <label>Địa chỉ *</label>
                <input
                  type="text"
                  value={currentUser.address}
                  disabled={isView}
                  onChange={(e) => {
                    setCurrentUser({ ...currentUser, address: e.target.value });
                    setFieldErrors({ ...fieldErrors, address: '' });
                  }}
                  placeholder="Nhập địa chỉ"
                  autoComplete="off"
                  className={fieldErrors.address ? 'input-error' : ''}
                />
                {fieldErrors.address && <span className="field-error-msg" style={{ color: 'red', fontSize: '12px', marginTop: '4px', display: 'block' }}>{fieldErrors.address}</span>}
              </div>

              <div className="form-group">
                <label>Ngày sinh</label>
                <input
                  type="date"
                  value={currentUser.dob ? currentUser.dob.split('T')[0] : ''}
                  disabled={isView}
                  onChange={(e) => {
                    setCurrentUser({ ...currentUser, dob: e.target.value });
                    setFieldErrors({ ...fieldErrors, dob: '' });
                  }}
                  autoComplete="off"
                  className={fieldErrors.dob ? 'input-error' : ''}
                />
                {fieldErrors.dob && <span className="field-error-msg" style={{ color: 'red', fontSize: '12px', marginTop: '4px', display: 'block' }}>{fieldErrors.dob}</span>}
              </div>

              {/* Password field only for CREATE mode */}
              {modalMode === 'create' && (
                <>
                  <div className="form-group">
                    <label>Mật khẩu *</label>
                    <div className="password-field">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={currentUser.password}
                        disabled={isView}
                        onChange={(e) => {
                          setCurrentUser({ ...currentUser, password: e.target.value });
                          setFieldErrors({ ...fieldErrors, password: '' });
                        }}
                        placeholder="Tối thiểu 8 ký tự"
                        autoComplete="new-password"
                        className={fieldErrors.password ? 'input-error' : ''}
                      />
                      <button
                        type="button"
                        className="btn-toggle-password"
                        onClick={() => setShowPassword((v) => !v)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {fieldErrors.password && <span className="field-error-msg" style={{ color: 'red', fontSize: '12px', marginTop: '4px', display: 'block' }}>{fieldErrors.password}</span>}
                  </div>
                  <div className="form-group">
                    <label>Xác nhận mật khẩu *</label>
                    <input
                      type="password"
                      value={currentUser.password_confirmation}
                      disabled={isView}
                      onChange={(e) => {
                        setCurrentUser({ ...currentUser, password_confirmation: e.target.value });
                        setFieldErrors({ ...fieldErrors, password_confirmation: '' });
                      }}
                      placeholder="Nhập lại mật khẩu"
                      className={fieldErrors.password_confirmation ? 'input-error' : ''}
                    />
                    {fieldErrors.password_confirmation && <span className="field-error-msg" style={{ color: 'red', fontSize: '12px', marginTop: '4px', display: 'block' }}>{fieldErrors.password_confirmation}</span>}
                  </div>
                </>
              )}

              <div className="form-group">
                <label>Vai trò</label>
                <select
                  value={normalizeRole(currentUser.role)}
                  disabled={isView}
                  onChange={(e) => setCurrentUser({ ...currentUser, role: e.target.value })}
                >
                  {roles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
                {fieldErrors.role && <span className="field-error-msg" style={{ color: 'red', fontSize: '12px', marginTop: '4px', display: 'block' }}>{fieldErrors.role}</span>}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={handleCloseModal}>
                {isView ? 'Đóng' : 'Hủy'}
              </button>

              {!isView && (
                <button className="btn-save" onClick={handleSave}>
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
              <button className="btn-close" onClick={cancelDelete} aria-label="Close" title="Đóng">
                <X size={24} />
              </button>
            </div>

            <div className="modal-body">
              <p>
                Bạn có chắc chắn muốn xoá người dùng <strong>{userToDelete?.name}</strong>?
              </p>
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

export default AdminPanel;
