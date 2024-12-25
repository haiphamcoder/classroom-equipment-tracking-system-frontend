import Sidebar from "../components/Sidebar";
import Widget from "../components/Widget";
import Table from "../components/Table";
import "../styles/Dashboard.scss";
import Box from "@mui/joy/Box";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const Dashboard = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user); // Parse the string to a JavaScript object
      if (parsedUser.firstLogin) {
        navigate("/firstLogin"); // Navigate to the first login page if firstLogin is false
      }
    }
  }, [navigate]);
  return (
    <main className="dashboard">
      <Sidebar />
      <Box className="homeContainer">
        <header className='DeviceHeader'
          style={{ width: 500, marginTop: '30px', marginLeft: '50px', fontFamily: 'Inter, serif', fontWeight: '600', fontSize: '40px', backgroundColor: 'transparent' }}
        >Dashboard</header>
        <Box className="widgets">
          <Widget type="tickets" />
          <Widget type="devices" />
        </Box>
        <Box className="listContainer" sx={{ backgroundColor: '#f0f4f8', }}>
          <div className="listTitle" style={{ fontFamily: 'Inter, serif', fontWeight: '600', fontSize: '20px' }}
          >Recent Tickets</div>
          <Table />
        </Box>
        <Box className="listContainer" sx={{ backgroundColor: '#f0f4f8', }}>
          <div className="listTitle" style={{ fontFamily: 'Inter, serif', fontWeight: '600', fontSize: '20px' }}
          >Recent Tickets</div>
          <Table />
        </Box>
        <Box className="listContainer" sx={{ backgroundColor: '#f0f4f8', }}>
          <div className="listTitle" style={{ fontFamily: 'Inter, serif', fontWeight: '600', fontSize: '20px' }}
          >Recent Tickets</div>
          <Table />
        </Box>

      </Box>
    </main>
  );
};

export default Dashboard;
