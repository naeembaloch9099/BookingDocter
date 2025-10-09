import React from "react";
import styled from "styled-components";
import HeroSection from "./Home/Hero";
import DepartmentsSection from "./Home/DepartmentSection";
import BiographySection from "./Home/BiographySection";
import ContactSection from "./Home/ContactSection";
import FooterSection from "./Home/FooterSection";

const Container = styled.div`
  font-family: "Inter", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  color: #2d3748;
  line-height: 1.6;
`;

import { NAV_HEIGHT } from "./NavBar";

const Home = ({ onNavigateToLogin, onNavigateToSignup, onOpenAppointment }) => {
  return (
    <Container>
      <div style={{ paddingTop: NAV_HEIGHT }}>
        <HeroSection onBookAppointment={onOpenAppointment} />
        <DepartmentsSection />
        <div id="about">
          <BiographySection />
        </div>
        <ContactSection />
        <FooterSection
          onBookAppointment={onOpenAppointment}
          onNavigateToLogin={onNavigateToLogin}
          onNavigateToSignup={onNavigateToSignup}
        />
      </div>
    </Container>
  );
};

export default Home;
