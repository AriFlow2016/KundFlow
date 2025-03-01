import React, { useState, Fragment } from 'react';
import { Customer, Contact } from '../../../types/customer';
import { FaBuilding, FaGlobe, FaMapMarkerAlt, FaPhone, FaEnvelope, FaUser, FaStar, FaTrash, FaEdit } from 'react-icons/fa';
import { Dialog, Transition } from '@headlessui/react';

interface ProspectInfoProps {
  customer: Customer;
  onUpdate: (customer: Customer) => void;
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

const emptyContact: ContactFormData = {
  name: '',
  title: '',
  email: '',
  phone: '',
  role: '',
  isPrimary: false,
};

const ProspectInfo: React.FC<ProspectInfoProps> = ({ customer, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(customer);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState<ContactFormData>(emptyContact);
  const [isEditingContact, setIsEditingContact] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    setIsEditing(false);
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

  const handleDeleteContact = (contactId: string) => {
    const updatedContacts = formData.contacts.filter(
      (contact) => contact.id !== contactId
    );
    setFormData({ ...formData, contacts: updatedContacts });
    onUpdate({ ...formData, contacts: updatedContacts });
  };

  return (
    <div className="space-y-6">
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

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Organisationsnummer
              </label>
              <input
                type="text"
                value={formData.organizationNumber || ''}
                onChange={(e) =>
                  setFormData({ ...formData, organizationNumber: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Webbplats
              </label>
              <input
                type="url"
                value={formData.website || ''}
                onChange={(e) =>
                  setFormData({ ...formData, website: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Avbryt
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Spara
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center text-gray-600">
              <FaBuilding className="h-5 w-5 mr-2" />
              <span>{formData.organizationNumber || 'Ej angivet'}</span>
            </div>
            {formData.website && (
              <div className="flex items-center text-gray-600">
                <FaGlobe className="h-5 w-5 mr-2" />
                <a
                  href={formData.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  {formData.website}
                </a>
              </div>
            )}
          </div>
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
      <Transition appear show={isContactModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsContactModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    {isEditingContact ? 'Redigera kontakt' : 'Lägg till ny kontakt'}
                  </Dialog.Title>
                  <form onSubmit={handleContactSubmit} className="mt-4 space-y-4">
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
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default ProspectInfo;
