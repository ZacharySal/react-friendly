import {
  BookmarkBorderOutlined,
  DarkModeOutlined,
  Home,
  HomeOutlined,
  LightModeOutlined,
  LogoutOutlined,
  PersonOutlineOutlined,
} from "@mui/icons-material";
import Bookmark from "@mui/icons-material/Bookmark";
import PersonIcon from "@mui/icons-material/Person";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { setMode } from "src/store/slices/appSlice";
import { setUser } from "src/store/slices/userSlice";
import FriendlyLogo from "../assets/logo.svg";
import MenuOption from "./MenuOption";

const Navbar = () => {
  const isDesktopScreen = useMediaQuery("(min-width:1024px)");
  const { palette } = useTheme();
  const id = useSelector((state) => state.user.user.id);
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const isActive = (page) => pathname.includes(page);
  return (
    <Box className="relative mt-4 flex items-center justify-center">
      <Box className="fixed top-[1rem] flex flex-col items-start gap-2">
        {isDesktopScreen ? (
          <Link
            to="/home"
            className="w-full cursor-pointer pl-2 text-3xl font-[900]"
            style={{ color: palette.primary.main }}
          >
            Friendly
          </Link>
        ) : (
          <Box className="flex min-w-full justify-center p-1">
            <img className="max-w-full" alt="" src={FriendlyLogo}></img>
          </Box>
        )}
        <MenuOption
          icon={isActive("home") ? <Home fontSize="large" /> : <HomeOutlined fontSize="large" />}
          link="/home"
          text={"Home"}
        />
        {/* <MenuOption
          icon={<NotificationsOutlined fontSize="large" />}
          text={"Notifications"}
        /> */}
        <MenuOption
          icon={
            isActive("bookmarks") ? (
              <Bookmark fontSize="large" />
            ) : (
              <BookmarkBorderOutlined fontSize="large" />
            )
          }
          link="/bookmarks"
          text={"Bookmarks"}
        />
        {/* <MenuOption
          icon={<MessageOutlined fontSize="large" />}
          text={"Messages"}
        /> */}

        {/* <MenuOption
          icon={<SearchOutlined fontSize="large" />}
          text={"Search"}
        /> */}

        <MenuOption
          icon={
            isActive("profile") ? (
              <PersonIcon fontSize="large" />
            ) : (
              <PersonOutlineOutlined fontSize="large" />
            )
          }
          link={`/profile/${id}`}
          text={"Profile"}
        />
        <MenuOption
          icon={<LogoutOutlined fontSize="large" />}
          link="/"
          onClick={(e) => {
            e.stopPropagation();
            dispatch(setUser(null));
          }}
          text={"Logout"}
        />
        <MenuOption
          icon={
            palette.mode === "dark" ? (
              <LightModeOutlined fontSize="large" />
            ) : (
              <DarkModeOutlined fontSize="large" />
            )
          }
          text={palette.mode === "dark" ? "Light Mode" : "Dark Mode"}
          onClick={(e) => {
            e.stopPropagation();
            dispatch(setMode());
          }}
        />
      </Box>
    </Box>
  );
};

export default Navbar;
