import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Link } from "react-router-dom";

const MenuOption = ({ icon, text, link = "/home", onClick = null }) => {
  const { palette } = useTheme();
  const isDesktopScreen = useMediaQuery("(min-width:700px)");

  return (
    <Box
      onClick={onClick}
      sx={{
        cursor: "pointer",
        minWidth: "100%",
        "&:hover #menu-option": {
          cursor: "pointer",
          backgroundColor: palette.neutral.light,
        },
      }}
    >
      <Box
        id="menu-option"
        borderRadius="10px"
        padding="10px"
        paddingRight={isDesktopScreen ? "20px" : "10px"}
        width={isDesktopScreen ? "min-content" : "100%"}
        justifyContent={isDesktopScreen ? "center" : "flex-start"}
      >
        <Link to={link} style={{ display: "flex", gap: "1rem" }}>
          {icon}
          {isDesktopScreen && (
            <Typography variant="h4" whiteSpace="nowrap">
              {text}
            </Typography>
          )}
        </Link>
      </Box>
    </Box>
  );
};

export default MenuOption;
