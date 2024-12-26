import { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import { Box, TextField, Button, MenuItem, Alert } from "@mui/material";
import { Staff } from "../pages/StaffList";

interface UpdateStaffFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Staff) => void;
  staffData: Staff | undefined;
}

const UpdateStaffForm = ({
  open,
  onClose,
  onSubmit,
  staffData,
}: UpdateStaffFormProps) => {
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

  const [formData, setFormData] = useState<Staff>(
    staffData || {
      id: "",
      name: "",
      email: "",
      phone: "",
      buildingId: { buildingName: "" },
    }
  );

  const [alert, setAlert] = useState<string | null>(null);

  useEffect(() => {
    if (staffData) {
      setFormData({ ...staffData });
    }
  }, [staffData]);

  useEffect(() => {
    if (alert) {
      const timeout = setTimeout(() => setAlert(null), 2000); // Cảnh báo tự động biến mất sau 2 giây
      return () => clearTimeout(timeout);
    }
  }, [alert]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const {
      name,
      phone,
      buildingId: { buildingName },
    } = formData;

    if (!name || !phone || !buildingName) {
      setAlert("Please fill in all required fields.");
      return;
    }

    onSubmit(formData);
    onClose();
  };

  if (!staffData) return null;

  return (
    <Popup open={open} modal nested onClose={onClose}>
      <Box
        className="modal"
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
        {alert && (
          <Alert
            severity="warning"
            sx={{
              mb: 2,
              borderRadius: 1,
              position: "relative",
              "& .MuiAlert-action": { display: "none" }, // Loại bỏ nút đóng
            }}
          >
            {alert}
          </Alert>
        )}
        <div className="header">Update Staff</div>
        <TextField
          fullWidth
          name="name"
          label="Name"
          value={formData.name}
          onChange={handleChange}
          helperText={!formData.name && "This field is required"}
        />
        <TextField
          fullWidth
          name="phone"
          label="Phone"
          value={formData.phone}
          onChange={handleChange}
          type="number"
          sx={{
            "& input[type=number]": {
              MozAppearance: "textfield", // Loại bỏ nút tăng giảm trên Firefox
            },
            "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button":
              {
                WebkitAppearance: "none", // Loại bỏ nút tăng giảm trên Chrome, Edge, và Safari
                margin: 0,
              },
          }}
          helperText={!formData.phone && "This field is required"}
        />
        <TextField
          fullWidth
          name="buildingName"
          select
          label="Building Name"
          value={formData.buildingId?.buildingName || ""}
          onChange={handleChange}
          helperText={!formData.buildingId?.buildingName && "This field is required"}
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

export default UpdateStaffForm;
