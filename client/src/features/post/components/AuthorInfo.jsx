import { Box, Typography, useTheme } from "@mui/material";

const AuthorInfo = ({ author, time, handleClick, clickable = true }) => {
  const { palette } = useTheme();
  return (
    <Box className="flex max-w-full items-center gap-1 overflow-hidden text-nowrap">
      <Typography
        onClick={(e) => clickable && handleClick(e, author.id)}
        sx={{ cursor: clickable ? "pointer" : "auto" }}
        variant="h5"
        className="font-[500]"
      >
        {`${author.first_name} ${author.last_name} `}
      </Typography>
      <Typography
        onClick={(e) => clickable && handleClick(e, author.id)}
        variant="h6"
        sx={{ cursor: clickable ? "pointer" : "auto" }}
        color={palette.neutral.medium}
      >
        {`@${author.display_name}`}
      </Typography>
      <Typography variant="h6" color={palette.neutral.medium}>
        •
      </Typography>
      <Typography variant="h6" color={palette.neutral.medium}>
        {time ?? ""}
      </Typography>
    </Box>
  );
};

export default AuthorInfo;
