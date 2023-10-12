import axios from "axios";
const END_POINT = "/site-page/translate";

class Service {
  getAll() {
    return axios.get(END_POINT + "/").then((res) => {
      return res;
    });
  }
}
export default new Service();
 