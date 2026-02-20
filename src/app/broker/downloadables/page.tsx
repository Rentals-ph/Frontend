'use client'

import AppSidebar from '../../../components/common/AppSidebar'
import BrokerHeader from '../../../components/broker/BrokerHeader'
import {
  FiDownload,
  FiFileText,
  FiBarChart2,
  FiImage,
} from 'react-icons/fi'

export default function BrokerDownloadables() {
  const handleDownload = (type: string) => {
    console.log(`Downloading ${type}`)
  }

  const items = [
    { id: 'lease-agreements', label: 'Lease Agreements', icon: FiFileText },
    { id: 'financial-report', label: 'Financial Report', icon: FiBarChart2 },
    { id: 'property-photos', label: 'Property Photos', icon: FiImage },
  ]

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] font-outfit">
      <AppSidebar />

      <main className="ml-[280px] flex-1 w-[calc(100%-280px)] p-8 min-h-screen lg:ml-[240px] lg:w-[calc(100%-240px)] lg:p-6 md:ml-0 md:w-full md:p-4 md:pt-15">
        <BrokerHeader
          title="Dashboard"
          subtitle="Welcome back, manage your rental properties"
          showNotifications={true}
        />

        <section className="mt-10">
          <h2 className="text-xl font-bold text-[#333] mb-6">Downloadables</h2>

          <div className="flex flex-col gap-4">
            {items.map(({ id, label, icon: Icon }) => (
              <div
                key={id}
                className="flex items-center gap-4 bg-white rounded-lg p-4 shadow-[0_2px_4px_rgba(0,0,0,0.05)] border border-gray-200/80"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#E0F2F7] flex items-center justify-center">
                  <Icon className="w-6 h-6 text-[#007BFF]" aria-hidden />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-medium text-[#333]">{label}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => handleDownload(id)}
                  aria-label={`Download ${label}`}
                  className="flex-shrink-0 p-2 text-[#007BFF] hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <FiDownload className="w-5 h-5" aria-hidden />
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
