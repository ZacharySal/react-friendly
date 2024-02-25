import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ModalContextProvider from "./contexts/ModalContext";
import HomePage from "./scenes/homePage";
import LoginPage from "./scenes/loginPage";
import PostPage from "./scenes/postPage";
import ProfilePage from "./scenes/profilePage";
import { fetchPosts } from "./store/postsSlice";
import { themeSettings } from "./theme";

function App() {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.user.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuthorized = Boolean(useSelector((state) => state.user.token));

  // TODO: fix this line

  if (isAuthorized) {
    dispatch(fetchPosts());
  }

  return (
    <div className="App">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <ModalContextProvider>
            <CssBaseline />
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/home" element={isAuthorized ? <HomePage /> : <Navigate to="/" />} />
              <Route
                path="/post/:post_id"
                element={isAuthorized ? <PostPage /> : <Navigate to="/" />}
              />
              <Route
                path="/profile/:user_id"
                element={isAuthorized ? <ProfilePage /> : <Navigate to="/" />}
              />
            </Routes>
          </ModalContextProvider>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
