import React from "react";
import styled from "styled-components";

const AboutContainer = styled.section`
  padding: clamp(2rem, 4vw, 6rem) 2rem;
  max-width: 1100px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: clamp(1.6rem, 2.8vw, 2.6rem);
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: clamp(1rem, 1.2vw, 1.1rem);
  color: #6b7280;
  margin-bottom: 2rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Content = styled.div``;

const Sidebar = styled.aside`
  background: linear-gradient(135deg, #4f46e5 0%, #7e22ce 100%);
  color: white;
  border-radius: 12px;
  padding: 1.5rem;
`;

const About = () => {
  return (
    <AboutContainer>
      <Title>About ZeeCare Medical Institute</Title>
      <Subtitle>
        Providing compassionate, modern healthcare with expert clinicians and a
        patient-first approach.
      </Subtitle>

      <Grid>
        <Content>
          <h3>Our Mission</h3>
          <p>
            To provide accessible, high-quality healthcare that improves the
            health and well-being of our community through prevention,
            diagnosis, and treatment delivered with compassion.
          </p>

          <h3>Our Vision</h3>
          <p>
            To be a leading regional healthcare provider known for clinical
            excellence, innovation, and exceptional patient experience.
          </p>

          <h3>Core Values</h3>
          <ul>
            <li>Patient-centered care</li>
            <li>Integrity and transparency</li>
            <li>Continuous improvement</li>
            <li>Collaboration and respect</li>
          </ul>
        </Content>

        <Sidebar>
          <h4>Contact Us</h4>
          <p>919-979-9999</p>
          <p>zee5eb@gmail.com</p>
          <p>Kanichi, Pakistan</p>
        </Sidebar>
      </Grid>
    </AboutContainer>
  );
};

export default About;
