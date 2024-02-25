import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material";

const AlertMessage = ({ text, confirmationAction, setShowAlert }) => {
  const { palette } = useTheme();
  return (
    <Box
      className="alert-message"
      sx={{
        width: "100vw",
        height: "100vh",
        position: "fixed",
        top: "50%",
        left: "50%",
        zIndex: "100",
      }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          width: "clamp(80px, 80vw, 600px)",
          padding: "1.5rem 1.5rem",
          boxShadow: "0px 0px 1000vw 1000vw rgba(0,0,0,0.4)",
          transform: "translateX(-50%) translateY(-50%)",
          borderRadius: "8px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
            height: "auto",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <Typography variant="h3">Delete Forever?</Typography>
          <Typography variant="h5" color={palette.neutral.main}>
            This post will be deleted forever and you will be unable to recover it.
          </Typography>
          <Box style={{ display: "flex", marginLeft: "auto", gap: "1rem", marginTop: "1rem" }}>
            <Typography
              variant="h8"
              sx={{ cursor: "pointer", color: palette.neutral.main }}
              onClick={() => setShowAlert(false)}
            >
              Cancel
            </Typography>
            <Typography
              onClick={confirmationAction}
              variant="h8"
              sx={{ cursor: "pointer", color: "red" }}
            >
              Confirm
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AlertMessage;
