import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { useTokenStore } from '@/stores/tokenStore';
import {
  fetchCategories,
  fetchAdvertisement,
  createAdvertisement,
  updateAdvertisement,
  deleteAdvertisement,
  fetchPostalCodeInfo,
  fetchNewestAdvertisements,
  searchAdvertisements,
  changeStatus
} from '../Advertisement';

vi.mock('axios');
vi.mock('@/stores/tokenStore', () => ({
  useTokenStore: vi.fn(() => ({
    getToken: 'mocked-token'
  }))
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Advertisement API functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetchCategories returns data on success', async () => {
    const mockData = [{ id: 1, name: 'Electronics' }];
    mockedAxios.get.mockResolvedValue({ data: mockData });

    const result = await fetchCategories();
    expect(result).toEqual(mockData);
    expect(mockedAxios.get).toHaveBeenCalledWith('http://127.0.0.1:8080/categories');
  });

  it('fetchAdvertisement returns data with token header', async () => {
    const mockData = { id: '123', name: 'Test Ad' };
    mockedAxios.get.mockResolvedValue({ data: mockData });

    const result = await fetchAdvertisement('123');
    expect(result).toEqual(mockData);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      'http://127.0.0.1:8080/items/123',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer mocked-token',
        })
      })
    );
  });

  it('createAdvertisement sends POST request with token', async () => {
    mockedAxios.post.mockResolvedValue({ status: 201 });

    const result = await createAdvertisement('{ "title": "New Ad" }');
    expect(result).toBe(201);
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'http://127.0.0.1:8080/items',
      '{ "title": "New Ad" }',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer mocked-token'
        })
      })
    );
  });

  it('updateAdvertisement sends PUT request with token', async () => {
    mockedAxios.put.mockResolvedValue({ status: 204 });

    const result = await updateAdvertisement('{ "title": "Updated" }', 'ad-id');
    expect(result).toBe(204);
    expect(mockedAxios.put).toHaveBeenCalledWith(
      'http://127.0.0.1:8080/items/ad-id',
      '{ "title": "Updated" }',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer mocked-token'
        })
      })
    );
  });

  it('deleteAdvertisement sends DELETE request with token', async () => {
    mockedAxios.delete.mockResolvedValue({ status: 200 });

    const result = await deleteAdvertisement('delete-id');
    expect(result).toBe(200);
    expect(mockedAxios.delete).toHaveBeenCalledWith(
      'http://127.0.0.1:8080/items/delete-id',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer mocked-token'
        })
      })
    );
  });
  it('fetchPostalCodeInfo returns data on success', async () => {
    const mockData = { result: 'Oslo' };
    mockedAxios.get.mockResolvedValue({ data: mockData });
    const result = await fetchPostalCodeInfo('0001');
    expect(result).toEqual(mockData);
    expect(mockedAxios.get).toHaveBeenCalled();
  });

  it('fetchPostalCodeInfo returns null on error', async () => {
    mockedAxios.get.mockRejectedValue(new Error('API error'));
    const result = await fetchPostalCodeInfo('0001');
    expect(result).toBeNull();
  });

  it('fetchNewestAdvertisements returns data', async () => {
    const mockData = [{ id: 'ad1' }];
    mockedAxios.get.mockResolvedValue({ data: mockData });
    const result = await fetchNewestAdvertisements(10);
    expect(result).toEqual(mockData);
    expect(mockedAxios.get).toHaveBeenCalled();
  });

  it('fetchNewestAdvertisements handles error', async () => {
    mockedAxios.get.mockRejectedValue(new Error('API error'));
    const result = await fetchNewestAdvertisements(10);
    expect(result).toBeInstanceOf(Error);
  });

  it('searchAdvertisements returns data', async () => {
    const mockData = [{ id: 'searchResult' }];
    mockedAxios.get.mockResolvedValue({ data: mockData });
    const result = await searchAdvertisements(10, 0, 'phone', 1, 2, ['NEW'], ['Oslo'], 100, 500, true, false, 'price', 'asc');
    expect(result).toEqual(mockData);
  });

  it('searchAdvertisements handles error', async () => {
    mockedAxios.get.mockRejectedValue(new Error('API error'));
    const result = await searchAdvertisements(10, 0, 'phone', 1, 2, ['NEW'], ['Oslo'], 100, 500, true, false, 'price', 'asc');
    expect(result).toBeInstanceOf(Error);
  });

  it('createAdvertisement handles error', async () => {
    mockedAxios.post.mockRejectedValue(new Error('API error'));
    const result = await createAdvertisement('{}');
    expect(result).toBeInstanceOf(Error);
  });

  it('updateAdvertisement handles error', async () => {
    mockedAxios.put.mockRejectedValue(new Error('API error'));
    const result = await updateAdvertisement('{}', 'id');
    expect(result).toBeInstanceOf(Error);
  });

  it('changeStatus sends PUT request and returns status', async () => {
    mockedAxios.put.mockResolvedValue({ status: 200 });
    const result = await changeStatus('ACTIVE', 'ad123');
    expect(result).toBe(200);
    expect(mockedAxios.put).toHaveBeenCalled();
  });

  it('changeStatus handles error', async () => {
    mockedAxios.put.mockRejectedValue(new Error('API error'));
    const result = await changeStatus('INACTIVE', 'ad123');
    expect(result).toBeInstanceOf(Error);
  });

  it('deleteAdvertisement handles error', async () => {
    mockedAxios.delete.mockRejectedValue(new Error('API error'));
    const result = await deleteAdvertisement('ad123');
    expect(result).toBeInstanceOf(Error);
  });
});
