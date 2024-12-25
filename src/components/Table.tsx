import { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import "../styles/Table.scss"
import axios from 'axios';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import DoneIcon from '@mui/icons-material/Done';
import ReportIcon from '@mui/icons-material/Help';
import Brightness1Icon from '@mui/icons-material/Brightness1';
import BrokenImageIcon from '@mui/icons-material/BrokenImage';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { Ticket, Items } from '../data/mockData';

const statusInfoHelper = (status: any) => {
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

  const { icon, bgColor } = getStatusInfo(status);

  return (
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
      {status}
    </div>

  );
}

const TicketsTable = () => {
  // format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };
  // format items for display
  const formatItems = (items: Items[]) => {
    return items.map(item =>
      `${item.equipmentName}(${item.quantity})`
    ).join(', ');
  };
  const [ticket, setTicket] = useState<Ticket[]>([]);
  const fetchData = async () => {
    try {
      const response = await axios.get("/api/order/list", {
        params: {
          sort: "ASC",  // Optional if backend is already sorting
          sortBy: "BORROW_TIME"
        }
      });

      // Sort the response by borrowTime in descending order and take the first 5 items
      const sortedData = response.data
        .sort((a: any, b: any) => new Date(b.borrowTime).getTime() - new Date(a.borrowTime).getTime())
        .slice(0, 5); // Get the 5 most recent items

      const mapped_response = sortedData.map((item: any) => ({
        id: item.id,
        borrowerName: item.borrowerName,
        staffName: item.staffName,
        borrowTime: item.borrowTime,
        returnDeadline: item.returnDeadline,
        items: item.items.map((equipment: any) => ({
          equipmentName: equipment.equipmentName,
          quantity: equipment.quantity,
        })),
        returnTime: item.returnTime,
        status: item.status,
      }));

      // Set the state with the 5 most recent tickets
      setTicket(mapped_response);
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
  const rows = ticket;
  return (
    <Table sx={{ width: '100%', borderRadius: '12px', border: '1px solid #ddd', backgroundColor: '#f5f5f5' }} aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell className='tableCell' style={{ fontFamily: 'Inter, serif', fontWeight: '600', fontSize: '14px' }}>borrower name</TableCell>
          <TableCell className='tableCell' style={{ fontFamily: 'Inter, serif', fontWeight: '600', fontSize: '14px' }}>staff name</TableCell>
          <TableCell className='tableCell' style={{ fontFamily: 'Inter, serif', fontWeight: '600', fontSize: '14px' }}>borrow time</TableCell>
          <TableCell className='tableCell' style={{ fontFamily: 'Inter, serif', fontWeight: '600', fontSize: '14px' }}>deadline</TableCell>
          <TableCell className='tableCell' style={{ fontFamily: 'Inter, serif', fontWeight: '600', fontSize: '14px' }}>devices</TableCell>
          <TableCell className='tableCell' style={{ fontFamily: 'Inter, serif', fontWeight: '600', fontSize: '14px' }}>status</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {[...rows].map((tickets) => (
          <TableRow key={tickets.id}>
            <TableCell className='tableCell' style={{ fontFamily: 'Inter, serif', fontWeight: '450', fontSize: '12px' }}>{tickets.borrowerName}</TableCell>
            <TableCell className='tableCell' style={{ fontFamily: 'Inter, serif', fontWeight: '450', fontSize: '12px' }}>{tickets.staffName}</TableCell>
            <TableCell className='tableCell' style={{ fontFamily: 'Inter, serif', fontWeight: '450', fontSize: '12px' }}>{formatTime(tickets.borrowTime)}</TableCell>
            <TableCell className='tableCell' style={{ fontFamily: 'Inter, serif', fontWeight: '450', fontSize: '12px' }}>{formatTime(tickets.returnDeadline)}</TableCell>
            <TableCell className='tableCell' style={{ fontFamily: 'Inter, serif', fontWeight: '450', fontSize: '12px' }}>{formatItems(tickets.items)}</TableCell>
            <TableCell className='tableCell'>
              <span className={`ticketstatus ${tickets.status}`} style={{ fontFamily: 'Inter, serif', fontWeight: '450', fontSize: '12px' }}>{statusInfoHelper(tickets.status)}</span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TicketsTable;
