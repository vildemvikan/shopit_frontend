import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import * as bookmarkAPI from '../Bookmark';
import { useTokenStore } from '../../src/stores/tokenStore';

vi.mock('axios');
vi.mock('@/stores/tokenStore', () => ({
  useTokenStore: vi.fn(),
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('bookmark API', () => {
  const mockToken = 'mocked-token';

  beforeEach(() => {
    vi.clearAllMocks();
    (useTokenStore as any).mockReturnValue({
      getToken: mockToken,
    });
  });

  it('fetchUserBookmarks should send GET request with correct params', async () => {
    const mockResponse = { data: ['bookmark1', 'bookmark2'] };
    mockedAxios.get.mockResolvedValue(mockResponse);

    const result = await bookmarkAPI.fetchUserBookmarks(10, 2, 'desc');

    expect(mockedAxios.get).toHaveBeenCalledWith(
      'http://127.0.0.1:8080/bookmark/me',
      expect.objectContaining({
        params: { size: 10, page: 2, sortDir: 'desc' },
        headers: expect.objectContaining({
          Authorization: `Bearer ${mockToken}`
        }),
      })
    );
    expect(result).toEqual(mockResponse.data);
  });

  it('createBookmark should POST to correct URL and return status', async () => {
    mockedAxios.post.mockResolvedValue({ status: 201 });

    const result = await bookmarkAPI.createBookmark('ad123');
    expect(result).toBe(201);
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'http://127.0.0.1:8080/bookmark/ad123',
      {},
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: `Bearer ${mockToken}`
        }),
      })
    );
  });

  it('createBookmark returns 401 if no token', async () => {
    (useTokenStore as any).mockReturnValueOnce({ getToken: null });

    const result = await bookmarkAPI.createBookmark('ad123');
    expect(result).toBe(401);
    expect(mockedAxios.post).not.toHaveBeenCalled();
  });

  it('deleteBookmark should DELETE from correct URL and return status', async () => {
    mockedAxios.delete.mockResolvedValue({ status: 204 });

    const result = await bookmarkAPI.deleteBookmark('ad123');
    expect(result).toBe(204);
    expect(mockedAxios.delete).toHaveBeenCalledWith(
      'http://127.0.0.1:8080/bookmark/ad123',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: `Bearer ${mockToken}`
        }),
      })
    );
  });

  it('deleteBookmark returns 401 if no token', async () => {
    (useTokenStore as any).mockReturnValueOnce({ getToken: null });

    const result = await bookmarkAPI.deleteBookmark('ad123');
    expect(result).toBe(401);
    expect(mockedAxios.delete).not.toHaveBeenCalled();
  });

  it('createBookmark returns error object on failure', async () => {
    mockedAxios.post.mockRejectedValue(new Error('Request failed'));

    const result = await bookmarkAPI.createBookmark('bad-id');
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe('Error! Could not bookmark advertisement!');
  });

  it('deleteBookmark returns error object on failure', async () => {
    mockedAxios.delete.mockRejectedValue(new Error('Request failed'));

    const result = await bookmarkAPI.deleteBookmark('bad-id');
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe('Error! Could not delete bookmark!');
  });
});
