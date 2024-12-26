import React, { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Validate form inputs
  const validateForm = () => {
    let errors = {};
    if (!formData.name) errors.name = "Name is required.";
    if (!formData.email) errors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Email is invalid.";
    if (!formData.message) errors.message = "Message is required.";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const sendEmail = async (event) => {
    event.preventDefault();

    // Validate the form before sending
    if (!validateForm()) return;

    const formDataObj = new FormData(event.target);
    formDataObj.append("access_key", "c48457fd-709c-4466-96aa-a19bcfec6aba");
    setLoading(true);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formDataObj,
      });

      const data = await response.json();
      if (data.success) {
        setResult("Form Submitted Successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setResult(`Error: ${data.message}`);
      }
    } catch (error) {
      setResult("There was an error submitting the form. Please try again.");
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="contact"
      className="flex flex-col lg:flex-row rounded-lg border border-gray-100 items-start gap-16 p-16 hover:border-2 my-20 w-full font-[sans-serif]"
    >
      <div className="lg:w-1/2 w-full">
        <h1 className="w-max bg-gradient-to-r from-blue-600 to-green-400 text-transparent bg-clip-text text-3xl font-extrabold">
          Let's Talk
        </h1>
        <p className="text-sm text-gray-400 mt-4">
          Looking to collaborate or need a skilled full-stack developer? Let's
          connect!
        </p>

        <form onSubmit={sendEmail} className="mt-12">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="text-sm text-gray-600">
              Your Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className={`mt-2 p-2 w-full border border-gray-300 rounded-md ${
                formErrors.name ? "border-red-500" : ""
              }`}
              value={formData.name}
              onChange={handleChange}
              required
            />
            {formErrors.name && (
              <p className="text-red-500 text-sm">{formErrors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="mt-4">
            <label htmlFor="email" className="text-sm text-gray-600">
              Your Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={`mt-2 p-2 w-full border border-gray-300 rounded-md ${
                formErrors.email ? "border-red-500" : ""
              }`}
              value={formData.email}
              onChange={handleChange}
              required
            />
            {formErrors.email && (
              <p className="text-red-500 text-sm">{formErrors.email}</p>
            )}
          </div>

          {/* Message Field */}
          <div className="mt-4">
            <label htmlFor="message" className="text-sm text-gray-600">
              Your Message:
            </label>
            <textarea
              id="message"
              name="message"
              rows="4"
              className={`mt-2 p-2 w-full border border-gray-300 rounded-md ${
                formErrors.message ? "border-red-500" : ""
              }`}
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
            {formErrors.message && (
              <p className="text-red-500 text-sm">{formErrors.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex items-center justify-between">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </div>
        </form>

        {result && (
          <div className="mt-4 text-sm text-gray-700">
            <p>{result}</p>
          </div>
        )}
      </div>

      {/* Contact Information */}
      <div className="lg:w-1/2 w-full mt-8 lg:mt-0">
        <h2 className="text-gray-700 text-base font-bold">
          Contact Information
        </h2>
        <ul className="mt-12 space-y-8">
          <li className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16px"
              height="16px"
              viewBox="0 0 512 512"
            >
              <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48L48 64zM0 176L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-208L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z" />
            </svg>
            <a
              href="mailto:sweety2020727@gmail.com"
              className="text-gray-600 text-sm ml-4"
            >
              rish122002@gmail.com
            </a>
          </li>
          <li className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16px"
              height="16px"
              viewBox="0 0 512 512"
            >
              <path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z" />
            </svg>
            <a href="tel:+918686668545" className="text-gray-600 text-sm ml-4">
              +91 7004450064
            </a>
          </li>
          <li className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16px"
              height="16px"
              viewBox="0 0 448 512"
            >
              <path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z" />
            </svg>
            <a
              href="https://www.linkedin.com/in/sweety-sharma-60b5b8234/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 text-sm ml-4"
            >
              LinkedIn
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Contact;
