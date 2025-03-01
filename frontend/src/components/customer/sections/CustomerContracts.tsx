import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { FaFileUpload, FaDownload, FaExclamationTriangle } from 'react-icons/fa';
import { Contract } from '../../../types/contract';
import { contractService } from '../../../services/contractService';
import { Customer } from '../../../types/customer';

interface CustomerContractsProps {
  customer: Customer;
  onUpdate: (customer: Customer) => void;
}

interface ContractFormData {
  customerId: string;
  name: string;
  startDate: string;
  endDate: string;
  operator: string;
  monthlyCost?: number;
  file?: File;
  ocrStatus?: 'pending' | 'completed' | 'failed';
}

export const CustomerContracts: React.FC<CustomerContractsProps> = ({ customer }) => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<ContractFormData>({
    customerId: customer.id,
    name: '',
    startDate: '',
    endDate: '',
    operator: '',
  });

  useEffect(() => {
    loadContracts();
  }, [customer.id]);

  const loadContracts = async () => {
    try {
      const data = await contractService.getCustomerContracts(customer.id);
      setContracts(data);
    } catch (error) {
      console.error('Error loading contracts:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined) {
          form.append(key, value.toString());
        }
      });

      if (selectedFile) {
        form.append('file', selectedFile);
      }

      await contractService.createContract(form);
      setIsModalOpen(false);
      loadContracts();
      resetForm();
    } catch (error) {
      console.error('Error creating contract:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      customerId: customer.id,
      name: '',
      startDate: '',
      endDate: '',
      operator: '',
    });
    setSelectedFile(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Kontrakt</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Lägg till kontrakt
        </button>
      </div>

      <div className="space-y-4">
        {contracts.map((contract) => (
          <div
            key={contract.id}
            className="border rounded p-4 flex justify-between items-center"
          >
            <div>
              <h3 className="font-medium">{contract.name}</h3>
              <p className="text-sm text-gray-600">
                {contract.startDate} - {contract.endDate}
              </p>
              <p className="text-sm text-gray-600">Operatör: {contract.operator}</p>
            </div>
            <div>
              <a
                href={contractService.getDocumentUrl(contract.documentUrl)}
                className="text-blue-600 hover:text-blue-800 mr-4"
                target="_blank"
                rel="noopener noreferrer"
              >
                Visa dokument
              </a>
            </div>
          </div>
        ))}
      </div>

      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="fixed z-10 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

          <div className="relative bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <Dialog.Title className="text-lg font-medium mb-4">
              Lägg till nytt kontrakt
            </Dialog.Title>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Namn
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Startdatum
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Slutdatum
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Operatör
                </label>
                <input
                  type="text"
                  name="operator"
                  value={formData.operator}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Månadskostnad
                </label>
                <input
                  type="number"
                  name="monthlyCost"
                  value={formData.monthlyCost || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Dokument
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="mt-1 block w-full"
                  accept=".pdf,.doc,.docx"
                />
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
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
    </div>
  );
};
