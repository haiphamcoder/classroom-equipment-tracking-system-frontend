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
  TextField,
} from "@mui/material";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import RegisterForm from "../components/RegisterForm";
import UpdateStaffForm from "../components/UpdateStaffForm";

export type Staff = {
  id: string | "";
  name: string;
  email: string;
  phone: string;
  buildingId: {
    buildingName: string;
  };
};

const  Staff = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [filteredStaff, setFilteredStaff] = useState<Staff[]>([]);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [selectedStaff, setSelectedStaff] = useState<Staff>();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);

  
  const fetchData = async () => {
    try {
      const response = await axios.get("/api/staff/list");
      // console.log('Staff data:', response.data);
      setStaff(response.data);
      setFilteredStaff(response.data); 
    } catch (error) {
      // console.error("Error fetching staff data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Search handler
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
      fetchData(); // Fetch updated data
      setUpdateDialogOpen(false); // Close the update dialog
    } catch (error) {
      console.error("Error updating staff:", error);
    }
  };

  // Handle deleting staff
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this staff member?")) {
      return;
    }
    try {
      await axios.post(`/api/staff/delete/${id}`);
      setStaff(staff.filter((item) => item.id !== id));
      setFilteredStaff(filteredStaff.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting staff:", error);
    }
  };

  // Handle adding new staff
  const handleAddStaff = async (newStaff: Staff) => {
    try {
      const response = await axios.post("/api/staff/create", newStaff);
      setStaff([...staff, response.data]);
      setFilteredStaff([...filteredStaff, response.data]);
    } catch (error) {
      console.error("Error creating new staff:", error);
    }
  };

  // Open update form
  const openUpdateForm = (staff: Staff) => {
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
            onClose={handleClose}
            onSubmit={handleAddStaff}
          />
          {/* Search bar */}
          <TextField
            label="Search by name"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearch}
            fullWidth
            margin="normal"
          />
          <div className="listTitle"></div>
            <TableContainer component={Paper} className="table">
            <Table sx={{ minWidth: 650 }} aria-label="staff table">
              {/* Table Head */}
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
              
              {/* Table Body */}
              <TableBody>
                {filteredStaff.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.email}</TableCell>
                    <TableCell>{item.phone}</TableCell>
                    <TableCell>
                      {item.buildingId?.buildingName}
                    </TableCell> 
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
          staffData={selectedStaff!}
        />
      </div>
    </div>
  );
};

export default Staff;