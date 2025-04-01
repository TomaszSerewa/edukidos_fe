import config from './config';

export const register = async (name, email, password) => {
  try {
    const response = await fetch(`${config.backendUrl}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await response.json();
    if (response.ok) {
      // Zapisz token w localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('userName', data.user.name);
    }
    return data;
  } catch (error) {
    console.error('Error registering:', error);
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    const response = await fetch(`${config.backendUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const getLettersStats = async (userId) => {
  try {
    const response = await fetch(`${config.backendUrl}/letters/${userId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching letters stats:', error);
    throw error;
  }
};

export const updateLettersStats = async (userId, lettersStats) => {
  try {
    const response = await fetch(`${config.backendUrl}/letters/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ lettersStats }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating letters stats:', error);
    throw error;
  }
};

export const getNextLetter = async (userId) => {
  try {
    const response = await fetch(`${config.backendUrl}/letters/next/${userId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching next letter:', error);
    throw error;
  }
};