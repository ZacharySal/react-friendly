import { CachedOutlined } from "@mui/icons-material";
import { Box, Typography, useTheme } from "@mui/material";

const RepostMessage = ({ authorName }) => {
  const { palette } = useTheme();
  return (
    <Box className="mb-1 flex items-center gap-2 pl-6" color={palette.neutral.medium}>
      <CachedOutlined sx={{ color: palette.neutral.medium, fontSize: "18px" }} />
      <Typography variant="h7" color={palette.neutral.medium} fontWeight="500">
        {authorName} reposted
      </Typography>
    </Box>
  );
};

export default RepostMessage;
