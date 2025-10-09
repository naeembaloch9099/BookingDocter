import React from "react";
import styled from "styled-components";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebook,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";

const FooterContainer = styled.footer`
  background: #2c3e50;
  color: #fff;
  padding: 3rem 1rem 1rem;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const FooterSectionStyled = styled.div`
  h3 {
    color: #1a73e8;
    margin-bottom: 1rem;
    font-size: 1.3rem;
  }

  ul {
    list-style: none;
    padding: 0;

    li {
      margin-bottom: 0.5rem;

      a {
        color: #ddd;
        text-decoration: none;
        font-size: 0.95rem;
        transition: color 0.3s;

        &:hover {
          color: #1a73e8;
        }
      }
    }
  }

  p {
    font-size: 0.95rem;
    color: #ccc;
    line-height: 1.5;
  }
`;

const HoursGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.4rem;
  font-size: 0.9rem;
  color: #ccc;
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;

  div {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-size: 0.95rem;
    color: #ccc;
  }
`;

const AppointmentButton = styled.button`
  background: #ff6b35;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
  width: 100%;
  transition: background 0.3s ease;

  &:hover {
    background: #e55a2b;
  }
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;

  a {
    color: #ddd;
    font-size: 1.3rem;
    transition: color 0.3s;

    &:hover {
      color: #1a73e8;
    }
  }
`;

const Copyright = styled.div`
  text-align: center;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #555;
  color: #aaa;
  font-size: 0.85rem;
`;

const FooterSection = ({ onBookAppointment }) => {
  return (
    <FooterContainer>
      <FooterContent>
        {/* About Section */}
        <FooterSectionStyled>
          <h3>ZEECARE</h3>
          <p>
            Your trusted healthcare provider dedicated to comprehensive medical
            services and personalized patient care.
          </p>
          <AppointmentButton onClick={onBookAppointment}>
            Book Appointment
          </AppointmentButton>
          <SocialIcons>
            <a href="https://facebook.com" aria-label="Facebook">
              <FaFacebook />
            </a>
            <a href="https://instagram.com" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://twitter.com" aria-label="Twitter">
              <FaTwitter />
            </a>
          </SocialIcons>
        </FooterSectionStyled>

        {/* Quick Links */}
        <FooterSectionStyled>
          <h3>Quick Links</h3>
          <ul>
            <li>
              <a href="#home">Home</a>
            </li>
            <li>
              <a href="#appointment">Appointment</a>
            </li>
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a href="#departments">Departments</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
          </ul>
        </FooterSectionStyled>

        {/* Hours */}
        <FooterSectionStyled>
          <h3>Hours</h3>
          <HoursGrid>
            <div>Monday</div>
            <div>8:00 AM - 9:00 PM</div>
            <div>Tuesday</div>
            <div>9:00 AM - 10:00 PM</div>
            <div>Wednesday</div>
            <div>10:00 AM - 10:00 PM</div>
            <div>Thursday</div>
            <div>9:00 AM - 9:00 PM</div>
            <div>Saturday</div>
            <div>8:00 AM - 10:00 PM</div>
          </HoursGrid>
        </FooterSectionStyled>

        {/* Contact Info */}
        <FooterSectionStyled>
          <h3>Contact</h3>
          <ContactInfo>
            <div>
              <FaPhoneAlt /> 919-979-9999
            </div>
            <div>
              <FaEnvelope /> zee5eb@gmail.com
            </div>
            <div>
              <FaMapMarkerAlt /> Kanichi, Pakistan
            </div>
          </ContactInfo>
        </FooterSectionStyled>
      </FooterContent>

      {/* Copyright */}
      <Copyright>
        &copy; {new Date().getFullYear()} ZeeCare Medical Institute. All rights
        reserved.
      </Copyright>
    </FooterContainer>
  );
};

export default FooterSection;
