import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "theme";
import HomePage from "scenes/homePage";
import LoginPage from "scenes/loginPage";
import ProfilePage from "scenes/profilePage";
import { fetchPosts } from "app/postsSlice";

function App() {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.user.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuthorized = Boolean(useSelector((state) => state.user.token));

  if (isAuthorized) {
    dispatch(fetchPosts());
  }

  return (
    <div className="App">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/home" element={isAuthorized ? <HomePage /> : <Navigate to="/" />} />
            <Route path="/profile/:userId" element={isAuthorized ? <ProfilePage /> : <Navigate to="/" />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
