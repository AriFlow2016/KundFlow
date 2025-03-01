import { useState } from 'react';

export const Settings = () => {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API key saving
    console.log('API key saved:', apiKey);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Inställningar</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
            API Nyckel
          </label>
          <div className="mt-1">
            <input
              type="password"
              name="apiKey"
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Ange din API nyckel"
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Din API nyckel används för att ansluta till externa tjänster.
          </p>
        </div>

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Spara inställningar
          </button>
        </div>
      </form>
    </div>
  );
};
