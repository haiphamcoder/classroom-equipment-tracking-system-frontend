import Sidebar from "../components/Sidebar";
import Widget from "../components/Widget";
import Table from "../components/Table";
import "../styles/Dashboard.scss";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const Dashboard = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user); 
      if (parsedUser.firstLogin) {
        
        navigate("/firstLogin"); 
      }
    }
  }, [navigate]);
  return (
    <div className="dashboard">
      <Sidebar />
      <div className="homeContainer">
        <div className="widgets">
          <Widget type="tickets" />
          <Widget type="devices" />
        </div>
        <div className="listContainer">
          <div className="listTitle">Ticket table</div>
          <Table />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
