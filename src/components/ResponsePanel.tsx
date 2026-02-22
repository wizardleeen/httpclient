import React, { useState } from 'react';
import { HttpResponse } from '../types';
import { formatDuration, formatResponseSize, getStatusColor } from '../utils/request';
import { ClockIcon, ScaleIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface ResponsePanelProps {
  response: HttpResponse | null;
  isLoading: boolean;
}

const ResponsePanel: React.FC<ResponsePanelProps> = ({ response, isLoading }) => {
  const [activeTab, setActiveTab] = useState<'body' | 'headers'>('body');
  const [jsonExpanded, setJsonExpanded] = useState<Record<string, boolean>>({});

  const formatJson = (obj: any, level = 0): JSX.Element => {
    if (obj === null) return <span className="text-gray-500">null</span>;
    if (obj === undefined) return <span className="text-gray-500">undefined</span>;
    if (typeof obj === 'string') return <span className="text-green-600">"${obj}"</span>;
    if (typeof obj === 'number') return <span className="text-blue-600">{obj}</span>;
    if (typeof obj === 'boolean') return <span className="text-purple-600">{obj.toString()}</span>;

    if (Array.isArray(obj)) {
      if (obj.length === 0) return <span>[]</span>;
      const key = `array-${level}`;
      const expanded = jsonExpanded[key] ?? true;
      
      return (
        <div>
          <button
            onClick={() => setJsonExpanded(prev => ({ ...prev, [key]: !expanded }))}
            className="text-gray-600 hover:text-gray-800"
          >
            {expanded ? '▼' : '▶'} [{obj.length}]
          </button>
          {expanded && (
            <div className="ml-4 border-l border-gray-200 pl-4">
              {obj.map((item, index) => (
                <div key={index} className="py-1">
                  <span className="text-gray-500">{index}: </span>
                  {formatJson(item, level + 1)}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (typeof obj === 'object') {
      const keys = Object.keys(obj);
      if (keys.length === 0) return <span>{'{}'}</span>;
      
      const key = `object-${level}`;
      const expanded = jsonExpanded[key] ?? true;
      
      return (
        <div>
          <button
            onClick={() => setJsonExpanded(prev => ({ ...prev, [key]: !expanded }))}
            className="text-gray-600 hover:text-gray-800"
          >
            {expanded ? '▼' : '▶'} {'{'}...{'}'}
          </button>
          {expanded && (
            <div className="ml-4 border-l border-gray-200 pl-4">
              {keys.map(objKey => (
                <div key={objKey} className="py-1">
                  <span className="text-orange-600">"{objKey}"</span>
                  <span className="text-gray-500">: </span>
                  {formatJson(obj[objKey], level + 1)}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return <span>{String(obj)}</span>;
  };

  const renderResponseBody = () => {
    if (!response) return null;

    let content;
    try {
      if (typeof response.data === 'object') {
        content = (
          <div className="json-viewer p-4">
            {formatJson(response.data)}
          </div>
        );
      } else if (typeof response.data === 'string') {
        // Try to parse as JSON
        try {
          const parsed = JSON.parse(response.data);
          content = (
            <div className="json-viewer p-4">
              {formatJson(parsed)}
            </div>
          );
        } catch {
          // Not JSON, display as text
          content = (
            <pre className="p-4 text-sm whitespace-pre-wrap">
              {response.data}
            </pre>
          );
        }
      } else {
        content = (
          <pre className="p-4 text-sm">
            {String(response.data)}
          </pre>
        );
      }
    } catch (error) {
      content = (
        <pre className="p-4 text-sm text-red-600">
          Error displaying response: {String(error)}
        </pre>
      );
    }

    return content;
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Response</h2>
          
          {response && (
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                {response.error ? (
                  <XCircleIcon className="w-4 h-4 text-red-500" />
                ) : (
                  <CheckCircleIcon className="w-4 h-4 text-green-500" />
                )}
                <span className={`font-medium ${getStatusColor(response.status)}`}>
                  {response.status} {response.statusText}
                </span>
              </div>
              
              <div className="flex items-center space-x-1 text-gray-500">
                <ClockIcon className="w-4 h-4" />
                <span>{formatDuration(response.duration)}</span>
              </div>
              
              <div className="flex items-center space-x-1 text-gray-500">
                <ScaleIcon className="w-4 h-4" />
                <span>{formatResponseSize(response.size)}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-sm text-gray-500">Sending request...</p>
          </div>
        </div>
      )}

      {!isLoading && !response && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <PlayIcon className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-lg font-medium text-gray-900 mb-2">Ready to send a request</p>
            <p className="text-sm text-gray-500">Enter a URL and click Send to get started</p>
          </div>
        </div>
      )}

      {!isLoading && response && (
        <>
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-4">
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
              <button
                onClick={() => setActiveTab('headers')}
                className={`py-3 text-sm font-medium border-b-2 ${
                  activeTab === 'headers'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Headers ({Object.keys(response.headers || {}).length})
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto">
            {activeTab === 'body' && (
              <div className="h-full">
                {response.error ? (
                  <div className="p-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-red-800 mb-2">Request Failed</h4>
                      <p className="text-sm text-red-700">{response.error}</p>
                      {response.data && (
                        <pre className="mt-3 text-xs text-red-600 bg-red-100 p-2 rounded">
                          {typeof response.data === 'string' ? response.data : JSON.stringify(response.data, null, 2)}
                        </pre>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="scrollbar-thin overflow-auto h-full">
                    {renderResponseBody()}
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'headers' && (
              <div className="p-4">
                <div className="space-y-2">
                  {Object.entries(response.headers || {}).map(([key, value]) => (
                    <div key={key} className="flex py-2 border-b border-gray-100">
                      <div className="w-1/3 pr-4">
                        <span className="font-medium text-sm text-gray-700">{key}:</span>
                      </div>
                      <div className="w-2/3">
                        <span className="text-sm text-gray-900">{String(value)}</span>
                      </div>
                    </div>
                  ))}
                  
                  {Object.keys(response.headers || {}).length === 0 && (
                    <p className="text-sm text-gray-500 italic">No headers received</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const PlayIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default ResponsePanel;