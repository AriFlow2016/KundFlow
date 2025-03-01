import React, { useState, useEffect, Fragment, useCallback } from 'react';
import { Transition, Dialog } from '@headlessui/react';
import { FaPlus, FaFileUpload, FaEdit, FaTrash, FaDownload, FaExclamationTriangle } from 'react-icons/fa';
import { format, differenceInDays } from 'date-fns';
import { sv } from 'date-fns/locale';
import { contractService } from '../../../services/contractService';
import { toast } from 'react-toastify';
import { Contract } from '../../../types/contract';
import { useDropzone } from 'react-dropzone';

interface CustomerContractsProps {
  customer: {
    id: string;
  };
}

interface FormData {
  name: string;
  startDate: string;
  endDate: string;
  operator: string;
  monthlyCost?: number;
  ocrStatus?: 'pending' | 'completed' | 'failed';
}

export const CustomerContracts: React.FC<CustomerContractsProps> = ({ customer }) => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    startDate: '',
    endDate: '',
    operator: '',
    monthlyCost: undefined,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const loadContracts = async () => {
    try {
      setIsLoading(true);
      const data = await contractService.getCustomerContracts(customer.id);
      setContracts(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Kunde inte hämta avtal');
      console.error('Error loading contracts:', error);
      setContracts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadContracts();
  }, [customer.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const contractData = {
        ...formData,
        customerId: customer.id,
      };

      if (selectedContract) {
        await contractService.updateContract(selectedContract.id, contractData);
        toast.success('Avtalet har uppdaterats');
      } else {
        await contractService.createContract(contractData);
        toast.success('Nytt avtal har skapats');
      }

      setIsOpen(false);
      setSelectedContract(null);
      setFormData({
        name: '',
        startDate: '',
        endDate: '',
        operator: '',
        monthlyCost: undefined,
      });
      loadContracts();
    } catch (error) {
      toast.error('Ett fel uppstod vid sparande av avtalet');
      console.error('Error saving contract:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async (contractId: string) => {
    if (!selectedFile) return;

    try {
      await contractService.uploadFile(contractId, selectedFile);
      toast.success('Filen har laddats upp');
      setSelectedFile(null);
      loadContracts();
    } catch (error) {
      toast.error('Kunde inte ladda upp filen');
      console.error('Error uploading file:', error);
    }
  };

  const handleDelete = async (contractId: string) => {
    if (window.confirm('Är du säker på att du vill ta bort detta avtal?')) {
      try {
        await contractService.deleteContract(contractId);
        toast.success('Avtalet har tagits bort');
        loadContracts();
      } catch (error) {
        toast.error('Kunde inte ta bort avtalet');
        console.error('Error deleting contract:', error);
      }
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      acceptedFiles.forEach(file => {
        formData.append('files', file);
      });
      formData.append('customerId', customer.id);
      
      const response = await contractService.uploadContracts(formData);
      toast.success(`${acceptedFiles.length} filer uppladdade för OCR-processering`);
      loadContracts();
    } catch (error) {
      toast.error('Fel vid uppladdning av filer');
      console.error('Error uploading files:', error);
    } finally {
      setIsLoading(false);
    }
  }, [customer.id]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: true
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Avtal</h3>
        <button
          onClick={() => {
            setSelectedContract(null);
            setIsOpen(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FaPlus className="mr-2 h-4 w-4" />
          Lägg till avtal
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-4">Laddar avtal...</div>
      ) : contracts.length === 0 ? (
        <div className="text-center py-4 text-gray-500">Inga avtal hittades</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Namn
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Operatör
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kostnad/mån
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Åtgärder
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contracts.map((contract) => {
                const daysUntilExpiry = contract.endDate
                  ? differenceInDays(new Date(contract.endDate), new Date())
                  : null;

                return (
                  <tr key={contract.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{contract.name}</div>
                      <div className="text-sm text-gray-500">
                        {contract.startDate && format(new Date(contract.startDate), 'yyyy-MM-dd', { locale: sv })}
                        {' - '}
                        {contract.endDate && format(new Date(contract.endDate), 'yyyy-MM-dd', { locale: sv })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {daysUntilExpiry !== null && (
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            daysUntilExpiry < 0
                              ? 'bg-red-100 text-red-800'
                              : daysUntilExpiry < 30
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {daysUntilExpiry < 0
                            ? 'Utgått'
                            : daysUntilExpiry < 30
                            ? `${daysUntilExpiry} dagar kvar`
                            : 'Aktivt'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contract.operator}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {contract.monthlyCost ? `${contract.monthlyCost} kr` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => {
                          setSelectedContract(contract);
                          setFormData({
                            name: contract.name,
                            startDate: contract.startDate || '',
                            endDate: contract.endDate || '',
                            operator: contract.operator || '',
                            monthlyCost: contract.monthlyCost,
                          });
                          setIsOpen(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <FaEdit className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(contract.id)} className="text-red-600 hover:text-red-900">
                        <FaTrash className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="p-4">
        <div {...getRootProps()} className={`border-2 border-dashed p-4 mb-4 ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
          <input {...getInputProps()} />
          <p className="text-center text-gray-600">
            {isDragActive ? 'Släpp filerna här...' : 'Dra och släpp PDF-filer här, eller klicka för att välja filer'}
          </p>
        </div>
      </div>

      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setIsOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-30 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                      {selectedContract ? 'Redigera avtal' : 'Lägg till nytt avtal'}
                    </Dialog.Title>

                    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Namn
                        </label>
                        <input
                          type="text"
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                          Startdatum
                        </label>
                        <input
                          type="date"
                          id="startDate"
                          value={formData.startDate}
                          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                          Slutdatum
                        </label>
                        <input
                          type="date"
                          id="endDate"
                          value={formData.endDate}
                          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="operator" className="block text-sm font-medium text-gray-700">
                          Operatör
                        </label>
                        <input
                          type="text"
                          id="operator"
                          value={formData.operator}
                          onChange={(e) => setFormData({ ...formData, operator: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label htmlFor="monthlyCost" className="block text-sm font-medium text-gray-700">
                          Månadskostnad (kr)
                        </label>
                        <input
                          type="number"
                          id="monthlyCost"
                          value={formData.monthlyCost || ''}
                          onChange={(e) =>
                            setFormData({ ...formData, monthlyCost: e.target.value ? Number(e.target.value) : undefined })
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>

                      <div className="mt-6 flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => {
                            setIsOpen(false);
                            setSelectedContract(null);
                          }}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                          Avbryt
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          {selectedContract ? 'Uppdatera' : 'Skapa'}
                        </button>
                      </div>
                    </form>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
};

export default CustomerContracts;
