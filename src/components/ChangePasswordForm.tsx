import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import axios from "axios";
import CustomAlert from "../components/CustomAlert";

interface ChangePasswordFormProps {
  open: boolean;
  onClose: () => void;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
  open,
  onClose,
}) => {
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // State for success or error alert
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Handle password change
  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      showAlert("error", "Mật khẩu mới không khớp. Vui lòng thử lại.");
      return;
    }

    try {
      const user = localStorage.getItem("user");
      if (!user) throw new Error("User not found");

      const parsedUser = JSON.parse(user);

      await axios.post("/api/staff/change-password", {
        staffId: parsedUser.id,
        oldPassword,
        newPassword,
      });

      // Show success alert
      showAlert("success", "Thay đổi mật khẩu thành công.");
      onClose();
    } catch (err: any) {
      showAlert(
        "error",
        err.response?.data?.message ||
          err.message ||
          "Có lỗi xảy ra khi đổi mật khẩu. Vui lòng thử lại."
      );
    }
  };

  // Function to show alert and auto-hide after 2 seconds
  const showAlert = (type: "success" | "error", message: string) => {
    setAlert({ type, message });
    setTimeout(() => {
      setAlert(null);
    }, 2000);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Thay đổi mật khẩu</DialogTitle>
      {/* Hiển thị cảnh báo ở đầu */}
      {alert && (
        <Alert
          severity={alert.type}
          sx={{
            mb: 2,
            borderRadius: 1,
            "& .MuiAlert-action": { display: "none" },
          }}
        >
          {alert.message}
        </Alert>
      )}
      <DialogContent>
        <TextField
          margin="normal"
          fullWidth
          type="password"
          label="Mật khẩu cũ"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <TextField
          margin="normal"
          fullWidth
          type="password"
          label="Mật khẩu mới"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <TextField
          margin="normal"
          fullWidth
          type="password"
          label="Xác nhận mật khẩu"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" variant="outlined">
          Thoát
        </Button>
        <Button
          onClick={handleChangePassword}
          color="primary"
          variant="contained"
        >
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangePasswordForm;
