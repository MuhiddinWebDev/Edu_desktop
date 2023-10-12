import axios from "axios";
const END_POINT = "/users";

class Service {
  getAll(data) {
    return axios.post(END_POINT + "/", data).then((res) => {
      return res;
    });
  }

  getSalaryTeachers(data) {
    return axios.post(END_POINT + "/salaryTeachers", data ).then((res) => {
      return res;
    });
  }

  getAllTeacher() {
    return axios.get(END_POINT + `/teachers`).then((res) => {
      return res;
    });
  }
  getAllStudent() {
    return axios.get(END_POINT + `/students`).then((res) => {
      return res;
    });
  }
  create(data) {
    return axios.post(END_POINT + "/create", data).then((res) => {
      return res;
    });
  }
  activeUser(data) {
    return axios.post(END_POINT + "/active", data).then((res) => {
      return res;
    });
  }
  createMore(data) {
    return axios.post(END_POINT + "/more", data).then((res) => {
      return res;
    });
  }

  update(id, data) {
    return axios
      .patch(END_POINT + `/profil/id/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        return res;
      });
  }

  updateAll(id, data) {
    return axios.patch(END_POINT + `/id/${id}`, data).then((res) => {
      return res;
    });
  }
 
  getOne(id) {
    return axios.get(END_POINT + `/id/${id}`).then((res) => {
      return res;
    });
  }

  getOneTeacher(id) {
    return axios.get(END_POINT + `/one/id/${id}`).then((res) => {
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
