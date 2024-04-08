import { Box, Button, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Formik } from "formik";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLogin } from "src/store/slices/userSlice";
import { API_URL } from "src/utils/misc";
import * as Yup from "yup";

const registerSchema = Yup.object().shape({
  firstName: Yup.string().required("required"),
  lastName: Yup.string().required("required"),
  displayName: Yup.string().required("required"),
  email: Yup.string().email("invalid email").required("required"),
  password: Yup.string().required("required"),
  passwordConfirmation: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("required"),
  picture: Yup.string(),
});

const loginSchema = Yup.object().shape({
  email: Yup.string().email("invalid email").required("required"),
  password: Yup.string().required("required"),
});

const initialValuesRegister = {
  firstName: "",
  lastName: "",
  displayName: "",
  email: "",
  password: "",
  passwordConfirmation: "",
  picture: "",
};

const initialValuesLogin = {
  email: "",
  password: "",
};

const Form = ({ setErrorMsg }) => {
  const [pageType, setPageType] = useState("login");
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isDesktopScreen = useMediaQuery("(min-width: 768px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";

  const register = async (values, onSubmitProps) => {
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }

    const savedUserResponse = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      body: formData,
    });

    const savedUser = await savedUserResponse.json();
    onSubmitProps.resetForm();

    if (savedUser) {
      setPageType("login");
    }
  };

  const login = async (values, onSubmitProps) => {
    console.log(values);
    const loggedInResponse = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const loggedIn = await loggedInResponse.json();
    if (typeof onSubmitProps !== "undefined") {
      onSubmitProps?.resetForm();
    }
    if (loggedInResponse.status === 200) {
      dispatch(
        setLogin({
          user: loggedIn.user,
          token: loggedIn.token,
        })
      );
      navigate("/home");
    } else {
      setErrorMsg(loggedIn.msg);
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
      validationSchema={isLogin ? loginSchema : registerSchema}
    >
      {({ values, errors, touched, handleBlur, handleChange, handleSubmit, resetForm }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(2, minmax(0,1fr))"
            sx={{
              "& > div": { gridColumn: isDesktopScreen ? undefined : "span 2" },
            }}
          >
            {isRegister && (
              <>
                <TextField
                  label="First Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.firstName}
                  name="firstName"
                  error={Boolean(touched.firstName) && Boolean(errors.firstName)}
                  helperText={touched.firstName && errors.firstName}
                  sx={{ gridColumn: "span 1" }}
                />
                <TextField
                  label="Last Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName}
                  name="lastName"
                  error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  sx={{ gridColumn: "span 1" }}
                />
                <TextField
                  label="Display Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.displayName}
                  name="displayName"
                  error={Boolean(touched.displayName) && Boolean(errors.displayName)}
                  helperText={touched.displayName && errors.displayName}
                  sx={{ gridColumn: "span 2" }}
                />

                <TextField
                  label="Email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  name="email"
                  error={Boolean(touched.email) && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  sx={{ gridColumn: "span 2" }}
                />

                <TextField
                  label="Password"
                  type="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  name="password"
                  error={Boolean(touched.password) && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Verify Password"
                  type="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.passwordConfirmation}
                  name="passwordConfirmation"
                  error={
                    Boolean(touched.passwordConfirmation) && Boolean(errors.passwordConfirmation)
                  }
                  helperText={touched.passwordConfirmation && errors.passwordConfirmation}
                  sx={{ gridColumn: "span 2" }}
                />
              </>
            )}
          </Box>

          {isLogin && (
            <Box
              display="grid"
              gap="1rem"
              gridTemplateColumns="repeat(2, minmax(0,1fr))"
              sx={{
                "& > div": {
                  gridColumn: isDesktopScreen ? undefined : "span 2",
                },
              }}
            >
              <TextField
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={Boolean(touched.email) && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                label="Password"
                type="password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={Boolean(touched.password) && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
          )}

          <Box>
            <Button
              fullWidth
              type="submit"
              sx={{
                m: "2rem 0rem 0rem 0rem",
                p: "1rem",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                border: "1px solid transparent",
                "&:hover": {
                  color: palette.primary.main,
                  backgroundColor: palette.background.alt,
                  border: `1px solid ${palette.primary.main}`,
                },
              }}
            >
              {isLogin ? "LOGIN" : "REGISTER"}
            </Button>
            {isLogin && (
              <Button
                fullWidth
                onClick={() => login({ email: "zach.salvaggio@gmail.com", password: "password" })}
                sx={{
                  m: "1rem 0rem 1rem 0",
                  p: "1rem",
                  backgroundColor: "white",
                  color: palette.primary.main,
                  border: `1px solid ${palette.primary.main}`,
                  "&:hover": {
                    backgroundColor: palette.primary.main,
                    color: palette.background.alt,
                    border: "1px solid transparent",
                  },
                }}
              >
                {"LOGIN WITH DEMO ACCOUNT"}
              </Button>
            )}
            <Typography
              onClick={() => {
                setPageType(isLogin ? "register" : "login");
                resetForm();
              }}
              sx={{
                textDecoration: "underline",
                color: palette.primary.main,
                "&:hover": {
                  cursor: "pointer",
                },
              }}
            >
              {isLogin
                ? "Don't have an account? Sign up here."
                : " Already have an account? Login here."}
            </Typography>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default Form;
