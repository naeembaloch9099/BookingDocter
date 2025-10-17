import React, { useState } from "react";
import styled from "styled-components";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPaperPlane,
} from "react-icons/fa";
import { jsonFetch } from "../../utils/api";

const ContactContainer = styled.section`
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  padding: clamp(2rem, 4vw, 5rem) 2rem;

  @media (max-width: 768px) {
    padding: clamp(1.5rem, 3.5vw, 4rem) 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 2rem 1rem;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  padding: clamp(1.5rem, 3vw, 4rem);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);

  @media (max-width: 768px) {
    padding: clamp(1.2rem, 2.5vw, 3rem);
  }

  @media (max-width: 480px) {
    padding: 1.5rem;
    border-radius: 16px;
  }
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;

  @media (max-width: 480px) {
    margin-bottom: 2.5rem;
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

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(1.5rem, 3vw, 4rem);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
  padding: 1.25rem;
  background: #f8fafc;
  border-radius: 14px;
  transition: all 0.22s ease;

  &:hover {
    background: #f1f5f9;
    transform: translateX(4px);
  }
`;

const ContactIcon = styled.div`
  width: clamp(48px, 7vw, 60px);
  height: clamp(48px, 7vw, 60px);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(1.1rem, 2.4vw, 1.5rem);
  background: linear-gradient(135deg, #4f46e5 0%, #7e22ce 100%);
  color: white;
  flex-shrink: 0;
`;

const ContactText = styled.div`
  flex: 1;
`;

const ContactLabel = styled.h4`
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #2d3748;
`;

const ContactValue = styled.p`
  color: #718096;
  line-height: 1.6;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #2d3748;
  font-size: 0.95rem;
`;

const Input = styled.input`
  padding: 0.95rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.98rem;
  transition: all 0.2s ease;
  background: #f8fafc;

  &:focus {
    outline: none;
    border-color: #4f46e5;
    background: white;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.08);
  }

  &::placeholder {
    color: #a0aec0;
  }
`;

const TextArea = styled.textarea`
  padding: 1rem 1.2rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  transition: all 0.3s ease;
  background: #f8fafc;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #4f46e5;
    background: white;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }

  &::placeholder {
    color: #a0aec0;
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #4f46e5 0%, #7e22ce 100%);
  color: white;
  border: none;
  padding: 1.2rem 2rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  box-shadow: 0 8px 25px rgba(79, 70, 229, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 35px rgba(79, 70, 229, 0.4);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.65;
    transform: none;
    box-shadow: none;
  }

  @media (max-width: 480px) {
    padding: 1rem 1.5rem;
    font-size: 1rem;
  }
`;

const ContactSection = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const payload = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      phone: formData.mobileNumber.trim(),
      message: formData.message.trim(),
    };

    console.log("[CONTACT FORM] Submitting", payload);

    setIsSubmitting(true);
    try {
      await jsonFetch("/api/messages", {
        method: "POST",
        body: payload,
      });

      const name = payload.firstName || "friend";
      if (
        window.__APP_TOAST__ &&
        typeof window.__APP_TOAST__.success === "function"
      ) {
        window.__APP_TOAST__.success(`Thank you ${name} for your message!`);
      } else {
        alert(`Thank you ${name} for your message!`);
      }

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        mobileNumber: "",
        message: "",
      });
    } catch (error) {
      console.error("[CONTACT FORM] Submission failed", error);
      const errorMessage = error?.message || "Failed to send your message.";
      if (
        window.__APP_TOAST__ &&
        typeof window.__APP_TOAST__.error === "function"
      ) {
        window.__APP_TOAST__.error(errorMessage);
      } else {
        alert(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ContactContainer>
      <ContentWrapper>
        <SectionHeader>
          <SectionTitle>Send Us A Message</SectionTitle>
          <SectionSubtitle>
            Get in touch with us for any inquiries or appointments. We're here
            to help you.
          </SectionSubtitle>
        </SectionHeader>

        <ContactGrid>
          <ContactInfo>
            <ContactItem>
              <ContactIcon>
                <FaPhone />
              </ContactIcon>
              <ContactText>
                <ContactLabel>Phone Number</ContactLabel>
                <ContactValue>919-979-9999</ContactValue>
              </ContactText>
            </ContactItem>

            <ContactItem>
              <ContactIcon>
                <FaEnvelope />
              </ContactIcon>
              <ContactText>
                <ContactLabel>Email Address</ContactLabel>
                <ContactValue>zee5eb@gmail.com</ContactValue>
              </ContactText>
            </ContactItem>

            <ContactItem>
              <ContactIcon>
                <FaMapMarkerAlt />
              </ContactIcon>
              <ContactText>
                <ContactLabel>Our Location</ContactLabel>
                <ContactValue>Kanichi, Pakistan</ContactValue>
              </ContactText>
            </ContactItem>
          </ContactInfo>

          <Form onSubmit={handleSubmit}>
            <FormRow>
              <FormGroup>
                <Label>First Name</Label>
                <Input
                  type="text"
                  name="firstName"
                  placeholder="Your first name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Last Name</Label>
                <Input
                  type="text"
                  name="lastName"
                  placeholder="Your last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label>Email</Label>
                <Input
                  type="email"
                  name="email"
                  placeholder="Your email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Mobile Number</Label>
                <Input
                  type="tel"
                  name="mobileNumber"
                  placeholder="Your mobile number"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
            </FormRow>

            <FormGroup>
              <Label>Message</Label>
              <TextArea
                name="message"
                placeholder="Your message here..."
                value={formData.message}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <SubmitButton type="submit" disabled={isSubmitting}>
              <FaPaperPlane />
              {isSubmitting ? "Sending..." : "Send Message"}
            </SubmitButton>
          </Form>
        </ContactGrid>
      </ContentWrapper>
    </ContactContainer>
  );
};

export default ContactSection;
