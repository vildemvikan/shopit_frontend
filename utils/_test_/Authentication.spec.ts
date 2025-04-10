import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import {
  getToken,
  registerUser,
  logout,
  sendResetEmail,
  validateResetToken,
  resetPasswordWithToken,
  refreshToken
} from '../Authentication'; // Adjust the path as needed

vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Auth API functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getToken sends credentials and returns data', async () => {
    const mockData = { accessToken: 'abc123' };
    mockedAxios.post.mockResolvedValue({ data: mockData });

    const result = await getToken('user@example.com', 'pass123');
    expect(result).toEqual(mockData);
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'http://localhost:8080/auth/login',
      { email: 'user@example.com', password: 'pass123' },
      expect.objectContaining({
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
        withCredentials: true
      })
    );
  });

  it('registerUser sends registration data and returns response', async () => {
    const mockResponse = { status: 201 };
    mockedAxios.post.mockResolvedValue(mockResponse);

    const result = await registerUser('new@example.com', 'Jane', 'Doe', 'pw123');
    expect(result).toEqual(mockResponse);
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'http://localhost:8080/auth/register',
      {
        email: 'new@example.com',
        firstName: 'Jane',
        lastName: 'Doe',
        password: 'pw123',
      },
      expect.objectContaining({ withCredentials: true })
    );
  });

  it('logout sends token and returns status', async () => {
    mockedAxios.post.mockResolvedValue({ status: 200 });

    const result = await logout('token-abc');
    expect(result).toBe(200);
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'http://localhost:8080/auth/logout',
      {},
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer token-abc'
        }),
        withCredentials: true
      })
    );
  });

  it('sendResetEmail calls forgot-password endpoint', async () => {
    const mockResponse = { data: 'Email sent' };
    mockedAxios.post.mockResolvedValue(mockResponse);

    const result = await sendResetEmail('user@example.com');
    expect(result).toEqual(mockResponse);
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'http://localhost:8080/auth/forgot-password',
      { email: 'user@example.com' },
      expect.objectContaining({
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
      })
    );
  });

  it('validateResetToken sends token and email, returns data', async () => {
    const mockData = { valid: true, message: 'Valid' };
    mockedAxios.get.mockResolvedValue({ data: mockData });

    const result = await validateResetToken('token123', 'email@example.com');
    expect(result).toEqual(mockData);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      'http://localhost:8080/auth/validate-reset-token',
      expect.objectContaining({
        params: { token: 'token123', email: 'email@example.com' }
      })
    );
  });

  it('validateResetToken handles error response with data', async () => {
    mockedAxios.get.mockRejectedValue({
      response: { data: { valid: false, message: 'Invalid token' } }
    });

    const result = await validateResetToken('bad-token', 'email@example.com');
    expect(result).toEqual({ valid: false, message: 'Invalid token' });
  });

  it('resetPasswordWithToken sends reset request and returns response', async () => {
    const mockResponse = { status: 200 };
    mockedAxios.post.mockResolvedValue(mockResponse);

    const result = await resetPasswordWithToken('token', 'email@example.com', 'newpass');
    expect(result).toEqual(mockResponse);
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'http://localhost:8080/auth/reset-password',
      {
        token: 'token',
        email: 'email@example.com',
        newPassword: 'newpass',
      },
      expect.anything()
    );
  });

  it('refreshToken calls refresh endpoint and returns data', async () => {
    const mockData = { accessToken: 'refreshed-token' };
    mockedAxios.post.mockResolvedValue({ data: mockData });

    const result = await refreshToken();
    expect(result).toEqual(mockData);
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'http://localhost:8080/auth/refresh',
      {},
      expect.objectContaining({
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
        withCredentials: true,
      })
    );
  });
});
