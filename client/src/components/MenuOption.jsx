import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Link } from "react-router-dom";

const MenuOption = ({ icon, text, link = {}, onClick = null }) => {
  const { palette } = useTheme();
  const isDesktopScreen = useMediaQuery("(min-width:1024px)");

  return (
    <Link to={link} onClick={onClick}>
      <Box
        className="cursor-pointer max-w-full overflow-hidden"
        sx={{
          "&:hover #menu-option": {
            backgroundColor: isDesktopScreen ? palette.neutral.light : "transparent",
          },
        }}
      >
        <Box
          id="menu-option"
          borderRadius="10px"
          padding="10px"
          paddingRight={isDesktopScreen ? "20px" : "10px"}
          width={isDesktopScreen ? "min-content" : "auto"}
          justifyContent={isDesktopScreen ? "center" : "flex-start"}
          alignItems={"center"}
        >
          <Box className="flex items-center gap-3">
            {icon}
            {isDesktopScreen && (
              <Typography variant="h4" whiteSpace="nowrap">
                {text}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Link>
  );
};

export default MenuOption;
