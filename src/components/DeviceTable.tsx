import React, { useState, useEffect } from 'react';
import "../styles/DevicesTable.scss";
import { Device, UpdateDevice } from '../data/mockData';
import Box from '@mui/joy/Box';
import Table from '@mui/joy/Table';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import Checkbox from '@mui/joy/Checkbox';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import IconButton from '@mui/joy/IconButton';
import Link from '@mui/joy/Link';
import EditIcon from '@mui/icons-material/Edit';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import Tooltip from '@mui/joy/Tooltip';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import DoneIcon from '@mui/icons-material/Done';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import Brightness1Icon from '@mui/icons-material/Brightness1';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import BrokenImageIcon from '@mui/icons-material/BrokenImage';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import Button from '@mui/joy/Button';
import ReportIcon from '@mui/icons-material/Help';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Input from '@mui/joy/Input';
import SearchIcon from '@mui/icons-material/Search';
import { visuallyHidden } from '@mui/utils';
import axios from 'axios';
import UpdateDevicesMenu from './UpdateDeviceMenu';
import { downloadExcelFile } from './DeviceExport';
import NewDevicesMenu from "./NewDevicesMenu";

function labelDisplayedRows({
  from,
  to,
  count,
}: {
  from: number;
  to: number;
  count: number;
}) {
  return `${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}
type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}
interface HeadCell {
  disablePadding: boolean;
  id: keyof Device;
  label: string;
  numeric: boolean;
}
interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Device) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}
interface HeadCell {
  disablePadding: boolean;
  id: keyof Device;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'id',
    numeric: true,
    disablePadding: true,
    label: 'No.',
  },
  {
    id: 'name',
    numeric: true,
    disablePadding: false,
    label: 'Name',
  },
  {
    id: 'roomName',
    numeric: true,
    disablePadding: false,
    label: 'Room Name',
  },
  {
    id: 'buildingName',
    numeric: true,
    disablePadding: false,
    label: 'Building Name',
  },
  {
    id: 'status',
    numeric: true,
    disablePadding: false,
    label: 'Status',
  },
  {
    id: 'quantity',
    numeric: true,
    disablePadding: false,
    label: 'Quantity',
  },
  {
    id: 'action',
    numeric: true,
    disablePadding: false,
    label: 'Action',
  },
];

function EnhancedTableHead(props: EnhancedTableProps) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler =
    (property: keyof Device) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <thead >
      <tr>
        <th>
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            slotProps={{
              input: {
                'aria-label': 'select all devices',
              },
            }}
            sx={{ verticalAlign: 'sub' }}
          />
        </th>
        {headCells.map((headCell) => {
          const active = orderBy === headCell.id;
          return (
            <th
              key={headCell.id}
              align={headCell.id ? 'right' : 'left'}
              aria-sort={
                active
                  ? ({ asc: 'ascending', desc: 'descending' } as const)[order]
                  : undefined
              }
            >
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <Link
                underline="none"
                color="neutral"
                textColor={active ? 'primary.plainColor' : undefined}
                component="button"
                onClick={createSortHandler(headCell.id)}
                endDecorator={
                  <ArrowDownwardIcon
                    sx={[active ? { opacity: 1 } : { opacity: 0 }]}
                  />
                }
                sx={{
                  fontWeight: 'lg',
                  '& svg': {
                    transition: '0.1s',
                    transform:
                      active && order === 'desc' ? 'rotate(0deg)' : 'rotate(180deg)',
                  },

                  '&:hover': { '& svg': { opacity: 1 } },
                  '&:focus': { outline: 'none', boxShadow: 'none' },
                }}
              >
                {headCell.label}
                {active ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </Link>
            </th>
          );
        })}
      </tr>
    </thead>
  );
}
interface EnhancedTableToolbarProps {
  numSelected: number;
}
function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected } = props;
  return (
    <Box
      sx={[
        {
          display: 'flex',
          alignItems: 'center',
          py: 1,
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          borderTopLeftRadius: 'var(--unstable_actionRadius)',
          borderTopRightRadius: 'var(--unstable_actionRadius)',
          borderBottom: '1px solid #ddd',
          backgroundColor: '#dde7ee',
        },
        numSelected > 0 && {
          display: 'flex',
          alignItems: 'center',
          py: 1,
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          borderTopLeftRadius: 'var(--unstable_actionRadius)',
          borderTopRightRadius: 'var(--unstable_actionRadius)',
          borderBottom: '1px solid #ddd',
          backgroundColor: '#dde7ee',
        },
      ]}
    >
      {numSelected > 0 ? (
        <Typography sx={{ flex: '1 1 100%' }} component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          level="body-lg"
          sx={{ flex: '1 1 100%' }}
          id="tableTitle"
          component="div"
          fontFamily={"Inter"}
          fontWeight={600}
          fontSize='1rem'
          lineHeight='1.5'
        >
          0 selected
        </Typography>
      )}
      {numSelected > 0 ? (
        <Tooltip title="Xoa">
          <IconButton size="sm" color="danger" variant="solid">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <IconButton size="sm">
        </IconButton>
      )}
    </Box>
  );
}


export var list_response: any = [];
export var total_rows = 0;
export default function TableSortAndSelection() {
  const [device, setDevices] = useState<Device[]>([]);
  const [_deviceToEdit, _setDeviceToEdit] = useState<UpdateDevice | null>(null);
  const [filteredDevice, setFilterDevice] = useState<Device[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDevice, setSelectedDevice] = useState<UpdateDevice | null>(null);
  const [_dialogOpen, setDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Device>('id');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [showNewDevicePopup, setShowNewDevicePopup] = useState(false);

  const getStatusInfo = (status: any) => {
    switch (status) {
      case 'AVAILABLE':
        return { icon: <DoneIcon sx={{ fontSize: 10, display: 'inline' }} />, bgColor: '#d4f8c4' };
      case 'UNAVAILABLE':
        return { icon: <DoNotDisturbIcon sx={{ fontSize: 10, display: 'inline' }} />, bgColor: '#F87071' };
      case 'BORROWED':
        return { icon: <HourglassEmptyIcon sx={{ fontSize: 10, display: 'inline' }} />, bgColor: '#f8e084' };
      case 'DAMAGED':
        return { icon: <BrokenImageIcon sx={{ fontSize: 10 }} />, bgColor: '#e5a6a6' };
      case 'NORMAL':
        return { icon: <Brightness1Icon sx={{ fontSize: 10 }} />, bgColor: '#f0f0f0' };
      case 'LOST':
        return { icon: <ReportIcon sx={{ fontSize: 10 }} />, bgColor: '#e1c2f9' };
      default:
        return { icon: null, bgColor: '#f9f9f9' }; // Default
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/equipment/list");
      const mapped_response = response.data.map((item: any) => ({
        id: item.id,
        name: item.name,
        roomName: item.room?.roomName ?? "Unknown",
        buildingName: item.room?.building?.buildingName ?? "Unknown",
        quantity: item.quantity,
        status: item.status,
      }));
      setDevices(mapped_response);
      setFilterDevice(mapped_response);
      total_rows = mapped_response.length;
      list_response = mapped_response;

    } catch (error) {
      console.error("Error fetching ticket data:", error);
    }
  };

  useEffect(() => {

    fetchData();
    // Set up periodic refresh
    const intervalId = setInterval(fetchData, 5000); // Refresh every 30 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);

  }, []);

  const handleDelete = async (ids: any) => {
    if (ids.length === 0) {
      console.error("No IDs to delete.");
      return;
    }

    try {
      const response = await axios.post("api/equipment/delete", ids, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Delete successful:", response.data);
    } catch (error) {
      console.error("Error deleting items:", error);
    }
  };


  const rows = filteredDevice;

  // Search handler
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    const filtered = device.filter((item) =>
      item.name.toLowerCase().includes(term.toLowerCase()) ||
      item.roomName.toLowerCase().includes(term.toLowerCase()) ||
      item.buildingName.toLowerCase().includes(term.toLowerCase()) ||
      item.status.toLowerCase().includes(term.toLowerCase()) ||
      item.quantity.toString().toLowerCase().includes(term.toLowerCase())
    );
    setFilterDevice(filtered);
  };

  const handleUpdate = async (updatedDevice: any) => {
    try {
      const response = await axios.post("/api/equipment/update", updatedDevice);
      if (response.status === 200) {
        alert("Device updated successfully.");
        fetchData();  // Refetch the devices list after update
      } else {
        alert("Failed to update device.");
      }
      setDevices(device.map((item) => (item.id === updatedDevice.id ? response.data : item)));
      setFilterDevice(filteredDevice.map((item) => (item.id === updatedDevice.id ? response.data : item)));
      setUpdateDialogOpen(false);
    } catch (error) {
      console.error("Error updating device:", error);
    }
  };
  // Open update form
  const openUpdateForm = (device: any) => {
    setSelectedDevice(device);
    setUpdateDialogOpen(true);
  };
  const handleRequestSort = (
    _event: React.MouseEvent<unknown>,
    property: keyof Device,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected: any = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };
  const handleClick = (_event: React.MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: readonly string[] = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };
  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (_event: any, newValue: number | null) => {
    setRowsPerPage(parseInt(newValue!.toString(), 10));
    setPage(0);
  };
  const getLabelDisplayedRowsTo = () => {
    if (rows.length === -1) {
      return (page + 1) * rowsPerPage;
    }
    return rowsPerPage === -1
      ? rows.length
      : Math.min(rows.length, (page + 1) * rowsPerPage);
  };
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleAddDevice = async (newDevice: Device) => {
    try {
      const response = await axios.post("/api/equipment/create", newDevice);
      fetchData(); // Refresh the list after adding
      setShowNewDevicePopup(false);
    } catch (error) {
      console.error("Error creating device:", error);
    }
  };

  return (
    <main className='device_main' style={{ marginLeft: '250px' }}>
      <header className='DeviceHeader'
        style={{ width: 500, marginTop: '30px', marginLeft: '50px', fontFamily: 'Inter, serif', fontWeight: '600', fontSize: '40px', backgroundColor: 'transparent' }}
      >Devices</header>
      <Box className='search-section' sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2,
        margin: '20px 50px'
      }}>
        <Input
          className="search-input"
          startDecorator={<SearchIcon />}
          placeholder='Search'
          variant='outlined'
          value={searchTerm}
          onChange={handleSearch}
          sx={{
            flex: 1,
            borderRadius: '10px',
            fontFamily: 'Inter, serif',
            fontWeight: '450',
            fontSize: '14px',
            border: '1px solid #ccc',
            backgroundColor: 'transparent',
          }}
        />
        <Button 
          onClick={() => setShowNewDevicePopup(true)}
          sx={{
            borderRadius: '10px',
            fontFamily: 'Inter, serif',
            fontWeight: '450',
            fontSize: '14px'
          }}
        >
          New Device
        </Button>
        <NewDevicesMenu
          open={showNewDevicePopup}
          onClose={() => setShowNewDevicePopup(false)}
          onSubmit={handleAddDevice}
        />
        <Button 
          startDecorator={<FileDownloadIcon style={{ fontSize: 18 }} />}
          onClick={downloadExcelFile}
          sx={{
            borderRadius: '10px',
            fontFamily: 'Inter, serif',
            fontWeight: '450',
            fontSize: '14px'
          }}
        >
          Export
        </Button>
      </Box>
      <Sheet 
        className="device-sheet"
        variant="outlined" 
        sx={{ 
          borderRadius: '10px',
          backgroundColor: 'whitesmoke'
        }}
      >
        <EnhancedTableToolbar numSelected={selected.length} />
        <Table
          aria-labelledby="tableTitle"
          hoverRow
          sx={{
            '--TableCell-headBackground': 'transparent',
            '--TableCell-selectedBackground': (theme) =>
              theme.vars.palette.success.softBg,
            '& thead th:nth-child(1)': {
              width: '20px',
            },
            '& thead th:nth-child(2)': {
              width: 'flex',
            },
            '& tr > *:nth-child(n+3)': { textAlign: 'start' },
          }}
        >
          <EnhancedTableHead
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={rows.length}
          />
          <tbody>
            {[...rows]
              .sort(getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                const continuousIndex = page * rowsPerPage + index + 1;
                const isItemSelected = selected.includes(row.id as any);
                const labelId = `enhanced-table-checkbox-${index}`;
                const { icon, bgColor } = getStatusInfo(row.status);
                return (
                  <tr
                    onClick={(event) => handleClick(event, row.id as any)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    // selected={isItemSelected}
                    style={
                      isItemSelected
                        ? ({
                          backgroundColor: '#dde7ee',
                        } as React.CSSProperties)
                        : {}
                    }
                  >
                    <th scope="row">
                      <Checkbox
                        checked={isItemSelected}
                        slotProps={{
                          input: {
                            'aria-labelledby': labelId,
                          },
                        }}
                        sx={{ verticalAlign: 'top' }}
                      />
                    </th>
                    <th scope="row" style={{ 
                      fontFamily: 'Inter, serif', 
                      fontWeight: '450', 
                      fontSize: '12px' 
                    }}>
                      {continuousIndex}
                    </th>
                    <td style={{ fontFamily: 'Inter, serif', fontWeight: '450', fontSize: '12px' }}>{row.name}</td>
                    <td style={{ fontFamily: 'Inter, serif', fontWeight: '450', fontSize: '12px' }}>{row.roomName}</td>
                    <td style={{ fontFamily: 'Inter, serif', fontWeight: '450', fontSize: '12px' }}>{row.buildingName}</td>
                    <td style={{ fontFamily: 'Inter, serif', fontWeight: '450', fontSize: '12px' }}>
                      <div style={{
                        display: 'inline',
                        alignItems: 'center',
                        padding: '5px 10px',
                        border: '1px solid #ccc',
                        borderRadius: '20px',
                        backgroundColor: bgColor,
                        borderColor: 'transparent'
                      }}>
                        {icon && <span style={{ marginRight: '5px' }}>{icon}</span>}
                        {row.status}
                      </div>
                    </td>
                    <td style={{ fontFamily: 'Inter, serif', fontWeight: '450', fontSize: '12px' }}>{row.quantity}</td>
                    <td>
                      <IconButton
                        variant="soft"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDialogOpen(true)
                          openUpdateForm(row);
                        }}
                        size='sm'
                        style={{ borderRadius: '16px' }}
                      >
                        <EditIcon style={{ fontFamily: 'Inter, serif', fontWeight: '450', fontSize: '20px', alignItems: 'start' }}
                        />
                      </IconButton>
                      <UpdateDevicesMenu
                        open={updateDialogOpen}
                        onClose={() => setUpdateDialogOpen(false)}
                        onSubmit={handleUpdate}
                        deviceData={selectedDevice} />
                      <IconButton
                        variant="soft"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete([row.id]);
                        }}
                        size='sm'
                        style={{ borderRadius: '16px' }}
                      >
                        <RemoveCircleIcon style={{ fontFamily: 'Inter, serif', fontWeight: '450', fontSize: '20px', alignItems: 'start' }}
                        />
                      </IconButton>
                    </td>
                  </tr>
                );
              })}
            {emptyRows > 0 && (
              <tr
                style={
                  {
                    height: `calc(${emptyRows} * 40px)`,
                    '--TableRow-hoverBackground': 'transparent',
                  } as React.CSSProperties
                }
              >
                <td colSpan={7} aria-hidden />
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={8}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                    justifyContent: 'flex-end',
                  }}
                >
                  <FormControl orientation="horizontal" size="sm">
                    <FormLabel>Rows per page:</FormLabel>
                    <Select 
                      onChange={handleChangeRowsPerPage} 
                      value={rowsPerPage}
                    >
                      <Option value={10}>10</Option>
                      <Option value={15}>15</Option>
                      <Option value={25}>25</Option>
                    </Select>
                  </FormControl>
                  <Typography sx={{ textAlign: 'center', minWidth: 80 }}>
                    {labelDisplayedRows({
                      from: rows.length === 0 ? 0 : page * rowsPerPage + 1,
                      to: getLabelDisplayedRowsTo(),
                      count: rows.length === -1 ? -1 : rows.length,
                    })}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      size="sm"
                      color="neutral"
                      variant="outlined"
                      disabled={page === 0}
                      onClick={() => handleChangePage(page - 1)}
                      sx={{ bgcolor: 'background.surface' }}
                    >
                      <KeyboardArrowLeftIcon />
                    </IconButton>
                    <IconButton
                      size="sm"
                      color="neutral"
                      variant="outlined"
                      disabled={
                        rows.length !== -1
                          ? page >= Math.ceil(rows.length / rowsPerPage) - 1
                          : false
                      }
                      onClick={() => handleChangePage(page + 1)}
                      sx={{ bgcolor: 'background.surface' }}
                    >
                      <KeyboardArrowRightIcon />
                    </IconButton>
                  </Box>
                </Box>
              </td>
            </tr>
          </tfoot>
        </Table>
      </Sheet>
    </main>
  );
}
