import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled, { createGlobalStyle } from "styled-components";
import Home from "./Clientside/Homepage";
import LoginPage from "./Clientside/Login";
import SignupPage from "./Clientside/Signup";
import AppointmentModal from "./Clientside/Appointement";
import NavBar from "./Clientside/NavBar";
import AdminDashboard from "./Admin/AdminDashboard";

// Global Styles
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    line-height: 1.6;
    color: #1F2937;
    overflow-x: hidden;
    background: #FAFBFC;
  }

  html {
    scroll-behavior: smooth;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    outline: none;
  }

  input, textarea, select {
    font-family: inherit;
    border: none;
    outline: none;
  }

  /* Responsive breakpoints */
  @media (max-width: 1200px) {
    body {
      font-size: 15px;
    }
  }

  @media (max-width: 768px) {
    body {
      font-size: 14px;
    }
  }

  @media (max-width: 480px) {
    body {
      font-size: 13px;
    }
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
`;

const App = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginStandalone, setIsLoginStandalone] = useState(false);
  const [isSignupStandalone, setIsSignupStandalone] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [userRole, setUserRole] = useState("user"); // 'user' or 'admin'

  // Navigation handlers
  const navigateToHome = () => {
    setCurrentPage("home");
    setUserRole("user");
  };

  const navigateToLogin = (standalone = true) => {
    setIsLoginStandalone(!!standalone);
    setCurrentPage("login");
  };

  const navigateToSignup = (standalone = true) => {
    setIsSignupStandalone(!!standalone);
    setCurrentPage("signup");
  };

  const navigateToAdmin = () => {
    setCurrentPage("admin");
    setUserRole("admin");
  };

  const openAppointmentModal = () => setIsAppointmentModalOpen(true);
  const closeAppointmentModal = () => setIsAppointmentModalOpen(false);

  const handleLogin = (details) => {
    let token;
    let userObj = { role: "user" };

    if (details && typeof details === "object") {
      if (details.user) {
        userObj = { ...details.user };
      } else {
        userObj = {
          role: details.role || details.roleId || "user",
          name: details.name,
          email: details.email,
        };
      }
      token = details.token;
    } else if (typeof details === "string") {
      userObj = { role: details };
    }

    const resolvedRole = userObj.role || "user";
    setUserRole(resolvedRole);
    setIsLoggedIn(true);

    try {
      window.__APP_USER__ = userObj;
      if (token) {
        window.__APP_TOKEN__ = token;
        window.localStorage?.setItem("app_token", token);
      }
    } catch {
      /* ignore */
    }

    showSuccess(`Logged in successfully as ${resolvedRole}`);

    if (resolvedRole === "admin") {
      setCurrentPage("admin");
    } else {
      setCurrentPage("home");
    }
  };

  const handleLogout = (targetPageOrEvent) => {
    let targetPage = "home";

    if (typeof targetPageOrEvent === "string") {
      targetPage = targetPageOrEvent;
    } else if (
      targetPageOrEvent &&
      typeof targetPageOrEvent.preventDefault === "function"
    ) {
      targetPageOrEvent.preventDefault();
    }

    setIsLoggedIn(false);
    setUserRole("user");
    showSuccess("Logged out successfully");
    setCurrentPage(targetPage);
    try {
      delete window.__APP_USER__;
      delete window.__APP_TOKEN__;
      window.localStorage?.removeItem("app_token");
    } catch {
      /* ignore */
    }
  };

  // Toast functions
  const showSuccess = (message) => toast.success(message);
  const showError = (message) => toast.error(message);
  const showInfo = (message) => toast.info(message);
  const showWarning = (message) => toast.warning(message);

  // Expose global toast helpers for deeply nested components
  useEffect(() => {
    try {
      window.__APP_TOAST__ = {
        success: showSuccess,
        error: showError,
        info: showInfo,
        warning: showWarning,
      };
    } catch {
      /* ignore (server-side or restricted envs) */
    }

    return () => {
      try {
        delete window.__APP_TOAST__;
      } catch {
        /* ignore */
      }
    };
  }, []);

  // Check if current page should show navbar
  const shouldShowNavbar = () => {
    if (currentPage === "admin") return false;
    if (currentPage === "login" && isLoginStandalone) return false;
    if (currentPage === "signup" && isSignupStandalone) return false;
    return true;
  };

  // Render current page
  const renderCurrentPage = () => {
    switch (currentPage) {
      case "home":
        return (
          <Home
            onNavigateToLogin={navigateToLogin}
            onNavigateToSignup={navigateToSignup}
            onOpenAppointment={openAppointmentModal}
            isLoggedIn={isLoggedIn}
            onLogout={handleLogout}
            showSuccess={showSuccess}
            showError={showError}
            userRole={userRole}
            onNavigateToAdmin={navigateToAdmin}
          />
        );
      case "login":
        return (
          <LoginPage
            onNavigateToHome={navigateToHome}
            onSwitchToSignup={navigateToSignup}
            showSuccess={showSuccess}
            showError={showError}
            showInfo={showInfo}
            onLogin={handleLogin}
            isLoggedIn={isLoggedIn}
            onLogout={handleLogout}
            standalone={isLoginStandalone}
            userRole={userRole}
            onNavigateToAdmin={navigateToAdmin}
          />
        );
      case "signup":
        return (
          <SignupPage
            onSwitchToLogin={navigateToLogin}
            onNavigateToHome={navigateToHome}
            showSuccess={showSuccess}
            showError={showError}
            showInfo={showInfo}
            isLoggedIn={isLoggedIn}
            onLogout={handleLogout}
            onLogin={handleLogin}
            standalone={isSignupStandalone}
            userRole={userRole}
          />
        );
      case "admin":
        return (
          <AdminDashboard
            onLogout={() => handleLogout("login")}
            onNavigateToHome={navigateToHome}
            showSuccess={showSuccess}
            showError={showError}
            userRole={userRole}
          />
        );
      default:
        return (
          <Home
            onNavigateToLogin={navigateToLogin}
            onNavigateToSignup={navigateToSignup}
            onOpenAppointment={openAppointmentModal}
            isLoggedIn={isLoggedIn}
            onLogout={handleLogout}
            showSuccess={showSuccess}
            showError={showError}
            userRole={userRole}
            onNavigateToAdmin={navigateToAdmin}
          />
        );
    }
  };

  return (
    <AppContainer>
      <GlobalStyle />

      {/* Render NavBar unless we're on admin or standalone auth pages */}
      {shouldShowNavbar() && (
        <NavBar
          onNavigateToLogin={navigateToLogin}
          onNavigateToSignup={navigateToSignup}
          onOpenAppointment={openAppointmentModal}
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
          onNavigateToHome={navigateToHome}
          userRole={userRole}
          onNavigateToAdmin={navigateToAdmin}
          showSuccess={showSuccess}
          showError={showError}
        />
      )}

      {renderCurrentPage()}

      {/* Global Appointment Modal */}
      <AppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={closeAppointmentModal}
        showSuccess={showSuccess}
        showError={showError}
        showInfo={showInfo}
      />

      {/* Global Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{
          fontSize: "14px",
        }}
      />
    </AppContainer>
  );
};

export default App;
