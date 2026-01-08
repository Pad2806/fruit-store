import React, { useMemo, useState } from 'react';
import { UserPlus, Edit2, Trash2, Search, X, Save, LogOut, Eye, EyeOff } from 'lucide-react';
import './adminpanel.css';

const AdminPanel = () => {
  const roles = [
    { value: 'manager', label: 'Manager', color: '#f4e94bff' },
    { value: 'user', label: 'User', color: '#27ae60' },
  ];

  const validRoleValues = new Set(roles.map((r) => r.value));
  const normalizeRole = (role) => (validRoleValues.has(role) ? role : 'user');

  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@example.com',
      phone_number: '0901234567',
      address: 'TP.HCM',
      dob: '2000-01-01',
      role: 'user',
      status: 'active',
    },
    {
      id: 2,
      name: 'Trần Thị B',
      email: 'tranthib@example.com',
      phone_number: '0912345678',
      address: 'Hà Nội',
      dob: '1998-05-12',
      role: 'manager',
      status: 'active',
    },
    {
      id: 3,
      name: 'Lê Văn C',
      email: 'levanc@example.com',
      phone_number: '0923456789',
      address: 'Đà Nẵng',
      dob: '2001-09-20',
      role: 'user',
      status: 'inactive',
    },
  ]);

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
    role: 'user',
    status: 'active',
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [formError, setFormError] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const isView = modalMode === 'view';

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
      password: '',
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
    });
    setFormError('');
    setShowPassword(false);
    setShowModal(true);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!userToDelete) return;
    setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
    setShowDeleteModal(false);
    setUserToDelete(null);
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

  const handleSave = () => {
    const nameOk = currentUser.name.trim().length > 0;
    const emailOk = currentUser.email.trim().length > 0;

    if (!nameOk || !emailOk) {
      setFormError('Vui lòng điền đầy đủ Họ tên và Email.');
      return;
    }

    if (!validatePhone(currentUser.phone_number)) {
      setFormError('Số điện thoại không hợp lệ (nên là 9-11 chữ số).');
      return;
    }

    if (modalMode === 'create' && String(currentUser.password).trim().length < 6) {
      setFormError('Mật khẩu tối thiểu 6 ký tự.');
      return;
    }

    setFormError('');

    const payload = {
      ...currentUser,
      role: normalizeRole(currentUser.role),
    };

    if (modalMode === 'create') {
      const newUser = {
        ...payload,
        id: Math.max(...users.map((u) => u.id), 0) + 1,
      };
      setUsers([...users, newUser]);
    } else {
      // giữ nguyên email khi edit (như yêu cầu)
      setUsers(users.map((u) => (u.id === payload.id ? { ...u, ...payload, email: u.email } : u)));
    }

    handleCloseModal();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const filteredUsers = useMemo(() => {
    const t = searchTerm.toLowerCase().trim();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(t) ||
        u.email.toLowerCase().includes(t) ||
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
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  onClick={() => handleView(user)}
                  style={{ cursor: 'pointer' }}
                  title="Bấm để xem chi tiết"
                >
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td title={user.email}>{user.email}</td>
                  <td>
                    <span className="role-badge" style={{ backgroundColor: getRoleColor(user.role) }}>
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${user.status}`}>
                      {user.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
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
              ))}
            </tbody>
          </table>
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
                  value={currentUser.dob}
                  disabled={isView}
                  onChange={(e) => setCurrentUser({ ...currentUser, dob: e.target.value })}
                  autoComplete="off"
                />
              </div>

              <div className="form-group">
                <label>Mật khẩu {modalMode === 'create' ? '*' : '(tùy chọn)'}</label>

                <div className="password-field">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={currentUser.password}
                    disabled={isView}
                    onChange={(e) => setCurrentUser({ ...currentUser, password: e.target.value })}
                    placeholder={
                      isView
                        ? '********'
                        : modalMode === 'create'
                        ? 'Tối thiểu 6 ký tự'
                        : 'Để trống nếu không đổi'
                    }
                    autoComplete="new-password"
                  />

                  {!isView && (
                    <button
                      type="button"
                      className="btn-toggle-password"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                      title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  )}
                </div>
              </div>

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

              <div className="form-group">
                <label>Trạng thái</label>
                <select
                  value={currentUser.status}
                  disabled={isView}
                  onChange={(e) => setCurrentUser({ ...currentUser, status: e.target.value })}
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
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
