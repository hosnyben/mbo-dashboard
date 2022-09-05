import axios from 'axios';
import router from '../router';
import store from '../store';
import authHeader from './auth-header';
const API_URL = 'https://www.marrakechbestof.com/wp-json/mbo/v1/';
class UserService {
  getReservations(year,month) {
    return axios.get(API_URL + `get_resas/${year}/${month}`, { headers: authHeader() }).catch(({response}) => {
      if (response.status === 403) {
        store.dispatch("auth/logout");
        router.push("/login");
      }
    })
  }
  updateReservation(id,data) {
    return axios.post(API_URL + `update_resa/${id}`,data, { headers: authHeader() }).catch(({response}) => {
      if (response.status === 403) {
        store.dispatch("auth/logout");
        router.push("/login");
      }
    })
  }
  getPublicContent() {
    return axios.get(API_URL + 'all');
  }
  getUserBoard() {
    return axios.get(API_URL + 'user', { headers: authHeader() });
  }
  getModeratorBoard() {
    return axios.get(API_URL + 'mod', { headers: authHeader() });
  }
  getAdminBoard() {
    return axios.get(API_URL + 'admin', { headers: authHeader() });
  }
}
export default new UserService();