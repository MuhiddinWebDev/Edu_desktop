import axios from "axios";
const END_POINT = "/course";

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


  createAdmin(data) {
    return axios
      .post(END_POINT + "/create", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        return res;
      });
  }


  teacherCreate(data) {
    return axios
      .post(END_POINT + "/", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        return res;
      });
  }
  adminCreatePlan(data) {
    return axios.post(END_POINT + "/update/plan", data).then((res) => {
      return res;
    });
  }
  teacherCreatePlan(data) {
    return axios.post(END_POINT + "/create-plan", data).then((res) => {
      return res;
    });
  }
  updateAdmin(id, data) {
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
  updateTeacher(id, data) {
    return axios
      .patch(END_POINT + `/update/id/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        return res;
      });
  }
  /// teacher created so updated by create fuction
  teacherUpdatePlan(data) {
    return axios
      .post(END_POINT + `/update-plan`, data)
      .then((res) => {
        return res;
      });
  }
  adminUpdatePlan(data) {
    return axios
    .post(END_POINT + `/update/plan`, data)
    .then((res) => {
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
  uploadVideoAdmin(data) {
    return axios
      .post(END_POINT + "/video", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        return res;
      });
  }
  uploadVideoTeacher(data) {
    return axios
      .post(END_POINT + "/upload/video", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        return res;
      });
  }
  uploadVideoUpdateTeacher(data) {
    return axios
      .post(END_POINT + "/update/video", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        return res;
      });
  }
  uploadVideoUpdateAdmin(data) {
    return axios
      .post(END_POINT + "/update-video", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
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
