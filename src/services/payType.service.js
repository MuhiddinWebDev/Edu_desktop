import axios from "axios";
const END_POINT = "/pay-type";

class Service {
  getAll(data) {
    return axios.post(END_POINT + "/all", data).then((res) => {
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
    return axios.patch(END_POINT + `/delete/${id}`).then((res) => {
      return res;
    });
  }
}
export default new Service();
