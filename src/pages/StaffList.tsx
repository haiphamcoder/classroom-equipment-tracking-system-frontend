import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import RegisterForm from "../components/RegisterForm";
import UpdateStaffForm from "../components/UpdateStaffForm";
import CustomAlert from "../components/CustomAlert";

export type Staff = {
  id: string | "";
  name: string;
  email: string;
  phone: string;
  buildingId: {
    buildingName: string;
  };
  admin?: boolean;
};

const Staff = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [filteredStaff, setFilteredStaff] = useState<Staff[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStaff, setSelectedStaff] = useState<Staff>();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [alert, setAlert] = useState<{
    type: string;
    title: string;
    message: string;
  } | null>(null);

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/staff/list");
      setStaff(response.data);
      setFilteredStaff(response.data);
    } catch (error) {
      showAlert(
        "error",
        "Fetch Error",
        "Could not fetch staff data. Please try again later."
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    const filtered = staff.filter((item) =>
      item.name.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredStaff(filtered);
  };

  const handleClose = () => {
    fetchData();
    setDialogOpen(false);
  };

  const handleUpdate = async (updatedStaff: Staff) => {
    try {
      await axios.post("/api/staff/update", updatedStaff);
      fetchData();
      setUpdateDialogOpen(false);
      showAlert(
        "success",
        "Update Success",
        "Staff information has been updated successfully."
      );
    } catch (error) {
      showAlert(
        "error",
        "Update Error",
        "An error occurred while updating the staff. Please try again."
      );
    }
  };
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string | undefined>();

  const handleDelete = async (id: string | undefined) => {
    try {
      await axios.post(`/api/staff/delete/${id}`);
      setStaff(staff.filter((item) => item.id !== id));
      setFilteredStaff(filteredStaff.filter((item) => item.id !== id));
      showAlert(
        "success",
        "Delete Success",
        "Staff member has been deleted successfully."
      );
    } catch (error) {
      showAlert(
        "error",
        "Delete Error",
        "An error occurred while deleting the staff. Please try again."
      );
    }
  };

  const handleAddStaff = async (newStaff: Staff) => {
    try {
      const response = await axios.post("/api/staff/create", newStaff);
      setStaff([...staff, response.data]);
      setFilteredStaff([...filteredStaff, response.data]);
      showAlert(
        "success",
        "Add Success",
        "New staff member has been added successfully."
      );
    } catch (error) {
      showAlert(
        "error",
        "Add Error",
        "An error occurred while adding the staff. Please try again."
      );
    }
  };

  const openUpdateForm = (staff: Staff) => {
    setSelectedStaff(staff);
    setUpdateDialogOpen(true);
  };

  // Function to show alert and automatically hide after 2 seconds
  const showAlert = (type: string, title: string, message: string) => {
    setAlert({ type, title, message });
    setTimeout(() => {
      setAlert(null);
    }, 2000);
  };

  return (
    <div>
      {alert && (
        <CustomAlert
          type={alert.type as "success" | "info" | "warning" | "error"}
          title={alert.title}
          message={alert.message}
        />
      )}
      <div className="dashboard">
        <Sidebar />
        <div className="homeContainer">
          <Navbar />
          <div className="widgets"></div>
          <div className="listContainer">
            <Button variant="contained" onClick={() => setDialogOpen(true)}>
              Add new staff
            </Button>
            <RegisterForm
              open={dialogOpen}
              onClose={handleClose}
              onSubmit={handleAddStaff}
            />
            <TextField
              label="Search by name"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearch}
              fullWidth
              margin="normal"
            />
            <Dialog open={openDeleteDialog}>
              <DialogTitle>Xoa nhan vien</DialogTitle>
              <DialogContent>
                Ban co chac chan muon xoa nhan vien nay khong?
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => {
                    handleDelete(deleteId);
                    setOpenDeleteDialog(false);
                  }}
                >
                  Xoa
                </Button>
                <Button onClick={() => setOpenDeleteDialog(false)}>Huy</Button>
              </DialogActions>
            </Dialog>
            <TableContainer component={Paper} className="table">
              <Table sx={{ minWidth: 650 }} aria-label="staff table">
                <TableHead>
                  <TableRow>
                    <TableCell>Staff ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Building</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredStaff.map((item) => {
                    if (item.admin === true) {
                      return null;
                    } else {
                      return (
                        <TableRow key={item.id}>
                          <TableCell>{item.id}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.email}</TableCell>
                          <TableCell>{item.phone}</TableCell>
                          <TableCell>{item.buildingId?.buildingName}</TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => openUpdateForm(item)}
                            >
                              Update
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              onClick={() => {
                                setOpenDeleteDialog(true);
                                setDeleteId(item.id);
                              }}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    }
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <UpdateStaffForm
            open={updateDialogOpen}
            onClose={() => setUpdateDialogOpen(false)}
            onSubmit={handleUpdate}
            staffData={selectedStaff!}
          />
        </div>
      </div>
    </div>
  );
};

export default Staff;
