import "../styles/Sidebar.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineOutlined from "@mui/icons-material/PersonOutlineOutlined";
import DeviceHub from "@mui/icons-material/DeviceHub";
import { Link, NavLink } from "react-router-dom";
import LogoutOutlined from "@mui/icons-material/LogoutOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { Avatar } from "@mui/material";
import { useAuth } from "../context/useAuth";

const Sidebar = () => {
  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
    console.log("User logged out");
  };

  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null;

  return (
    <div className="sidebar">
      <div className="top">
        <span className="logo">HUST TICKETS</span>
      </div>
      <hr />
      <div className="center">
        <ul>
          <Link to="/dashboard" style={{ textDecoration: "none" }}>
            <li>
              <DashboardIcon className="icon" />
              <span>Dashboard</span>
            </li>
          </Link>
          <NavLink to="/devices" style={{ textDecoration: "none" }}>
            <li>
              <DeviceHub className="icon" />
              <span>Device</span>
            </li>
          </NavLink>
          <Link to="/tickets" style={{ textDecoration: "none" }}>
            <li>
              <AssignmentIcon className="icon" />
              <span>Ticket</span>
            </li>
          </Link>
          {user && user.admin && (
            <Link to="/staff" style={{ textDecoration: "none" }}>
              <li>
                <GroupOutlinedIcon className="icon" />
                <span>Staff</span>
              </li>
            </Link>
          )}
          <Link to="/profile" style={{ textDecoration: "none" }}>
            <li>
              <PersonOutlineOutlined className="icon" />
              <span>Profile</span>
            </li>
          </Link>
          <li onClick={handleLogout} style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
            <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
              {user ? user.name.charAt(0).toUpperCase() : ""}
            </Avatar>
            <LogoutOutlined className="icon" />
            <span>Logout</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;