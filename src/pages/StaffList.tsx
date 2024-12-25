import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import RegisterForm from "../components/RegisterForm";
import UpdateStaffForm from "../components/UpdateStaffForm";
import CustomAlert from "../components/CustomAlert";
import Sheet from "@mui/joy/Sheet";
import EditIcon from "@mui/icons-material/Edit";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { downloadExcelFile } from "../components/StaffExport";

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
      showAlert("success", "Delete Success", "Xoá nhân viên thành công.");
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
          <Navbar />
          <div className="widgets"></div>
          <main className="listContainer">
            <header
              style={{
                fontSize: "32px",
                fontWeight: "600",
                marginBottom: "20px",
                fontFamily: "Inter, serif",
              }}
            >
              Staff List
            </header>
            <Box>
              <Button variant="contained" onClick={() => setDialogOpen(true)}>
                Add New Staff
              </Button>
              <Button variant="contained" onClick={() => downloadExcelFile(showAlert)}>
                Export
              </Button>
            </Box>
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
            <Sheet
              variant="outlined"
              sx={{
                width: "100%",
                borderRadius: "10px",
                marginTop: "20px",
                backgroundColor: "whitesmoke",
              }}
            >
              <Table aria-labelledby="tableTitle">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Building</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredStaff.map((item) => {
                    if (item.admin) return null;
                    return (
                      <TableRow key={item.id}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.email}</TableCell>
                        <TableCell>{item.phone}</TableCell>
                        <TableCell>{item.buildingId?.buildingName}</TableCell>
                        <TableCell>
                          <IconButton
                            // variant="soft"
                            onClick={() => openUpdateForm(item)}
                            size="small"
                            style={{
                              borderRadius: "16px",
                              marginRight: "10px",
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            // variant="soft"
                            onClick={() => {
                              setOpenDeleteDialog(true);
                              setDeleteId(item.id);
                            }}
                            size="small"
                            style={{ borderRadius: "16px" }}
                          >
                            <RemoveCircleIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Sheet>
            <Dialog open={openDeleteDialog}>
              <DialogTitle>Delete Staff</DialogTitle>
              <DialogContent>
                Are you sure you want to delete this staff?
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => {
                    handleDelete(deleteId);
                    setOpenDeleteDialog(false);
                  }}
                >
                  Delete
                </Button>
                <Button onClick={() => setOpenDeleteDialog(false)}>
                  Cancel
                </Button>
              </DialogActions>
            </Dialog>
            <UpdateStaffForm
              open={updateDialogOpen}
              onClose={() => setUpdateDialogOpen(false)}
              onSubmit={handleUpdate}
              staffData={selectedStaff!}
            />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Staff;
