import {
  BookmarkBorderOutlined,
  DarkModeOutlined,
  HomeOutlined,
  LightModeOutlined,
  MessageOutlined,
  NotificationsOutlined,
  PersonOutlineOutlined,
  SearchOutlined,
} from "@mui/icons-material";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { ModalContext } from "contexts/ModalContext";
import NewPostModal from "modals/NewPostModal";
import { useContext } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { setMode } from "store/userSlice";
import MenuOption from "./MenuOption";

const Layout = ({ children }) => {
  const isDesktopScreen = useMediaQuery("(min-width:700px)");
  const { palette } = useTheme();

  const dispatch = useDispatch();

  const { modalContext } = useContext(ModalContext);

  return (
    <Box>
      {modalContext.show && <NewPostModal />}
      <div className="main-container">
        <Box display="flex" flexDirection="column" alignItems="start" gap="0.5rem" mt="1rem">
          {isDesktopScreen ? (
            <Link
              to="/home"
              style={{
                textDecoration: "none",
                width: "100%",
                fontWeight: "bold",
                fontSize: "clamp(1rem,1.5rem,2rem)",
                color: palette.primary.main,
                paddingLeft: "10px",
                "&:hover": {
                  cursor: "pointer",
                },
              }}
            >
              Friendly
            </Link>
          ) : (
            <Box display="flex" minWidth="100%" justifyContent="center" padding="5px">
              <img style={{ maxWidth: "100%" }} alt="" src="../assets/logo.svg"></img>
            </Box>
          )}
          <MenuOption icon={<HomeOutlined fontSize="large" />} text={"Home"} />
          <MenuOption icon={<SearchOutlined fontSize="large" />} text={"Search"} />
          <MenuOption icon={<MessageOutlined fontSize="large" />} text={"Messages"} />
          <MenuOption icon={<NotificationsOutlined fontSize="large" />} text={"Notifications"} />
          <MenuOption icon={<BookmarkBorderOutlined fontSize="large" />} text={"Bookmarks"} />
          <MenuOption icon={<PersonOutlineOutlined fontSize="large" />} text={"Profile"} />
          <MenuOption
            icon={
              palette.mode === "dark" ? (
                <LightModeOutlined fontSize="large" />
              ) : (
                <DarkModeOutlined fontSize="large" />
              )
            }
            text={palette.mode === "dark" ? "Light Mode" : "Dark Mode"}
            onClick={() => dispatch(setMode())}
          />
        </Box>

        <Box
          width="100%"
          overflow="hidden"
          padding="0"
          borderLeft={`1px solid ${palette.neutral.light}`}
          borderRight={`1px solid ${palette.neutral.light}`}
        >
          {children}
        </Box>

        {isDesktopScreen && (
          <Box>
            {/* <AdvertWidget /> */}
            {/* <FriendListWidget key={id} userId={id} /> */}
          </Box>
        )}
      </div>
    </Box>
  );
};

export default Layout;
