import { useState, useEffect } from "react";
import styles from "./Profile.module.scss";
import { useAuth } from "../../context/AuthContext";
import api from "../../../../axios";
import { message } from "antd";

export default function Profile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [userData, setUserData] = useState({
    name: "",
    phone: "",
    email: "",
    address: ""
  });

  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setUserData({
        name: user.name || "",
        phone: user.phone_number || "", // BE uses phone_number, verify response? Assuming user details from API match BE model
        email: user.email || "",
        address: user.address || ""
      });
    }
  }, [user]);

  const handleChange = (field, value) => {
    setUserData(prev => ({ ...prev, [field]: value }));
    setSuccess(false); // Clear success message on edit
    // Clear error when user types
    if (errors[field] || errors['phone_number']) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        if (field === 'phone') delete newErrors['phone_number'];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!userData.name.trim()) newErrors.name = "Vui lòng nhập họ và tên";

    const phoneRegex = /^[0-9]{10}$/;
    if (!userData.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!phoneRegex.test(userData.phone.trim())) {
      newErrors.phone = "Số điện thoại phải bao gồm 10 chữ số";
    }

    if (!userData.address.trim()) newErrors.address = "Vui lòng nhập địa chỉ nhận hàng";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validate()) return;

    setLoading(true);
    setErrors({});
    setSuccess(false);

    try {
      // Map state to BE expected payload
      const payload = {
        name: userData.name,
        phone_number: userData.phone,
        address: userData.address
        // email is not updatable via this endpoint usually, and dob if needed
      };

      await api.post("/update-profile", payload);
      message.success("Cập nhật thông tin thành công!");
      setSuccess(true);

      // Delay reload to let user see success message
      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (error) {
      console.error(error);
      if (error.response?.status === 422 && error.response?.data?.errors) {
        // Map BE errors to state
        // BE returns { name: ["error"], phone_number: ["error"] }
        const apiErrors = error.response.data.errors;
        const mappedErrors = {};
        if (apiErrors.name) mappedErrors.name = apiErrors.name[0];
        if (apiErrors.phone_number) mappedErrors.phone = apiErrors.phone_number[0];
        if (apiErrors.address) mappedErrors.address = apiErrors.address[0];

        setErrors(mappedErrors);
        message.error("Vui lòng kiểm tra lại thông tin!");
      } else {
        message.error("Có lỗi xảy ra khi cập nhật!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h3 className={styles.title}>Thông tin tài khoản</h3>
        <p className={styles.subtitle}>Quản lý thông tin cá nhân</p>
      </div>

      <div className={styles.formCard}>
        <div className={styles.formBody}>
          {success && (
            <div className={styles.successMessage}>
              Cập nhật thông tin thành công!
            </div>
          )}
          <div className={styles.group}>
            <label>Họ và tên</label>
            <input
              type="text"
              placeholder="Nhập họ và tên"
              value={userData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className={errors.name ? styles.errorInput : ""}
            />
            {errors.name && <span className={styles.errorText}>{errors.name}</span>}
          </div>

          <div className={styles.row}>
            <div className={styles.group}>
              <label>Số điện thoại</label>
              <input
                type="text"
                placeholder="Nhập số điện thoại"
                value={userData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className={errors.phone ? styles.errorInput : ""}
              />
              {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
            </div>

            <div className={styles.group}>
              <label>Email</label>
              <input
                type="email"
                value={userData.email}
                disabled
                className={styles.disabledInput}
              />
            </div>
          </div>

          <div className={styles.group}>
            <label>Địa chỉ nhận hàng</label>
            <textarea
              rows="3"
              placeholder="Nhập địa chỉ chi tiết"
              value={userData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              className={errors.address ? styles.errorInput : ""}
            />
            {errors.address && <span className={styles.errorText}>{errors.address}</span>}
          </div>
        </div>

        <div className={styles.formFooter}>
          <button
            className={styles.btnUpdate}
            onClick={handleUpdate}
            disabled={loading}
          >
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </div>
    </div>
  );
}