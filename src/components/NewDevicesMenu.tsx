import React, { useRef, useState, useEffect } from "react";
import Popup from 'reactjs-popup';
import "../styles/NewDevicesMenu.scss";
import { TextField, Box, MenuItem, Snackbar } from "@mui/material";
import axios from "axios";

const NewDevicesMenu: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    roomId: 0,
    quantity: 0,
  });
  const [rooms, setRooms] = useState<{ id: number; name: string }[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const ref = useRef<any>(null);

  // Fetch room data from the backend
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get("/api/equipment/list");

        // Map rooms and remove duplicates based on room ID
        const uniqueRooms: any = Array.from(
          new Map(
            response.data.map((item: any) => [
              item.room?.id, // Use room ID as the unique key
              {
                id: item.room?.id ?? 0,
                name: `${item.room?.building?.buildingName ?? "Unknown"} - ${item.room?.roomName ?? "Unknown"}`,
              },
            ])
          ).values()
        );

        setRooms(uniqueRooms);
      } catch (error) {
        console.error("Error fetching room data:", error);
      }
    };

    fetchRooms();
  }, []);  // Handle input change and update state
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  // Handle room selection
  const handleRoomChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setFormData({
      ...formData,
      roomId: e.target.value as number,
    });
  };

  // Handle adding new device
  const handleSave = async () => {
    if (!formData.name || !formData.roomId || formData.quantity <= 0) {
      setSnackbarMessage("Please fill in all fields correctly.");
      setOpenSnackbar(true);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("/api/equipment/add", formData);
      console.log("Device created successfully:", response.data);
      setSnackbarMessage("Device created successfully!");
      setOpenSnackbar(true);
      setFormData({ name: "", roomId: 0, quantity: 0 }); // Reset form data
      ref.current.close(); // Close popup
    } catch (error) {
      console.error("Error creating device:", error);
      setSnackbarMessage("Error creating device.");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const exit = () => {
    setFormData({ name: "", roomId: 0, quantity: 0 }); // Reset form when exiting
    ref.current.close();
  };

  return (
    <>
      <Popup
        open={open}
        onClose={onClose}
        ref={ref}
        modal
        nested
      >
        <Box className="modal" component="form" sx={{ display: "flex", flexDirection: "column", gap: 3, p: 2, borderRadius: '10px', backgroundColor: '#fbfcfe', marginLeft: '100px' }}
          noValidate autoComplete="off">
          <div className="header"> Add tickets </div>
          <div className="content">
            <TextField
              fullWidth
              select
              label="Room"
              value={formData.roomId}
              onChange={handleRoomChange}
              variant="outlined"
              margin="dense"
            >
              {rooms.map((room) => (
                <MenuItem key={room.id} value={room.id}>
                  {room.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              className="Name"
              id="name"
              label="Device Name"
              value={formData.name}
              onChange={handleInputChange}
              margin="normal"
              variant="outlined"
            />
            <TextField
              fullWidth
              className="Quantity"
              required
              id="quantity"
              label="Quantity"
              type="number"
              value={formData.quantity}
              onChange={handleInputChange}
              variant="outlined"
              margin="normal"
            />
          </div>
          <div className="actions">
            <button
              className="savebutton"
              onClick={handleSave}
              disabled={loading} // Disable save button while loading
            >
              {loading ? "Saving..." : "SAVE"}
            </button>
            <button className="exitbutton" onClick={exit}>
              Exit
            </button>
          </div>
        </Box>
      </Popup>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
      />
    </>
  );
}

export default NewDevicesMenu;

