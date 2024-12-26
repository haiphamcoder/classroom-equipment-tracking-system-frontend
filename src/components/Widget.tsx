import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Widget.scss";
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp';
import ListSharp from '@mui/icons-material/ListSharp';
import DeviceHub from '@mui/icons-material/DeviceHub';
import ClickableText from "./ClickableText";
import { Link } from "react-router-dom";

const Widget = ({ type }: { type: string }) => {
  let data;

  const [totalCount, setTotalCount] = useState(0);
  const [totalCount1, setTotalCount1] = useState(0);
  const fetchData = async () => {
    try {
      const response = await axios.get("/api/equipment/list");
      const mappedResponse = response.data.map((item: any) => ({
        id: item.id,
      }));
      setTotalCount(mappedResponse.length);
    } catch (error) {
      console.error("Error fetching ticket data:", error);
    }
  };
  const fetchData1 = async () => {
    try {
      const response = await axios.get("/api/order/list", {
        params: {
          sort: "ASC",
          sortBy: "BORROW_TIME"
        }
      });
      const mapped_response = response.data.map((item: any) => ({
        id: item.id,
      }));
      setTotalCount1(mapped_response.length);
    } catch (error) {
      console.error("Error fetching ticket data:", error);
    }
  };


  useEffect(() => {
    fetchData1();
    fetchData();
    console.log("row", totalCount);
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  switch (type) {
    case "tickets":
      data = {
        title: <div className="new-devices">Total Tickets - {totalCount}</div>,
        link: (
          <Link to="/tickets" style={{ textDecoration: "none" }}>
            <ClickableText text="See all tickets" onClick={function(): void {
              throw new Error("Function not implemented.");
            }} />
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
        title: <div className="new-devices">Total Devices - {totalCount1} </div>,
        link: (
          <div className="see-all-devices">
            <Link to="/devices" style={{ textDecoration: "none" }}>
              <ClickableText text="See all devices" onClick={function(): void {
                throw new Error("Function not implemented.");
              }} />
            </Link>
          </div>
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
