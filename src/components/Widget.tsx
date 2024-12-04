import "../styles/Widget.scss";
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp';
import ListSharp from '@mui/icons-material/ListSharp';
import DeviceHub from '@mui/icons-material/DeviceHub'
import NewDevicesMenu from "./NewDevicesMenu";
import NewTicketsMenu from "./NewTicketsMenu";
import ClickableText from "./ClickableText";
import { Link } from "react-router-dom";
const Widget = ({ type }: { type: string }) => {
  let data;

  //temporary data
  const nums = 200;
  const diff = 30;

  switch (type) {
    case "tickets":
      data = {
        tilte: <div className="New tickets" >
          <NewTicketsMenu />
        </div>,
        amount: false,
        link: <div className="See all tickets">
          <ClickableText text="See all tickets" onClick={() => {
            <Link to="/tickets" style={{ textDecoration: "none" }}>
            </Link>
          }} />
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
          <NewDevicesMenu />
        </div>,
        link: <div className="See all devices">
          <ClickableText text="See all devices" onClick={() => {
            <Link to="/devices" style={{ textDecoration: "none" }}>
            </Link>
          }} />
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
        <span className="counter">{data?.amount} {nums}</span>
        <span className="link">{data?.link}</span>
      </div>
      <div className="right">
        <div className="percentage positive">
          <KeyboardArrowUp />
          {diff} %
        </div>
        {data?.icon}

      </div>
    </div>
  )
}

export default Widget;
