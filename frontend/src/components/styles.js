import {
  AppBar as MuiAppBar,
  Drawer as MuiDrawer,
  TableCell,
  TableRow,
  tableCellClasses,
} from "@mui/material";
import { alpha, createTheme, styled } from "@mui/material/styles";

export const drawerWidth = 240;

export const getAppTheme = (darkMode = true) =>
  createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: "#6366f1",
        light: "#818cf8",
        dark: "#4338ca",
      },
      secondary: {
        main: "#14b8a6",
      },
      background: darkMode
        ? {
            default: "#020617",
            paper: "#0f172a",
          }
        : {
            default: "#f8fafc",
            paper: "#ffffff",
          },
      text: darkMode
        ? {
            primary: "#e2e8f0",
            secondary: "#94a3b8",
          }
        : {
            primary: "#0f172a",
            secondary: "#475569",
          },
      divider: darkMode ? alpha("#cbd5e1", 0.12) : alpha("#0f172a", 0.08),
    },
    shape: {
      borderRadius: 18,
    },
    typography: {
      fontFamily: ["Inter", "Poppins", "Segoe UI", "sans-serif"].join(","),
      h3: {
        fontWeight: 800,
        letterSpacing: "-0.03em",
      },
      h4: {
        fontWeight: 700,
        letterSpacing: "-0.02em",
      },
      button: {
        fontWeight: 700,
        textTransform: "none",
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            background: darkMode
              ? "radial-gradient(circle at top, rgba(99,102,241,0.18), transparent 34%), #020617"
              : "linear-gradient(180deg, #eef2ff 0%, #f8fafc 100%)",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            border: `1px solid ${
              darkMode ? alpha("#cbd5e1", 0.08) : alpha("#0f172a", 0.08)
            }`,
            boxShadow: darkMode
              ? "0 24px 80px rgba(2, 6, 23, 0.45)"
              : "0 24px 80px rgba(15, 23, 42, 0.12)",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 14,
            paddingInline: 18,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 24,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backdropFilter: "blur(16px)",
            backgroundColor: darkMode
              ? alpha("#0f172a", 0.78)
              : alpha("#ffffff", 0.86),
            color: darkMode ? "#e2e8f0" : "#0f172a",
          },
        },
      },
    },
  });

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.mode === "dark" ? "#172554" : "#e0e7ff",
    color: theme.palette.text.primary,
    fontWeight: 700,
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? alpha("#6366f1", 0.05)
        : alpha("#6366f1", 0.03),
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    backgroundColor:
      theme.palette.mode === "dark"
        ? alpha("#0f172a", 0.95)
        : alpha("#ffffff", 0.92),
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));
