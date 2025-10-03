import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import PropertyListingForm from '../forms/PropertyListingForm'

const ListRentProperty: React.FC = () => {
  const navigate = useNavigate()

  const handleSuccess = () => {
    navigate('/property-submitted', { 
      state: { 
        propertyType: 'rent', 
        propertyTitle: 'Property Listed Successfully' 
      } 
    })
  }

  const handleCancel = () => {
    navigate('/list-property')
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/list-property')}
                className="flex items-center text-gray-600 hover:text-primary-600"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">List Property for Rent</h1>
                <p className="text-gray-600">Fill in the details to list your property</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PropertyListingForm 
          transactionType="rent"
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
}

export default ListRentProperty

