import axios from "axios";
const END_POINT = "/davomat";

class Service {
  getAll() {
    return axios.get(END_POINT + "/").then((res) => {
      return res;
    });
  }
  create(data) {
    return axios.post(END_POINT + "/", data).then((res) => {
      return res;
    });
  }
  toAttandace(data) {
    return axios.post(END_POINT + "/toattandance", data).then((res) => {
      return res;
    });
  }
  update(id, data) {
    return axios.patch(END_POINT + `/id/${id}`, data).then((res) => {
      return res;
    });
  }
  getOne(date,teacher,group) {
    return axios.get(END_POINT + `/date?date=${date}&teacher_id=${teacher}&group_id=${group}`).then((res) => {
      return res;
    });
  }
  getOneUpdate(id){
    return axios.get(END_POINT + `/id/${id}`).then((res) => {
      return res
    })
  }
  searchModel(data){
    return axios.post(END_POINT + `/search`, data).then((res) => {
      return res
    })
  }
  delete(id) {
    return axios.delete(END_POINT + `/id/${id}`).then((res) => {
      return res;
    });
  }
}
export default new Service();
