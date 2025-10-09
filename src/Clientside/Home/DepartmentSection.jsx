import React from "react";
import styled from "styled-components";
import { FaBaby, FaBone, FaHeart, FaBrain, FaStar } from "react-icons/fa";

const DepartmentsContainer = styled.section`
  background: #fafbfc;
  padding: clamp(2rem, 4vw, 5rem) 2rem;

  @media (max-width: 768px) {
    padding: clamp(1.5rem, 3.5vw, 4rem) 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 2rem 1rem;
  }
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;

  @media (max-width: 480px) {
    margin-bottom: 3rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2.8rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #4f46e5 0%, #7e22ce 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 2.3rem;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 1.2rem;
  color: #718096;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;

  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

const DepartmentsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: clamp(1rem, 2vw, 2rem);
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const DepartmentCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: clamp(1.2rem, 2vw, 2.5rem);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  transition: all 0.28s ease;
  border: 1px solid #f1f5f9;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 36px rgba(0, 0, 0, 0.09);
  }
`;

const DepartmentIcon = styled.div`
  width: clamp(60px, 8vw, 80px);
  height: clamp(60px, 8vw, 80px);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(1.6rem, 2.8vw, 2.2rem);
  margin-bottom: 1.25rem;
  background: linear-gradient(
    135deg,
    ${(props) => props.color}20 0%,
    ${(props) => props.color}40 100%
  );
  color: ${(props) => props.color};
`;

const DepartmentName = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #2d3748;

  @media (max-width: 480px) {
    font-size: 1.3rem;
  }
`;

const DepartmentDescription = styled.p`
  color: #718096;
  line-height: 1.7;
  margin-bottom: 1.5rem;
`;

const DepartmentFeatures = styled.ul`
  list-style: none;
  margin-bottom: 2rem;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  color: #4a5568;
  font-size: 0.95rem;

  &::before {
    content: "✓";
    color: #10b981;
    font-weight: bold;
  }
`;

const LearnMoreButton = styled.button`
  background: transparent;
  color: #4f46e5;
  border: 2px solid #4f46e5;
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;

  &:hover {
    background: #4f46e5;
    color: white;
    transform: translateY(-2px);
  }
`;

const departmentsData = [
  {
    name: "PEDIATRICS",
    description:
      "Specialized care for infants, children, and adolescents with compassionate pediatric experts.",
    icon: FaBaby,
    color: "#3B82F6",
    features: [
      "Child Wellness Checkups",
      "Vaccination Services",
      "Growth Monitoring",
      "Emergency Pediatric Care",
    ],
  },
  {
    name: "ORTHOPEDICS",
    description:
      "Comprehensive treatment for bone, joint, and musculoskeletal conditions with advanced surgical options.",
    icon: FaBone,
    color: "#EF4444",
    features: [
      "Joint Replacement",
      "Sports Medicine",
      "Fracture Care",
      "Arthroscopic Surgery",
    ],
  },
  {
    name: "CARDIOLOGY",
    description:
      "Expert heart and cardiovascular care with state-of-the-art diagnostic and treatment facilities.",
    icon: FaHeart,
    color: "#DC2626",
    features: [
      "Cardiac Surgery",
      "Angioplasty",
      "Pacemaker Implantation",
      "Heart Health Screening",
    ],
  },
  {
    name: "NEUROLOGY",
    description:
      "Advanced diagnosis and treatment of nervous system disorders with cutting-edge technology.",
    icon: FaBrain,
    color: "#7C3AED",
    features: [
      "Brain Surgery",
      "Stroke Treatment",
      "Epilepsy Management",
      "Neurological Rehabilitation",
    ],
  },
];

const DepartmentsSection = () => {
  return (
    <DepartmentsContainer>
      <SectionHeader>
        <SectionTitle>Our Medical Departments</SectionTitle>
        <SectionSubtitle>
          Comprehensive healthcare services across various specialties with
          expert medical professionals
        </SectionSubtitle>
      </SectionHeader>

      <DepartmentsGrid>
        {departmentsData.map((dept, index) => (
          <DepartmentCard key={index}>
            <DepartmentIcon color={dept.color}>
              <dept.icon />
            </DepartmentIcon>
            <DepartmentName>{dept.name}</DepartmentName>
            <DepartmentDescription>{dept.description}</DepartmentDescription>
            <DepartmentFeatures>
              {dept.features.map((feature, idx) => (
                <FeatureItem key={idx}>{feature}</FeatureItem>
              ))}
            </DepartmentFeatures>
            <LearnMoreButton>Learn More</LearnMoreButton>
          </DepartmentCard>
        ))}
      </DepartmentsGrid>
    </DepartmentsContainer>
  );
};

export default DepartmentsSection;
