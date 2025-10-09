import React from "react";
import styled from "styled-components";
import { FaStethoscope, FaHeartbeat, FaCalendarCheck } from "react-icons/fa";

const HeroContainer = styled.section`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 6rem 2rem 4rem;
  text-align: center;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 5rem 1.5rem 3rem;
  }

  @media (max-width: 480px) {
    padding: 4rem 1rem 2rem;
  }
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
`;

const HeroTitle = styled.h1`
  /* fluid scale between 2rem and 3.5rem */
  font-size: clamp(2rem, 4.5vw, 3.5rem);
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.15;
`;

const HeroSubtitle = styled.h2`
  font-size: clamp(1.2rem, 2.2vw, 1.8rem);
  font-weight: 600;
  margin-bottom: 2rem;
  opacity: 0.95;
`;

const HeroDescription = styled.p`
  font-size: clamp(1rem, 1.3vw, 1.2rem);
  margin-bottom: 3rem;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.7;
  opacity: 0.95;
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 3rem;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
`;

const PrimaryButton = styled.button`
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
  color: white;
  border: none;
  padding: 1.2rem 2.5rem;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  box-shadow: 0 8px 25px rgba(255, 107, 107, 0.3);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px rgba(255, 107, 107, 0.4);
  }

  @media (max-width: 480px) {
    padding: 1rem 2rem;
    font-size: 1rem;
    width: 100%;
    max-width: 280px;
    justify-content: center;
  }
`;

const SecondaryButton = styled.button`
  background: transparent;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 1.2rem 2.5rem;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.8rem;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-2px);
  }

  @media (max-width: 480px) {
    padding: 1rem 2rem;
    font-size: 1rem;
    width: 100%;
    max-width: 280px;
    justify-content: center;
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  max-width: 1000px;
  margin: 0 auto;

  @media (max-width: 768px) {
    gap: 1rem;
    max-width: 480px;
  }
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(8px);
  padding: clamp(1rem, 2vw, 2rem);
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.12);
`;

const StatIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #ffd93d;

  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 0.5rem;

  @media (max-width: 480px) {
    font-size: 1.8rem;
  }
`;

const StatLabel = styled.div`
  font-size: 1rem;
  opacity: 0.9;

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const HeroSection = ({ onBookAppointment }) => {
  return (
    <HeroContainer>
      <HeroContent>
        <HeroTitle>Welcome to ZeeCare Medical Institute</HeroTitle>
        <HeroSubtitle>Your Trusted Healthcare Provider</HeroSubtitle>
        <HeroDescription>
          ZeeCare Medical Institute is a state-of-the-art facility dedicated to
          providing comprehensive healthcare services with compassion and
          expertise. Our team of skilled professionals is committed to
          delivering personalized care tailored to each patient's needs.
        </HeroDescription>

        <CTAButtons>
          <PrimaryButton onClick={onBookAppointment}>
            <FaCalendarCheck />
            Book Appointment Now
          </PrimaryButton>
          <SecondaryButton>
            <FaStethoscope />
            Our Services
          </SecondaryButton>
        </CTAButtons>

        <StatsContainer>
          <StatCard>
            <StatIcon>
              <FaHeartbeat />
            </StatIcon>
            <StatNumber>50,000+</StatNumber>
            <StatLabel>Patients Treated</StatLabel>
          </StatCard>
          <StatCard>
            <StatIcon>
              <FaStethoscope />
            </StatIcon>
            <StatNumber>200+</StatNumber>
            <StatLabel>Expert Doctors</StatLabel>
          </StatCard>
          <StatCard>
            <StatIcon>
              <FaCalendarCheck />
            </StatIcon>
            <StatNumber>24/7</StatNumber>
            <StatLabel>Emergency Care</StatLabel>
          </StatCard>
        </StatsContainer>
      </HeroContent>
    </HeroContainer>
  );
};

export default HeroSection;
