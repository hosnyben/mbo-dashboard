import axios from 'axios';
import router from '../router';
import store from '../store';
import authHeader from './auth-header';
const API_URL = 'https://www.marrakechbestof.com/wp-json/mbo/v1/';
class UserService {
  getReservations(year = null,month = null, datas = {}) {
    let stringToAdd = '';
    
    Object.keys(datas).forEach(key => {
      stringToAdd += `&${key}=${datas[key]}`
    })

    return axios.get(API_URL + `get_resas${year?'/'+year:''}${month?'/'+month:''}?v=${Math.random()}${stringToAdd}`, { headers: authHeader() }).catch(({response}) => {
      if (response.status === 403) this.forceLogout();
    })
  }
  updateReservation(id,data) {
    return axios.post(API_URL + `update_resa/${id}?v=${Math.random()}`,data, { headers: authHeader() }).catch(({response}) => {
      if (response.status === 403) this.forceLogout();
    })
  }
  getOffers() {
    return axios.get(API_URL + `get_offers?v=${Math.random()}`, { headers: authHeader() }).catch(({response}) => {
      if (response.status === 403) this.forceLogout();
    })
  }
  getOccupations() {
    return axios.get(API_URL + `get_occupations_v2?v=${Math.random()}`, { headers: authHeader() }).catch(({response}) => {
      if (response.status === 403) this.forceLogout();
    })
  }
  updateOccupation(etabId,data) {
    return axios.post(API_URL + `update_occupations_v2/${etabId}?v=${Math.random()}`,data, { headers: authHeader() }).catch(({response}) => {
      if (response.status === 403) this.forceLogout();
    })
  }
  getTransporters() {
    return axios.get(API_URL + `get_transporters?v=${Math.random()}`, { headers: authHeader() }).catch(({response}) => {
      if (response.status === 403) this.forceLogout();
    })
  }
  getAdmins() {
    return axios.get(API_URL + `get_admins?v=${Math.random()}`, { headers: authHeader() }).catch(({response}) => {
      if (response.status === 403) this.forceLogout();
    })
  }
  forceLogout() {
    store.dispatch("auth/logout");
    router.push("/login");
  }
}
export default new UserService();