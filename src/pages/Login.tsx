import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginParams, useAuth } from "../context/useAuth";
import { AppProvider } from "@toolpad/core/AppProvider";
import { SignInPage, type AuthProvider } from "@toolpad/core/SignInPage";
import {
  Avatar,
  Box,
  Container,
  FormControlLabel,
  Paper,
  TextField,
  Typography,
  Checkbox,
  Button,
  Grid,
  Link,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import axios from "axios";
export const Login = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const naviagte = useNavigate();
  const handleSubmit = () => {
    // login({ username: username, password: password });
    axios.post("/api/staff/login", {
      username,
      password,
    });
  };
  useEffect(() => {}, []);
  return (
    <Container maxWidth="xs">
      <Paper elevation={10} sx={{ marginTop: 8, padding: 2 }}>
        <Avatar
          sx={{
            mx: "auto",
            bgcolor: "secondary.main",
            textAlign: "center",
            mb: 1,
          }}
        >
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" sx={{ textAlign: "center" }}>
          Sign In
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={handleSubmit}>
          <TextField
            placeholder="Enter username"
            value={username}
            fullWidth
            required
            autoFocus
            sx={{ mb: 2 }}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            placeholder="Enter password"
            fullWidth
            required
            value={password}
            type="password"
            sx={{ mb: 2 }}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 1 }}>
            Sign In
          </Button>
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 1 }}>
            Change Password
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
