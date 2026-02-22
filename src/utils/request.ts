import { HttpRequest, HttpResponse } from '../types';

export const makeHttpRequest = async (request: HttpRequest): Promise<HttpResponse> => {
  const startTime = Date.now();
  
  try {
    const config = {
      method: request.method.toLowerCase(),
      url: request.url,
      headers: request.headers,
      timeout: 30000
    };

    if (request.body && request.method !== 'GET' && request.method !== 'HEAD') {
      if (request.bodyType === 'json') {
        try {
          config.data = JSON.parse(request.body);
          config.headers['Content-Type'] = 'application/json';
        } catch (e) {
          config.data = request.body;
        }
      } else {
        config.data = request.body;
      }
    }

    const result = await window.electronAPI.makeHttpRequest(config);
    const duration = Date.now() - startTime;

    if (result.error) {
      return {
        data: result.response?.data || result.message,
        status: result.response?.status || 0,
        statusText: result.response?.statusText || 'Error',
        headers: result.response?.headers || {},
        duration,
        size: JSON.stringify(result.response?.data || result.message).length,
        error: result.message
      };
    }

    return {
      data: result.data,
      status: result.status,
      statusText: result.statusText,
      headers: result.headers,
      duration,
      size: JSON.stringify(result.data).length
    };
  } catch (error: any) {
    const duration = Date.now() - startTime;
    return {
      data: error.message,
      status: 0,
      statusText: 'Network Error',
      headers: {},
      duration,
      size: error.message.length,
      error: error.message
    };
  }
};

export const formatResponseSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatDuration = (ms: number): string => {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
};

export const getStatusColor = (status: number): string => {
  if (status >= 200 && status < 300) return 'text-green-600';
  if (status >= 300 && status < 400) return 'text-yellow-600';
  if (status >= 400 && status < 500) return 'text-orange-600';
  if (status >= 500) return 'text-red-600';
  return 'text-gray-600';
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};