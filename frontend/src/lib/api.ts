/**
 * API client for backend communication.
 * Handles authentication tokens and request/response formatting.
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

// Token storage keys
const TOKEN_KEY = "tastemap_token";
const TOKEN_EXPIRES_KEY = "tastemap_token_expires";

export interface TokenData {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface UserData {
  id: number;
  username: string;
  email: string;
  name?: string;
  bio?: string;
  avatar?: string;
  cover?: string;
  title?: string;
  location?: string;
  phone?: string;
  joined_at?: string;
  xp: number;
  level: number;
}

export interface AuthResponse {
  token: TokenData;
  user: UserData;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  name?: string;
}

// ─── Token Management ───

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: TokenData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token.access_token);
  const expiresAt = Date.now() + token.expires_in * 1000;
  localStorage.setItem(TOKEN_EXPIRES_KEY, expiresAt.toString());
}

export function clearToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRES_KEY);
}

export function isTokenValid(): boolean {
  if (typeof window === "undefined") return false;
  const token = getToken();
  const expiresAt = localStorage.getItem(TOKEN_EXPIRES_KEY);
  if (!token || !expiresAt) return false;
  return Date.now() < parseInt(expiresAt, 10);
}

// ─── API Client ───

async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  // Add auth token if available
  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ detail: "Unknown error" }));
    // Backend returns FastAPI error format: { detail: string } or { detail: [{ msg: string }] }
    let errorMessage: string;
    if (typeof errorData.detail === "string") {
      errorMessage = errorData.detail;
    } else if (Array.isArray(errorData.detail) && errorData.detail[0]?.msg) {
      errorMessage = errorData.detail[0].msg;
    } else if (errorData.message) {
      errorMessage = errorData.message;
    } else {
      errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  // Handle empty responses (204 No Content)
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

// ─── Auth API ───

export const authApi = {
  /**
   * Login with email and password
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await fetchWithAuth<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    // Store token on successful login
    setToken(response.token);
    return response;
  },

  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await fetchWithAuth<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });

    // Store token on successful registration
    setToken(response.token);
    return response;
  },

  /**
   * Get current user info using stored token
   */
  async getCurrentUser(): Promise<UserData> {
    return fetchWithAuth<UserData>("/auth/me");
  },

  /**
   * Logout - clear stored token
   */
  logout(): void {
    clearToken();
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return isTokenValid();
  },
};

// ─── User API ───

export const userApi = {
  /**
   * Get user profile (full profile data)
   */
  async getProfile(userId: number) {
    return fetchWithAuth(`/users/${userId}/profile`);
  },

  /**
   * Get my profile (current user)
   */
  async getMyProfile() {
    return fetchWithAuth("/users/me/profile");
  },

  /**
   * Update user info
   */
  async updateUser(userId: number, data: Partial<UserData>) {
    return fetchWithAuth<UserData>(`/users/${userId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
};

const api = {
  auth: authApi,
  user: userApi,
};

export default api;
