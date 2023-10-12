import axios from "axios";
const END_POINT = "/region";

class Service {
  getAllRegion() {
    return axios.get(END_POINT + "/").then((res) => {
      return res;
    });
  }
  getAllDistrict(data) {
    return axios.post(END_POINT + "/district", data).then((res) => {
      return res;
    });
  }

  getOneRegion(id) {
    return axios.get(END_POINT + `/one/${id}`).then((res) => {
      return res;
    });
  }

  getOneDistrict(id) {
    return axios.get(END_POINT + `/district-one/${id}`).then((res) => {
      return res;
    });
  }

}
export default new Service();
