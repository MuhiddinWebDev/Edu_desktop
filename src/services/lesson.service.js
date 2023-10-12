import axios from "axios";
const END_POINT = "/lesson";

class Service {
  getAll(data) {
    return axios.post(END_POINT + "/all", data).then((res) => {
      return res;
    });
  }
  getAllGroup(data) {
    return axios.post(END_POINT + "/group", data).then((res) => {
      return res;
    });
  }
  searchTable(lesson) {
    return axios.get(END_POINT + `/search-table?lesson_id=${lesson}`).then((res) => {
      return res;
    });
  }

  searchTeacher(data) {
    return axios.post(END_POINT + `/teacher`, data).then((res) => {
      return res;
    });
  }

  getAllTable(data) {
    return axios.post(END_POINT + `/table`, data).then((res) => {
      return res;
    });
  }

  lessonCreate(data) {
    return axios.post(END_POINT + "/", data).then((res) => {
      return res;
    });
  }

  makeAttendance(data) {
    return axios.post(END_POINT + "/attendance", data).then((res) => {
      return res;
    });
  }

  lessonTableCreate(data) {
    return axios.post(END_POINT + "/create", data).then((res) => {
      return res;
    });
  }

  lessonTableUpdate(data) {
    return axios.post(END_POINT + `/update`, data).then((res) => {
      return res;
    });
  }
  genrateDays(data) {
    return axios.post(END_POINT + "/generate", data).then((res) => {
      return res;
    });
  }

  checkTable(data) {
    return axios.post(END_POINT + "/check", data).then((res) => {
      return res;
    });
  }

  updateGenrateDays(data) {
    return axios.post(END_POINT + "/generate/update", data).then((res) => {
      return res;
    });
  }

  lessonUpdate(id, data) {
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
