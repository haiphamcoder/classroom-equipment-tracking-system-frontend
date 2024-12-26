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
  IconButton,
  Box,
} from "@mui/material";
import Sidebar from "../components/Sidebar";
import RegisterForm from "../components/RegisterForm";
import UpdateStaffForm from "../components/UpdateStaffForm";
import CustomAlert from "../components/CustomAlert";
import Input from '@mui/joy/Input';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

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
        "Không thể lấy dữ liệu nhân viên. Vui lòng thử lại."
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
        "Cập nhật thông tin nhân viên thành công."
      );
    } catch (error) {
      showAlert(
        "error",
        "Update Error",
        "Cập nhật thông tin nhân viên thất bại. Vui lòng thử lại."
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
        "Xoá nhân viên thành công."
      );
    } catch (error) {
      showAlert(
        "error",
        "Delete Error",
        "Có lỗi xảy ra khi xóa nhân viên. Vui lòng thử lại."
      );
    }
  };

  const handleAddStaff = async (newStaff: Staff) => {
    try {
      const response = await axios.post("/api/staff/create", newStaff);
      setStaff([...staff, response.data]);
      setFilteredStaff([...filteredStaff, response.data]);
      setDialogOpen(false);
      showAlert(
        "success",
        "Add Success",
        "Nhân viên mới đã được thêm thành công."
      );
    } catch (error) {
      showAlert(
        "error",
        "Add Error",
        "Có lỗi xảy ra khi thêm nhân viên. Vui lòng thử lại."
      );
    }
  };

  const openUpdateForm = (staff: Staff) => {
    setSelectedStaff(staff);
    setUpdateDialogOpen(true);
  };

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
          title={alert.type === "success" ? "Thành công" : "Lỗi"}
          message={alert.message}
        />
      )}
      <div className="dashboard">
        <Sidebar />
        <div className="homeContainer">
          <header className='StaffHeader'
            style={{ 
              width: 500, 
              marginTop: '30px', 
              marginLeft: '50px', 
              fontFamily: 'Inter, serif', 
              fontWeight: '600', 
              fontSize: '40px', 
              backgroundColor: 'transparent' 
            }}
          >
            Staff
          </header>

          <div className="listContainer">
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              margin: '10px 0 30px 0'
            }}>
              <Input
                className="search-input"
                startDecorator={<SearchIcon />}
                placeholder='Search'
                variant='outlined'
                value={searchTerm}
                onChange={handleSearch}
                style={{ 
                  width: 800, 
                  borderRadius: '10px', 
                  fontFamily: 'Inter, serif', 
                  fontWeight: '450', 
                  fontSize: '14px', 
                  backgroundColor: 'transparent' 
                }}
              />
              <Box sx={{ display: 'flex', gap: 1, marginLeft: 2 }}>
                <Button 
                  onClick={() => setDialogOpen(true)}
                  sx={{
                    borderRadius: '10px',
                    fontFamily: 'Inter, serif',
                    fontWeight: '450',
                    fontSize: '14px',
                    backgroundColor: '#0B7EEE',
                    color: 'white',
                    textTransform: 'none',
                    px: 2,
                    '&:hover': {
                      backgroundColor: '#0966c2'
                    }
                  }}
                >
                  New Staff
                </Button>
              </Box>
            </Box>

            <TableContainer component={Paper} className="table">
              <Table sx={{ 
                minWidth: 650,
                '& thead th:first-of-type, & tbody td:first-of-type': {
                  width: '50px',  
                  padding: '8px', 
                }
              }} aria-label="staff table">
                <TableHead>
                  <TableRow>
                    <TableCell>No.</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Building</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredStaff.map((item, index) => {
                    if (item.admin === true) {
                      return null;
                    } else {
                      return (
                        <TableRow key={item.id}>
                          <TableCell>{index}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.email}</TableCell>
                          <TableCell>{item.phone}</TableCell>
                          <TableCell>{item.buildingId?.buildingName}</TableCell>
                          <TableCell>
                            <IconButton
                              variant="soft"
                              onClick={() => openUpdateForm(item)}
                              size='sm'
                              style={{ borderRadius: '16px' }}
                            >
                              <EditIcon style={{ fontFamily: 'Inter, serif', fontWeight: '450', fontSize: '20px' }} />
                            </IconButton>
                            <IconButton
                              variant="soft"
                              onClick={() => {
                                setOpenDeleteDialog(true);
                                setDeleteId(item.id);
                              }}
                              size='sm'
                              style={{ borderRadius: '16px' }}
                            >
                              <RemoveCircleIcon style={{ fontFamily: 'Inter, serif', fontWeight: '450', fontSize: '20px' }} />
                            </IconButton>
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
          <RegisterForm
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            onSubmit={handleAddStaff}
          />
        </div>
      </div>
    </div>
  );
};

export default Staff;
