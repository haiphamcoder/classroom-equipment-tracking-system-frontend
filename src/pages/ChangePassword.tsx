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
import React from 'react'

export const ChangePassword = () => {
  return (
    <Container maxWidth="xs">
      <Paper elevation={10} sx={{ marginTop: 8, padding: 2 }}>
        <Typography component="h1" variant="h5" sx={{ textAlign: "center" }}>
          Change Password
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1 }} >
          <TextField
            placeholder="Enter old password"
            fullWidth
            required
            autoFocus
            sx={{ mb: 2 }}
          />
          <TextField
            placeholder="Enter new password"
            fullWidth
            required
            type="password"
            sx={{ mb: 2 }}
          />
          <TextField
            placeholder="Enter new password again"
            fullWidth
            required
            type="password"
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 1 }}>
            Change Password
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}
