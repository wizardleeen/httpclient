import React, { useState } from 'react';
import { HttpMethod, HttpRequest } from '../types';
import { PlayIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface RequestPanelProps {
  request: HttpRequest;
  onMethodChange: (method: HttpMethod) => void;
  onUrlChange: (url: string) => void;
  onHeadersChange: (headers: Record<string, string>) => void;
  onBodyChange: (body: string, bodyType: 'none' | 'json' | 'text' | 'form-data') => void;
  onSend: () => void;
  isLoading: boolean;
}

const HTTP_METHODS: HttpMethod[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];

const RequestPanel: React.FC<RequestPanelProps> = ({
  request,
  onMethodChange,
  onUrlChange,
  onHeadersChange,
  onBodyChange,
  onSend,
  isLoading
}) => {
  const [activeTab, setActiveTab] = useState<'headers' | 'body'>('headers');
  const [headerEntries, setHeaderEntries] = useState<Array<{key: string; value: string; enabled: boolean}>>(
    Object.entries(request.headers).map(([key, value]) => ({ key, value, enabled: true }))
  );

  React.useEffect(() => {
    setHeaderEntries(
      Object.entries(request.headers).map(([key, value]) => ({ key, value, enabled: true }))
    );
  }, [request.headers]);

  const handleHeaderChange = (index: number, field: 'key' | 'value', value: string) => {
    const newEntries = [...headerEntries];
    newEntries[index][field] = value;
    setHeaderEntries(newEntries);
    
    // Update headers object
    const headers: Record<string, string> = {};
    newEntries.forEach(entry => {
      if (entry.enabled && entry.key.trim() && entry.value.trim()) {
        headers[entry.key.trim()] = entry.value.trim();
      }
    });
    onHeadersChange(headers);
  };

  const handleToggleHeader = (index: number) => {
    const newEntries = [...headerEntries];
    newEntries[index].enabled = !newEntries[index].enabled;
    setHeaderEntries(newEntries);
    
    const headers: Record<string, string> = {};
    newEntries.forEach(entry => {
      if (entry.enabled && entry.key.trim() && entry.value.trim()) {
        headers[entry.key.trim()] = entry.value.trim();
      }
    });
    onHeadersChange(headers);
  };

  const addHeaderRow = () => {
    setHeaderEntries([...headerEntries, { key: '', value: '', enabled: true }]);
  };

  const removeHeaderRow = (index: number) => {
    const newEntries = headerEntries.filter((_, i) => i !== index);
    setHeaderEntries(newEntries);
    
    const headers: Record<string, string> = {};
    newEntries.forEach(entry => {
      if (entry.enabled && entry.key.trim() && entry.value.trim()) {
        headers[entry.key.trim()] = entry.value.trim();
      }
    });
    onHeadersChange(headers);
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-green-100 text-green-800 border-green-200';
      case 'POST': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PUT': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'DELETE': return 'bg-red-100 text-red-800 border-red-200';
      case 'PATCH': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'HEAD': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'OPTIONS': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white border-r border-gray-200">
      {/* Request URL Bar */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex space-x-2">
          <select
            value={request.method}
            onChange={(e) => onMethodChange(e.target.value as HttpMethod)}
            className={`px-3 py-2 border rounded-lg font-medium text-sm ${getMethodColor(request.method)} focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            {HTTP_METHODS.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
          
          <input
            type="text"
            value={request.url}
            onChange={(e) => onUrlChange(e.target.value)}
            placeholder="Enter request URL"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={handleKeyDown}
          />
          
          <button
            onClick={onSend}
            disabled={isLoading || !request.url.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <PlayIcon className="w-4 h-4" />
            <span>{isLoading ? 'Sending...' : 'Send'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-8 px-4">
          <button
            onClick={() => setActiveTab('headers')}
            className={`py-3 text-sm font-medium border-b-2 ${
              activeTab === 'headers'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Headers
          </button>
          <button
            onClick={() => setActiveTab('body')}
            className={`py-3 text-sm font-medium border-b-2 ${
              activeTab === 'body'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Body
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'headers' && (
          <div className="p-4">
            <div className="space-y-2">
              {headerEntries.map((header, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={header.enabled}
                    onChange={() => handleToggleHeader(index)}
                    className="rounded border-gray-300"
                  />
                  <input
                    type="text"
                    value={header.key}
                    onChange={(e) => handleHeaderChange(index, 'key', e.target.value)}
                    placeholder="Header name"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={header.value}
                    onChange={(e) => handleHeaderChange(index, 'value', e.target.value)}
                    placeholder="Header value"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => removeHeaderRow(index)}
                    className="p-2 text-gray-400 hover:text-red-600"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              <button
                onClick={addHeaderRow}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Add Header</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'body' && (
          <div className="p-4">
            <div className="mb-4">
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="none"
                    checked={request.bodyType === 'none'}
                    onChange={(e) => onBodyChange(request.body, e.target.value as any)}
                    className="mr-2"
                  />
                  None
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="json"
                    checked={request.bodyType === 'json'}
                    onChange={(e) => onBodyChange(request.body, e.target.value as any)}
                    className="mr-2"
                  />
                  JSON
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="text"
                    checked={request.bodyType === 'text'}
                    onChange={(e) => onBodyChange(request.body, e.target.value as any)}
                    className="mr-2"
                  />
                  Text
                </label>
              </div>
            </div>
            
            {request.bodyType !== 'none' && (
              <textarea
                value={request.body}
                onChange={(e) => onBodyChange(e.target.value, request.bodyType)}
                placeholder={request.bodyType === 'json' ? '{\n  "key": "value"\n}' : 'Enter request body'}
                className="w-full h-64 p-3 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestPanel;