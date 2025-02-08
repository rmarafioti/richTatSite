"use client";

import emailjs from "@emailjs/browser";
import Cleave from "cleave.js/react";
import "cleave.js/dist/addons/cleave-phone.us";
import { motion } from "framer-motion";

import React, { useState, useRef } from "react";

import styles from "@/app/styling/contactform.module.css";

export default function ContactForm() {
  const formRef = useRef();
  const [messageStatus, setMessageStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const closeModal = () => {
    setIsModalVisible(false);
  };

  function MessageSentModal() {
    return (
      <>
        {isModalVisible && (
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div className={styles.modalContent}>
              <p className={styles.modalHeader}>Message Sent!</p>
              <p className={styles.modalSubHeader}>
                We will be in touch and hope to see you for your next tattoo
              </p>
              <button className={styles.modalButton} onClick={closeModal}>
                close
              </button>
            </motion.div>
          </motion.div>
        )}
      </>
    );
  }

  const inputForm = {
    user_name: "",
    user_email: "",
    user_phone: "",
    date_choice: "",
    user_message: "",
  };

  const [formValues, setFormValues] = useState(inputForm);

  const preferDays = ["Today", "This week", "This weekend", "At a later date"];

  const inputValidationError = {
    user_name: false,
    user_email: false,
    user_phone: false,
    date_choice: false,
    user_message: false,
  };

  const [validationError, setValidationError] = useState(inputValidationError);

  const validateAllFields = () => {
    const errors = {};
    Object.entries(formValues).forEach(([field, value]) => {
      if (field === "user_email") {
        errors[field] = !isValidEmail(value);
      } else if (field === "user_phone") {
        errors[field] = !isValidPhone(value);
      } else {
        errors[field] = value.trim() === "";
      }
    });
    setValidationError(errors);
    return errors;
  };

  // allow the user to change the value of a form field
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  //valid email check looks for an '@' and a '.'
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  //valid phone check looks for 10 integers
  const isValidPhone = (phone) => {
    const phoneDigits = phone.replace(/\D/g, "");
    return phoneDigits.length === 10;
  };

  const sendEmail = (e) => {
    e.preventDefault();

    const errors = validateAllFields();
    const isValid = Object.values(errors).every((error) => !error);

    if (!isValid) {
      console.log("Form validation failed:", validationError);
      return;
    }

    setIsLoading(true);

    emailjs
      .sendForm(
        "service_b5ti40c", //email services service ID from emailjs gmail sync
        "template_1qzubk8", //template ID from created emailjs template
        formRef.current,
        "BlLUwfq3Q5zY1L2RS" //emailjs public key
      )
      .then(
        () => {
          console.log("MESSAGE SENT!");
          setMessageStatus("success");
          setIsLoading(false);
          setValidationError(inputValidationError);
          formRef.current.reset();
          setFormValues(inputForm);
          setIsModalVisible(true);
        },
        (error) => {
          console.log("MESSAGE FAILED", error.text);
          setMessageStatus("error");
          setIsLoading(false);
        }
      );
  };

  return (
    <>
      <h2 className={styles.contactUs}>Contact Me</h2>
      <form
        className={styles.contactForm}
        ref={formRef}
        onSubmit={sendEmail}
        encType="multipart/form-data"
        method="post"
      >
        <label className={styles.label}>Name: </label>
        <input
          className={styles.form}
          type="text"
          name="user_name"
          aria-label="user_name"
          value={formValues.user_name}
          onChange={handleInputChange}
        />
        <label className={styles.label}>Email: </label>
        <input
          className={styles.form}
          type="email"
          name="user_email"
          aria-label="user_email"
          value={formValues.user_email}
          onChange={handleInputChange}
        />
        <label className={styles.label}>Phone: </label>
        <Cleave
          name="user_phone"
          options={{ phone: true, phoneRegionCode: "US" }}
          className={styles.form}
          value={formValues.user_phone}
          onChange={(e) =>
            handleInputChange({
              target: { name: "user_phone", value: e.target.value },
            })
          }
          placeholder="(XXX) XXX-XXXX"
        />
        <label className={styles.label}>I Would Like to Get Tattooed:</label>
        <select
          className={styles.form}
          name="date_choice"
          value={formValues.date_choice}
          aria-label="date_choice"
          onChange={(e) =>
            setFormValues((prevValues) => ({
              ...prevValues,
              date_choice: e.target.value,
            }))
          }
        >
          <option value="">Day of choice</option>
          {preferDays.map((day, index) => (
            <option key={index} value={day}>
              {day}
            </option>
          ))}
        </select>
        <label className={styles.label}>Additional information:</label>
        <textarea
          className={styles.messageForm}
          name="user_message"
          aria-label="users_additional_information"
          value={formValues.user_message}
          onChange={handleInputChange}
        />
        <input
          className={styles.formSubmit}
          type="submit"
          aria-label="form_submit_button"
          value={isLoading ? "Sending..." : "Send"}
          disabled={isLoading}
        />
        {validationError.user_name && (
          <p className={styles.errorBottom}>*Please enter your name*</p>
        )}
        {validationError.user_email && (
          <p className={styles.errorBottom}>
            *Please enter a valid email address*
          </p>
        )}
        {validationError.user_phone && (
          <p className={styles.errorBottom}>
            *Please enter a valid phone number*
          </p>
        )}
        {validationError.date_choice && (
          <p className={styles.errorBottom}>*Please select a preferred date*</p>
        )}
        {validationError.user_message && (
          <p className={styles.errorBottom}>
            *Please provide us additional information about your tattoo request"
          </p>
        )}
        {messageStatus === "error" && (
          <p className={styles.errorMessage}>
            **Message failed to send. Please try again**
          </p>
        )}
      </form>
      <MessageSentModal />
    </>
  );
}
