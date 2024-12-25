import { useState } from "react";
import Popup from "reactjs-popup";
import { Box, TextField, Button, MenuItem, Typography } from "@mui/material";

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

  const handleChange = (e: any) => {
    const { id, name, value } = e.target;
    setFormData((prev) => ({ ...prev, [id || name]: value }));
  };

  const handleSave = () => {
    const { username, fullName, phone, email, buildingName } = formData;
    if (!username || !fullName || !phone || !email || !buildingName) {
      alert("Please fill all fields.");
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

  return (
    <Popup open={open} modal nested onClose={onClose}>
      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          p: 4,
          width: 360,
          borderRadius: 2,
          boxShadow: 4,
          bgcolor: "background.paper",
        }}
        noValidate
        autoComplete="off"
      >
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
        />
        <TextField
          fullWidth
          id="fullName"
          label="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          margin="dense"
          variant="outlined"
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