import React, { useState } from "react";
import styled from "styled-components";
import {
  FaTachometerAlt,
  FaUserMd,
  FaUserPlus,
  FaStethoscope,
  FaEnvelope,
  FaSignOutAlt,
  FaTimes,
  FaCalendarCheck,
} from "react-icons/fa";

const SidebarContainer = styled.div`
  width: 280px;
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  color: white;
  min-height: 100vh;
  overflow-y: auto;
  transition: all 0.3s ease;

  /* Desktop: normal full sidebar */
  @media (min-width: 1025px) {
    width: 280px;
    transform: translateX(0);
  }

  /* Tablet: compact icons-only sidebar */
  @media (max-width: 1024px) and (min-width: 769px) {
    transform: translateX(0);
    width: 80px;
  }

  /* Mobile: overlay hidden unless opened */
  @media (max-width: 768px) {
    width: 80px;
    transform: translateX(0);
  }
`;

const SidebarHeader = styled.div`
  padding: 2rem 1.5rem;
  border-bottom: 1px solid #374151;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #4f46e5 0%, #7e22ce 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  &.logo-mobile {
    width: 44px;
    height: 44px;
  }
`;

const LogoText = styled.div`
  display: flex;
  flex-direction: column;
  @media (max-width: 1024px) {
    display: none; /* hide logo text on tablet and below */
  }
`;

const LogoTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(135deg, #4f46e5 0%, #7e22ce 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const LogoSubtitle = styled.span`
  font-size: 0.8rem;
  color: #9ca3af;
  font-weight: 500;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #9ca3af;
  font-size: 1.2rem;
  cursor: pointer;
  display: none;

  @media (max-width: 1024px) {
    display: block;
  }
`;

const MenuLabel = styled.span`
  display: inline-block;
  margin-left: 6px;
  @media (max-width: 1024px) {
    display: none; /* hide labels on tablet and mobile */
  }
`;

const SidebarMenu = styled.ul`
  list-style: none;
  padding: 1.5rem 0;
`;

const MenuItem = styled.li`
  margin-bottom: 0.5rem;
`;

const MenuButton = styled.button`
  width: 100%;
  background: ${(props) =>
    props.$active ? "rgba(79, 70, 229, 0.2)" : "transparent"};
  color: ${(props) => (props.$active ? "#4F46E5" : "#D1D5DB")};
  border: none;
  padding: 1rem 1.5rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1rem;
  font-weight: 500;
  border-right: ${(props) =>
    props.$active ? "3px solid #4F46E5" : "3px solid transparent"};

  &:hover {
    background: rgba(79, 70, 229, 0.1);
    color: #4f46e5;
  }

  @media (max-width: 768px) {
    padding: 1.2rem 1.5rem;
  }
  /* Tablet: compact icons-only appearance */
  @media (max-width: 1024px) and (min-width: 769px) {
    justify-content: center;
    gap: 0;
    padding: 0.9rem 0.4rem;
  }
`;

const MenuIcon = styled.div`
  font-size: 1.1rem;
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

/* Mobile toggle removed — layout controlled via global CSS (.admin-sidebar) */

const MobileToggleIcon = styled.button`
  background: transparent;
  border: none;
  color: #cbd5e1;
  font-size: 1.2rem;
  display: none;
  cursor: pointer;
  @media (max-width: 768px) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.25rem 0.5rem;
  }
`;

const AdminSidebar = ({ activeSection, setActiveSection, onLogout }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: FaTachometerAlt },
    { id: "doctors", label: "Doctors List", icon: FaUserMd },
    { id: "add-admin", label: "Add New Admin", icon: FaUserPlus },
    { id: "add-doctor", label: "Register Doctor", icon: FaStethoscope },
    { id: "appointments", label: "Appointments", icon: FaCalendarCheck },
    { id: "messages", label: "Messages", icon: FaEnvelope },
  ];

  const handleMenuClick = (sectionId) => {
    setActiveSection(sectionId);
    // close mobile overlay after selection
    if (mobileOpen) setMobileOpen(false);
  };

  return (
    <>
      <SidebarContainer
        className={`admin-sidebar ${mobileOpen ? "mobile-open" : ""}`}
      >
        <SidebarHeader>
          <Logo>
            <LogoIcon className="logo-mobile">Z</LogoIcon>
            <LogoText className="logo-text">
              <LogoTitle>ZEECARE</LogoTitle>
              <LogoSubtitle>MEDICAL INSTITUTE</LogoSubtitle>
            </LogoText>
          </Logo>
          <div>
            <MobileToggleIcon
              aria-label="Toggle menu"
              onClick={() => setMobileOpen((s) => !s)}
            >
              {/* small bars icon */}
              <svg
                width="18"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 6H21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3 12H21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3 18H21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </MobileToggleIcon>
          </div>
        </SidebarHeader>

        <SidebarMenu className="sidebar-menu">
          {menuItems.map((item) => (
            <MenuItem key={item.id} className="menu-item">
              <MenuButton
                className="menu-button"
                $active={activeSection === item.id}
                onClick={() => handleMenuClick(item.id)}
              >
                <MenuIcon>
                  <item.icon />
                </MenuIcon>
                <MenuLabel className="menu-label">{item.label}</MenuLabel>
              </MenuButton>
            </MenuItem>
          ))}

          <MenuItem className="menu-item">
            <MenuButton
              className="menu-button"
              onClick={() => {
                if (typeof onLogout === "function") onLogout();
                if (mobileOpen) setMobileOpen(false);
              }}
            >
              <MenuIcon>
                <FaSignOutAlt />
              </MenuIcon>
              <MenuLabel className="menu-label">Logout</MenuLabel>
            </MenuButton>
          </MenuItem>
        </SidebarMenu>
      </SidebarContainer>
    </>
  );
};

export default AdminSidebar;
