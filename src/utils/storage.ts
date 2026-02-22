import { HttpRequest, RequestHistory, Environment } from '../types';

const STORAGE_KEYS = {
  REQUESTS: 'http-client-requests',
  HISTORY: 'http-client-history',
  ENVIRONMENTS: 'http-client-environments',
  ACTIVE_ENV: 'http-client-active-env'
};

export const saveRequest = (request: HttpRequest): void => {
  try {
    const requests = getSavedRequests();
    const existingIndex = requests.findIndex(r => r.id === request.id);
    
    if (existingIndex >= 0) {
      requests[existingIndex] = request;
    } else {
      requests.push(request);
    }
    
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
  } catch (error) {
    console.error('Failed to save request:', error);
  }
};

export const getSavedRequests = (): HttpRequest[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.REQUESTS);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Failed to load requests:', error);
    return [];
  }
};

export const deleteRequest = (id: string): void => {
  try {
    const requests = getSavedRequests();
    const filtered = requests.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to delete request:', error);
  }
};

export const saveToHistory = (history: RequestHistory): void => {
  try {
    const historyList = getHistory();
    historyList.unshift(history);
    
    // Keep only last 100 entries
    const trimmed = historyList.slice(0, 100);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(trimmed));
  } catch (error) {
    console.error('Failed to save history:', error);
  }
};

export const getHistory = (): RequestHistory[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Failed to load history:', error);
    return [];
  }
};

export const clearHistory = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
  } catch (error) {
    console.error('Failed to clear history:', error);
  }
};

export const saveEnvironments = (environments: Environment[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.ENVIRONMENTS, JSON.stringify(environments));
  } catch (error) {
    console.error('Failed to save environments:', error);
  }
};

export const getEnvironments = (): Environment[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.ENVIRONMENTS);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Failed to load environments:', error);
    return [];
  }
};

export const setActiveEnvironment = (envId: string | null): void => {
  try {
    if (envId) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_ENV, envId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_ENV);
    }
  } catch (error) {
    console.error('Failed to set active environment:', error);
  }
};

export const getActiveEnvironment = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_ENV);
  } catch (error) {
    console.error('Failed to get active environment:', error);
    return null;
  }
};