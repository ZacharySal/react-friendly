import { Box, Typography, useTheme } from "@mui/material";

const PostTypeOption = ({ type, selectedType, setSelectedType }) => {
  const { palette } = useTheme();
  return (
    <Box
      onClick={() => setSelectedType(type)}
      display="flex"
      justifyContent="center"
      sx={{
        color: selectedType === type ? "" : palette.neutral.medium,
        padding: "0.75rem 1rem",
        width: "100%",
        letterSpacing: "-0.4px",
        flexGrow: "1",
        borderBottom: selectedType === type ? `3px solid ${palette.primary.main}` : "",
        borderWidth: "50%",
        transition: "background-color 0.2s ease",
        "&:hover": {
          backgroundColor: palette.neutral.light,
          cursor: "pointer",
        },
      }}
    >
      <Typography variant="h5" fontWeight="600" className="capitalize">
        {type}
      </Typography>
    </Box>
  );
};

export default PostTypeOption;
