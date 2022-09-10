import axios from 'axios';
import router from '../router';
import store from '../store';
import authHeader from './auth-header';
const API_URL = 'https://www.marrakechbestof.com/wp-json/mbo/v1/';
class UserService {
  getReservations(year,month) {
    return axios.get(API_URL + `get_resas/${year}/${month}`, { headers: authHeader() }).catch(({response}) => {
      if (response.status === 403) this.forceLogout();
    })
  }
  updateReservation(id,data) {
    return axios.post(API_URL + `update_resa/${id}`,data, { headers: authHeader() }).catch(({response}) => {
      if (response.status === 403) this.forceLogout();
    })
  }
  getOffers() {
    return axios.get(API_URL + `get_offers`, { headers: authHeader() }).catch(({response}) => {
      if (response.status === 403) this.forceLogout();
    })
  }
  getOccupations() {
    return axios.get(API_URL + `get_occupations`, { headers: authHeader() }).catch(({response}) => {
      if (response.status === 403) this.forceLogout();
    })
  }
  updateOccupation(etabId,data) {
    return axios.post(API_URL + `update_occupation/${etabId}`,data, { headers: authHeader() }).catch(({response}) => {
      if (response.status === 403) this.forceLogout();
    })
  }
  getTransporters() {
    return axios.get(API_URL + `get_transporters`, { headers: authHeader() }).catch(({response}) => {
      if (response.status === 403) this.forceLogout();
    })
  }
  forceLogout() {
    store.dispatch("auth/logout");
    router.push("/login");
  }
}
export default new UserService();