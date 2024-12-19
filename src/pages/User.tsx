import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import RegisterForm from "../components/RegisterForm";
import UpdateStaffForm from "../components/UpdateStaffForm";

const User = () => {
  const [staff, setStaff] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);

  // Fetch staff data on component load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/staff/list");
        setStaff(response.data);
      } catch (error) {
        console.error("Error fetching staff data:", error);
      }
    };

    fetchData();
  }, []);

  // Handle updating staff
  const handleUpdate = async (updatedStaff) => {
    try {
      const response = await axios.post("/api/staff/update", updatedStaff);
      setStaff(
        staff.map((item) => (item.id === updatedStaff.id ? response.data : item))
      );
      setUpdateDialogOpen(false);
    } catch (error) {
      console.error("Error updating staff:", error);
    }
  };

  // Handle deleting staff
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this staff member?")) {
      return;
    }
    try {
      await axios.delete(`/api/staff/delete/${id}`);
      // Remove the deleted staff from the state
      setStaff(staff.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting staff:", error);
    }
  };

  // Handle adding new staff
  const handleAddStaff = async (newStaff) => {
    try {
      const response = await axios.post("/api/staff/create", newStaff);
      setStaff([...staff, response.data]);
    } catch (error) {
      console.error("Error creating new staff:", error);
    }
  };

  // Open update form
  const openUpdateForm = (staff) => {
    setSelectedStaff(staff);
    setUpdateDialogOpen(true);
  };

  return (
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
            onClose={() => setDialogOpen(false)}
            onSubmit={handleAddStaff}
          />
          <div className="listTitle"></div>
          <TableContainer component={Paper} className="table">
            <Table sx={{ minWidth: 650 }} aria-label="staff table">
              <TableHead>
                <TableRow>
                  <TableCell>Staff ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {staff.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.email}</TableCell>
                    <TableCell>{item.phone}</TableCell>
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
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <UpdateStaffForm
          open={updateDialogOpen}
          onClose={() => setUpdateDialogOpen(false)}
          onSubmit={handleUpdate}
          staffData={selectedStaff}
        />
      </div>
    </div>
  );
};

export default User;
