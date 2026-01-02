import React, { useState } from 'react';
import { UserPlus, Edit2, Trash2, Search, X, Save, LogOut } from 'lucide-react';
import './adminpanel.css';

const AdminPanel = () => {
  const roles = [
    { value: 'manager', label: 'Manager', color: '#f4e94bff' },
    { value: 'user', label: 'User', color: '#27ae60' },
  ];

  const validRoleValues = new Set(roles.map((r) => r.value));
  const normalizeRole = (role) => (validRoleValues.has(role) ? role : 'user');

  const [users, setUsers] = useState([
    { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@example.com', role: 'user', status: 'active' },
    { id: 2, name: 'Trần Thị B', email: 'tranthib@example.com', role: 'manager', status: 'active' },
    { id: 3, name: 'Lê Văn C', email: 'levanc@example.com', role: 'user', status: 'inactive' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUser, setCurrentUser] = useState({
    id: null,
    name: '',
    email: '',
    role: 'user',
    status: 'active',
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [formError, setFormError] = useState('');

  const handleCreate = () => {
    setModalMode('create');
    setCurrentUser({ id: null, name: '', email: '', role: 'user', status: 'active' });
    setFormError('');
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setModalMode('edit');
    setCurrentUser({ ...user, role: normalizeRole(user.role) });
    setFormError('');
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

  const handleSave = () => {
    const nameOk = currentUser.name.trim().length > 0;
    const emailOk = currentUser.email.trim().length > 0;

    if (!nameOk || !emailOk) {
      setFormError('Vui lòng điền đầy đủ Họ tên và Email.');
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
      setUsers(users.map((u) => (u.id === payload.id ? payload : u)));
    }

    setShowModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role) => roles.find((r) => r.value === role)?.color || '#95a5a6';

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div className="header-content">
          <h1>FRUITstore Admin</h1>
          <p>Quản lý người dùng & phân quyền</p>
        </div>

        <div className="header-actions">
          <button className="btn-logout" onClick={handleLogout}>
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
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>

                  <td title={user.email}>{user.email}</td>

                  <td>
                    <span className="role-badge" style={{ backgroundColor: getRoleColor(user.role) }}>
                      {roles.find((r) => r.value === user.role)?.label}
                    </span>
                  </td>

                  <td>
                    <span className={`status-badge ${user.status}`}>
                      {user.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                    </span>
                  </td>

                  <td>
                    <div className="action-buttons">
                      <button className="btn-edit" onClick={() => handleEdit(user)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="btn-delete" onClick={() => handleDeleteClick(user)}>
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
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modalMode === 'create' ? 'Thêm người dùng mới' : 'Chỉnh sửa người dùng'}</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>
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
                  onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                  placeholder="Nhập họ tên"
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={currentUser.email}
                  onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                  placeholder="Nhập email"
                />
              </div>

              <div className="form-group">
                <label>Vai trò</label>
                <select
                  value={normalizeRole(currentUser.role)}
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
                  onChange={(e) => setCurrentUser({ ...currentUser, status: e.target.value })}
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>
                Hủy
              </button>
              <button className="btn-save" onClick={handleSave}>
                <Save size={20} />
                Lưu
              </button>
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
