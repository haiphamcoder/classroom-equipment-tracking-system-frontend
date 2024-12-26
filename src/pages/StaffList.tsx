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
  Tooltip,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import Sidebar from "../components/Sidebar";
import RegisterForm from "../components/RegisterForm";
import UpdateStaffForm from "../components/UpdateStaffForm";
import CustomAlert from "../components/CustomAlert";
import EditIcon from "@mui/icons-material/Edit";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { downloadExcelFile } from "../components/StaffExport";
import axios from "axios";

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
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<keyof Staff>("id");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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

  const handleRequestSort = (
    _event: React.MouseEvent<unknown>,
    property: keyof Staff
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    _event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setRowsPerPage(parseInt(_event.target.value as string, 10));
    setPage(0);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredStaff.length) : 0;

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
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Button variant="contained" onClick={() => setDialogOpen(true)}>
                Add New Staff
              </Button>
              <Button
                variant="contained"
                onClick={() => downloadExcelFile(showAlert)}
              >
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
            <Box sx={{ width: "100%", overflow: "auto", backgroundColor: "#f5f5f5", borderRadius: "10px", padding: "20px" }}>
              <Table>
                <TableHead>
                  <TableRow style={{ backgroundColor: "#e0e7ff" }}>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Building</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredStaff
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((item) => (
                      <TableRow
                        hover
                        key={item.id}
                      >
                        <TableCell>{item.id}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.email}</TableCell>
                        <TableCell>{item.phone}</TableCell>
                        <TableCell>{item.buildingId?.buildingName}</TableCell>
                        <TableCell>
                          <Tooltip title="Edit">
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                openUpdateForm(item);
                              }}
                              size="small"
                              style={{
                                borderRadius: "16px",
                                marginRight: "10px",
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenDeleteDialog(true);
                                setDeleteId(item.id);
                              }}
                              size="small"
                              style={{ borderRadius: "16px" }}
                            >
                              <RemoveCircleIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Select
                value={rowsPerPage}
                onChange={handleChangeRowsPerPage}
                displayEmpty
                inputProps={{ "aria-label": "Rows per page" }}
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
              </Select>
              <Typography sx={{ mx: 2 }}>
                {page * rowsPerPage + 1}-
                {Math.min((page + 1) * rowsPerPage, filteredStaff.length)} of{" "}
                {filteredStaff.length}
              </Typography>
              <IconButton
                onClick={() => handleChangePage(page - 1)}
                disabled={page === 0}
              >
                <KeyboardArrowLeftIcon />
              </IconButton>
              <IconButton
                onClick={() => handleChangePage(page + 1)}
                disabled={page >= Math.ceil(filteredStaff.length / rowsPerPage) - 1}
              >
                <KeyboardArrowRightIcon />
              </IconButton>
            </Box>
            <Dialog open={openDeleteDialog}>
              <DialogTitle>Xoá nhân viên</DialogTitle>
              <DialogContent>
                Bạn có chắc chắn muốn xoá nhân viên này không?
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => {
                    handleDelete(deleteId);
                    setOpenDeleteDialog(false);
                  }}
                >
                  Xoá 
                </Button>
                <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
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