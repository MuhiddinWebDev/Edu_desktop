import axios from "axios";
const END_POINT = "/discount";

class Service {
  getAll() {
    return axios.get(END_POINT + "/").then((res) => {
      return res;
    });
  }
  searchModel(data) {
    return axios.post(END_POINT + `/search`, data).then((res) => {
      return res;
    });
  }
  create(data) {
    return axios.post(END_POINT + "/", data).then((res) => {
      return res;
    });
  }
  update(id, data) {
    return axios.patch(END_POINT + `/id/${id}`, data).then((res) => {
      return res;
    });
  }
  getOne(id) {
    return axios.get(END_POINT + `/id/${id}`).then((res) => {
      return res;
    });
  }
  delete(id) {
    return axios.delete(END_POINT + `/id/${id}`).then((res) => {
      return res;
    });
  }
}
export default new Service();
