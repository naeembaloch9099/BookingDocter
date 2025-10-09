import React, { useState, useEffect, useMemo } from "react";
import styled, { keyframes } from "styled-components";
import { FaTimes, FaCheck, FaExclamationTriangle } from "react-icons/fa";
import { jsonFetch } from "../utils/api";

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 10px;
  padding: clamp(1rem, 2.5vw, 2rem);
  width: 92%;
  max-width: 720px;
  max-height: 92vh;
  overflow-y: auto;
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.15);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  border-bottom: 2px solid #1a73e8;
  padding-bottom: 0.75rem;
`;

const ModalTitle = styled.h2`
  color: #1a73e8;
  margin: 0;
  font-size: 1.5rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;

  &:hover {
    color: #1a73e8;
  }
`;

const Form = styled.form`
  display: grid;
  gap: 0.9rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.9rem;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 0.4rem;
  font-weight: 600;
  color: #222;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.95rem;
`;

const RequiredStar = styled.span`
  color: #e53935;
`;

const Input = styled.input`
  padding: 0.7rem 0.9rem;
  border: 1px solid ${(props) => (props.hasError ? "#e53935" : "#ddd")};
  border-radius: 6px;
  font-size: 0.98rem;

  &:focus {
    outline: none;
    border-color: ${(props) => (props.hasError ? "#e53935" : "#1a73e8")};
    box-shadow: 0 0 0 2px
      ${(props) =>
        props.hasError ? "rgba(229, 57, 53, 0.12)" : "rgba(26, 115, 232, 0.1)"};
  }
`;

const Select = styled.select`
  padding: 0.7rem 0.9rem;
  border: 1px solid ${(props) => (props.hasError ? "#e53935" : "#ddd")};
  border-radius: 6px;
  font-size: 0.98rem;
  background: white;

  &:focus {
    outline: none;
    border-color: ${(props) => (props.hasError ? "#e53935" : "#1a73e8")};
    box-shadow: 0 0 0 2px
      ${(props) =>
        props.hasError ? "rgba(229, 57, 53, 0.12)" : "rgba(26, 115, 232, 0.1)"};
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem 0.9rem;
  border: 1px solid ${(props) => (props.hasError ? "#e53935" : "#ddd")};
  border-radius: 6px;
  font-size: 0.98rem;
  min-height: 90px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${(props) => (props.hasError ? "#e53935" : "#1a73e8")};
    box-shadow: 0 0 0 2px
      ${(props) =>
        props.hasError ? "rgba(229, 57, 53, 0.12)" : "rgba(26, 115, 232, 0.1)"};
  }
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
`;

const RadioInput = styled.input`
  margin: 0;
`;

const ErrorMessage = styled.span`
  color: #e53935;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SubmitButton = styled.button`
  background: #1a73e8;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 4px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background: #0d47a1;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

// Toast Animations
const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const ToastContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1001;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Toast = styled.div`
  background: ${(props) => (props.type === "success" ? "#4caf50" : "#e53935")};
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: ${(props) => (props.isClosing ? slideOut : slideIn)} 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 300px;
  cursor: pointer;
`;

