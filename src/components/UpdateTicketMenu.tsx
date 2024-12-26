import { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import { Box, Button } from "@mui/material";
import { UpdateTicket } from "../data/mockData";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
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

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({ ...prev, [name]: value }));
  // };
  //
  const handleSave = async () => {
    const newDeadline = formData;
    if (!newDeadline) {
      alert("Please fill in the new deadline.");
      return;
    }
    await onSubmit(formData); // Ensure onSubmit handles the POST request
    onClose();
  };

  const [value, setValue] = React.useState<Dayjs | null>(
    dayjs().set('date', dayjs().date()).set('month', dayjs().month()).set('year', dayjs().year())
  );

  const handleTimeChange = (newValue: Dayjs | null) => {
    if (newValue) {
      // Lock the date to the current day and update only the time portion
      const lockedDate = dayjs().startOf('day'); // Current date with time set to 00:00

      // Update the time based on the new value selected by the user
      const newDate = lockedDate
        .set('hour', newValue.hour())
        .set('minute', newValue.minute())
        .set('second', newValue.second());

      setValue(newDate);

      // Format the date as an ISO string with the local time but mimic the UTC format
      const formattedDate = newDate.format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z'; // Add Z to indicate UTC

      // Update the newDeadline in the updateTicket
      setFormData((prevTicket) => ({
        ...prevTicket,
        newDeadline: formattedDate,
      }));

      console.log('Updated Ticket id:', formData.orderId); // To see the updated object in the console
      console.log('Updated Ticket new deadline:', formData.newDeadline); // To see the updated object in the console
    }
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
        <div className="header">Extend Deadline</div>

        {/*<TextField
          fullWidth
          name="newDeadline"
          label="New Deadline"
          type="datetime-local"
          value={formData.newDeadline}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true, // Ensures the label is displayed correctly for date inputs
          }}
        />*/}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DateTimePicker', 'DateTimePicker']}>
            <DateTimePicker
              label="Extend deadline to"
              value={value}
              onChange={handleTimeChange}
              openTo="hours" // Keep picker open to select time
            />
          </DemoContainer>
        </LocalizationProvider>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
          <Button onClick={onClose} variant="outlined" color="error">
            Exit
          </Button>
        </Box>
      </Box>
    </Popup>
  );
};

export default UpdateTicketForm;

