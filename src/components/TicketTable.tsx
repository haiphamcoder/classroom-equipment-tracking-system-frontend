import React, { useEffect, useState } from 'react';
import "../styles/TicketsTable.scss";
import { Ticket, Items, UpdateTicket } from '../data/mockData';
import Box from '@mui/joy/Box';
import Table from '@mui/joy/Table';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import Checkbox from '@mui/joy/Checkbox';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import IconButton from '@mui/joy/IconButton';
import { MoreVertRounded } from '@mui/icons-material';
import Link from '@mui/joy/Link';
import Tooltip from '@mui/joy/Tooltip';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import DoneIcon from '@mui/icons-material/Done';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import CancelIcon from '@mui/icons-material/Cancel';
import { visuallyHidden } from '@mui/utils';
import EditIcon from '@mui/icons-material/Edit';
import Input from '@mui/joy/Input';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import UpdateTicketForm from './UpdateTicketMenu';


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
  a: { [key in Key]: number | string | Array<any> },
  b: { [key in Key]: number | string | Array<any> },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Ticket;
  label: string;
  numeric: boolean;
}
interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Ticket) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}
const headCells: readonly HeadCell[] = [
  {
    id: 'id',
    numeric: true,
    disablePadding: true,
    label: 'Id',
  },
  {
    id: 'borrowerName',
    numeric: true,
    disablePadding: false,
    label: 'Ten nguoi muon',
  },
  {
    id: 'staffName',
    numeric: true,
    disablePadding: false,
    label: 'ten nhan vien',
  },
  {
    id: 'borrowTime',
    numeric: true,
    disablePadding: false,
    label: 'thoi gian muon',
  },

  {
    id: 'returnDeadline',
    numeric: true,
    disablePadding: false,
    label: 'thoi gian tra',
  },
  {
    id: 'status',
    numeric: true,
    disablePadding: false,
    label: 'trang thai',
  },
  {
    id: 'items',
    numeric: true,
    disablePadding: false,
    label: 'Thiet bi',
  },
  {
    id: 'action',
    numeric: true,
    disablePadding: false,
    label: 'actions',
  },


];
function EnhancedTableHead(props: EnhancedTableProps) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler =
    (property: keyof Ticket) => (event: React.MouseEvent<unknown>) => {
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
                'aria-label': 'select all tickets',
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
export default function TableSortAndSelection() {
  const [ticket, setTicket] = useState<Ticket[]>([]);
  const [filteredTicket, setFilterTicket] = useState<Ticket[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<UpdateTicket | null>(null);
  const [_dialogOpen, setDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const fetchData = async () => {
    try {
      const response = await axios.get("/api/order/list", {
        params: {
          sort: "ASC",
          sortBy: "BORROW_TIME"
        }
      });
      const mapped_response = response.data.map((item: any) => ({
        id: item.id,
        borrowerName: item.borrowerName,
        staffName: item.staffName,
        borrowTime: item.borrowTime,
        returnDeadline: item.returnDeadline,
        items: item.items.map((equipment: any) => ({
          equipmentName: equipment.equipmentName,
          quantity: equipment.quantity
        })),
        returnTime: item.returnTime,
        status: item.status,
        actions: (<IconButton onClick={() => handleActionClick(item.id)}>
          <MoreVertRounded />
        </IconButton>)
      }));
      setTicket(mapped_response);
      setFilterTicket(mapped_response);
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
  const rows = filteredTicket;

  const handleDelete = async (ids: number[]) => {
    console.log("Deleting item with ID:", ids); // Check if this is logged when clicking Delete button
    if (!window.confirm("Are you sure you want to delete this device?")) {
      return;
    }

    try {
      // Send a POST request to delete the item
      await axios.post("/api/order/cancel/", { ids });
      setTicket(ticket.filter((item) => !ids.at(item.id))); // Remove item from the state
      setFilterTicket(filteredTicket.filter((item) => !ids.at(item.id)));
      console.log(`Device with ID ${ids.join(", ")} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting device:", error);
      alert("An error occurred while deleting the device. Please try again.");
    }
  };

  // Search handler
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    const filtered = ticket.filter((item) =>
      item.borrowerName.toLowerCase().includes(term.toLowerCase()) ||
      item.staffName.toLowerCase().includes(term.toLowerCase()) ||
      item.status.toLowerCase().includes(term.toLowerCase()) ||
      item.borrowTime.toLowerCase().includes(term.toLowerCase()) ||
      item.returnDeadline.toLowerCase().includes(term.toLowerCase())
    );
    setFilterTicket(filtered);
  };

  const handleUpdate = async (updatedTicket: any) => {
    try {
      // Construct the payload to include the orderId (ticket id) and new deadline
      const payload = {
        orderId: updatedTicket.id, // Include the orderId
        newDeadline: updatedTicket.newDeadline, // Ensure this is coming from the update form
      };

      // Send the payload to the API
      const response = await axios.post("/api/order/extend-deadline", payload);

      if (response.status === 200) {
        alert("Device updated successfully.");
        fetchData(); // Refetch the tickets list after update
      } else {
        alert("Failed to update the device.");
      }

      // Update the ticket in the state
      setTicket(
        ticket.map((item) =>
          item.id === updatedTicket.id ? response.data : item
        )
      );
      setUpdateDialogOpen(false);
    } catch (error) {
      console.error("Error updating device:", error);
    }
  };  // Open update form
  const openUpdateForm = (ticket: any) => {
    setSelectedTicket(ticket);
    setUpdateDialogOpen(true);
  };

  // format items for display
  const formatItems = (items: Items[]) => {
    return items.map(item =>
      `${item.equipmentName}(${item.quantity})`
    ).join(', ');
  };
  // format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Ticket>('id');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const getStatusInfo = (status: any) => {
    switch (status) {
      case 'RETURNED':
        return { icon: <DoneIcon sx={{ fontSize: 10, display: 'inline' }} />, bgColor: '#d4f8c4' };
      case 'BORROWED':
        return { icon: <HourglassEmptyIcon sx={{ fontSize: 10, display: 'inline' }} />, bgColor: '#f8e084' };
      case 'OVERDUE':
        return { icon: <WatchLaterIcon sx={{ fontSize: 10 }} />, bgColor: '#F8AE3F' };
      case 'CANCEL':
        return { icon: <CancelIcon sx={{ fontSize: 10 }} />, bgColor: '#F5B5B5' };
      default:
        return { icon: null, bgColor: '#f9f9f9' }; // Default
    }
  };
  const handleRequestSort = (
    _event: React.MouseEvent<unknown>,
    property: keyof Ticket,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  const handleActionClick = (_id: number) => {
    console.log("clicked")
  }
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

  return (
    <main className='ticket_main'>
      <header className='TicketHeader'
        style={{ width: 500, marginTop: '30px', marginLeft: '50px', fontFamily: 'Inter, serif', fontWeight: '600', fontSize: '40px', backgroundColor: 'transparent' }}
      >Tickets</header>
      <Input
        startDecorator={<SearchIcon />}
        placeholder='Search'
        variant='outlined'
        value={searchTerm}
        onChange={handleSearch}
        style={{ width: 800, top: 20, marginLeft: '50px', borderRadius: '10px', fontFamily: 'Inter, serif', fontWeight: '450', fontSize: '14px', border: '1px solid #ccc', backgroundColor: 'transparent' }}
      />
      <Sheet variant="outlined"
        sx={{ width: { xs: '90%', md: '1500px' }, borderRadius: '10px', top: { xs: '10%', md: '50px' }, left: '50px', backgroundColor: 'whitesmoke' }
        }
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
              width: '30px',
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
                    <th id={labelId} scope="row" style={{ fontFamily: 'Inter, serif', fontWeight: '450', fontSize: '12px' }}>
                      {row.id}
                    </th>
                    <td style={{ fontFamily: 'Inter, serif', fontWeight: '450', fontSize: '12px' }}>{row.borrowerName}</td>
                    <td style={{ fontFamily: 'Inter, serif', fontWeight: '450', fontSize: '12px' }}>{row.staffName}</td>
                    <td style={{ fontFamily: 'Inter, serif', fontWeight: '450', fontSize: '12px' }}>{formatTime(row.borrowTime)}</td>
                    <td style={{ fontFamily: 'Inter, serif', fontWeight: '450', fontSize: '12px' }}>{formatTime(row.returnDeadline)}</td>
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
                    <td style={{ fontFamily: 'Inter, serif', fontWeight: '450', fontSize: '12px' }}>{formatItems(row.items)}</td>
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
                      <UpdateTicketForm
                        open={updateDialogOpen}
                        onClose={() => setUpdateDialogOpen(false)}
                        onSubmit={handleUpdate}
                        ticketData={selectedTicket} />
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
                      </IconButton></td>
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
                <td colSpan={8} aria-hidden />
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={9}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    justifyContent: 'flex-end',
                  }}
                >
                  <FormControl orientation="horizontal" size="sm">
                    <FormLabel>Rows per page:</FormLabel>
                    <Select onChange={handleChangeRowsPerPage} value={rowsPerPage}>
                      <Option value={5}>5</Option>
                      <Option value={10}>10</Option>
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
