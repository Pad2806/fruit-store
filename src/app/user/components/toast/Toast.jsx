import toast from "react-hot-toast"; 
import SuccessToast from "./SuccessToast";
import ConfirmToast from "./ConfirmToast";

export const ToastService = { 
  success: (product) => {
    toast.custom((t) => <SuccessToast t={t} product={product} />, {
      position: "top-right",
    });
  },

  confirmDelete: (message, onConfirm) => {
    toast.custom((t) => <ConfirmToast t={t} message={message} onConfirm={onConfirm} />, {
      position: "top-center",
      duration: Infinity,
    });
  },
success: (msg) =>
  toast.success(msg, {
    position: "top-right",
    style: { marginTop: "60px" },
  }),

  error: (msg) => toast.error(msg),
};