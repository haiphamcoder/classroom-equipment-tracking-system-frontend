
import { useRef, useState, useEffect } from "react";
import Popup from "reactjs-popup";
// import ClickableText from "./ClickableText";
import "../styles/NewDevicesMenu.scss";
import {
  TextField,
  Box,
  Autocomplete,
  List,
  ListItem,
  IconButton,
} from "@mui/material";
import { Remove, Add } from "@mui/icons-material";
import axios from "axios";
import { NewTicketItems, NewTicket } from "../data/mockData";
// import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
// import dayjs, { Dayjs } from 'dayjs';
import { staff_id } from "../context/useAuth";

const NewTicketsMenu: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [equipmentOptions, setEquipmentOptions] = useState<number[]>([]); // State for equipment IDs
  const [formData, setFormData] = useState<NewTicket>({
    borrowerId: 0,
    staffId: 0,
    borrowTime: new Date().toISOString(),
    returnDeadline: new Date().toISOString(),
    items: [],
  });

  // Fetch equipment IDs from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/equipment/list");
        const ids = response.data.map((item: any) => item.id); // Extract only the IDs
        setEquipmentOptions(ids);
      } catch (error) {
        console.error("Error fetching equipment data:", error);
      }
    };

    fetchData();
    // Set up periodic refresh
    const intervalId = setInterval(fetchData, 30000); // Refresh every 30 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);

  }, []);

  // Handle adding a new row
  const handleAddRow = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { equipmentId: 0, quantity: 0, notes: "" }],
    }));
  };

  // Handle removing a row
  const handleRemoveRow = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  // Handle item changes
  const handleItemChange = (index: number, field: keyof NewTicketItems, value: any) => {
    const updatedItems = formData.items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setFormData((prev) => ({ ...prev, items: updatedItems }));
  };

  const formatDateTimeForInput = (isoString: string) => {
    const date = new Date(isoString);
    return date.toISOString().slice(0, 16); // Format: "YYYY-MM-DDThh:mm"
  };

  const handleDateTimeChange = (field: "borrowTime" | "returnDeadline", value: string) => {
    try {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        setFormData((prev) => ({
          ...prev,
          [field]: date.toISOString(),
        }));
      }
    } catch (error) {
      console.error("Invalid date input:", error);
    }
  };

  const currentDateTime = new Date().toISOString();
  const ref = useRef<any>(null);
  const exit = () => {
    setFormData({ borrowerId: 0, staffId: 0, borrowTime: currentDateTime, returnDeadline: currentDateTime, items: [] })
    ref.current.close();
  }

  const handleSave = async () => {

    setLoading(true);
    try {
      const formattedData = {
        ...formData,
        borrowTime: new Date(formData.borrowTime).toISOString(),
        returnDeadline: new Date(formData.returnDeadline).toISOString(),
      };

      const response = await axios.post("/api/order/create", formattedData);
      console.log("Ticket created successfully:", response.data);
      setFormData({ borrowerId: 0, staffId: 0, borrowTime: currentDateTime, returnDeadline: currentDateTime, items: [] })
      ref.current.close();
    } catch (error) {
      console.error("Error creating ticket:", error);
    }
  };
  const handleFormChange = (field: keyof NewTicket, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  return (
    <Popup
      open={open}
      onClose={onClose}
      ref={ref}
      // trigger={<ClickableText text="Add tickets" onClick={() => { }} />}
      modal
      nested
    >
      <Box className="modal" component="form" sx={{ display: "flex", flexWrap: "wrap", marginLeft: '250px' }} noValidate autoComplete="off">
        <div className="header">Add devices</div>
        <div className="content">
          {/* Borrower ID */}
          <TextField
            fullWidth
            id="borrowerId"
            label="MSSV/MSGV"
            value={formData.borrowerId}
            onChange={(e) => handleFormChange("borrowerId", Number(e.target.value))}
            margin="normal"
            variant="outlined"
          />

          {/* Staff ID */}
          <TextField
            fullWidth
            aria-readonly
            id="staffId"
            label="Id nhan vien"
            value={staff_id}
            onChange={(e) => handleFormChange("staffId", Number(e.target.value))}
            margin="normal"
            variant="outlined"
          />

          {/* Borrow Time */}
          <TextField
            fullWidth
            label="Thoi gian muon"
            type="datetime-local"
            value={formatDateTimeForInput(formData.borrowTime)}
            onChange={(e) => handleDateTimeChange("borrowTime", e.target.value)}
            margin="normal"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
          />

          {/* Return Deadline */}
          <TextField
            fullWidth
            label="Thoi gian tra"
            type="datetime-local"
            value={formatDateTimeForInput(formData.returnDeadline)}
            onChange={(e) => handleDateTimeChange("returnDeadline", e.target.value)}
            margin="normal"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              min: formatDateTimeForInput(formData.borrowTime),
            }}
          />

          {/* Items List */}
          <List sx={{
            borderRadius: '12px',
            maxHeight: '200px',
            overflowY: 'auto',
            border: '1px solid #ddd',
            padding: '10px',
          }}>
            {formData.items.map((item, index) => (
              <ListItem key={index} disableGutters>
                <Autocomplete
                  fullWidth
                  options={equipmentOptions}
                  value={item.equipmentId}
                  onChange={(_, newValue) => handleItemChange(index, "equipmentId", newValue)}
                  renderInput={(params) => (
                    <TextField {...params} label="Equipment" variant="outlined" margin="normal" />
                  )}
                />
                <TextField
                  label="Quantity"
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, "quantity", Number(e.target.value))}
                  margin="normal"
                  variant="outlined"
                />
                <TextField
                  label="Notes"
                  value={item.notes}
                  onChange={(e) => handleItemChange(index, "notes", e.target.value)}
                  margin="normal"
                  variant="outlined"
                />
                <IconButton onClick={() => handleRemoveRow(index)}>
                  <Remove />
                </IconButton>
              </ListItem>
            ))}
          </List>
          <IconButton onClick={handleAddRow} color="primary">
            <Add />
          </IconButton>
        </div>
        <div className="actions">
          <button className="savebutton" type="button" onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "SAVE"}
          </button>
          <button className="exitbutton" type="button" onClick={exit}>
            Exit
          </button>
        </div>
      </Box>
    </Popup>
  );
}

export default NewTicketsMenu;

