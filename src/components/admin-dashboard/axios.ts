import axios from 'axios';

const API_URL = 'http://localhost:8090/api';

const getToken = () => localStorage.getItem('token');

export const fetchUsers = async () => {
    const token = getToken();
    
    const response = await axios.get(`${API_URL}/user/allUsers`, {
        
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const updateUserRole = async (userId: string, role: string) => {
    const token = getToken();
    const endpoints: { [key: string]: string } = {
        'VIP': '/admin/setVIP',
        'UPGRADED': '/admin/setUpgraded',
        'CANSLE VIP': '/admin/takeVIP',
        'CANSLE UPGRADED': '/admin/takeUpgraded',
    };

    const endpoint = endpoints[role];
    if (endpoint) {
        return axios.put(
            `${API_URL}${endpoint}`,
            { userId },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
    }
    throw new Error('Invalid role selected');
};

export const blockUserCard = async (cardId: string) => {
    const token = getToken();
    return axios.post(`${API_URL}/admin/blockUserCard/${cardId}`, {}, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};