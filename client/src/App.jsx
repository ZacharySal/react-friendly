import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { Suspense, lazy, useMemo } from "react";
import { Oval } from "react-loader-spinner";
import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import Layout from "src/components/Layout";
import ScrollToTop from "src/components/ScrollToTop";
import LoginPage from "src/pages/Login";
import { themeSettings } from "src/providers/theme";

const HomePage = lazy(() => import("src/pages/Home"));
const PostPage = lazy(() => import("src/pages/FullPost"));
const ProfilePage = lazy(() => import("src/pages/Profile"));
const BookmarksPage = lazy(() => import("src/pages/Bookmarks"));

function App() {
  const mode = useSelector((state) => state.app.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuthorized = Boolean(useSelector((state) => state.user.token));

  return (
    <div className="App">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route element={<PageWrapper />}>
              <Route path="/home" element={isAuthorized ? <HomePage /> : <Navigate to="/" />} />
              <Route
                path="/post/:post_id"
                element={isAuthorized ? <PostPage /> : <Navigate to="/" />}
              />
              <Route
                path="/profile/:user_id"
                element={isAuthorized ? <ProfilePage /> : <Navigate to="/" />}
              />
              <Route
                path="/bookmarks"
                element={isAuthorized ? <BookmarksPage /> : <Navigate to="/" />}
              />
            </Route>
          </Routes>
        </ThemeProvider>
        <ScrollToTop />
      </BrowserRouter>
    </div>
  );
}

const PageWrapper = ({}) => {
  return (
    <Suspense
      fallback={
        <Layout>
          <Oval
            visible={true}
            height="50"
            width="50"
            color="#1DA1F2"
            secondaryColor="#FAFAFA"
            ariaLabel="oval-loading"
            wrapperStyle={{}}
            wrapperClass="min-w-screen min-h-screen border flex justify-center items-center"
          />
        </Layout>
      }
    >
      <Layout>
        <Outlet />
      </Layout>
    </Suspense>
  );
};

export default App;
