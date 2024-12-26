import { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Typography,
  Alert,
} from "@mui/material";

const RegisterForm = ({ open, onClose, onSubmit }: any) => {
  const building = [
    { value: "D7", label: "D7" },
    { value: "D9", label: "D9" },
    { value: "D3", label: "D3" },
    { value: "D5", label: "D5" },
    { value: "D3-5", label: "D3-5" },
    { value: "D6", label: "D6" },
    { value: "D8", label: "D8" },
    { value: "C1", label: "C1" },
    { value: "C2", label: "C2" },
    { value: "B1", label: "B1" },
    { value: "C4", label: "C4" },
    { value: "C7", label: "C7" },
  ];

  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    phone: "",
    email: "",
    buildingName: "",
  });

  const [alert, setAlert] = useState<string | null>(null);

  const handleChange = (e: any) => {
    const { id, name, value } = e.target;
    setFormData((prev) => ({ ...prev, [id || name]: value }));
  };

  const handleSave = () => {
    const { username, fullName, phone, email, buildingName } = formData;
    if (!username || !fullName || !phone || !email || !buildingName) {
      setAlert("Please fill in all the required fields.");
      return;
    }

    onSubmit(formData);
    onClose();
    setFormData({
      username: "",
      fullName: "",
      phone: "",
      email: "",
      buildingName: "",
    });
  };

  useEffect(() => {
    if (alert) {
      const timeout = setTimeout(() => setAlert(null), 2000); // Cảnh báo sẽ biến mất sau 2 giây
      return () => clearTimeout(timeout); // Xóa timeout khi component unmount hoặc alert thay đổi
    }
  }, [alert]);

  return (
    <Popup open={open} modal nested onClose={onClose}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          p: 4,
          width: 400,
          maxWidth: "90%",
          borderRadius: 2,
          boxShadow: 4,
          bgcolor: "background.paper",
        }}
        noValidate
        autoComplete="off"
      >
        {alert && (
          <Alert
            severity="warning"
            sx={{
              mb: 2,
              borderRadius: 1,
              position: "relative",
              "& .MuiAlert-action": { display: "none" }, // Loại bỏ nút x
            }}
          >
            {alert}
          </Alert>
        )}
        <Typography variant="h5" align="center" gutterBottom>
          Add Staff
        </Typography>
        <TextField
          fullWidth
          id="username"
          label="Username"
          value={formData.username}
          onChange={handleChange}
          margin="dense"
          variant="outlined"
          helperText={!formData.username && "This field is required"}
        />
        <TextField
          fullWidth
          id="fullName"
          label="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          margin="dense"
          variant="outlined"
          helperText={!formData.fullName && "This field is required"}
        />
        <TextField
          fullWidth
          id="phone"
          label="Phone"
          value={formData.phone}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*$/.test(value)) {
              handleChange(e);
            }
          }}
          margin="dense"
          variant="outlined"
          type="text"
          helperText={!formData.phone && "This field is required"}
        />
        <TextField
          fullWidth
          id="email"
          label="Email"
          value={formData.email}
          onChange={handleChange}
          margin="dense"
          variant="outlined"
          type="email"
          helperText={!formData.email && "This field is required"}
        />
        <TextField
          fullWidth
          name="buildingName"
          select
          label="Building Name"
          value={formData.buildingName}
          onChange={handleChange}
          margin="dense"
          variant="outlined"
          helperText={!formData.buildingName && "This field is required"}
        >
          {building.map((building) => (
            <MenuItem key={building.value} value={building.value}>
              {building.label}
            </MenuItem>
          ))}
        </TextField>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
          <Button onClick={onClose} variant="outlined" color="secondary">
            Exit
          </Button>
        </Box>
      </Box>
    </Popup>
  );
};

export default RegisterForm;
