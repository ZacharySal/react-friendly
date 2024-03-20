import { Box, Typography, useTheme } from "@mui/material";
const FeedSelection = ({ postType, setPostType }) => {
  const { palette } = useTheme();
  return (
    <Box
      className="md:sticky left-0 top-0 z-20 self-start"
      borderBottom={`1px solid ${palette.neutral.light}`}
      sx={{
        backgroundColor: palette.mode === "dark" ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.4)",
        backdropFilter: "blur(15px)",
      }}
    >
      <Box className="flex justify-evenly">
        <Box
          onClick={() => setPostType("feed")}
          className="min-w-1/2 flex items-center p-4 tracking-tight"
          sx={{
            borderBottom:
              postType === "feed" ? `3px solid ${palette.primary.main}` : "3px solid transparent",
            transition: "background-color 0.2s ease",
            "&:hover": {
              backgroundColor: palette.neutral.light,
              cursor: "pointer",
            },
          }}
        >
          <Typography variant="h5" fontWeight="600">
            For you
          </Typography>
        </Box>
        <Box
          onClick={() => setPostType("following")}
          className="min-w-1/2 flex cursor-pointer items-center p-4 tracking-tight"
          sx={{
            borderBottom:
              postType === "following"
                ? `3px solid ${palette.primary.main}`
                : "3px solid transparent",
            transition: "background-color 0.2s ease",
            "&:hover": {
              backgroundColor: palette.neutral.light,
            },
          }}
        >
          <Typography variant="h5" fontWeight="600">
            Following
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default FeedSelection;
