import React, { useState, useRef } from "react";
import { alpha } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Check from "@mui/icons-material/Check";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import Sidebar from "./Sidebar";
import { useHistory } from "react-router-dom";
import Divider from "@mui/material/Divider";
import { useAuth } from "contexts/AuthContext";
import {
  Avatar,
  Box,
  ListItemIcon,
  ListItemText,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import Logo from "components/Logo";
import { Brightness3, ExitToApp, Settings } from "@mui/icons-material";
import { ThemeString, useTheme } from "contexts/ThemeContext";
import { useThemeUpdate } from "contexts/ThemeContext";
import { UserActions, useUserUpdate } from "contexts/UserContext";
import { CARDS_ACTIONS } from "Constants";
import { Action } from "App";
import ArrowBack from "@mui/icons-material/ArrowBack";
import CardForm from "components/cardform/CardForm";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    borderWidth: "1px",
    backgroundColor: theme.palette.background.default,
    borderColor:
      theme.palette.mode === "dark"
        ? alpha(theme.palette.common.white, 0.25)
        : alpha(theme.palette.common.black, 0.25),
    borderStyle: "solid",
    "&:hover": {
      borderColor:
        theme.palette.mode === "dark"
          ? alpha(theme.palette.common.white, 0.5)
          : alpha(theme.palette.common.black, 0.45),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("md")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
      position: "absolute",
      left: "50%",
      transform: "translateX(-50%)",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "40ch",
    },
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  list: {
    padding: 0,
  },
}));

interface Props {
  cardsDispatch: React.Dispatch<Action>;
}

