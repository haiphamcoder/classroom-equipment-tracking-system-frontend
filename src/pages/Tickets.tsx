import Sidebar from '../components/Sidebar';
import "../styles/Tickets.scss"
import TableSortAndSelection from "../components/TicketTable";

const Tickets = () => {
  return (
    <div className="tickets">
      <Sidebar />
      <div className="homeContainer">
        <TableSortAndSelection />
      </div>
    </div>
  );
};

export default Tickets;
