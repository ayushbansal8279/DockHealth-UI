import axios from './axios-heydoc';

export const getAllContacts = async () => {
  const response = await axios.get('/contact/getAll');
  if (response.status === 200 && response.data) {
    return response.data;
  }
  return [];
};

export const saveContact = async contact => {
  const response = await axios.post('/contact', contact);
  if (response.status === 200 && response.data) {
    return response.data;
  }
  return null;
};

export const editContact = async contact => {
  const response = await axios.put('/contact', contact);
  if (response.status === 200 && response.data) {
    return response.data;
  }
  return null;
};
