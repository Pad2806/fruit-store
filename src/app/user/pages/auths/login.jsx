import { useState, useEffect } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import styles from "./login.module.scss";
import bannerlogin from "../../assets/images/bannerlogin.png";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

import { message } from "antd";
import { Loader } from "lucide-react";

export default function Login() {
  const { login, register, verifyCode, resendCode, forgotPassword, resetPassword } = useAuth();
  const navigate = useNavigate();

  const translateError = (msg) => {
    if (!msg) return "";
    const map = {
      "Unauthorized": "Email hoặc mật khẩu không chính xác",
      "User not verified": "Tài khoản chưa được xác thực",
      "The email has already been taken.": "Email đã được sử dụng",
      "The selected email is invalid.": "Email không hợp lệ",
      "Login failed": "Đăng nhập thất bại",
      "Too Many Requests": "Quá nhiều yêu cầu, vui lòng thử lại sau"
    };
    // Simple partial match or exact match
    for (const key in map) {
      if (msg.includes(key)) return map[key];
    }
    return msg; // Return original if no match
  };

  const [isLogin, setIsLogin] = useState(true);
  const [showForgot, setShowForgot] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [timer, setTimer] = useState(44);
  const [showPass, setShowPass] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const [serverError, setServerError] = useState("");

  useEffect(() => {
    let interval = null;
    if (showVerify && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [showVerify, timer]);

  const handleTabChange = (mode) => {
    setIsLogin(mode);
    setErrors({});
    setServerError("");
    setShowPass(false);
    setShowConfirm(false);
    setFormData({ email: "", password: "", confirmPassword: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
    setServerError("");
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.email) tempErrors.email = "Vui lòng nhập email";
    if (!formData.password) tempErrors.password = "Vui lòng nhập mật khẩu";

    if (!isLogin) {
      if (!formData.confirmPassword) {
        tempErrors.confirmPassword = "Vui lòng nhập lại mật khẩu";
      } else if (formData.password !== formData.confirmPassword) {
        tempErrors.confirmPassword = "Mật khẩu không trùng khớp";
      }
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      if (isLogin) {
        setLoading(true);
        const res = await login(formData.email, formData.password);
        setLoading(false);
        if (res.success) {
          message.success("Đăng nhập thành công!");
          const role = res.role;
          if (role === 'admin') navigate("/admin");
          else if (role === 'seller') navigate("/seller");
          else navigate("/");
        } else {
          if (res.errors) {
            const mappedErrors = {};
            if (res.errors.email) mappedErrors.email = translateError(res.errors.email[0]);
            if (res.errors.password) mappedErrors.password = translateError(res.errors.password[0]);
            setErrors(mappedErrors);
          }
          if (!res.errors && res.message) {
            setServerError(translateError(res.message));
          }
        }
      } else {
        // Register flow
        setLoading(true);
        const res = await register({
          name: formData.email.split("@")[0], // Temporary name from email
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.confirmPassword
        });
        setLoading(false);

        if (res.success) {
          message.success("Đăng ký thành công. Vui lòng kiểm tra email để lấy mã OTP.");
          setShowVerify(true);
          setTimer(60);
        } else {
          // Handle specific validation errors if available
          if (res.errors) {
            const mappedErrors = {};
            if (res.errors.email) mappedErrors.email = translateError(res.errors.email[0]);
            if (res.errors.password) mappedErrors.password = translateError(res.errors.password[0]);
            setErrors(mappedErrors);
          }

          if (!res.errors && res.message) {
            setServerError(translateError(res.message));
          }
        }
      }
    }
  };

  const handleVerifyCode = async (code) => {
    const res = await verifyCode(formData.email, code);
    if (res.success) {
      message.success("Xác thực thành công! Bạn có thể đăng nhập ngay.");
      setShowVerify(false);
      setIsLogin(true); // Switch to login tab
      handleTabChange(true);
    } else {
      message.error(res.message);
    }
  };

  const handleResendCode = async () => {
    const res = await resendCode(formData.email);
    if (res.success) {
      message.success("Đã gửi lại mã OTP.");
      setTimer(60);
    } else {
      message.error(res.message);
    }
  };

  // Forgot Password Helpers
  const handleForgotPasswordStep1 = async (email) => {
    const res = await forgotPassword(email);
    if (res.success) {
      message.success(translateError(res.message)); // Translate success message if needed or just show
      setForgotStep(2);
    } else {
      message.error(translateError(res.message));
    }
  };

  const handleForgotPasswordStep2 = (otp) => {
    if (!otp) return message.error("Vui lòng nhập OTP");
    setForgotStep(3);
  };

  const handleForgotPasswordStep3 = async (email, code, newPass, confirmPass) => {
    if (newPass !== confirmPass) return message.error("Mật khẩu không khớp");
    const res = await resetPassword(email, code, newPass, confirmPass);
    if (res.success) {
      message.success(translateError(res.message));
      setShowForgot(false);
      setIsLogin(true);
    } else {
      message.error(translateError(res.message));
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://127.0.0.1:8000/api/auth/google/redirect";
  };
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.left}>
          <div className={styles.brand}>
            <h1>FRUIT SHOP</h1>
            <p>Tinh hoa đất trời trong từng thớ quả</p>
          </div>
          <div className={styles.banner}>
            <img src={bannerlogin} alt="Banner" />
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.card}>
            <h2>{isLogin ? "Đăng nhập tài khoản" : "Đăng ký tài khoản"}</h2>
            <div className={styles.tabs}>
              <button className={isLogin ? styles.active : ""} onClick={() => handleTabChange(true)}>ĐĂNG NHẬP</button>
              <button className={!isLogin ? styles.active : ""} onClick={() => handleTabChange(false)}>ĐĂNG KÝ</button>
            </div>

            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <div className={styles.formGroup}>
                <label><span>*</span> Email</label>
                <div className={styles.inputWrapper}>
                  <div className={styles.iconLeft}><Mail size={18} /></div>
                  <input
                    name="email" type="email" value={formData.email} onChange={handleChange}
                    className={errors.email ? styles.errorInput : ""} placeholder="Nhập email"
                  />
                </div>
                {errors.email && <span className={styles.errorMsg}>{errors.email}</span>}
              </div>

              <div className={styles.formGroup}>
                <label><span>*</span> Mật khẩu</label>
                <div className={styles.inputWrapper}>
                  <div className={styles.iconLeft}><Lock size={18} /></div>
                  <input
                    name="password" type={showPass ? "text" : "password"} value={formData.password} onChange={handleChange}
                    className={errors.password ? styles.errorInput : ""} placeholder="Nhập mật khẩu"
                  />
                  <button type="button" className={styles.toggleIcon} onClick={() => setShowPass(!showPass)}>
                    {showPass ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                </div>
                {errors.password && <span className={styles.errorMsg}>{errors.password}</span>}
              </div>

              {!isLogin && (
                <div className={styles.formGroup}>
                  <label><span>*</span> Nhập lại mật khẩu</label>
                  <div className={styles.inputWrapper}>
                    <div className={styles.iconLeft}><Lock size={18} /></div>
                    <input
                      name="confirmPassword" type={showConfirm ? "text" : "password"} value={formData.confirmPassword} onChange={handleChange}
                      className={errors.confirmPassword ? styles.errorInput : ""} placeholder="Nhập lại mật khẩu"
                    />
                    <button type="button" className={styles.toggleIcon} onClick={() => setShowConfirm(!showConfirm)}>
                      {showConfirm ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <span className={styles.errorMsg}>{errors.confirmPassword}</span>}
                </div>
              )}

              {serverError && (
                <div style={{ color: '#ff4d4f', marginBottom: '15px', textAlign: 'center', fontSize: '14px', fontWeight: '500' }}>
                  {serverError}
                </div>
              )}

              <button type="submit" className={styles.mainBtn} disabled={loading}>
                {loading ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Loader size={18} className={styles.spinning} />
                    <span>Đang xử lý...</span>
                  </div>
                ) : (
                  isLogin ? "Đăng nhập" : "Đăng ký"
                )}
              </button>

              {isLogin && (
                <>
                  <a className={styles.forgotPass} onClick={() => { setShowForgot(true); setForgotStep(1); }}>Quên mật khẩu?</a>
                  <button
                    type="button"
                    className={styles.googleBtn}
                    onClick={handleGoogleLogin}
                  >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" />
                    <span>Đăng nhập bằng Google</span>
                  </button>
                </>
              )
              }
            </form >
          </div >
        </div >
      </div >

      {
        showVerify && (
          <OtpModal
            email={formData.email}
            timer={timer}
            onClose={() => setShowVerify(false)}
            onVerify={handleVerifyCode}
            onResend={handleResendCode}
          />
        )
      }

      {
        showForgot && (
          <ForgotPasswordModal
            onClose={() => setShowForgot(false)}
            step={forgotStep}
            setStep={setForgotStep}
            onSendOtp={handleForgotPasswordStep1}
            onVerifyOtp={handleForgotPasswordStep2}
            onResetPass={handleForgotPasswordStep3}
          />
        )
      }
    </div >
  );

}

// Sub-components for Modals to keep code clean
function OtpModal({ email, timer, onClose, onVerify, onResend }) {
  const [otp, setOtp] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  const handleResendClick = async () => {
    setResendLoading(true);
    await onResend();
    setResendLoading(false);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>Xác minh OTP</h3>
          <button className={styles.close} onClick={onClose}>&times;</button>
        </div>
        <div className={styles.modalBody}>
          <p className={styles.infoText}>Mã xác thực đã được gửi đến: <strong>{email}</strong></p>
          <div className={styles.formGroup}>
            <label>Mã OTP</label>
            <div className={styles.inputWrapper}>
              <div className={styles.iconLeft}><Lock size={18} /></div>
              <input
                type="text"
                placeholder="Nhập OTP 6 số"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.otpInputRow}>
            <button
              className={styles.resendBtn}
              disabled={timer > 0 || resendLoading}
              onClick={handleResendClick}
            >
              {resendLoading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Loader size={13} className={styles.spinning} />
                  Đang gửi...
                </span>
              ) : "Gửi lại OTP"}
            </button>
            {timer > 0 && <span className={styles.timer}>({timer}s)</span>}
          </div>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.btnCancel} onClick={onClose}>Cancel</button>
          <button className={styles.btnSubmit} onClick={() => onVerify(otp)}>Xác minh</button>
        </div>
      </div>
    </div>
  )
}

