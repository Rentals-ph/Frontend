import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import {
  HomePage,
  AboutPage,
  PropertiesForRentPage,
  RentManagersPage,
  RentManagerDetailsPage,
  BlogPage,
  BlogDetailsPage,
  ContactUsPage,
  PropertyDetailsPage,
  NewsPage,
  AdminDashboard,
  AgentsPage,
  PropertiesPage,
  RevenuePage,
  AgentDashboard,
  AgentEditProfile,
  AgentMyProfile,
  AgentInbox,
  AgentDownloadables,
  AgentDigitalCard,
  AgentChangePassword,
  AgentMyListings,
  AgentRentalTracker,
  AgentRentEstimate,
  AgentShareBlogs,
  AgentCreateListingCategory,
  AgentCreateListingDetails,
  AgentCreateListingLocation,
  AgentCreateListingPropertyImages,
  AgentCreateListingPricing,
  AgentCreateListingAttributes,
  AgentCreateListingOwnerInfo,
  AgentCreateListingPublish
} from './pages'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/properties" element={<PropertiesForRentPage />} />
        <Route path="/property/:id" element={<PropertyDetailsPage />} />
        <Route path="/rent-managers" element={<RentManagersPage />} />
        <Route path="/rent-managers/:id" element={<RentManagerDetailsPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:id" element={<BlogDetailsPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/contact" element={<ContactUsPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/agents" element={<AgentsPage />} />
        <Route path="/admin/properties" element={<PropertiesPage />} />
        <Route path="/admin/revenue" element={<RevenuePage />} />
        <Route path="/agent" element={<AgentDashboard />} />
        <Route path="/agent/create-listing" element={<AgentCreateListingCategory />} />
        <Route path="/agent/create-listing/details" element={<AgentCreateListingDetails />} />
        <Route path="/agent/create-listing/location" element={<AgentCreateListingLocation />} />
        <Route
          path="/agent/create-listing/property-images"
          element={<AgentCreateListingPropertyImages />}
        />
        <Route path="/agent/create-listing/pricing" element={<AgentCreateListingPricing />} />
        <Route path="/agent/create-listing/attributes" element={<AgentCreateListingAttributes />} />
        <Route path="/agent/create-listing/owner-info" element={<AgentCreateListingOwnerInfo />} />
        <Route path="/agent/create-listing/publish" element={<AgentCreateListingPublish />} />
        <Route path="/agent/profile" element={<AgentMyProfile />} />
        <Route path="/agent/edit-profile" element={<AgentEditProfile />} />
        <Route path="/agent/inbox" element={<AgentInbox />} />
        <Route path="/agent/downloadables" element={<AgentDownloadables />} />
        <Route path="/agent/digital-card" element={<AgentDigitalCard />} />
        <Route path="/agent/change-password" element={<AgentChangePassword />} />
        <Route path="/agent/listings" element={<AgentMyListings />} />
        <Route path="/agent/tracker" element={<AgentRentalTracker />} />
        <Route path="/agent/rent-estimate" element={<AgentRentEstimate />} />
        <Route path="/agent/blogs" element={<AgentShareBlogs />} />
      </Routes>
    </Router>
  )
}

export default App
