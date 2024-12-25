
import { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import { Box, TextField, Button } from "@mui/material";
import { UpdateTicket } from "../data/mockData";

// Props for the form component
interface UpdateTicketFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateTicket) => void;
  ticketData: UpdateTicket | null;
}

const UpdateTicketForm = ({
  open,
  onClose,
  onSubmit,
  ticketData,
}: UpdateTicketFormProps) => {
  const [formData, setFormData] = useState<UpdateTicket>(
    ticketData || { orderId: 0, newDeadline: "" }
  );

  useEffect(() => {
    if (ticketData) {
      setFormData({ ...ticketData });
    }
  }, [ticketData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const newDeadline = formData;
    if (!newDeadline) {
      alert("Please fill in the new deadline.");
      return;
    }
    await onSubmit(formData); // Ensure onSubmit handles the POST request
    onClose();
  };

  if (!ticketData) return null;

  return (
    <Popup open={open} modal nested onClose={onClose}>
      <Box
        className="modal"
        component="form"
        sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2 }}
        noValidate
        autoComplete="off"
      >
        <div className="header">Update Ticket</div>

        <TextField
          fullWidth
          name="newDeadline"
          label="New Deadline"
          type="datetime-local"
          value={formData.newDeadline}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true, // Ensures the label is displayed correctly for date inputs
          }}
        />
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

export default UpdateTicketForm;

