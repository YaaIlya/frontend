import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

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

export const deleteUser = async (userId: string) => {
    const token = getToken();
    const data = { userId }; // Здесь должно быть { userId }
    console.log("Data для отправки на бэк:", data);
    return axios.request({
        url: `${API_URL}/superAdmin/deleteUser`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        data: data, // Передаем тело запроса
    });
};



export const updateUserRole = async (userId: number, role: string) => {
    const token = getToken();
    const endpoints: { [key: string]: string } = {
        'ADMIN': '/superAdmin/setAdmin',
        'SUPERADMIN': '/superAdmin/setSuperAdmin',
        'CANCLE ADMIN': '/superAdmin/takeAdmin',
        'CANCLE SUPERADMIN': '/superAdmin/takeSuperAdmin',
    };

    const endpoint = endpoints[role];
    if (endpoint) {
        
        return axios.put(
            `${API_URL}${endpoint}`,
            {userId},
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



