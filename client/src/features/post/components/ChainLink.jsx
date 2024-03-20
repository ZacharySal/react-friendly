import { Box, useTheme } from "@mui/material";

const ChainLink = ({ isPostPage = false }) => {
  const { palette } = useTheme();
  return (
    <Box
      sx={{
        position: "relative",
        top: "1px",
        left: "50%",
        width: "2.5px",
        height: isPostPage ? "calc(100% + 12px)" : "95%",
        transform: "translateX(-50%)",
        backgroundColor: palette.neutral.light,
      }}
    />
  );
};

export default ChainLink;
