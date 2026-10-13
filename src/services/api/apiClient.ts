/**
 * Mosunmola Cooperative API Client
 * Authoritative connection to Python backend (Flask + SQLAlchemy)
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

import type { ApiResponse } from '../../types';
export type { ApiResponse };

class ApiClient {
  private getAuthToken(): string | null {
    try {
      return localStorage.getItem('mosunmola_auth_token');
    } catch {
      return null;
    }
  }

  public setAuthToken(token: string | null) {
    try {
      if (token) {
        localStorage.setItem('mosunmola_auth_token', token);
      } else {
        localStorage.removeItem('mosunmola_auth_token');
      }
    } catch (e) {
      console.warn('Could not persist auth token', e);
    }
  }

  public async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const cleanBase = (API_BASE_URL || '/api').replace(/\/+$/, '');
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${cleanBase}${cleanEndpoint}`;
    const token = this.getAuthToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers as Record<string, string> || {})
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          this.setAuthToken(null);
        }
        return {
          success: false,
          message: data.message || `Request failed with status ${response.status}`,
          data: data.data
        };
      }

      return data as ApiResponse<T>;
    } catch (err: any) {
      console.error(`API Error on ${url}:`, err);
      return {
        success: false,
        message: err.message || 'Network error communicating with cooperative backend server.'
      };
    }
  }

  public get<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  public post<T = any>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined
    });
  }

  public patch<T = any>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined
    });
  }

  public delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
