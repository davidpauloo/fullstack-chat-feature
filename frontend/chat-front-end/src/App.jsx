import React, { useEffect } from "react";
// Import Router components
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// Components & Pages
import Navbar from "./components/Navbar";
import SideBarMain from "./components/SideBarMain.jsx"; // Main application sidebar (collapsible)
import SignUpPage from "./pages/SignUpPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import ProjectPage from "./pages/ProjectPage";
import DashboardPage from "./pages/Dashboard.jsx";
// Import other pages like PayrollPage, VideoConferencePage, FileHandlingPage if they exist
import PayrollPage from "./pages/PayrollPage.jsx";
import VideoConferencePage from "./pages/VideoConferencePage.jsx";
import FileHandlingPage from "./pages/FileHandlingPage.jsx";
import ProjectDetailsPage from "./pages/ProjectDetails.jsx";


// State & Utils
// import { axiosInstance } from "./lib/axios"; // Uncomment if used directly in App.jsx
import { useAuthStore } from "./store/useAuthStore";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useThemeStore } from "./store/useThemeStore";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();
  const location = useLocation();

  console.log({onlineUsers});

  useEffect(() => {
    // Check authentication status when the app loads or checkAuth changes
    checkAuth();
  }, [checkAuth]);

  console.log("Current authUser state:", authUser); // Log authUser state for debugging

  // Show loader only during the initial authentication check
  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen bg-base-200">
        <Loader className="size-10 animate-spin text-primary" />
      </div>
    );
  }

  // Define routes that should NOT have the main sidebar/navbar layout
  const noLayoutRoutes = ['/login', '/signup'];
  // Determine if the main layout (Navbar + Sidebar) should be shown
  const showLayout = authUser && !noLayoutRoutes.includes(location.pathname);

  return (
    // Ensure the root div also flexes and takes full height if App is the true root
    <div data-theme={theme} className="flex flex-col h-screen">
      {/* Conditionally render the main layout */}
      {showLayout ? (
        // Layout for authenticated users (Navbar + Sidebar + Page Content)
        <> {/* Using fragment as direct child of conditional rendering */}
          <Navbar /> {/* This is fixed, h-16 (4rem) */}
          {/* ***** MODIFICATION HERE ***** */}
          {/* This div takes remaining height AND needs padding-top to clear the fixed Navbar */}
          <div className="flex flex-1 overflow-hidden pt-16"> {/* Assuming Navbar is h-16 (4rem) */}
            <SideBarMain /> {/* Use the collapsible main application sidebar */}
            {/* Main content area where routed pages will render */}
            {/* Padding here (p-6 md:p-8) is for *internal* spacing of the content within this main area */}
            <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-base-200">
              <Routes>
                {/* Authenticated Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/projects" element={<ProjectPage />} />
                <Route path="/projects/:id" element={<ProjectDetailsPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/payroll" element={<PayrollPage />}/>
                <Route path="/video-meetings" element={<VideoConferencePage/>} />
                <Route path="/file-handling" element={<FileHandlingPage/>}/>
                {/* Add other authenticated routes here */}

                {/* Fallback redirect for any unknown authenticated path */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </main>
          </div>
        </>
      ) : (
        // Render routes without the main layout (Login, Signup, or redirects)
        <Routes>
          <Route
            path="/signup"
            // Show Signup only if not logged in, else redirect to dashboard
            element={!authUser ? <SignUpPage /> : <Navigate to="/dashboard" replace />}
          />
          <Route
            path="/login"
            // Show Login only if not logged in, else redirect to dashboard
            element={!authUser ? <LoginPage /> : <Navigate to="/dashboard" replace />}
          />
          {/* If not logged in and path is not /login or /signup, redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
      {/* Toaster is available globally */}
      <Toaster />
    </div>
  );
};

export default App;
