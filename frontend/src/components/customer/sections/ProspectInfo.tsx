import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { FaMapMarkerAlt, FaBuilding, FaGlobe, FaUser, FaEdit, FaTrash, FaCheck } from 'react-icons/fa';
import { Customer, CustomerFormData } from '../../../types/customer';

interface ProspectInfoProps {
  customer: Customer;
  onUpdate: (customer: Customer) => void;
  onConvertToCustomer?: (customer: Customer) => void;
}

interface ContactFormData {
  id?: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  role: string;
  isPrimary: boolean;
}

const PROSPECT_STATUSES = [
  { id: 'new', name: 'Ny prospect' },
  { id: 'contacted', name: 'Kontaktad' },
  { id: 'meeting_booked', name: 'Möte bokat' },
  { id: 'qualified', name: 'Kvalificerad' },
  { id: 'proposal_sent', name: 'Offert skickad' },
  { id: 'negotiating', name: 'Förhandling' },
];

const emptyContact: ContactFormData = {
  name: '',
  title: '',
  email: '',
  phone: '',
  role: '',
  isPrimary: false,
};

const ProspectInfo: React.FC<ProspectInfoProps> = ({ customer, onUpdate, onConvertToCustomer }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<CustomerFormData>({
    type: customer.type,
    status: customer.status,
    name: customer.name,
    visitingAddress: customer.visitingAddress,
    mailingAddress: customer.mailingAddress,
    organizationNumber: customer.organizationNumber,
    website: customer.website,
    industry: customer.industry,
    revenue: customer.revenue,
    employees: customer.employees,
    description: customer.description,
    contacts: customer.contacts.map(contact => ({
      ...contact,
      id: contact.id
    }))
  });

  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState<ContactFormData>(emptyContact);
  const [isEditingContact, setIsEditingContact] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedCustomer = {
        ...customer,
        ...formData
      };
      onUpdate(updatedCustomer);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating prospect:', error);
    }
  };

  const handleStatusChange = (newStatus: string) => {
    const updatedData = {
      ...formData,
      status: newStatus
    };
    setFormData(updatedData);
    onUpdate({ ...customer, ...updatedData });
  };

  const handleConvertToCustomer = () => {
    if (onConvertToCustomer) {
      onConvertToCustomer({ ...customer, type: 'customer' });
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedContacts = isEditingContact
      ? formData.contacts.map((contact) =>
          contact.id === currentContact.id ? { ...currentContact } : contact
        )
      : [...formData.contacts, { ...currentContact, id: Date.now().toString() }];

    setFormData({ ...formData, contacts: updatedContacts });
    setIsContactModalOpen(false);
    setCurrentContact(emptyContact);
    setIsEditingContact(false);
    onUpdate({ ...formData, contacts: updatedContacts });
  };

  const handleOpenContactModal = (contact?: Contact) => {
    if (contact) {
      setCurrentContact({
        id: contact.id,
        name: contact.name,
        title: contact.title,
        email: contact.email,
        phone: contact.phone,
        role: contact.role,
        isPrimary: contact.isPrimary,
      });
      setIsEditingContact(true);
    } else {
      setCurrentContact(emptyContact);
      setIsEditingContact(false);
    }
    setIsContactModalOpen(true);
  };

  const handleDeleteContact = (contactId: string) => {
    const updatedContacts = formData.contacts.filter(
      (contact) => contact.id !== contactId
    );
    setFormData({ ...formData, contacts: updatedContacts });
    onUpdate({ ...formData, contacts: updatedContacts });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Status och åtgärder */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-medium text-gray-900">Prospect Status</h3>
            <select
              value={formData.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {PROSPECT_STATUSES.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.name}
                </option>
              ))}
            </select>
          </div>
          {formData.status === 'qualified' && onConvertToCustomer && (
            <button
              onClick={handleConvertToCustomer}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            >
              <FaCheck className="mr-2" />
              Konvertera till kund
            </button>
          )}
        </div>
      </div>

      {/* Företagsinformation */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-medium text-gray-900">Företagsinformation</h3>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-blue-600 hover:text-blue-800"
          >
            <FaEdit className="h-5 w-5" />
          </button>
        </div>

        {!isEditing ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Företagsnamn</h3>
              <p className="mt-1">{customer.name}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Organisationsnummer</h3>
              <p className="mt-1">{customer.organizationNumber}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Besöksadress</h3>
              <p className="mt-1">
                {customer.visitingAddress.street}<br />
                {customer.visitingAddress.postalCode} {customer.visitingAddress.city}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Webbplats</h3>
              <p className="mt-1">
                <a href={customer.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                  {customer.website}
                </a>
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Bransch</h3>
              <p className="mt-1">{customer.industry}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Beskrivning</h3>
              <p className="mt-1">{customer.description}</p>
            </div>
          </div>
        ) : (
          <Dialog
            open={isEditing}
            onClose={() => setIsEditing(false)}
            className="fixed z-10 inset-0 overflow-y-auto"
          >
            <div className="flex items-center justify-center min-h-screen">
              <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

              <div className="relative bg-white rounded-lg p-8 max-w-md w-full mx-4">
                <Dialog.Title className="text-lg font-medium mb-4">
                  Redigera grundinformation
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Företagsnamn
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Organisationsnummer
                    </label>
                    <input
                      type="text"
                      name="organizationNumber"
                      value={formData.organizationNumber}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Webbplats
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Bransch
                    </label>
                    <input
                      type="text"
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Beskrivning
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex justify-end space-x-4 mt-6">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                    >
                      Avbryt
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      Spara
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </Dialog>
        )}
      </div>

      {/* Kontakter */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Kontakter</h3>
          <button
            onClick={() => handleOpenContactModal()}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Lägg till kontakt
          </button>
        </div>

        <div className="space-y-4">
          {formData.contacts.map((contact) => (
            <div
              key={contact.id}
              className="flex items-start justify-between p-4 border rounded-lg"
            >
              <div className="space-y-1">
                <div className="flex items-center">
                  <span className="font-medium">{contact.name}</span>
                  {contact.isPrimary && (
                    <FaStar className="ml-2 h-4 w-4 text-yellow-400" />
                  )}
                </div>
                <div className="text-sm text-gray-500">{contact.title}</div>
                <div className="text-sm text-gray-500">{contact.role}</div>
                <div className="flex items-center space-x-4 mt-2">
                  {contact.email && (
                    <a
                      href={`mailto:${contact.email}`}
                      className="flex items-center text-gray-600 hover:text-blue-600"
                    >
                      <FaEnvelope className="h-4 w-4 mr-1" />
                      {contact.email}
                    </a>
                  )}
                  {contact.phone && (
                    <a
                      href={`tel:${contact.phone}`}
                      className="flex items-center text-gray-600 hover:text-blue-600"
                    >
                      <FaPhone className="h-4 w-4 mr-1" />
                      {contact.phone}
                    </a>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleOpenContactModal(contact)}
                  className="text-gray-400 hover:text-blue-500"
                  title="Redigera kontakt"
                >
                  <FaEdit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDeleteContact(contact.id)}
                  className="text-gray-400 hover:text-red-500"
                  title="Ta bort kontakt"
                >
                  <FaTrash className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Kontakt Modal */}
      <Dialog
        open={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        className="fixed z-10 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

          <div className="relative bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <Dialog.Title className="text-lg font-medium mb-4">
              {isEditingContact ? 'Redigera kontakt' : 'Lägg till ny kontakt'}
            </Dialog.Title>

            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Namn
                </label>
                <input
                  type="text"
                  value={currentContact.name}
                  onChange={(e) =>
                    setCurrentContact({ ...currentContact, name: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Titel
                </label>
                <input
                  type="text"
                  value={currentContact.title}
                  onChange={(e) =>
                    setCurrentContact({ ...currentContact, title: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Roll/Funktion
                </label>
                <input
                  type="text"
                  value={currentContact.role}
                  onChange={(e) =>
                    setCurrentContact({ ...currentContact, role: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  E-post
                </label>
                <input
                  type="email"
                  value={currentContact.email}
                  onChange={(e) =>
                    setCurrentContact({ ...currentContact, email: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Telefon
                </label>
                <input
                  type="tel"
                  value={currentContact.phone}
                  onChange={(e) =>
                    setCurrentContact({ ...currentContact, phone: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPrimary"
                  checked={currentContact.isPrimary}
                  onChange={(e) =>
                    setCurrentContact({
                      ...currentContact,
                      isPrimary: e.target.checked,
                    })
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="isPrimary"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Sätt som primär kontakt
                </label>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsContactModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Avbryt
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  {isEditingContact ? 'Uppdatera' : 'Lägg till'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default ProspectInfo;
