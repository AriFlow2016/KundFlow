import React, { useState } from 'react';
import { Customer, Contact } from '../../../types/customer';
import { FaUser, FaEnvelope, FaPhone, FaBriefcase, FaStar, FaTrash, FaEdit } from 'react-icons/fa';
import { Dialog } from '@headlessui/react';

interface CustomerContactsProps {
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

export default function CustomerContacts({ customer, onUpdate }: CustomerContactsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState<ContactFormData>(emptyContact);
  const [isEditing, setIsEditing] = useState(false);

  const handleOpenModal = (contact?: Contact) => {
    if (contact) {
      setCurrentContact(contact);
      setIsEditing(true);
    } else {
      setCurrentContact(emptyContact);
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedContacts = isEditing
      ? customer.contacts.map(c => c.id === currentContact.id ? currentContact : c)
      : [...customer.contacts, { ...currentContact, id: crypto.randomUUID() }];

    // Om den nya/uppdaterade kontakten är primär, se till att inga andra är det
    if (currentContact.isPrimary) {
      updatedContacts.forEach(c => {
        if (c.id !== currentContact.id) {
          c.isPrimary = false;
        }
      });
    }

    onUpdate({
      ...customer,
      contacts: updatedContacts,
    });

    setIsModalOpen(false);
    setCurrentContact(emptyContact);
  };

  const handleDelete = (contactId: string) => {
    if (window.confirm('Är du säker på att du vill ta bort denna kontakt?')) {
      onUpdate({
        ...customer,
        contacts: customer.contacts.filter(c => c.id !== contactId),
      });
    }
  };

  const setPrimaryContact = (contactId: string) => {
    const updatedContacts = customer.contacts.map(c => ({
      ...c,
      isPrimary: c.id === contactId,
    }));

    onUpdate({
      ...customer,
      contacts: updatedContacts,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header med Lägg till-knapp */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Kontaktpersoner</h3>
        <button
          type="button"
          onClick={() => handleOpenModal()}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          Lägg till kontakt
        </button>
      </div>

      {/* Kontaktlista */}
      <div className="grid grid-cols-1 gap-4">
        {customer.contacts.map((contact) => (
          <div
            key={contact.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <FaUser className="text-gray-500" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-lg font-medium text-gray-900">{contact.name}</h4>
                    {contact.isPrimary && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <FaStar className="mr-1" />
                        Primär kontakt
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{contact.title}</p>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center text-sm text-gray-500">
                      <FaBriefcase className="mr-2" />
                      {contact.role}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <FaEnvelope className="mr-2" />
                      <a href={`mailto:${contact.email}`} className="text-blue-600 hover:text-blue-800">
                        {contact.email}
                      </a>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <FaPhone className="mr-2" />
                      <a href={`tel:${contact.phone}`} className="text-blue-600 hover:text-blue-800">
                        {contact.phone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                {!contact.isPrimary && (
                  <button
                    onClick={() => setPrimaryContact(contact.id)}
                    className="text-gray-400 hover:text-yellow-500"
                    title="Sätt som primär kontakt"
                  >
                    <FaStar />
                  </button>
                )}
                <button
                  onClick={() => handleOpenModal(contact)}
                  className="text-gray-400 hover:text-blue-500"
                  title="Redigera kontakt"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(contact.id)}
                  className="text-gray-400 hover:text-red-500"
                  title="Ta bort kontakt"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal för att lägga till/redigera kontakt */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="fixed inset-0 z-10 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

          <div className="relative bg-white rounded-lg max-w-md w-full mx-4 p-6">
            <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
              {isEditing ? 'Redigera kontakt' : 'Lägg till ny kontakt'}
            </Dialog.Title>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Namn</label>
                <input
                  type="text"
                  value={currentContact.name}
                  onChange={(e) => setCurrentContact({ ...currentContact, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Titel</label>
                <input
                  type="text"
                  value={currentContact.title}
                  onChange={(e) => setCurrentContact({ ...currentContact, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Roll/Funktion</label>
                <input
                  type="text"
                  value={currentContact.role}
                  onChange={(e) => setCurrentContact({ ...currentContact, role: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">E-post</label>
                <input
                  type="email"
                  value={currentContact.email}
                  onChange={(e) => setCurrentContact({ ...currentContact, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Telefon</label>
                <input
                  type="tel"
                  value={currentContact.phone}
                  onChange={(e) => setCurrentContact({ ...currentContact, phone: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPrimary"
                  checked={currentContact.isPrimary}
                  onChange={(e) => setCurrentContact({ ...currentContact, isPrimary: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isPrimary" className="ml-2 block text-sm text-gray-900">
                  Sätt som primär kontakt
                </label>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Avbryt
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  {isEditing ? 'Uppdatera' : 'Lägg till'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
