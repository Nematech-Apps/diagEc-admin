import axios from 'axios';

class NotificationService {
  constructor(baseURL) {
    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json', // Set the content type as needed
        // Add any other headers here
      },
    });
  }

  // Set the authorization token
  setAuthorizationToken(token) {
    this.axiosInstance.defaults.headers.common['Authorization'] = `key=${token}`;
  }

  // Clear the authorization token
  clearAuthorizationToken() {
    delete this.axiosInstance.defaults.headers.common['Authorization'];
  }

  // Méthode pour effectuer une requête GET
  async get(endpoint, params = {}) {
    try {
      const response = await this.axiosInstance.get(endpoint, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Méthode pour effectuer une requête POST
  async post(endpoint, data = {}) {
    try {
      const response = await this.axiosInstance.post(endpoint, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Méthode pour effectuer une requête PUT
  async put(endpoint, data = {}) {
    try {
      const response = await this.axiosInstance.put(endpoint, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Méthode pour effectuer une requête DELETE
  async delete(endpoint) {
    try {
      const response = await this.axiosInstance.delete(endpoint);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default NotificationService;
