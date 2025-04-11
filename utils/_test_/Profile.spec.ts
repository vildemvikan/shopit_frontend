import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import * as userAPI from '../Profile';
import { Status } from '@/enums/enums';

vi.mock('axios');
vi.mock('@/stores/tokenStore', () => ({
  useTokenStore: () => ({
    getToken: 'mocked-token',
  }),
}));

const mockedAxios = axios as unknown as jest.Mocked<typeof axios>;

describe('user.ts API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetchUserInformation - success', async () => {
    const mockData = { name: 'Alice' };
    mockedAxios.get.mockResolvedValue({ data: mockData });

    const result = await userAPI.fetchUserInformation();
    expect(result).toEqual(mockData);
    expect(mockedAxios.get).toHaveBeenCalledWith('http://127.0.0.1:8080/me', expect.anything());
  });

  it('fetchUserInformation - failure', async () => {
    mockedAxios.get.mockRejectedValue(new Error('fail'));
    const result = await userAPI.fetchUserInformation();
    expect(result).toBeInstanceOf(Error);
  });

  it('fetchUserAdvertisements - descending (default)', async () => {
    const mockData = [{ id: 1 }];
    mockedAxios.get.mockResolvedValue({ data: mockData });

    const result = await userAPI.fetchUserAdvertisements(5, 0, 1, Status.Active);
    expect(result).toEqual(mockData);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      'http://127.0.0.1:8080/items/me',
      expect.objectContaining({
        params: expect.objectContaining({ sortDir: 'desc', status: Status.Active }),
      })
    );
  });

  it('fetchUserAdvertisements - ascending (date = 2)', async () => {
    const mockData = [{ id: 2 }];
    mockedAxios.get.mockResolvedValue({ data: mockData });

    const result = await userAPI.fetchUserAdvertisements(5, 0, 2, null);
    expect(result).toEqual(mockData);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      'http://127.0.0.1:8080/items/me',
      expect.objectContaining({
        params: expect.objectContaining({ sortDir: 'asc', status: null }),
      })
    );
  });

  it('fetchUserAdvertisements - failure', async () => {
    mockedAxios.get.mockRejectedValue(new Error('failed'));
    const result = await userAPI.fetchUserAdvertisements(5, 0, 1, null);
    expect(result).toBeInstanceOf(Error);
  });

  it('updateProfilePicture - success', async () => {
    mockedAxios.post.mockResolvedValue({ status: 200 });
    const result = await userAPI.updateProfilePicture('data:image/jpeg;base64,mock');
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'http://127.0.0.1:8080/profilePicture',
      { url: 'data:image/jpeg;base64,mock' },
      expect.anything()
    );
  });

  it('updateProfilePicture - failure', async () => {
    mockedAxios.post.mockRejectedValue(new Error('failed'));
    const result = await userAPI.updateProfilePicture('badurl');
    expect(result).toBeInstanceOf(Error);
  });

  it('changePassword - success', async () => {
    mockedAxios.put.mockResolvedValue({ status: 204 });
    const status = await userAPI.changePassword('oldpass', 'newpass');
    expect(status).toBe(204);
  });

  it('changePassword - failure', async () => {
    mockedAxios.put.mockRejectedValue(new Error('wrong'));
    await expect(userAPI.changePassword('bad', 'bad2')).rejects.toThrow('Error! Cannot update password!');
  });

  it('deleteUser - success', async () => {
    mockedAxios.delete.mockResolvedValue({ status: 204 });
    const result = await userAPI.deleteUser();
    expect(result).toBe(204);
    expect(mockedAxios.delete).toHaveBeenCalledWith(
      'http://127.0.0.1:8080/me',
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: `Bearer mocked-token` }),
        withCredentials: true,
      })
    );
  });

  it('deleteUser - failure', async () => {
    mockedAxios.delete.mockRejectedValue(new Error('boom'));
    await expect(userAPI.deleteUser()).rejects.toThrow('Error! Could not fetch user information.');
  });
});
