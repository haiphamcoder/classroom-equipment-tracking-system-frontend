import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import "../styles/Devices.scss"
import TableSortAndSelection from "../components/DeviceTable";

const Devices = () => {
  return (
    <div className="devices">
      <Sidebar />
      <div className="homeContainer">
        <TableSortAndSelection />
      </div>
    </div>
  );
};

export default Devices;
