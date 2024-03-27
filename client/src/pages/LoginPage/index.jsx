import { Alert, Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";
import Form from "./form";

const LoginPage = () => {
  const [errorMsg, setErrorMsg] = useState("");
  const theme = useTheme();
  const isDesktopScreen = useMediaQuery("(min-width: 1000px)");
  return (
    <Box>
      <Box
        width="100%"
        backgroundColor={theme.palette.background.alt}
        p="1rem 6%"
        textAlign="center"
      >
        <Typography fontWeight="bold" fontSize="32px" color="primary">
          Friendly
        </Typography>
      </Box>

      <Box
        width={isDesktopScreen ? "50%" : "90%"}
        p="2rem"
        m="5rem auto"
        borderRadius="1.5rem"
        backgroundColor={theme.palette.background.alt}
      >
        <Typography fontWeight="500" variant="h5" sx={{}}>
          Welcome to Friendly!
        </Typography>
        <Box display="flex" flexDirection="column" gap="0.25rem" py="1rem" fontWeight="300">
          <Typography style={{ color: theme.palette.neutral.medium }} variant="h8">
            Demo Email: demo@gmail.com
          </Typography>
          <Typography style={{ color: theme.palette.neutral.medium }} variant="h8">
            Demo Password: demo123
          </Typography>
        </Box>
        {errorMsg && (
          <Alert severity="error" sx={{ fontSize: "inherit", mb: "1.5rem" }}>
            {errorMsg}
          </Alert>
        )}
        <Form setErrorMsg={setErrorMsg} />
      </Box>
    </Box>
  );
};

export default LoginPage;