const Header: React.FC<Props> = ({ cardsDispatch }) => {
  const logoRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLButtonElement | null>(null);
  const themeString = useTheme();
  const setThemeString = useThemeUpdate() as Function;

  const [cardFormOpen, setCardFormOpen] = useState(false);

  const classes = useStyles();
  const [displaySidebar, setDisplaySidebar] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [themeAnchorEl, setThemeAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    useState<null | HTMLElement>(null);

  const history = useHistory();
  const { logout, currentUser } = useAuth();

  const isMenuOpen = Boolean(anchorEl);
  const isThemeMenuOpen = Boolean(themeAnchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setThemeAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };
  const handleThemeMenuOpen = () => {
    setThemeAnchorEl(anchorEl);
    setAnchorEl(null);
  };
  const handleChooseTheme = (selectedTheme: ThemeString) => {
    handleMenuClose();
    setThemeString(selectedTheme);
  };

  const userDispatch = useUserUpdate();

  const handleSignOut = () => {
    handleMenuClose();
    userDispatch({ type: UserActions.ResetUser });
    cardsDispatch({ type: CARDS_ACTIONS.RESET_CARDS });
    logout();
    // TODO: the two expressions above have to happen together or not happen at all
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      transformOrigin={{ vertical: "top", horizontal: "center" }}
      id={menuId}
      keepMounted
      open={isMenuOpen}
      onClose={handleMenuClose}
      classes={{ list: classes.list }}
    >
      <Paper variant="outlined">
        <Box mt={1}>
          <Typography variant="body1" align="center">
            {" "}
            Signed in as:{" "}
          </Typography>
        </Box>
        <Box sx={{ mx: 3, my: 1 }}>
          <Typography variant="h6" style={{ fontWeight: 800 }}>
            {currentUser && (currentUser.displayName || currentUser.email)}
          </Typography>
        </Box>

        <Divider sx={{ mt: "8px", mb: "8px" }} />

        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <AccountCircle />
          </ListItemIcon>
          <Box sx={{ mr: 5 }}>
            <ListItemText primary="Profile" />
          </Box>
        </MenuItem>
        <MenuItem onClick={handleThemeMenuOpen}>
          <ListItemIcon>
            <Brightness3 />
          </ListItemIcon>
          <ListItemText primary="Theme" />
        </MenuItem>

        <MenuItem onClick={handleThemeMenuOpen}>
          <ListItemIcon>
            <Settings />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleSignOut}>
          <ListItemIcon>
            <ExitToApp />
          </ListItemIcon>
          <ListItemText primary="Sign out" />
        </MenuItem>
      </Paper>
    </Menu>
  );
  const handleThemeBackBtn = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(accountRef.current);
    setThemeAnchorEl(null);
  };
  const themeMenu = (
    <Menu
      anchorEl={themeAnchorEl}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      transformOrigin={{ vertical: "top", horizontal: "center" }}
      id={menuId}
      keepMounted
      open={isThemeMenuOpen}
      onClose={handleMenuClose}
      classes={{ list: classes.list }}
    >
      <Paper variant="outlined">
        <MenuItem onClick={handleThemeBackBtn}>
          <ListItemIcon>
            <ArrowBack />
          </ListItemIcon>
          <ListItemText>Back</ListItemText>
        </MenuItem>

        <Divider />

        <MenuItem
          onClick={() => handleChooseTheme("device-theme")}
          selected={themeString === "device-theme"}
        >
          {themeString === "device-theme" && (
            <ListItemIcon>
              <Check />
            </ListItemIcon>
          )}
          <ListItemText inset={themeString !== "device-theme"}>
            Device theme
          </ListItemText>
        </MenuItem>

        <MenuItem
          onClick={() => handleChooseTheme("light")}
          selected={themeString === "light"}
        >
          {themeString === "light" && (
            <ListItemIcon>
              <Check />
            </ListItemIcon>
          )}
          <ListItemText inset={themeString !== "light"}>Light</ListItemText>
        </MenuItem>

        <MenuItem
          onClick={() => handleChooseTheme("dark")}
          selected={themeString === "dark"}
        >
          {themeString === "dark" && (
            <ListItemIcon>
              <Check />
            </ListItemIcon>
          )}
          <ListItemText inset={themeString !== "dark"}>Dark</ListItemText>
        </MenuItem>
      </Paper>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
      classes={{ list: classes.list }}
    >
      <Paper variant="outlined">
        <MenuItem
          onClick={() => {
            setCardFormOpen(true);
          }}
        >
          <IconButton
            aria-label="create a new card"
            color="inherit"
            size="large"
          >
            <AddCircleIcon />
          </IconButton>
          <p>New card</p>
        </MenuItem>
        <MenuItem>
          <IconButton
            aria-label="show 11 new notifications"
            color="inherit"
            size="large"
          >
            <Badge badgeContent={2} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <p>Notifications</p>
        </MenuItem>
        <MenuItem onClick={handleProfileMenuOpen}>
          <IconButton
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            color="inherit"
            size="large"
          >
            {currentUser?.photoURL ? (
              <Avatar
                alt={currentUser?.displayName || ""}
                src={currentUser?.photoURL}
              />
            ) : (
              <AccountCircle />
            )}
          </IconButton>
          <p>Account</p>
        </MenuItem>
      </Paper>
    </Menu>
  );

  function handleSearbarFocus() {
    if (window.innerWidth < 600 && logoRef?.current?.style) {
      logoRef.current.style.width = "0px";
    }
  }
  function handleSearbarBlur() {
    if (logoRef?.current?.style) {
      logoRef.current.style.width = "100%";
    }
  }
  return (
    <div className={classes.grow}>
      <AppBar position="static" color="inherit">
        <Toolbar>
          <Tooltip title="Sidebar Navigation" enterDelay={1000}>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="open drawer"
              onClick={() => {
                setDisplaySidebar((prev) => !prev);
              }}
              size="large"
            >
              <MenuIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="MathCards Home" enterDelay={1000}>
            <div ref={logoRef} style={{ transition: "width 500ms" }}>
              <IconButton
                style={{ borderRadius: "0.3rem", paddingLeft: "0.3rem" }}
                size="small"
                onClick={() => {
                  history.push("/");
                }}
              >
                <Logo />
              </IconButton>
            </div>
          </Tooltip>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ "aria-label": "search" }}
              onFocus={handleSearbarFocus}
              onBlur={handleSearbarBlur}
            />
          </div>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <Tooltip title="Create a new card">
              <IconButton
                aria-label="create a new card"
                color="inherit"
                onClick={() => {
                  setCardFormOpen(true);
                }}
                size="large"
              >
                <AddCircleIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Notifications">
              <IconButton
                aria-label="show 2 new notifications"
                color="inherit"
                size="large"
              >
                <Badge badgeContent={2} color="error" sx={{ zIndex: "0" }}>
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title="Account and Settings">
              <IconButton
                ref={accountRef}
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
                size="large"
              >
                {currentUser?.photoURL ? (
                  <Avatar
                    alt={currentUser?.displayName || ""}
                    src={currentUser?.photoURL}
                  />
                ) : (
                  <AccountCircle />
                )}
              </IconButton>
            </Tooltip>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
              size="large"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
      {themeMenu}
      <Sidebar
        displaySidebar={displaySidebar}
        setDisplaySidebar={setDisplaySidebar}
      />
      <CardForm
        operationType="create"
        cardsDispatch={cardsDispatch}
        cardFormOpen={cardFormOpen}
        setCardFormOpen={setCardFormOpen}
      />
    </div>
  );
};

export default Header;
