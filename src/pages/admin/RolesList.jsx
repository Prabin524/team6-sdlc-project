import React from "react";
import { Paper, Typography, List, ListItem, ListItemText, Box } from "@mui/material";

const RolesList = () => {
  const roles = ["Admin", "HR", "Employee"];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        System Roles
      </Typography>

      <Paper sx={{ p: 2 }}>
        <List>
          {roles.map((role) => (
            <ListItem key={role}>
              <ListItemText primary={role} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default RolesList;
