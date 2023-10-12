import axios from "axios";
const END_POINT = "/site-page";

class Service {
  getAll(lang) {
    return axios.get(END_POINT + "/",{
      headers:{
        'Accept-Language': lang  ? lang:"uz"
      }
    }).then((res) => {
      return res;
    });
  }
  create(data) {
    return axios.post(END_POINT + "/", data,{
        headers:{
          "Content-Type": "multipart/form-data",
        }
    }).then((res) => {
      return res;
    });
  }
  update(id, data) {
    return axios
      .patch(END_POINT + `/id/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
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
