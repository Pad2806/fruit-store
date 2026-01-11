import React, { useMemo, useState, useEffect } from 'react';
import { UserPlus, Edit2, Trash2, Search, X, Save, LogOut, Eye, EyeOff } from 'lucide-react';
import './adminpanel.css';
import { getUsers, createUser, updateUser, deleteUser } from '../services/userService';

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
  const [formError, setFormError] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const isView = modalMode === 'view';

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getUsers();
      // Assuming response.data is the array of users (from Resource collection)
      // or response.data.data if paginated.
      // Based on typical Laravel Resource collection response: { data: [...] }
      const userList = response.data || [];

      const mappedUsers = userList.map(u => ({
        ...u,
        role: u.role?.name || 'user' // Extract role name if it's an object
      }));
      setUsers(mappedUsers);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormError('');
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
    setFormError('');
    setShowPassword(false);
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setModalMode('edit');
    setCurrentUser({
      ...user,
      role: normalizeRole(user.role),
      password: '', // Clear password fields for edit
      password_confirmation: '',
    });
    setFormError('');
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
    setFormError('');
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
      await fetchUsers(); // Refresh list
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

  const handleSave = async () => {
    const nameOk = currentUser.name.trim().length > 0;

    if (!nameOk) {
      setFormError('Vui lòng điền Họ tên.');
      return;
    }

    if (modalMode === 'create' && !currentUser.email.trim()) {
      setFormError('Vui lòng điền Email.');
      return;
    }

    if (!currentUser.dob) {
      setFormError('Vui lòng chọn ngày sinh.');
      return;
    }

    if (!validatePhone(currentUser.phone_number)) {
      setFormError('Số điện thoại không hợp lệ (nên là 9-11 chữ số).');
      return;
    }

    if (modalMode === 'create') {
      if (String(currentUser.password).trim().length < 8) {
        setFormError('Mật khẩu tối thiểu 8 ký tự.');
        return;
      }
      if (currentUser.password !== currentUser.password_confirmation) {
        setFormError('Mật khẩu xác nhận không khớp.');
        return;
      }
    }

    setFormError('');

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
      } else {
        // Update mode
        const payload = {
          name: currentUser.name,
          phone_number: currentUser.phone_number,
          address: currentUser.address,
          dob: currentUser.dob,
          role: currentUser.role,
          // email and password not included for update as per API limitations
        };
        await updateUser(currentUser.id, payload);
      }

      await fetchUsers(); // Refresh list
      handleCloseModal();
    } catch (error) {
      console.error("Save failed", error);
      if (error.response?.data?.errors) {
        const firstErrorKey = Object.keys(error.response.data.errors)[0];
        const firstErrorMsg = error.response.data.errors[firstErrorKey][0];
        setFormError(firstErrorMsg);
      } else if (error.response?.data?.message) {
        setFormError(error.response.data.message);
      } else {
        setFormError('Có lỗi xảy ra, vui lòng thử lại.');
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

        <div className="users-table">
          {loading ? (
            <div className="loading-state">Đang tải dữ liệu...</div>
          ) : (
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
                {filteredUsers.length > 0 ? (
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
              {formError && <div className="form-error">{formError}</div>}

              <div className="form-group">
                <label>Họ tên *</label>
                <input
                  type="text"
                  value={currentUser.name}
                  disabled={isView}
                  onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                  placeholder="Nhập họ tên"
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={currentUser.email}
                  disabled={modalMode === 'edit' || isView}
                  onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                  placeholder="Nhập email"
                  title={modalMode === 'edit' ? 'Email không thể chỉnh sửa' : undefined}
                  autoComplete="off"
                />
              </div>

              <div className="form-group">
                <label>Số điện thoại</label>
                <input
                  type="tel"
                  value={currentUser.phone_number}
                  disabled={isView}
                  onChange={(e) => setCurrentUser({ ...currentUser, phone_number: e.target.value })}
                  placeholder="VD: 0901234567"
                  autoComplete="off"
                />
              </div>

              <div className="form-group">
                <label>Địa chỉ</label>
                <input
                  type="text"
                  value={currentUser.address}
                  disabled={isView}
                  onChange={(e) => setCurrentUser({ ...currentUser, address: e.target.value })}
                  placeholder="Nhập địa chỉ"
                  autoComplete="off"
                />
              </div>

              <div className="form-group">
                <label>Ngày sinh</label>
                <input
                  type="date"
                  value={currentUser.dob ? currentUser.dob.split('T')[0] : ''}
                  disabled={isView}
                  onChange={(e) => setCurrentUser({ ...currentUser, dob: e.target.value })}
                  autoComplete="off"
                />
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
                        onChange={(e) => setCurrentUser({ ...currentUser, password: e.target.value })}
                        placeholder="Tối thiểu 8 ký tự"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className="btn-toggle-password"
                        onClick={() => setShowPassword((v) => !v)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Xác nhận mật khẩu *</label>
                    <input
                      type="password"
                      value={currentUser.password_confirmation}
                      disabled={isView}
                      onChange={(e) => setCurrentUser({ ...currentUser, password_confirmation: e.target.value })}
                      placeholder="Nhập lại mật khẩu"
                    />
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
