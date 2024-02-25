import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";

const MenuOption = ({ icon, text, onClick = null }) => {
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
        display="flex"
        gap="1rem"
        alignItems="center"
        borderRadius="10px"
        padding="10px"
        paddingRight={isDesktopScreen ? "20px" : "10px"}
        width={isDesktopScreen ? "min-content" : "100%"}
        justifyContent={isDesktopScreen ? "center" : "flex-start"}
      >
        {icon}
        {isDesktopScreen && (
          <Typography variant="h4" whiteSpace="nowrap">
            {text}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default MenuOption;
