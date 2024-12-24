import {
  Avatar,
  Box,
  Paper,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/useAuth";
import CustomAlert from "../components/CustomAlert";

export const ChangePassword = () => {
  const [formData, setFormData] = useState({
    staffId: 0,
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const { logout } = useAuth();

  const [alert, setAlert] = useState<{
    type: string;
    title: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        if (parsedUser && parsedUser.id) {
          setFormData((prev) => ({ ...prev, staffId: parsedUser.id }));
        } else {
          console.error("Invalid user data in localStorage");
        }
      } catch (error) {
        console.error("Error parsing user from localStorage", error);
      }
    } else {
      console.warn("No user data found in localStorage");
    }
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const showAlert = (type: string, title: string, message: string) => {
    setAlert({ type, title, message });
    setTimeout(() => {
      setAlert(null);
    }, 2000);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const { oldPassword, newPassword, confirmNewPassword, staffId } = formData;
  
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      showAlert("error", "Validation Error", "Vui lòng điền đủ các thông tin.");
      return;
    }
  
    if (newPassword !== confirmNewPassword) {
      showAlert("error", "Validation Error", "Mật khẩu mới không khớp. Vui lòng thử lại.");
      return;
    }
  
    try {
      await axios.post("/api/staff/change-password", {
        staffId,
        oldPassword,
        newPassword,
      });
  
      showAlert("success", "Success", "Thay đổi mật khẩu thành công.");
  
      setTimeout(() => {
        logout();
      }, 2000);
    } catch (error) {
      console.error("Error updating password:", error);
      showAlert("error", "Error", "Có lỗi xảy ra khi đổi mật khẩu. Vui lòng thử lại.");
    }
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
      <Paper elevation={10} sx={{ marginTop: 8, padding: 3 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Change Password
          </Typography>
        </Box>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
          <TextField
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleChange}
            placeholder="Enter old password"
            type="password"
            fullWidth
            required
            autoFocus
            sx={{ mb: 2 }}
          />
          <TextField
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="Enter new password"
            type="password"
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            name="confirmNewPassword"
            value={formData.confirmNewPassword}
            onChange={handleChange}
            placeholder="Confirm new password"
            type="password"
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Change Password
          </Button>
        </Box>
      </Paper>
    </div>
  );
};
