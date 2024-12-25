import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Container,
  Paper,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { LoginParams, useAuth } from "../context/useAuth";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); 
    try {
      await login({ username, password } as LoginParams);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid username or password.");
    }
  };

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
          {error && (
            <Typography color="error" variant="body2" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 1 }}>
            Sign In
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
