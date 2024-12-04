import "../styles/Sidebar.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineOutlined from "@mui/icons-material/PersonOutlineOutlined";
import DeviceHub from "@mui/icons-material/DeviceHub";
import { Link } from "react-router-dom";
const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="top">
        <span className="logo">HUSTticket</span>
      </div>
      <hr />
      <div className="center">
        <ul>
          <p className="title">MAIN</p>
          <Link to="/tickets" style={{ textDecoration: "none" }}>
            <li>
              <DashboardIcon className="icon" />
              <span>Ticket</span>
            </li>
          </Link>
          <Link to="/devices" style={{ textDecoration: "none" }}>
            <li>
              <DeviceHub className="icon" />
              <span>Device</span>
            </li>
          </Link>
          <p className="title">Personal</p>
          <Link to="/user" style={{ textDecoration: "none" }}>
            <li>
              <PersonOutlineOutlined className="icon" />
              <span>User</span>
            </li>
          </Link>
        </ul>
      </div>
      <div className="bottom">
        <div className="colorOption"></div>
        <div className="colorOption"></div>
      </div>
    </div>
  );
};

export default Sidebar;
