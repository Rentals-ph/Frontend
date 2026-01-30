import { useState } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import './ContactUsPage.css'

function ContactUsPage() {
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'John',
    phone: '+63 xxx xxx xxxx',
    subject: 'How can we help you?',
    message: 'Tell us more about you inquiry...'
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
  }

  return (
    <div className="contact-page">
      <Navbar />

      {/* Page Header */}


      {/* Main Content with Background */}
      <main className="contact-main-content">
        {/* Background Illustration */}
        <div className="contact-background-illustration"></div>

        {/* Content Container */}
        <div className="contact-content-wrapper">
          <div className="contact-grid">
            {/* Contact Form */}
            <div className="contact-form-section">
              <h2 className="form-section-title">Send us a Message</h2>
              <p className="form-section-subtitle">
                We would like to hear your feedbacks! just fill out the form below
              </p>
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    required
                  ></textarea>
                </div>

                <button type="submit" className="contact-submit-btn">
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="contact-info-section">
              <h2 className="info-section-title">Contact Information</h2>
              <p className="info-section-subtitle">
                You can also reach us through these channels.
              </p>

              <div className="contact-info-cards">
                {/* Phone Numbers */}
                <div className="contact-info-card">
                  <div className="info-card-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.69 14.9 16.08 14.82 16.43 14.93C17.55 15.3 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z" fill="#205ED7" />
                    </svg>
                  </div>
                  <div className="info-card-content">
                    <h3 className="info-card-title">Phone numbers</h3>
                    <p className="info-card-text">
                      Globe: +639178886298<br />
                      Landline: (032) 254-8900
                    </p>
                  </div>
                </div>

                {/* Office Address */}
                <div className="contact-info-card">
                  <div className="info-card-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="#205ED7" />
                    </svg>
                  </div>
                  <div className="info-card-content">
                    <h3 className="info-card-title">Office Address</h3>
                    <p className="info-card-text">
                      Rent.ph Headquarters<br />
                      Aznar Road Cebu City, Philippines, 6000
                    </p>
                  </div>
                </div>

                {/* Email Address */}
                <div className="contact-info-card">
                  <div className="info-card-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="#205ED7" />
                    </svg>
                  </div>
                  <div className="info-card-content">
                    <h3 className="info-card-title">Email Address</h3>
                    <p className="info-card-text">
                      official.rentph@gmail.com
                    </p>
                  </div>
                </div>

                {/* Follow Us */}
                <div className="contact-info-card">
                  <div className="info-card-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM11 7H13V9H11V7ZM11 11H13V17H11V11Z" fill="#205ED7" />
                    </svg>
                  </div>
                  <div className="info-card-content">
                    <h3 className="info-card-title">Follow Us</h3>
                    <p className="info-card-text">
                      Stay connected on social media.
                    </p>
                    <div className="social-links">
                      <a href="#facebook" className="social-link" aria-label="Facebook">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="16" cy="16" r="16" fill="#205ED7" />
                          <path d="M18 17H19.5L20.5 13H18V11.5C18 10.67 18 10 19.25 10H20.5V7.355C20.355 7.245 19.355 7.25 18.25 7.25C15.9 7.25 14.5 8.395 14.5 11.1875V13H12.5V17H14.5V25H18V17Z" fill="white" />
                        </svg>
                      </a>
                      <a href="#instagram" className="social-link" aria-label="Instagram">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="16" cy="16" r="16" fill="#205ED7" />
                          <path d="M16 12C13.79 12 12 13.79 12 16C12 18.21 13.79 20 16 20C18.21 20 20 18.21 20 16C20 13.79 18.21 12 16 12ZM16 18.5C14.62 18.5 13.5 17.38 13.5 16C13.5 14.62 14.62 13.5 16 13.5C17.38 13.5 18.5 14.62 18.5 16C18.5 17.38 17.38 18.5 16 18.5ZM18.75 11.5C18.34 11.5 18 11.84 18 12.25C18 12.66 18.34 13 18.75 13C19.16 13 19.5 12.66 19.5 12.25C19.5 11.84 19.16 11.5 18.75 11.5ZM16 10C19.31 10 22 12.69 22 16C22 19.31 19.31 22 16 22C12.69 22 10 19.31 10 16C10 12.69 12.69 10 16 10Z" fill="white" />
                        </svg>
                      </a>
                      <a href="#whatsapp" className="social-link" aria-label="WhatsApp">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="16" cy="16" r="16" fill="#205ED7" />
                          <path d="M16 8C11.58 8 8 11.58 8 16C8 17.85 8.56 19.55 9.5 20.95L8 24L11.3 22.6C12.6 23.4 14.2 23.9 16 23.9C20.42 23.9 24 20.32 24 15.9C24 11.48 20.42 8 16 8ZM16 22.1C14.4 22.1 12.9 21.6 11.7 20.8L11.4 20.6L9.4 21.2L10 19.3L9.8 19C9 17.8 8.5 16.3 8.5 14.7C8.5 10.8 11.8 7.5 15.7 7.5C19.6 7.5 22.9 10.8 22.9 14.7C22.9 18.6 19.6 22.1 16 22.1ZM19.1 16.4C18.9 16.2 18.4 16.1 18.1 16.2L17.4 16.4C17.2 16.5 16.9 16.4 16.8 16.3L16.1 15.6C16 15.5 15.8 15.4 15.7 15.5L15.4 15.8C15.2 16 14.9 16.1 14.7 16.3C14.3 16.7 13.9 17.1 13.5 17.4C13.3 17.5 13.1 17.6 12.9 17.7C12.7 17.8 12.5 17.8 12.3 17.7L11.8 17.5C11.5 17.4 11.2 17.3 10.9 17.1C10.6 16.9 10.3 16.6 10.1 16.3C9.9 16 9.8 15.7 9.7 15.4L9.5 14.7C9.4 14.4 9.3 14.1 9.4 13.8C9.5 13.5 9.6 13.2 9.8 13L10 12.7C10.2 12.4 10.4 12.2 10.7 12.1C11 12 11.3 12 11.6 12.1L12.3 12.3C12.6 12.4 12.9 12.5 13.1 12.7L13.4 13C13.6 13.2 13.8 13.4 13.9 13.7C14 14 14 14.3 13.9 14.6L13.7 15.3C13.6 15.6 13.7 15.9 13.9 16.1L14.6 16.8C14.7 16.9 14.8 17.1 14.7 17.3L14.5 18C14.4 18.3 14.5 18.6 14.7 18.8C15.1 19.2 15.5 19.6 15.9 19.9C16.3 20.2 16.7 20.4 17.1 20.6C17.3 20.7 17.5 20.8 17.7 20.8C17.9 20.9 18.1 20.9 18.3 20.8L19 20.6C19.3 20.5 19.6 20.4 19.9 20.2C20.2 20 20.4 19.7 20.6 19.4L20.8 18.7C20.9 18.4 20.9 18.1 20.8 17.8L19.1 16.4Z" fill="white" />
                        </svg>
                      </a>
                      <a href="#rss" className="social-link" aria-label="RSS">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="16" cy="16" r="16" fill="#205ED7" />
                          <path d="M8 8C8 8 8 24 24 24V20C20 20 20 8 8 8ZM8 12C8 12 8 20 20 20V16C16 16 16 12 8 12ZM10 18C10.5523 18 11 17.5523 11 17C11 16.4477 10.5523 16 10 16C9.44772 16 9 16.4477 9 17C9 17.5523 9.44772 18 10 18Z" fill="white" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default ContactUsPage

