import React, { useRef, useState, useEffect } from "react";
import Popup from 'reactjs-popup'
import ClickableText from "./ClickableText";
import "../styles/NewDevicesMenu.scss"
import { TextField, Box, MenuItem, Snackbar } from "@mui/material";
function NewDevicesMenu() {
  const ref = useRef<any>(null);
  const exit = () => ref.current.close();

  return (
    <Popup
      ref={ref}
      trigger={<ClickableText text="Add devices" onClick={() => { }} />}
      modal
      nested
    >
      <Box className="modal" component="form" sx={{ display: "flex", flexWrap: 'wrap' }} noValidate autoComplete="off">
        <div className="header"> Add devices </div>
        <div className="content">
          <TextField fullWidth className="Id" required id="Id" label="Id" defaultValue="previous id + 1" variant="outlined" margin="dense" slotProps={{ input: { readOnly: true, }, }} />
          <TextField fullWidth className="Name" id="Name" label="Ten thiet bi" defaultValue={"..e.g.XNXX69"} margin="normal" variant="outlined" />
          <TextField fullWidth className="Location" id="Location" label="Dia diem" defaultValue={"..e.g.Phong D9-302"} margin="normal" variant="outlined" />
          <TextField fullWidth className="Status" required id="Status" label="Trang thai" defaultValue="Hoat dong" variant="outlined" margin="normal" slotProps={{ input: { readOnly: true, }, }} />

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

export default NewDevicesMenu
