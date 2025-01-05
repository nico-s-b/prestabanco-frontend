import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import PaidIcon from "@mui/icons-material/Paid";
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import ListIcon from '@mui/icons-material/List';
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";

export default function Sidemenu({ open, toggleDrawer }) {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const userType = localStorage.getItem('userType');
  let profileURL = "";
  if (1) {
    profileURL = `/client/${userId}`;
  } else {
    profileURL = `/executive/${userId}`;
  }
  
  const listOptions = () => (
    <Box
      role="presentation"
      onClick={toggleDrawer(false)}
    >
      <List>
        <ListItemButton onClick={() => navigate("/home")}>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItemButton>

        <Divider />

        <ListItemButton onClick={() => navigate(profileURL)}>
          <ListItemIcon>
            <PeopleAltIcon />
          </ListItemIcon>
          <ListItemText primary="Mi Perfil" />
        </ListItemButton>

        <Divider />

        {/* Opciones para CLIENT */}
        {userType === "CLIENT" && (
          <>
            <ListItemButton onClick={() => navigate("/credit/simulate")}>
              <ListItemIcon>
                <RequestQuoteIcon />
              </ListItemIcon>
              <ListItemText primary="Simular Crédito" />
            </ListItemButton>

            <ListItemButton onClick={() => navigate("/credit/request")}>
              <ListItemIcon>
                <PaidIcon />
              </ListItemIcon>
              <ListItemText primary="Solicitar Crédito" />
            </ListItemButton>
          </>
        )}

        {/* Opciones para EXECUTIVE */}
        {userType === "EXECUTIVE" && (
          <ListItemButton onClick={() => navigate("/credit/all")}>
            <ListItemIcon>
              <ListIcon />
            </ListItemIcon>
            <ListItemText primary="Ver Créditos" />
          </ListItemButton>
        )}
        
      </List>
    </Box>
  );

  return (
    <div>
      <Drawer anchor={"left"} open={open} onClose={toggleDrawer(false)}>
        {listOptions()}
      </Drawer>
    </div>
  );
}
