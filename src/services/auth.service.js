import axios from 'axios';
const API_URL = 'https://www.marrakechbestof.com/wp-json/';
class AuthService {
  login(user) {
    return axios
      .post(API_URL + 'jwt-auth/v1/token', {
        username: user.username,
        password: user.password
      })
      .then(response => {
        if (response.data.token) {
          localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
      });
  }
  logout() {
    localStorage.removeItem('user');
  }
}
export default new AuthService();