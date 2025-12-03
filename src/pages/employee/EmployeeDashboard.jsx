import React, { useEffect, useState } from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TimerOffIcon from "@mui/icons-material/TimerOff";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import {
  clockIn,
  clockOut,
  getTodayAttendance,
} from "../../services/attendanceService";

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [todayRecord, setTodayRecord] = useState(null);

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const loadToday = () => {
    if (user) {
      const record = getTodayAttendance(user.email);
      setTodayRecord(record);
    }
  };

  useEffect(() => {
    loadToday();
  }, [user]);

  /*Handle clock in */
  const handleClockIn = () => {
    const res = clockIn(user.email);

    setAlert({
      open: true,
      message: res.success ? "Clocked In Successfully!" : res.message,
      severity: res.success ? "success" : "error",
    });

    loadToday();
  };

  //Clock Out
  const handleClockOut = () => {
    const res = clockOut(user.email);

    setAlert({
      open: true,
      message: res.success ? "Clocked Out Successfully!" : res.message,
      severity: res.success ? "success" : "error",
    });

    loadToday();
  };

//card 
 const Card = ({ icon, title, subtitle, onClick, disabled, bgColor, textColor }) => (
  <Paper
    onClick={!disabled ? onClick : undefined}
    sx={{
      p: 3,
      textAlign: "center",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.6 : 1,
      borderRadius: 3,
      background: bgColor || "white",
      color: textColor || "inherit",
      transition: "0.3s",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      "&:hover": {
        transform: disabled ? "none" : "scale(1.04)",
        boxShadow: disabled ? "none" : "0px 8px 18px rgba(0,0,0,0.25)",
      },
    }}
  >
    <Box sx={{ fontSize: 50, color: textColor || "inherit" }}>
      {icon}
    </Box>
    <Typography variant="h6" sx={{ fontWeight: 600 }}>
      {title}
    </Typography>
    <Typography variant="body2" sx={{ opacity: 0.9 }}>
      {subtitle}
    </Typography>
  </Paper>
);


  return (
    <Box>

      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={() => setAlert({ ...alert, open: false })}
          severity={alert.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>

      <Typography variant="h4" mb={3}>
        Welcome, {user?.fullname}
      </Typography>

      <Grid container spacing={3}>
        
        <Grid item xs={12} md={6}>
  <Card
    icon={<PersonIcon fontSize="large" />}
    title="My Profile"
    subtitle="View and manage personal details"
    bgColor="linear-gradient(135deg, #42a5f5, #1e88e5)"
    textColor="white"
    onClick={() => navigate("/employee/profile")}
  />
</Grid>

<Grid item xs={12} md={6}>
  <Card
    icon={<AccessTimeIcon fontSize="large" />}
    title="Clock In"
    subtitle={
      todayRecord?.clockIn
        ? `Clocked In: ${todayRecord.clockIn}`
        : "Tap to start work"
    }
    bgColor="linear-gradient(135deg, #66bb6a, #43a047)"
    textColor="white"
    disabled={!!todayRecord?.clockIn}
    onClick={handleClockIn}
  />
</Grid>

<Grid item xs={12} md={6}>
  <Card
    icon={<TimerOffIcon fontSize="large" />}
    title="Clock Out"
    subtitle={
      todayRecord?.clockOut
        ? `Clocked Out: ${todayRecord.clockOut}`
        : "Tap to end work"
    }
    bgColor="linear-gradient(135deg, #fb8c00, #ef6c00)"
    textColor="white"
    disabled={!todayRecord || todayRecord.clockOut !== null}
    onClick={handleClockOut}
  />
</Grid>

<Grid item xs={12} md={6}>
  <Card
    icon={<CalendarMonthIcon fontSize="large" />}
    title="My Attendance"
    subtitle="View daily, weekly, monthly attendance"
    bgColor="linear-gradient(135deg, #ab47bc, #8e24aa)"
    textColor="white"
    onClick={() => navigate("/employee/attendance")}
  />
</Grid>

      </Grid>
    </Box>
  );
};

export default EmployeeDashboard;
