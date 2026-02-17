'use client'

import { useState } from 'react'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import PageHeader from '../../components/layout/PageHeader'

export default function ContactUsPage() {
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
    console.log('Form submitted:', formData)
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <PageHeader title="CONTACT US" />
      <main className="relative mx-auto min-h-[500px] w-full max-w-7xl px-4 py-10 md:px-8 lg:px-16">
        {/* Background Illustration */}
        <div 
          className="absolute left-1/2 top-0 z-0 h-[55vh] w-screen -translate-x-1/2 overflow-hidden bg-cover bg-center bg-no-repeat md:h-[40vh] lg:h-[55vh]"
          style={{ backgroundImage: "url('/assets/background-contactus.png')" }}
        />

        <div className="relative z-10">
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
            {/* Contact Form Section */}
            <div className="flex flex-col rounded-2xl bg-white p-7 shadow-[0px_4px_20px_rgba(0,0,0,0.08)] md:rounded-3xl">
              <h2 className="mb-2 font-outfit text-2xl font-bold text-gray-800 md:text-xl">Send us a Message</h2>
              <p className="mb-5 flex min-h-[42px] items-start font-outfit text-sm leading-relaxed text-gray-600">
                We would like to hear your feedbacks! just fill out the form below
              </p>
              <form className="flex flex-col" onSubmit={handleSubmit}>
                <div className="mb-1.5 grid gap-4 md:grid-cols-2">
                  <div className="mb-4 flex flex-col gap-1.5">
                    <label htmlFor="firstName" className="font-outfit text-sm font-semibold text-gray-800">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="rounded-lg border-2 border-gray-200 bg-white px-3.5 py-2.5 font-outfit text-sm outline-none transition-all focus:border-rental-blue-600 focus:shadow-[0px_0px_0px_3px_rgba(32,94,215,0.1)]"
                    />
                  </div>
                  <div className="mb-4 flex flex-col gap-1.5">
                    <label htmlFor="lastName" className="font-outfit text-sm font-semibold text-gray-800">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="rounded-lg border-2 border-gray-200 bg-white px-3.5 py-2.5 font-outfit text-sm outline-none transition-all focus:border-rental-blue-600 focus:shadow-[0px_0px_0px_3px_rgba(32,94,215,0.1)]"
                    />
                  </div>
                </div>

                <div className="mb-4 flex flex-col gap-1.5">
                  <label htmlFor="email" className="font-outfit text-sm font-semibold text-gray-800">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="rounded-lg border-2 border-gray-200 bg-white px-3.5 py-2.5 font-outfit text-sm outline-none transition-all focus:border-rental-blue-600 focus:shadow-[0px_0px_0px_3px_rgba(32,94,215,0.1)]"
                  />
                </div>

                <div className="mb-4 flex flex-col gap-1.5">
                  <label htmlFor="phone" className="font-outfit text-sm font-semibold text-gray-800">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="rounded-lg border-2 border-gray-200 bg-white px-3.5 py-2.5 font-outfit text-sm outline-none transition-all focus:border-rental-blue-600 focus:shadow-[0px_0px_0px_3px_rgba(32,94,215,0.1)]"
                  />
                </div>

                <div className="mb-4 flex flex-col gap-1.5">
                  <label htmlFor="subject" className="font-outfit text-sm font-semibold text-gray-800">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="rounded-lg border-2 border-gray-200 bg-white px-3.5 py-2.5 font-outfit text-sm outline-none transition-all focus:border-rental-blue-600 focus:shadow-[0px_0px_0px_3px_rgba(32,94,215,0.1)]"
                  />
                </div>

                <div className="mb-0 flex flex-col gap-1.5">
                  <label htmlFor="message" className="font-outfit text-sm font-semibold text-gray-800">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    required
                    className="min-h-[100px] resize-y rounded-lg border-2 border-gray-200 bg-white px-3.5 py-2.5 font-outfit text-sm outline-none transition-all focus:border-rental-blue-600 focus:shadow-[0px_0px_0px_3px_rgba(32,94,215,0.1)]"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="mt-2.5 self-start rounded-lg bg-rental-blue-600 px-7 py-3 font-outfit text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-rental-blue-700 hover:shadow-[0px_6px_20px_rgba(32,94,215,0.4)] md:w-full"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Info Section */}
            <div className="flex flex-col rounded-2xl bg-white p-7 shadow-[0px_4px_20px_rgba(0,0,0,0.08)] md:rounded-3xl">
              <h2 className="mb-2 font-outfit text-2xl font-bold text-gray-800 md:text-xl">Contact Information</h2>
              <p className="mb-5 font-outfit text-sm leading-relaxed text-gray-600">
                You can also reach us through these channels.
              </p>

              <div className="mt-0 flex flex-col gap-4">
                {/* Phone Card */}
                <div className="flex items-start gap-3 p-0 transition-all hover:translate-x-1">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-rental-blue-600/10">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.69 14.9 16.08 14.82 16.43 14.93C17.55 15.3 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z" fill="#205ED7" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-1.5 font-outfit text-sm font-semibold text-gray-800">Phone numbers</h3>
                    <p className="m-0 font-outfit text-xs leading-relaxed text-gray-600">
                      Globe: +639178886298<br />
                      Landline: (032) 254-8900
                    </p>
                  </div>
                </div>

                {/* Address Card */}
                <div className="flex items-start gap-3 p-0 transition-all hover:translate-x-1">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-rental-blue-600/10">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="#205ED7" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-1.5 font-outfit text-sm font-semibold text-gray-800">Office Address</h3>
                    <p className="m-0 font-outfit text-xs leading-relaxed text-gray-600">
                      Rent.ph Headquarters<br />
                      Aznar Road Cebu City, Philippines, 6000
                    </p>
                  </div>
                </div>

                {/* Email Card */}
                <div className="flex items-start gap-3 p-0 transition-all hover:translate-x-1">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-rental-blue-600/10">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="#205ED7" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-1.5 font-outfit text-sm font-semibold text-gray-800">Email Address</h3>
                    <p className="m-0 font-outfit text-xs leading-relaxed text-gray-600">
                      official.rentph@gmail.com
                    </p>
                  </div>
                </div>

                {/* Social Card */}
                <div className="flex items-start gap-3 p-0 transition-all hover:translate-x-1">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-rental-blue-600/10">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM11 7H13V9H11V7ZM11 11H13V17H11V11Z" fill="#205ED7" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-1.5 font-outfit text-sm font-semibold text-gray-800">Follow Us</h3>
                    <p className="m-0 font-outfit text-xs leading-relaxed text-gray-600">
                      Stay connected on social media.
                    </p>
                    <div className="mt-2 flex gap-2.5">
                      <a href="#facebook" className="flex items-center justify-center rounded-full transition-all hover:-translate-y-1 hover:shadow-[0px_6px_16px_rgba(0,0,0,0.15)]" aria-label="Facebook">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="16" cy="16" r="16" fill="#205ED7" />
                          <path d="M18 17H19.5L20.5 13H18V11.5C18 10.67 18 10 19.25 10H20.5V7.355C20.355 7.245 19.355 7.25 18.25 7.25C15.9 7.25 14.5 8.395 14.5 11.1875V13H12.5V17H14.5V25H18V17Z" fill="white" />
                        </svg>
                      </a>
                      <a href="#instagram" className="flex items-center justify-center rounded-full transition-all hover:-translate-y-1 hover:shadow-[0px_6px_16px_rgba(0,0,0,0.15)]" aria-label="Instagram">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="16" cy="16" r="16" fill="#205ED7" />
                          <path d="M16 12C13.79 12 12 13.79 12 16C12 18.21 13.79 20 16 20C18.21 20 20 18.21 20 16C20 13.79 18.21 12 16 12ZM16 18.5C14.62 18.5 13.5 17.38 13.5 16C13.5 14.62 14.62 13.5 16 13.5C17.38 13.5 18.5 14.62 18.5 16C18.5 17.38 17.38 18.5 16 18.5ZM18.75 11.5C18.34 11.5 18 11.84 18 12.25C18 12.66 18.34 13 18.75 13C19.16 13 19.5 12.66 19.5 12.25C19.5 11.84 19.16 11.5 18.75 11.5ZM16 10C19.31 10 22 12.69 22 16C22 19.31 19.31 22 16 22C12.69 22 10 19.31 10 16C10 12.69 12.69 10 16 10Z" fill="white" />
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

