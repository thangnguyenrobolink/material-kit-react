import axios from 'axios';
import { toast } from 'react-toastify';

const LoginApi = async (email, hashpassword) => {
    const url = 'http://127.0.0.1:8000/api/token/';
    const data = {
        username: email,
        password: hashpassword,
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }

        const jsonResponse = await response.json();
        const accessToken = jsonResponse.access; // Assuming the token is returned as 'token'
        localStorage.setItem('accessToken', jsonResponse.access);
        localStorage.setItem('refreshToken',  jsonResponse.refresh);

        return accessToken;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return null;
    }
};

const usersFromApi = async () => {
    const API_URL = 'http://127.0.0.1:8000/api/users/';
    const token = localStorage.getItem('accessToken'); // Retrieve the token from localStorage

    if (!token) {
        console.error('No access token found in localStorage');
        return [];
    }
    
    try {
        const response = await axios.get(API_URL, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
        if (!response.status === 'ok') {
            toast.error(`HTTP error! Status: ${response.status}`);
        }
    
    
        // Assuming the API returns an array of users, adjust fields as necessary
        const users = response.data.results.map(user => ({
            id: user.id,
            avatarUrl: `/assets/images/avatars/avatar_${user.id + 1}.jpg`, // Adjust field names as necessary
            name: user.username,
            company: user.email,
            isVerified: user.is_staff, 
            status: 'active',
            role:  'Leader',
          }));
          toast.success('Load Users successful!', { autoClose: 500 });
        return users;
        }
    catch (error) {
        toast.error('Error fetching users:', error);
        return [];
    }
}
export { LoginApi, usersFromApi };