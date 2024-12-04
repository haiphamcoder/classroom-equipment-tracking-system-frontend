import React, { useRef, useState, useEffect } from "react";
import Popup from 'reactjs-popup'
import ClickableText from "./ClickableText";
import "../styles/NewDevicesMenu.scss"
import { TextField, Box, MenuItem, Snackbar, Autocomplete } from "@mui/material";

function NewTicketsMenu() {
  const defaultProps = {
    options: ['loa', 'o cam'],
  };
  const ref = useRef<any>(null);
  const exit = () => ref.current.close();
  return (
    <Popup
      ref={ref}
      trigger={<ClickableText text="Add tickets" onClick={() => { }} />}
      modal
      nested
    >
      <Box className="modal" component="form" sx={{ display: "flex", flexWrap: 'wrap' }} noValidate autoComplete="off">
        <div className="header"> Add devices </div>
        <div className="content">
          <TextField fullWidth className="Id" required id="Id" label="TicketId" defaultValue="previous id + 1" variant="outlined" margin="dense" slotProps={{ input: { readOnly: true, }, }} />
          <TextField fullWidth className="BorrowerId" id="BorrowerId" label="MSSV/MSGV" defaultValue={"..e.g.20207632"} margin="normal" variant="outlined" />
          <TextField fullWidth className="BorrowerName" id="BorrowerName" label="Ten nguoi muon" defaultValue={"..e.g.Nguyen Viet Thanh"} margin="normal" variant="outlined" />
          <Autocomplete
            {...defaultProps}
            id="equipment_option"
            disableCloseOnSelect
            renderInput={(params) => (
              <TextField {...params} label="disableCloseOnSelect" variant="standard" />
            )}
          />
        </div>
        <div className="actions">
          <button className="savebutton" onClick={() => {
            console.log("Save")
          }}>SAVE</button>
          <button
            className="exitbutton"
            onClick={exit}
          >
            Thoat
          </button>
        </div>
      </Box>
    </Popup>
  );
}

export default NewTicketsMenu
