import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import axios from "axios";
import CustomAlert from "../components/CustomAlert"; // Import CustomAlert

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

  // State for CustomAlert
  const [alert, setAlert] = useState<{
    type: string;
    title: string;
    message: string;
  } | null>(null);

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu mới không khớp. Vui lòng thử lại.");
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
      showAlert("success", "Password Changed", "Thay đổi mật khẩu thành công.");
      onClose();
    } catch (err: any) {
      // Show error alert
      showAlert(
        "error",
        "Change Failed",
        err.response?.data?.message || err.message || "Có lỗi xảy ra khi đổi mật khẩu. Vui lòng thử lại."
      );
    }
  };

  // Function to show CustomAlert
  const showAlert = (type: string, title: string, message: string) => {
    setAlert({ type, title, message });
    setTimeout(() => {
      setAlert(null);
    }, 2000); // Auto-hide after 2 seconds
  };

  return (
    <div>
      {alert && (
        <CustomAlert
          type={alert.type as "success" | "info" | "warning" | "error"}
          title={alert.type === "success" ? "Thành công" : "Lỗi"}
          message={alert.message}
        />
      )}
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            margin="normal"
            fullWidth
            type="password"
            label="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <TextField
            margin="normal"
            fullWidth
            type="password"
            label="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <TextField
            margin="normal"
            fullWidth
            type="password"
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary" variant="outlined">
            Exit
          </Button>
          <Button
            onClick={handleChangePassword}
            color="primary"
            variant="contained"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ChangePasswordForm;
