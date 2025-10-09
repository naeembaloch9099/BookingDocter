import React from "react";
import styled from "styled-components";
import { FaEnvelope, FaPhone, FaVenusMars, FaIdCard } from "react-icons/fa";

const DoctorsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const DoctorsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const DoctorAvatarImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(79, 70, 229, 0.2);

  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
  }
`;

const DoctorCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-4px);
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const DoctorHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

const DoctorAvatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4f46e5 0%, #7e22ce 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  font-weight: 700;

  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
  }
`;

const DoctorInfo = styled.div`
  flex: 1;
`;

const DoctorName = styled.h3`
  font-size: 1.4rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.25rem;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const DoctorDepartment = styled.p`
  color: #4f46e5;
  font-weight: 600;
  font-size: 0.9rem;
`;

const DoctorDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }
`;

const DetailIcon = styled.div`
  color: #4f46e5;
  font-size: 1.1rem;
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DetailContent = styled.div`
  flex: 1;
`;

const DetailLabel = styled.span`
  color: #6b7280;
  font-size: 0.9rem;
  font-weight: 500;
`;

const DetailValue = styled.span`
  color: #1f2937;
  font-weight: 500;
  display: block;
  margin-top: 0.25rem;
`;

const DoctorsList = ({ doctors = [] }) => {
  return (
    <DoctorsContainer>
      <Header>
        <Title>DOCTORS</Title>
      </Header>

      <DoctorsGrid>
        {doctors.length === 0 ? (
          <div style={{ padding: 20 }}>No doctors found.</div>
        ) : (
          doctors.map((doctor, index) => (
            <DoctorCard key={doctor._id || index}>
              <DoctorHeader>
                {doctor.photo ? (
                  <DoctorAvatarImage
                    src={doctor.photo}
                    alt={`${doctor.name || "Doctor"} avatar`}
                  />
                ) : (
                  <DoctorAvatar>
                    {(doctor.name || "DR")
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </DoctorAvatar>
                )}
                <DoctorInfo>
                  <DoctorName>{doctor.name}</DoctorName>
                  <DoctorDepartment>
                    Department of {doctor.department}
                  </DoctorDepartment>
                </DoctorInfo>
              </DoctorHeader>

              <DoctorDetails>
                <DetailItem>
                  <DetailIcon>
                    <FaEnvelope />
                  </DetailIcon>
                  <DetailContent>
                    <DetailLabel>Email</DetailLabel>
                    <DetailValue>{doctor.email}</DetailValue>
                  </DetailContent>
                </DetailItem>

                <DetailItem>
                  <DetailIcon>
                    <FaPhone />
                  </DetailIcon>
                  <DetailContent>
                    <DetailLabel>Phone</DetailLabel>
                    <DetailValue>{doctor.phone}</DetailValue>
                  </DetailContent>
                </DetailItem>

                <DetailItem>
                  <DetailIcon>
                    <FaIdCard />
                  </DetailIcon>
                  <DetailContent>
                    <DetailLabel>NIC</DetailLabel>
                    <DetailValue>{doctor.nic}</DetailValue>
                  </DetailContent>
                </DetailItem>

                <DetailItem>
                  <DetailIcon>
                    <FaVenusMars />
                  </DetailIcon>
                  <DetailContent>
                    <DetailLabel>Gender</DetailLabel>
                    <DetailValue>{doctor.gender}</DetailValue>
                  </DetailContent>
                </DetailItem>
              </DoctorDetails>
            </DoctorCard>
          ))
        )}
      </DoctorsGrid>
    </DoctorsContainer>
  );
};

export default DoctorsList;
