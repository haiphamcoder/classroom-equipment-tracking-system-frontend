import { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import { Box, TextField, Button, MenuItem } from "@mui/material";
import { UpdateDevice } from "../data/mockData";
import { list_response } from "./DeviceTable";
interface UpdateDeviceFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateDevice) => void;
  deviceData: UpdateDevice | null;
}

const UpdateDeviceForm = ({
  open,
  onClose,
  onSubmit,
  deviceData,
}: UpdateDeviceFormProps) => {
  const status = [
    "AVAILABLE",
    "UNAVAILABLE",
    "BORROWED",
    "DAMAGED",
    "NORMAL",
    "LOST",
  ];

  const [formData, setFormData] = useState<UpdateDevice>(
    deviceData || { id: 0, name: "", status: "AVAILABLE", quantity: 0 }
  );

  useEffect(() => {
    if (deviceData) {
      setFormData({ ...deviceData });
    }
  }, [deviceData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const { name, status, quantity } = formData;
    if (!name || !status || quantity <= 0) {
      alert("Please fill all fields.");
      return;
    }
    await onSubmit(formData);  // Ensure onSubmit handles the POST request
    onClose();
  };

  if (!deviceData) return null;

  return (
    <Popup open={open} modal nested onClose={onClose}>
      <Box
        className="modal"
        component="form"
        sx={{ display: "flex", flexDirection: "column", gap: 3, p: 2, borderRadius: '10px', backgroundColor: '#fbfcfe', padding: 0 }}
        noValidate
        width='600px'
        padding='20px'
        border='1px solid #ddd'
        autoComplete="off"
      >
        <div className="header" style={{ fontFamily: 'Inter, serif', fontWeight: '500', fontSize: '20px', borderBottom: '1px solid #ddd' }}>Update Device</div>
        <TextField
          fullWidth
          name="name"
          select
          label="Device Name"
          value={formData.name}
          onChange={handleChange}
          SelectProps={{
            MenuProps: {
              PaperProps: {
                style: {
                  maxHeight: 48 * 4.5,
                  width: '20ch',
                  boxShadow: 'none',
                  outline: '1px solid #D3D3D3'
                }
              }
            }
          }}
          InputProps={{
            style: { fontFamily: 'Inter, serif', fontWeight: '450', fontSize: '14px' }
          }}
          InputLabelProps={{
            style: { fontFamily: 'Inter, serif', fontWeight: '450', fontSize: '14px' }
          }}
        >
          {list_response.map((device: any) => (
            <MenuItem key={device.name} value={device.name} sx={{ fontFamily: 'Inter, serif', fontWeight: '450', fontSize: '14px' }}>
              {device.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          fullWidth
          name="quantity"
          label="Quantity"
          value={formData.quantity}
          onChange={handleChange}
          type="number"
          sx={{
            "& input[type=number]": {
              MozAppearance: "textfield", // Remove spin buttons in Firefox
            },
            "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button":
            {
              WebkitAppearance: "none", // Remove spin buttons in Chrome, Edge, and Safari
              margin: 0,
            },
          }}
          InputProps={{
            style: { fontFamily: 'Inter, serif', fontWeight: '500', fontSize: '14px' }
          }}
          InputLabelProps={{
            style: { fontFamily: 'Inter, serif', fontWeight: '500', fontSize: '14px' }
          }}

        />
        <TextField
          fullWidth
          name="status"
          select
          label="Status"
          value={formData.status}
          onChange={handleChange}
          SelectProps={{
            MenuProps: {
              PaperProps: {
                style: {
                  maxHeight: 48 * 4.5,
                  width: '20ch',
                  boxShadow: 'none',
                  outline: '1px solid #D3D3D3'
                }
              }
            }
          }}

          InputProps={{
            style: { fontFamily: 'Inter, serif', fontWeight: '500', fontSize: '14px' }
          }}
          InputLabelProps={{
            style: { fontFamily: 'Inter, serif', fontWeight: '500', fontSize: '14px' }
          }}
        >
          {status.map((status) => (
            <MenuItem key={status} value={status} sx={{ boxShadow: 'none' }}>
              {status}
            </MenuItem>
          ))}
        </TextField>
        <Box sx={{ display: "flex", alignItems: 'center', gap: 3, justifyContent: "flex-end" }}>
          <Button onClick={handleSave} variant="outlined" sx={{
            fontFamily: 'Inter, serif', fontWeight: '600', fontSize: '12px', color: 'black', borderColor: '#0b6bcb', backgroundColor: '#0b6bcb', textTransform: 'capitalize',
            '&:hover': {
              backgroundColor: '#023E79',
              borderColor: '#023E79',
            },
          }}>
            Save
          </Button>
          <Button onClick={onClose} variant="outlined" sx={{
            fontFamily: 'Inter, serif', fontWeight: '600', fontSize: '12px', color: 'black', borderColor: '#D3D3D3', textTransform: 'capitalize',
            '&:hover': {
              backgroundColor: '#D3D2D4',
              borderColor: '#D3D3D3',
            },
          }}>
            Exit
          </Button>
        </Box>
      </Box>
    </Popup >
  );
};

export default UpdateDeviceForm;

