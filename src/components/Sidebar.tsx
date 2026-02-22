import React, { useState } from 'react';
import { HttpRequest, RequestHistory, Environment } from '../types';
import { saveRequest, deleteRequest, clearHistory } from '../utils/storage';
import { formatDuration, getStatusColor } from '../utils/request';
import { 
  DocumentTextIcon, 
  ClockIcon, 
  CogIcon, 
  PlusIcon,
  TrashIcon,
  PlayIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline';

interface SidebarProps {
  requests: HttpRequest[];
  history: RequestHistory[];
  environments: Environment[];
  activeTab: 'requests' | 'history' | 'environments';
  onTabChange: (tab: 'requests' | 'history' | 'environments') => void;
  onRequestSelect: (request: HttpRequest) => void;
  onHistorySelect: (history: RequestHistory) => void;
  onNewRequest: () => void;
  currentRequest: HttpRequest;
  onRequestSave: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  requests,
  history,
  environments,
  activeTab,
  onTabChange,
  onRequestSelect,
  onHistorySelect,
  onNewRequest,
  currentRequest,
  onRequestSave
}) => {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [requestName, setRequestName] = useState('');

  const handleSaveRequest = () => {
    if (requestName.trim()) {
      const requestToSave = {
        ...currentRequest,
        name: requestName.trim(),
        timestamp: Date.now()
      };
      saveRequest(requestToSave);
      onRequestSave();
      setShowSaveDialog(false);
      setRequestName('');
    }
  };

  const handleDeleteRequest = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    deleteRequest(id);
    onRequestSave();
  };

  const handleClearHistory = () => {
    clearHistory();
    window.location.reload();
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'text-green-600';
      case 'POST': return 'text-blue-600';
      case 'PUT': return 'text-yellow-600';
      case 'DELETE': return 'text-red-600';
      case 'PATCH': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold text-gray-900">HTTP Client</h1>
          <button
            onClick={onNewRequest}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            title="New Request"
          >
            <PlusIcon className="w-5 h-5" />
          </button>
        </div>
        
        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => onTabChange('requests')}
            className={`flex-1 flex items-center justify-center px-3 py-2 text-sm rounded-md transition-colors ${
              activeTab === 'requests'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <DocumentTextIcon className="w-4 h-4 mr-2" />
            Requests
          </button>
          <button
            onClick={() => onTabChange('history')}
            className={`flex-1 flex items-center justify-center px-3 py-2 text-sm rounded-md transition-colors ${
              activeTab === 'history'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ClockIcon className="w-4 h-4 mr-2" />
            History
          </button>
          <button
            onClick={() => onTabChange('environments')}
            className={`flex-1 flex items-center justify-center px-3 py-2 text-sm rounded-md transition-colors ${
              activeTab === 'environments'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <CogIcon className="w-4 h-4 mr-2" />
            Env
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'requests' && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-900">Saved Requests</h3>
              <button
                onClick={() => {
                  setRequestName(currentRequest.name);
                  setShowSaveDialog(true);
                }}
                className="flex items-center px-2 py-1 text-xs text-blue-600 hover:text-blue-700"
              >
                <BookmarkIcon className="w-3 h-3 mr-1" />
                Save Current
              </button>
            </div>
            
            <div className="space-y-2">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 group"
                  onClick={() => onRequestSelect(request)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs font-medium ${getMethodColor(request.method)}`}>
                          {request.method}
                        </span>
                        <span className="text-sm font-medium text-gray-900 truncate">
                          {request.name}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-1">
                        {request.url}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDeleteRequest(request.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {requests.length === 0 && (
              <div className="text-center py-8">
                <DocumentTextIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-sm text-gray-500">No saved requests yet</p>
                <p className="text-xs text-gray-400 mt-1">Save your current request to see it here</p>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'history' && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-900">Request History</h3>
              {history.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  className="text-xs text-red-600 hover:text-red-700"
                >
                  Clear All
                </button>
              )}
            </div>
            
            <div className="space-y-2">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                  onClick={() => onHistorySelect(item)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs font-medium ${getMethodColor(item.request.method)}`}>
                        {item.request.method}
                      </span>
                      <span className={`text-xs font-medium ${getStatusColor(item.response.status)}`}>
                        {item.response.status}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatDuration(item.response.duration)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-900 truncate">
                    {item.request.url}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(item.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            
            {history.length === 0 && (
              <div className="text-center py-8">
                <ClockIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-sm text-gray-500">No requests sent yet</p>
                <p className="text-xs text-gray-400 mt-1">Your request history will appear here</p>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'environments' && (
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Environments</h3>
            <div className="text-center py-8">
              <CogIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-sm text-gray-500">Environment management</p>
              <p className="text-xs text-gray-400 mt-1">Coming in a future update</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Save Request</h3>
            <input
              type="text"
              value={requestName}
              onChange={(e) => setRequestName(e.target.value)}
              placeholder="Enter request name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveRequest();
                if (e.key === 'Escape') setShowSaveDialog(false);
              }}
            />
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRequest}
                disabled={!requestName.trim()}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;