function ForgotPasswordModal({ onClose, step, setStep, onSendOtp, onVerifyOtp, onResetPass }) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    setLoading(true);
    if (step === 1) await onSendOtp(email);
    if (step === 2) onVerifyOtp(otp);
    if (step === 3) await onResetPass(email, otp, pass, confirmPass);
    setLoading(false);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>Quên mật khẩu</h3>
          <button className={styles.close} onClick={onClose}>&times;</button>
        </div>
        <div className={styles.stepsContainer}>
          <div className={`${styles.step} ${step === 1 ? styles.active : ""}`}><div className={styles.stepNum}>1</div> Email</div>
          <div className={styles.stepLine}></div>
          <div className={`${styles.step} ${step === 2 ? styles.active : ""}`}><div className={styles.stepNum}>2</div> OTP</div>
          <div className={styles.stepLine}></div>
          <div className={`${styles.step} ${step === 3 ? styles.active : ""}`}><div className={styles.stepNum}>3</div> Mật khẩu mới</div>
        </div>
        <div className={styles.modalBody}>
          {step === 1 && (
            <div className={styles.formGroup}>
              <label>Email đăng ký</label>
              <div className={styles.inputWrapper}>
                <div className={styles.iconLeft}><Mail size={18} /></div>
                <input type="text" placeholder="Nhập email đăng ký" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
          )}
          {step === 2 && (
            <div className={styles.formGroup}>
              <label>Mã OTP</label>
              <div className={styles.inputWrapper}>
                <div className={styles.iconLeft}><Lock size={18} /></div>
                <input type="text" placeholder="Nhập OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
              </div>
            </div>
          )}
          {step === 3 && (
            <>
              <div className={styles.formGroup}>
                <label>Mật khẩu mới</label>
                <div className={styles.inputWrapper}>
                  <div className={styles.iconLeft}><Lock size={18} /></div>
                  <input type="password" placeholder="Mật khẩu mới" value={pass} onChange={(e) => setPass(e.target.value)} />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Nhập lại mật khẩu</label>
                <div className={styles.inputWrapper}>
                  <div className={styles.iconLeft}><Lock size={18} /></div>
                  <input type="password" placeholder="Nhập lại mật khẩu" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} />
                </div>
              </div>
            </>
          )}
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.btnCancel} onClick={onClose} disabled={loading}>Hủy</button>
          <button className={styles.btnSubmit} onClick={handleNext} disabled={loading}>
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Loader size={16} className={styles.spinning} />
                <span>Đang xử lý...</span>
              </div>
            ) : (
              step === 1 ? "Gửi OTP" : step === 2 ? "Xác nhận" : "Đổi mật khẩu"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}