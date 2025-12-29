import { useState, useEffect } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react"; 
import styles from "./login.module.scss";
import bannerlogin from "../../assets/images/bannerlogin.png";

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
                <label>Email đăng ký</label>
                <div className={styles.inputWrapper}>
                  <div className={styles.iconLeft}><Mail size={18} /></div>
                  <input type="text" placeholder="Nhập email đăng ký" />
                </div>
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
              <p className={styles.infoText}>Mã xác thực đã được gửi đến: <strong>{formData.email}</strong></p>
              <div className={styles.formGroup}>
                <label>Mã OTP</label>
                <div className={styles.inputWrapper}>
                  <div className={styles.iconLeft}><Lock size={18} /></div>
                  <input type="text" placeholder="Nhập OTP 6 số" />
                </div>
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