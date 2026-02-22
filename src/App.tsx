import React, { useState, useEffect } from 'react';
import { HttpRequest, HttpResponse, RequestHistory, Environment, HttpMethod } from './types';
import RequestPanel from './components/RequestPanel';
import ResponsePanel from './components/ResponsePanel';
import Sidebar from './components/Sidebar';
import { makeHttpRequest } from './utils/request';
import { saveToHistory, getHistory, getSavedRequests, getEnvironments, getActiveEnvironment } from './utils/storage';
import { generateId } from './utils/request';

function App() {
  const [currentRequest, setCurrentRequest] = useState<HttpRequest>({
    id: generateId(),
    name: 'Untitled Request',
    method: 'GET',
    url: 'https://jsonplaceholder.typicode.com/posts/1',
    headers: {},
    body: '',
    bodyType: 'none',
    timestamp: Date.now()
  });

  const [response, setResponse] = useState<HttpResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<RequestHistory[]>([]);
  const [savedRequests, setSavedRequests] = useState<HttpRequest[]>([]);
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [activeEnvironment, setActiveEnvironment] = useState<string | null>(null);
  const [sidebarTab, setSidebarTab] = useState<'requests' | 'history' | 'environments'>('requests');

  useEffect(() => {
    // Load saved data
    setHistory(getHistory());
    setSavedRequests(getSavedRequests());
    setEnvironments(getEnvironments());
    setActiveEnvironment(getActiveEnvironment());

    // Listen for new request shortcut
    if (window.electronAPI) {
      window.electronAPI.onNewRequest(() => {
        handleNewRequest();
      });
    }

    return () => {
      if (window.electronAPI) {
        window.electronAPI.removeAllListeners('new-request');
      }
    };
  }, []);

  const handleSendRequest = async () => {
    if (!currentRequest.url.trim()) return;

    setIsLoading(true);
    setResponse(null);

    try {
      const result = await makeHttpRequest(currentRequest);
      setResponse(result);

      // Save to history
      const historyEntry: RequestHistory = {
        id: generateId(),
        request: { ...currentRequest },
        response: result,
        timestamp: Date.now()
      };
      
      saveToHistory(historyEntry);
      setHistory(getHistory());
    } catch (error) {
      console.error('Request failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewRequest = () => {
    setCurrentRequest({
      id: generateId(),
      name: 'Untitled Request',
      method: 'GET',
      url: '',
      headers: {},
      body: '',
      bodyType: 'none',
      timestamp: Date.now()
    });
    setResponse(null);
  };

  const handleMethodChange = (method: HttpMethod) => {
    setCurrentRequest(prev => ({ ...prev, method }));
  };

  const handleUrlChange = (url: string) => {
    setCurrentRequest(prev => ({ ...prev, url }));
  };

  const handleHeadersChange = (headers: Record<string, string>) => {
    setCurrentRequest(prev => ({ ...prev, headers }));
  };

  const handleBodyChange = (body: string, bodyType: 'none' | 'json' | 'text' | 'form-data') => {
    setCurrentRequest(prev => ({ ...prev, body, bodyType }));
  };

  const handleLoadRequest = (request: HttpRequest) => {
    setCurrentRequest(request);
    setResponse(null);
  };

  const handleLoadFromHistory = (historyItem: RequestHistory) => {
    setCurrentRequest(historyItem.request);
    setResponse(historyItem.response);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        requests={savedRequests}
        history={history}
        environments={environments}
        activeTab={sidebarTab}
        onTabChange={setSidebarTab}
        onRequestSelect={handleLoadRequest}
        onHistorySelect={handleLoadFromHistory}
        onNewRequest={handleNewRequest}
        currentRequest={currentRequest}
        onRequestSave={() => {
          setSavedRequests(getSavedRequests());
        }}
      />
      
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex">
          <RequestPanel 
            request={currentRequest}
            onMethodChange={handleMethodChange}
            onUrlChange={handleUrlChange}
            onHeadersChange={handleHeadersChange}
            onBodyChange={handleBodyChange}
            onSend={handleSendRequest}
            isLoading={isLoading}
          />
          
          <ResponsePanel 
            response={response}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}

export default App;