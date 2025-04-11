import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import * as categoriesAPI from '../Categories'; // adjust path as needed

vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('categories API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetchCategories - returns category list on success', async () => {
    const mockData = [{ id: 1, name: 'Electronics' }];
    mockedAxios.get.mockResolvedValue({ data: mockData });

    const result = await categoriesAPI.fetchCategories();

    expect(mockedAxios.get).toHaveBeenCalledWith('http://127.0.0.1:8080/categories', {
      params: { includeSubCategories: false },
    });
    expect(result).toEqual(mockData);
  });

  it('fetchCategories - returns Error on failure', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Network error'));

    const result = await categoriesAPI.fetchCategories();
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe('Error! Could not fetch categories.');
  });

  it('fetchCategoriesWithSubCategories - returns category list with subs on success', async () => {
    const mockData = [
      { id: 1, name: 'Electronics', subCategories: [{ id: 2, name: 'Phones' }] },
    ];
    mockedAxios.get.mockResolvedValue({ data: mockData });

    const result = await categoriesAPI.fetchCategoriesWithSubCategories();

    expect(mockedAxios.get).toHaveBeenCalledWith('http://127.0.0.1:8080/categories', {
      params: { includeSubCategories: true },
    });
    expect(result).toEqual(mockData);
  });

  it('fetchCategoriesWithSubCategories - returns Error on failure', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Request failed'));

    const result = await categoriesAPI.fetchCategoriesWithSubCategories();
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe('Error! Could not fetch categories with sub-categories.');
  });
});
