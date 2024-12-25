import { useState } from "react";
import Popup from "reactjs-popup";
import { Box, TextField, Button, MenuItem } from "@mui/material";

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

  // Handle input changes
  const handleChange = (e: any) => {
    const { id, name, value } = e.target;
    setFormData((prev) => ({ ...prev, [id || name]: value }));
  };

  // Handle form submission
  const handleSave = () => {
    // Validation: Ensure all fields are filled
    const { username, fullName, phone, email, buildingName } = formData;
    if (!username || !fullName || !phone || !email || !buildingName) {
      alert("Please fill all fields.");
      return;
    }

    onSubmit(formData); // Pass the data to parent component
    onClose(); // Close the popup
    setFormData({
      username: "",
      fullName: "",
      phone: "",
      email: "",
      buildingName: "",
    }); // Reset the form
  };

  return (
    <Popup open={open} modal nested onClose={onClose}>
      <Box
        className="modal"
        component="form"
        sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2 }}
        noValidate
        autoComplete="off"
      >
        <div className="header">Add Staff</div>
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
          margin="normal"
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
          margin="normal"
          variant="outlined"
          type="text"
        />

        <TextField
          fullWidth
          id="email"
          label="Email"
          value={formData.email}
          onChange={(e) => {
            const value = e.target.value;
            if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            }
            handleChange(e);
          }}
          margin="normal"
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
          margin="normal"
          variant="outlined"
        >
          {building.map((building) => (
            <MenuItem key={building.value} value={building.value}>
              {building.label}
            </MenuItem>
          ))}
        </TextField>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button
            className="savebutton"
            onClick={handleSave}
            variant="contained"
            color="primary"
          >
            Save
          </Button>
          <Button
            className="exitbutton"
            onClick={onClose}
            variant="outlined"
            color="secondary"
          >
            Exit
          </Button>
        </Box>
      </Box>
    </Popup>
  );
};

export default RegisterForm;
