import React from "react";
import { Alert, AlertTitle } from "@mui/material";

type CustomAlertProps = {
  type: "success" | "info" | "warning" | "error";
  title: string;
  message: string;
};

const CustomAlert: React.FC<CustomAlertProps> = ({ type, title, message }) => {
  return (
    <Alert severity={type} sx={{ mb: 2 }}>
      <AlertTitle>{title}</AlertTitle>
      {message}
    </Alert>
  );
};

export default CustomAlert;