const ToastIcon = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.2rem;
`;

// Validation Regex Patterns
const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  mobile: /^\+?[\d\s-]{10,}$/,
  nic: /^[0-9]{5}-[0-9]{7}-[0-9]{1}$|^[0-9]{13}$/,
  name: /^[A-Za-z\s]{2,50}$/,
  date: /^\d{2}\/\d{2}\/\d{4}$/,
};

// Error Messages
const ERROR_MESSAGES = {
  required: "This field is required",
  invalidEmail: "Please enter a valid email address",
  invalidMobile: "Please enter a valid mobile number",
  invalidNIC: "Please enter a valid NIC format (XXXXX-XXXXXXX-X or 13 digits)",
  invalidName: "Name should contain only letters and spaces (2-50 characters)",
  invalidDate: "Please enter date in DD/MM/YYYY format",
  futureDate: "Appointment date must be in the future",
};

const AppointmentModal = ({ isOpen, onClose, showSuccess, showError }) => {
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableDoctors, setAvailableDoctors] = useState([]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    nic: "",
    dateOfBirth: "",
    gender: "",
    appointmentDate: "",
    department: "Pediatrics",
    doctor: "",
    address: "",
    visitedBefore: "",
  });

  // Using App-level toasts (showSuccess/showError) instead of modal-local toasts

  // Validation Functions
  const validateField = (name, value) => {
    switch (name) {
      case "firstName":
      case "lastName":
        if (!value.trim()) return ERROR_MESSAGES.required;
        if (!VALIDATION_PATTERNS.name.test(value))
          return ERROR_MESSAGES.invalidName;
        return "";

      case "email":
        if (!value.trim()) return ERROR_MESSAGES.required;
        if (!VALIDATION_PATTERNS.email.test(value))
          return ERROR_MESSAGES.invalidEmail;
        return "";

      case "mobileNumber":
        if (!value.trim()) return ERROR_MESSAGES.required;
        if (!VALIDATION_PATTERNS.mobile.test(value))
          return ERROR_MESSAGES.invalidMobile;
        return "";

      case "nic":
        if (!value.trim()) return ERROR_MESSAGES.required;
        if (!VALIDATION_PATTERNS.nic.test(value))
          return ERROR_MESSAGES.invalidNIC;
        return "";

      case "dateOfBirth":
      case "appointmentDate":
        if (!value.trim()) return ERROR_MESSAGES.required;
        if (!VALIDATION_PATTERNS.date.test(value))
          return ERROR_MESSAGES.invalidDate;

        if (name === "appointmentDate") {
          const appointmentDate = new Date(
            value.split("/").reverse().join("-")
          );
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (appointmentDate <= today) return ERROR_MESSAGES.futureDate;
        }
        return "";

      case "gender":
      case "department":
      case "doctor":
      case "visitedBefore":
        if (!value.trim()) return ERROR_MESSAGES.required;
        return "";

      case "address":
        if (!value.trim()) return ERROR_MESSAGES.required;
        if (value.trim().length < 10)
          return "Address must be at least 10 characters";
        return "";

      default:
        return "";
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      if (typeof showError === "function")
        showError("Please fix the errors in the form");
      else console.warn("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      const appointmentName = `${formData.firstName || ""}${
        formData.lastName ? ` ${formData.lastName}` : ""
      }`.trim();

      const toIsoDate = (value) => {
        if (!value) return undefined;
        const [day, month, year] = value.split("/");
        if (!day || !month || !year) return undefined;
        const iso = new Date(`${year}-${month}-${day}T09:00:00`);
        return Number.isNaN(iso.getTime()) ? undefined : iso.toISOString();
      };

      const payload = {
        patientName: appointmentName,
        patientEmail: formData.email,
        cnic: formData.nic,
        phone: formData.mobileNumber,
        address: formData.address,
        gender: formData.gender,
        dateOfBirth: toIsoDate(formData.dateOfBirth),
        department: formData.department,
        doctor: formData.doctor,
        date: toIsoDate(formData.appointmentDate),
        visitedBefore: formData.visitedBefore === "yes",
        notes: `Booked online via website at ${new Date().toISOString()}`,
      };

      console.log("[APPOINTMENT MODAL] Submitting appointment", payload);
      await jsonFetch("/api/appointments", {
        method: "POST",
        body: payload,
      });

      const name = `${formData.firstName || ""}${
        formData.lastName ? " " + formData.lastName : ""
      }`.trim();
      if (typeof showSuccess === "function") {
        showSuccess(
          `Thank you ${name || "guest"} for booking your appointment!`
        );
      }

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        mobileNumber: "",
        nic: "",
        dateOfBirth: "",
        gender: "",
        appointmentDate: "",
        department: "Pediatrics",
        doctor: "",
        address: "",
        visitedBefore: "",
      });

      onClose();
    } catch (err) {
      console.error(err);
      if (typeof showError === "function") {
        showError("Failed to book appointment. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await jsonFetch("/api/doctors");
        console.log("[APPOINTMENT MODAL] Doctors fetched", response);
        setAvailableDoctors(response?.doctors || []);
      } catch (err) {
        console.error("[APPOINTMENT MODAL] Failed to load doctors", err);
      }
    };

    if (isOpen) {
      fetchDoctors();
    }
  }, [isOpen]);

  const doctorsByDepartment = useMemo(() => {
    return (availableDoctors || []).reduce((acc, doc) => {
      const dept = doc.department || "General";
      if (!acc[dept]) acc[dept] = [];
      acc[dept].push(doc.name || doc.fullName || doc.doctorName || doc.email);
      return acc;
    }, {});
  }, [availableDoctors]);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <ModalOverlay onClick={onClose}>
        <ModalContainer onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <ModalTitle>Book an Appointment</ModalTitle>
            <CloseButton onClick={onClose}>
              <FaTimes />
            </CloseButton>
          </ModalHeader>

          <Form onSubmit={handleSubmit} noValidate>
            {/* Personal Information */}
            <FormRow>
              <FormGroup>
                <Label>
                  First Name <RequiredStar>*</RequiredStar>
                </Label>
                <Input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  hasError={!!errors.firstName}
                  placeholder="Enter first name"
                />
                {errors.firstName && (
                  <ErrorMessage>
                    <FaExclamationTriangle />
                    {errors.firstName}
                  </ErrorMessage>
                )}
              </FormGroup>

              <FormGroup>
                <Label>
                  Last Name <RequiredStar>*</RequiredStar>
                </Label>
                <Input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  hasError={!!errors.lastName}
                  placeholder="Enter last name"
                />
                {errors.lastName && (
                  <ErrorMessage>
                    <FaExclamationTriangle />
                    {errors.lastName}
                  </ErrorMessage>
                )}
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label>
                  Email <RequiredStar>*</RequiredStar>
                </Label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  hasError={!!errors.email}
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <ErrorMessage>
                    <FaExclamationTriangle />
                    {errors.email}
                  </ErrorMessage>
                )}
              </FormGroup>

              <FormGroup>
                <Label>
                  Mobile Number <RequiredStar>*</RequiredStar>
                </Label>
                <Input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  hasError={!!errors.mobileNumber}
                  placeholder="Enter mobile number"
                />
                {errors.mobileNumber && (
                  <ErrorMessage>
                    <FaExclamationTriangle />
                    {errors.mobileNumber}
                  </ErrorMessage>
                )}
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label>
                  NIC <RequiredStar>*</RequiredStar>
                </Label>
                <Input
                  type="text"
                  name="nic"
                  value={formData.nic}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  hasError={!!errors.nic}
                  placeholder="XXXXX-XXXXXXX-X or 13 digits"
                />
                {errors.nic && (
                  <ErrorMessage>
                    <FaExclamationTriangle />
                    {errors.nic}
                  </ErrorMessage>
                )}
              </FormGroup>

              <FormGroup>
                <Label>
                  Date of Birth <RequiredStar>*</RequiredStar>
                </Label>
                <Input
                  type="text"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  hasError={!!errors.dateOfBirth}
                  placeholder="DD/MM/YYYY"
                />
                {errors.dateOfBirth && (
                  <ErrorMessage>
                    <FaExclamationTriangle />
                    {errors.dateOfBirth}
                  </ErrorMessage>
                )}
              </FormGroup>
            </FormRow>

            {/* Appointment Details */}
            <FormRow>
              <FormGroup>
                <Label>
                  Select Gender <RequiredStar>*</RequiredStar>
                </Label>
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  hasError={!!errors.gender}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </Select>
                {errors.gender && (
                  <ErrorMessage>
                    <FaExclamationTriangle />
                    {errors.gender}
                  </ErrorMessage>
                )}
              </FormGroup>

              <FormGroup>
                <Label>
                  Appointment Date <RequiredStar>*</RequiredStar>
                </Label>
                <Input
                  type="text"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  hasError={!!errors.appointmentDate}
                  placeholder="DD/MM/YYYY"
                />
                {errors.appointmentDate && (
                  <ErrorMessage>
                    <FaExclamationTriangle />
                    {errors.appointmentDate}
                  </ErrorMessage>
                )}
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label>
                  Department <RequiredStar>*</RequiredStar>
                </Label>
                <Select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  hasError={!!errors.department}
                >
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Neurology">Neurology</option>
                </Select>
                {errors.department && (
                  <ErrorMessage>
                    <FaExclamationTriangle />
                    {errors.department}
                  </ErrorMessage>
                )}
              </FormGroup>

              <FormGroup>
                <Label>
                  Select Doctor <RequiredStar>*</RequiredStar>
                </Label>
                <Select
                  name="doctor"
                  value={formData.doctor}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  hasError={!!errors.doctor}
                >
                  <option value="">Select Doctor</option>
                  {doctorsByDepartment[formData.department]?.length ? (
                    doctorsByDepartment[formData.department].map((doctor) => (
                      <option key={doctor} value={doctor}>
                        {doctor}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No doctors available
                    </option>
                  )}
                </Select>
                {errors.doctor && (
                  <ErrorMessage>
                    <FaExclamationTriangle />
                    {errors.doctor}
                  </ErrorMessage>
                )}
              </FormGroup>
            </FormRow>

            <FormGroup>
              <Label>
                Address <RequiredStar>*</RequiredStar>
              </Label>
              <TextArea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                onBlur={handleBlur}
                hasError={!!errors.address}
                placeholder="Enter your complete address"
              />
              {errors.address && (
                <ErrorMessage>
                  <FaExclamationTriangle />
                  {errors.address}
                </ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label>
                Have you visited before? <RequiredStar>*</RequiredStar>
              </Label>
              <RadioGroup>
                <RadioLabel>
                  <RadioInput
                    type="radio"
                    name="visitedBefore"
                    value="yes"
                    checked={formData.visitedBefore === "yes"}
                    onChange={handleInputChange}
                  />
                  Yes
                </RadioLabel>
                <RadioLabel>
                  <RadioInput
                    type="radio"
                    name="visitedBefore"
                    value="no"
                    checked={formData.visitedBefore === "no"}
                    onChange={handleInputChange}
                  />
                  No
                </RadioLabel>
              </RadioGroup>
              {errors.visitedBefore && (
                <ErrorMessage>
                  <FaExclamationTriangle />
                  {errors.visitedBefore}
                </ErrorMessage>
              )}
            </FormGroup>

            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <FaCheck />
                  Booking Appointment...
                </>
              ) : (
                <>
                  <FaCheck />
                  GET APPOINTMENT
                </>
              )}
            </SubmitButton>
          </Form>
        </ModalContainer>
      </ModalOverlay>

      {/* toasts are displayed by App via react-toastify (showSuccess/showError) */}
    </>
  );
};

export default AppointmentModal;
