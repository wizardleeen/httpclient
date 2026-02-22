export interface HttpRequest {
  id: string;
  name: string;
  method: HttpMethod;
  url: string;
  headers: Record<string, string>;
  body?: string;
  bodyType: 'none' | 'json' | 'text' | 'form-data';
  timestamp: number;
}

export interface HttpResponse {
  data: any;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  duration: number;
  size: number;
  error?: string;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

export interface Environment {
  id: string;
  name: string;
  variables: Record<string, string>;
}

export interface RequestHistory {
  id: string;
  request: HttpRequest;
  response: HttpResponse;
  timestamp: number;
}

export interface AppState {
  currentRequest: HttpRequest;
  response: HttpResponse | null;
  history: RequestHistory[];
  environments: Environment[];
  activeEnvironment: string | null;
  isLoading: boolean;
}

declare global {
  interface Window {
    electronAPI: {
      makeHttpRequest: (config: any) => Promise<any>;
      onNewRequest: (callback: () => void) => void;
      removeAllListeners: (channel: string) => void;
    };
  }
}