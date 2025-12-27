import { useState, useEffect } from "react";
import styles from "./login.module.scss";
import bannerlogin from "../../assets/images/bannerlogin.png";

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
);

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
);

const EyeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
);

const EyeOffIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
);

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [showForgot, setShowForgot] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [timer, setTimer] = useState(44);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

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
    setShowPass(false);
    setShowConfirm(false);
    setFormData({ email: "", password: "", confirmPassword: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      if (isLogin) {
        console.log("Submit Login", formData);
      } else {
        setShowVerify(true);
        setTimer(44);
      }
    }
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
                  <div className={styles.iconLeft}><MailIcon /></div>
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
                  <div className={styles.iconLeft}><LockIcon /></div>
                  <input 
                    name="password" type={showPass ? "text" : "password"} value={formData.password} onChange={handleChange}
                    className={errors.password ? styles.errorInput : ""} placeholder="Nhập mật khẩu" 
                  />
                  <button type="button" className={styles.toggleIcon} onClick={() => setShowPass(!showPass)}>
                    {showPass ? <EyeIcon /> : <EyeOffIcon />}
                  </button>
                </div>
                {errors.password && <span className={styles.errorMsg}>{errors.password}</span>}
              </div>

              {!isLogin && (
                <div className={styles.formGroup}>
                  <label><span>*</span> Nhập lại mật khẩu</label>
                  <div className={styles.inputWrapper}>
                    <div className={styles.iconLeft}><LockIcon /></div>
                    <input 
                      name="confirmPassword" type={showConfirm ? "text" : "password"} value={formData.confirmPassword} onChange={handleChange}
                      className={errors.confirmPassword ? styles.errorInput : ""} placeholder="Nhập lại mật khẩu" 
                    />
                    <button type="button" className={styles.toggleIcon} onClick={() => setShowConfirm(!showConfirm)}>
                      {showConfirm ? <EyeIcon /> : <EyeOffIcon />}
                    </button>
                  </div>
                  {errors.confirmPassword && <span className={styles.errorMsg}>{errors.confirmPassword}</span>}
                </div>
              )}

              <button type="submit" className={styles.mainBtn}>{isLogin ? "Đăng nhập" : "Đăng ký"}</button>

              {isLogin && (
                <>
                  <a className={styles.forgotPass} onClick={() => { setShowForgot(true); setForgotStep(1); }}>Quên mật khẩu?</a>
                  <button type="button" className={styles.googleBtn}>
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" />
                    <span>Đăng nhập bằng tài khoản google</span>
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      </div>

      {showForgot && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Quên mật khẩu</h3>
              <button className={styles.close} onClick={() => setShowForgot(false)}>&times;</button>
            </div>
            <div className={styles.stepsContainer}>
              <div className={`${styles.step} ${forgotStep === 1 ? styles.active : ""}`}>
                <div className={styles.stepNum}>1</div> Email
              </div>
              <div className={styles.stepLine}></div>
              <div className={`${styles.step} ${forgotStep === 2 ? styles.active : ""}`}>
                <div className={styles.stepNum}>2</div> OTP
              </div>
              <div className={styles.stepLine}></div>
              <div className={`${styles.step} ${forgotStep === 3 ? styles.active : ""}`}>
                <div className={styles.stepNum}>3</div> Mật khẩu mới
              </div>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <input type="text" placeholder="Nhập email đăng ký" />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.btnCancel} onClick={() => setShowForgot(false)}>Hủy</button>
              <button className={styles.btnSubmit}>Gửi OTP</button>
            </div>
          </div>
        </div>
      )}

      {showVerify && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Xác minh OTP</h3>
              <button className={styles.close} onClick={() => setShowVerify(false)}>&times;</button>
            </div>
            <div className={styles.modalBody}>
              <p>Email: <strong>{formData.email}</strong></p>
              <div className={styles.formGroup}>
                <input type="text" placeholder="Nhập OTP 6 số" />
              </div>
              <div className={styles.otpInputRow}>
                <button className={styles.resendBtn} disabled={timer > 0}>Gửi lại OTP</button>
                {timer > 0 && <span className={styles.timer}>({timer}s)</span>}
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.btnCancel} onClick={() => setShowVerify(false)}>Cancel</button>
              <button className={styles.btnSubmit}>Xác minh</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}