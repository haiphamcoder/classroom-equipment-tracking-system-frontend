import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Widget.scss";
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp';
import ListSharp from '@mui/icons-material/ListSharp';
import DeviceHub from '@mui/icons-material/DeviceHub';
import NewDevicesMenu from "./NewDevicesMenu";
import NewTicketsMenu from "./NewTicketsMenu";
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

      setTotalRows(mapped_response.length);
      console.log("Total rows:", totalRows);
    } catch (error) {
      console.error("Error fetching ticket data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 30000);

    return () => clearInterval(intervalId);
  }, []);

  switch (type) {
    case "tickets":
      data = {
        title: <NewTicketsMenu />,
        link: (
          <Link to="/tickets" style={{ textDecoration: "none" }}>
            <ClickableText text="See all tickets" />
          </Link>
        ),
        icon: (
          <ListSharp
            className="icon"
            style={{
              color: "black",
              backgroundColor: "lightgray",
              borderRadius: "50%",
              padding: "5px",
            }}
          />
        ),
      };
      break;
    case "devices":
      data = {
        title: <NewDevicesMenu />,
        link: (
          <Link to="/devices" style={{ textDecoration: "none" }}>
            <ClickableText text="See all devices" />
          </Link>
        ),
        icon: (
          <DeviceHub
            className="icon"
            style={{
              color: "black",
              backgroundColor: "lightgray",
              borderRadius: "50%",
              padding: "5px",
            }}
          />
        ),
      };
      break;
    default:
      break;
  }

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data?.title}</span>
        <span className="link">{data?.link}</span>
      </div>
      <div className="right">
        <div className="percentage positive">
          <KeyboardArrowUp />
        </div>
        {data?.icon}
      </div>
    </div>
  );
};

export default Widget;