
import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, MenuItem } from '@mui/material';
import axios from 'axios';

interface TicketExport {
  borrowerName: string;
  status: 'BORROWED' | 'RETURNED' | 'OVERDUE' | 'CANCELED';
  startDate: string;
  endDate: string;
  sortBy: 'BORROWER';
  sortDirection: string;
}

const TicketExportPopup: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const [formData, setFormData] = useState<TicketExport>({
    borrowerName: '',
    status: 'BORROWED',
    startDate: '',
    endDate: '',
    sortBy: 'BORROWER',
    sortDirection: 'asc',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }))
  };




  const handleSubmit = async () => {
    try {
      // Make GET request with axios and specify responseType as 'blob'
      const response = await axios.get("api/order/export", {
        params: formData,
        responseType: 'blob'
      });

      console.log('Response Headers:', formData);
      // Log response headers to check content type and other metadata
      console.log('Response Headers:', response.headers);
      // Get filename from Content-Disposition header if available
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'export.xlsx';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '');
        }
      }

      // Create a blob URL
      const blob = new Blob([response.data], {
        type: response.headers['content-type']
      });
      const url = window.URL.createObjectURL(blob);

      // Create temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      alert('Export Successful');
      onClose();
    } catch (error) {
      alert('Export Failed');
      console.error(error);
    }
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Export Ticket</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          margin="dense"
          label="Borrower Name"
          name="borrowerName"
          value={formData.borrowerName}
          onChange={handleChange}
        />

        <TextField
          select
          fullWidth
          margin="dense"
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          {['BORROWED', 'RETURNED', 'OVERDUE', 'CANCELED'].map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          margin="dense"
          label="Start Date"
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          fullWidth
          margin="dense"
          label="End Date"
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          select
          fullWidth
          margin="dense"
          label="Sort Direction"
          name="sortDirection"
          value={formData.sortDirection}
          onChange={handleChange}
        >
          <MenuItem value="asc">Ascending</MenuItem>
          <MenuItem value="desc">Descending</MenuItem>
        </TextField>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TicketExportPopup;

