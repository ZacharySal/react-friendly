import { Box, useMediaQuery, useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import ModalProvider from "src/modals/ModalProvider";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  const isDesktopScreen = useMediaQuery("(min-width:1024px)");
  const { palette } = useTheme();

  const modal = useSelector((state) => state.app.modal);

  return (
    <Box>
      {modal.enabled && <ModalProvider />}
      <main className="grid h-auto w-full max-w-full grid-cols-[55px_1fr] justify-center lg:grid-cols-[250px_600px] lg:px-[8%]">
        <Navbar />
        <Box
          className="min-h-[1056px] max-w-full"
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
      </main>
    </Box>
  );
};

export default Layout;
