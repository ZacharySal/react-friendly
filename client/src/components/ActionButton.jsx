import { Button, CircularProgress } from "@mui/material";

const ActionButton = ({
  disabled,
  backgroundColor = "blue",
  textColor = "white",
  status = "idle",
  handleClick,
  text,
  visibility = "visible",
}) => {
  return (
    <Button
      disabled={disabled}
      onClick={handleClick}
      sx={{
        visibility: visibility,
        color: textColor,
        backgroundColor: backgroundColor,
        borderRadius: "3rem",
        height: "34px",
        minWidth: "40px",
        fontSize: "1rem",
        padding: "0rem 1rem",
        textTransform: "capitalize",
        marginLeft: "auto",
        fontWeight: "800",
        "&:hover": {
          backgroundColor: backgroundColor,
        },
      }}
    >
      {status === "loading" ? (
        <CircularProgress size={22} thickness={3.5} sx={{ color: "white" }} />
      ) : (
        text
      )}
    </Button>
  );
};

export default ActionButton;
