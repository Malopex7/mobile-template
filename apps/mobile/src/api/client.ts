import { getSecureToken, saveSecureToken, deleteSecureToken } from '../utils/secureStore';

// For local dev, ensure you use the IP of your machine rather than localhost
// so the emulator can reach the Express server.
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://YOUR_LOCAL_IP:5001/api/v1';

export const apiClient = async (
    endpoint: string,
    { data, method = 'GET', headers: customHeaders, ...customConfig }: RequestInit & { data?: any } = {}
) => {
    const token = await getSecureToken('accessToken');

    const headers = new Headers({
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...customHeaders,
    });

    const config: RequestInit = {
        method,
        headers,
        ...customConfig,
    };

    if (data) {
        config.body = JSON.stringify(data);
    }

    const url = `${API_URL}${endpoint}`;
    let response = await fetch(url, config);

    // Automatic token refresh logic
    if (response.status === 401) {
        const refreshToken = await getSecureToken('refreshToken');
        if (refreshToken) {
            try {
                const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refreshToken }),
                });

                if (refreshResponse.ok) {
                    const resData = await refreshResponse.json();
                    await saveSecureToken('accessToken', resData.data.accessToken);
                    await saveSecureToken('refreshToken', resData.data.refreshToken);

                    // Retry the original request
                    headers.set('Authorization', `Bearer ${resData.data.accessToken}`);
                    config.headers = headers;
                    response = await fetch(url, config);
                } else {
                    // Refresh failed, logging out explicitly or dispatch an event
                    await deleteSecureToken('accessToken');
                    await deleteSecureToken('refreshToken');
                }
            } catch (e) {
                await deleteSecureToken('accessToken');
                await deleteSecureToken('refreshToken');
            }
        } else {
            await deleteSecureToken('accessToken');
        }
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'API request failed');
    }

    return response.json();
};
