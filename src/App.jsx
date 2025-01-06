import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from '@mui/material/CssBaseline';
import { useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import { SessionProvider } from "./services/SessionContext";

import Navbar from "./components/Navbar"
import Home from './components/Home';
import NotFound from './components/NotFound';
import CreditSimulate from './components/CreditSimulate';
import CreditEval from './components/CreditEval';
import CreditRequest from './components/CreditRequest';
import CreditView from './components/CreditView';
import CreditList from './components/CreditList';
import CreditConfirm from './components/CreditConfirm';
import ClientProfile from './components/ClientProfile';
import ClientInfo from './components/ClientInfo';
import Register from './components/Register';
import ExecutiveProfile from './components/ExecutiveProfile';
import Login from './components/Login';
import Documents from './components/Documents';

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = createTheme({
    palette: {
      mode: prefersDarkMode ? "dark" : "light", // Oscuro o claro según la preferencia del sistema
      primary: {
        main: "#1976d2", // Azul predeterminado de Material-UI
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#f50057", // Rosa predeterminado
      },
      background: {
        default: prefersDarkMode ? "#242424" : "#ffffff", // Fondo general
        paper: prefersDarkMode ? "#121212" : "#f9f9f9", // Fondo de componentes
      },
      text: {
        primary: prefersDarkMode ? "#ffffff" : "#000000", // Texto principal
        secondary: prefersDarkMode ? "#aaaaaa" : "#333333", // Texto secundario
      },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: "#1976d2",
          },
        },
      },
    },
  });
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Aplica el fondo y colores base del tema */}
      <Router>
        <SessionProvider>
          <Box
            sx={{
              bgcolor: "background.default",
              color: "text.primary",
              padding: 2,
              minHeight: "100vh",
            }}
            > 
            <Navbar />
            
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/credit/simulate" element={<CreditSimulate />} />
              <Route path="/credit/request" element={<CreditRequest />} />
              <Route path="/credit/:id" element={<CreditView />} />
              <Route path="/credit/all" element={<CreditList />} />
              <Route path="/client/:id" element={<ClientProfile />} />
              <Route path="/client/info/:id" element={<ClientInfo />} />
              <Route path="/register" element={<Register />} />
              <Route path="/executive/:id" element={<ExecutiveProfile />} />
              <Route path="/credit/eval/:creditId" element={<CreditEval />} />
              <Route path="/credit/confirm/:id" element={<CreditConfirm />} />
              <Route path="/documents/:id" element={<Documents />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Box>
        </SessionProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App