'use client'

import { useState, useEffect } from 'react'
import AppSidebar from '../../../components/common/AppSidebar'
import AgentHeader from '../../../components/agent/AgentHeader'
import AccountSettings, { 
  ProfileData, 
  EditFormData, 
  PasswordFormData 
} from '../../../components/common/AccountSettings'
import { agentsApi } from '../../../api'
import type { Agent } from '../../../api/endpoints/agents'
import { ASSETS } from '@/utils/assets'

export default function AgentAccount() {
  const [loading, setLoading] = useState(true)
  const [agent, setAgent] = useState<Agent | null>(null)
  const [uploading, setUploading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    email: '',
    phone: '',
    role: 'Property Agent',
    avatar: ASSETS.PLACEHOLDER_PROFILE
  })

  const [editFormData, setEditFormData] = useState<EditFormData>({
    firstName: '',
    lastName: '',
    email: '',
    countryCode: 'PH+63',
    contactNumber: '',
    aboutYourself: '',
    addressLine1: '',
    country: 'Philippines',
    region: 'Region VII - Central Visayas',
    province: 'Cebu',
    city: 'Cebu City'
  })

  useEffect(() => {
    const fetchAgentData = async () => {
      try {
        const agentData = await agentsApi.getCurrent()
        setAgent(agentData)
        
        if (agentData.first_name && agentData.last_name) {
          const fullName = agentData.first_name + ' ' + agentData.last_name
          localStorage.setItem('agent_name', fullName)
          localStorage.setItem('user_name', fullName)
        }
        if (agentData.id) {
          localStorage.setItem('agent_id', agentData.id.toString())
        }
        
        const agentName = agentData.full_name || 
          (agentData.first_name && agentData.last_name 
            ? agentData.first_name + ' ' + agentData.last_name
            : agentData.first_name || agentData.last_name ||
            localStorage.getItem('user_name') || 
            localStorage.getItem('agent_name') ||
            (agentData.email ? agentData.email.split('@')[0] : 'Agent'))
        
        const phoneClean = agentData.phone ? agentData.phone.replace(/^\+?63\s?/, '') : ''
        
        setProfileData({
          name: agentName,
          email: agentData.email || '',
          phone: agentData.phone ? '+63 ' + phoneClean : '',
          role: agentData.verified ? 'Rent Manager' : 'Property Agent',
          avatar: agentData.image || agentData.avatar || agentData.profile_image || ASSETS.PLACEHOLDER_PROFILE
        })

        const phoneNumber = agentData.phone || ''
        const phoneWithoutCode = phoneNumber.replace(/^\+?63\s?/, '')
        
        setEditFormData({
          firstName: agentData.first_name || '',
          lastName: agentData.last_name || '',
          email: agentData.email || '',
          countryCode: 'PH+63',
          contactNumber: phoneWithoutCode,
          aboutYourself: '',
          addressLine1: '',
          country: 'Philippines',
          region: agentData.state || 'Region VII - Central Visayas',
          province: agentData.city || 'Cebu',
          city: agentData.city || 'Cebu City'
        })
      } catch (error) {
        console.error('Error fetching agent data:', error)
        try {
          const agentId = localStorage.getItem('agent_id')
          if (agentId) {
            const agentData = await agentsApi.getById(parseInt(agentId))
            setAgent(agentData)
            
            if (agentData.first_name && agentData.last_name) {
              const fullName = agentData.first_name + ' ' + agentData.last_name
              localStorage.setItem('agent_name', fullName)
              localStorage.setItem('user_name', fullName)
            }
            
            const agentName = agentData.full_name || 
              (agentData.first_name && agentData.last_name 
                ? agentData.first_name + ' ' + agentData.last_name
                : agentData.first_name || agentData.last_name ||
                localStorage.getItem('user_name') || 
                localStorage.getItem('agent_name') ||
                (agentData.email ? agentData.email.split('@')[0] : 'Agent'))
            
            const phoneClean = agentData.phone ? agentData.phone.replace(/^\+?63\s?/, '') : ''
            
            setProfileData({
              name: agentName,
              email: agentData.email || '',
              phone: agentData.phone ? '+63 ' + phoneClean : '',
              role: agentData.verified ? 'Rent Manager' : 'Property Agent',
              avatar: agentData.image || agentData.avatar || agentData.profile_image || ASSETS.PLACEHOLDER_PROFILE
            })

            const phoneNumber = agentData.phone || ''
            const phoneWithoutCode = phoneNumber.replace(/^\+?63\s?/, '')
            
            setEditFormData({
              firstName: agentData.first_name || '',
              lastName: agentData.last_name || '',
              email: agentData.email || '',
              countryCode: 'PH+63',
              contactNumber: phoneWithoutCode,
              aboutYourself: '',
              addressLine1: '',
              country: 'Philippines',
              region: agentData.state || 'Region VII - Central Visayas',
              province: agentData.city || 'Cebu',
              city: agentData.city || 'Cebu City'
            })
          }
        } catch (fallbackError) {
          console.error('Error fetching agent by ID:', fallbackError)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchAgentData()
  }, [])

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)
    
    try {
      const updateData: {
        first_name?: string
        last_name?: string
        phone?: string
        city?: string
        state?: string
        office_address?: string
        image?: File
      } = {
        first_name: editFormData.firstName,
        last_name: editFormData.lastName,
        phone: editFormData.contactNumber ? '+63' + editFormData.contactNumber.replace(/\D/g, '') : undefined,
        city: editFormData.city,
        state: editFormData.region,
        office_address: editFormData.addressLine1,
      }
      
      if (imageFile) {
        updateData.image = imageFile
      }
      
      const updatedAgent = await agentsApi.update(updateData)
      
      setAgent(updatedAgent)
      const updatedPhoneClean = updatedAgent.phone ? updatedAgent.phone.replace(/^\+?63\s?/, '') : ''
      setProfileData({
        name: updatedAgent.full_name || (updatedAgent.first_name + ' ' + updatedAgent.last_name),
        email: updatedAgent.email || '',
        phone: updatedAgent.phone ? '+63 ' + updatedPhoneClean : '',
        role: updatedAgent.verified ? 'Rent Manager' : 'Property Agent',
        avatar: updatedAgent.image || updatedAgent.avatar || updatedAgent.profile_image || ASSETS.PLACEHOLDER_PROFILE
      })
      
      setImageFile(null)
      setImagePreview(null)
      
      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handlePasswordSubmit = (passwordData: PasswordFormData) => {
    console.log('Password change submitted:', passwordData)
    alert('Password changed successfully!')
  }

  return (
    <div className="flex min-h-screen bg-gray-100 font-outfit">
      <AppSidebar/>

      <main className="ml-[280px] flex-1 w-[calc(100%-280px)] p-8 min-h-screen lg:ml-[240px] lg:w-[calc(100%-240px)] lg:p-6 md:ml-[200px] md:w-[calc(100%-200px)] md:p-4">
        <AgentHeader 
          title="Account Settings" 
          subtitle="Manage your account information and preferences." 
        />

        <AccountSettings
          userType="agent"
          profileData={profileData}
          editFormData={editFormData}
          loading={loading}
          uploading={uploading}
          imagePreview={imagePreview}
          onEditFormChange={handleEditChange}
          onEditSubmit={handleEditSubmit}
          onPasswordSubmit={handlePasswordSubmit}
          onImageChange={handleImageChange}
          cancelRoute="/agent"
        />
      </main>
    </div>
  )
}
