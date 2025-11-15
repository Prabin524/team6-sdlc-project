import React, { useState } from "react";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Typography,
  Box,
  Paper
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { redirectToRole } from "../utils/roleRedirect";
import { saveLoginLog } from "../services/adminStatsService";
const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const response = await loginUser(email, password);
    saveLoginLog(response.email); // ⬅ SAVE LOGIN EVENT

      login(response, remember);
      redirectToRole(navigate, response.role);
    } catch (err) {
      setError(err);
    }
  }
  ;

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f2f4f7"
      }}
    >
      <Paper elevation={3} sx={{ padding: 4, width: 350 }}>
        <Typography variant="h5" textAlign="center" mb={2}>
          Login
        </Typography>

        {error && (
          <Typography color="error" textAlign="center" mb={2}>
            {error}
          </Typography>
        )}

        <TextField
          fullWidth
          label="Email"
          margin="normal"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          fullWidth
          label="Password"
          type={showPass ? "text" : "password"}
          margin="normal"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPass(!showPass)}>
                  {showPass ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        <FormControlLabel
          control={<Checkbox checked={remember} onChange={(e) => setRemember(e.target.checked)} />}
          label="Remember Me"
        />

        <Button fullWidth variant="contained" onClick={handleLogin} sx={{ mt: 2 }}>
          Login
        </Button>

        <Typography
          variant="body2"
          color="primary"
          mt={2}
          textAlign="center"
          sx={{ cursor: "pointer" }}
          onClick={() => navigate("/forgot-password")}
        >
          Forgot Password?
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;
