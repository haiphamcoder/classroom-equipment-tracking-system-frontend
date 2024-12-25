import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Widget.scss";
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp';
import ListSharp from '@mui/icons-material/ListSharp';
import DeviceHub from '@mui/icons-material/DeviceHub'
import ClickableText from "./ClickableText";
import { Link } from "react-router-dom";
const Widget = ({ type }: { type: string }) => {
  let data;
  const [totalRows, setTotalRows] = useState(0);
  const fetchData = async () => {
    try {
      const response = await axios.get("/api/equipment/list");
      const mapped_response = response.data.map((item: any) => ({
        id: item.id,
      }));

      // Calculate total rows
      setTotalRows(mapped_response.length);
      console.log("Total rows:", totalRows); // You can use this value as needed

    } catch (error) {
      console.error("Error fetching ticket data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    // Set up periodic refresh
    const intervalId = setInterval(fetchData, 30000); // Refresh every 30 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
  //temporary data
  // const nums = totalRows;
  // const diff = 30;

  switch (type) {
    case "tickets":
      data = {
        tilte: <div className="New tickets" >
        </div>,
        amount: false,
        link: <div className="See all tickets">
          <Link to="/tickets" style={{ textDecoration: "none" }}>
            <ClickableText text="See all tickets" onClick={() => {
              console.log("navigate to dashboard");
            }} />
          </Link>
        </div>,
        icon: (
          <ListSharp
            className="icon"
            style={
              {
                color: "black",
                backgroundColor: "lightgray"
              }
            }
          />
        )
      };
      break;
    case "devices":
      data = {
        tilte: <div className="New devices" >
        </div>,
        link: <div className="See all devices">
          <Link to="/devices" style={{ textDecoration: "none" }}>
            <ClickableText text="See all devices" onClick={() => {
              console.log("navigate to devices");
            }} />
          </Link>
        </div>,
        icon: (
          <DeviceHub className="icon"
            style={
              {
                color: "black",
                backgroundColor: "lightgray"
              }
            }
          />
        )
      };
      break;

    default:
      break;
  }
  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data?.tilte}</span>
        <span className="link">{data?.link}</span>
      </div>
      <div className="right">
        <div className="percentage positive">
          <KeyboardArrowUp />
        </div>
        {data?.icon}

      </div>
    </div>
  )
}

export default Widget;
