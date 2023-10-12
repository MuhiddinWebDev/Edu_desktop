import axios from "axios";
const END_POINT = "/report";

class Service {

  kassaSverka(data) {
    return axios.post(END_POINT + `/kassa-sverka`, data).then((res) => {
      return res;
    });
  }

  kassaReport(data) {
    return axios.post(END_POINT + `/kassa-report`, data).then((res) => {
      return res;
    });
  }

  rasxodReport(data) {
    return axios.post(END_POINT + `/rasxod`, data).then((res) => {
      return res;
    });
  }

  rasxodSverka(data) {
    return axios.post(END_POINT + `/rasxod-table`, data).then((res) => {
      return res;
    });
  }
  
  studentReport(data) {
    return axios.post(END_POINT + `/student`, data).then((res) => {
      return res;
    });
  }
  
  studentSverka(data) {
    return axios.post(END_POINT + `/student-sverka`, data).then((res) => {
      return res;
    });
  }

  teacherReport(data) {
    return axios.post(END_POINT + `/teacher`, data).then((res) => {
      return res;
    });
  }

  teacherSverka(data) {
    return axios.post(END_POINT + `/teacher-sverka`, data).then((res) => {
      return res;
    });
  }

  davomatReport(data) {
    return axios.post(END_POINT + `/davomat-report`, data).then((res) => {
      return res;
    });
  }

  davomatSverka(data) {
    return axios.post(END_POINT + `/davomat-sverka`, data).then((res) => {
      return res;
    });
  }

  lessonReport(data) {
    return axios.post(END_POINT + `/lesson-report`, data).then((res) => {
      return res;
    });
  }

  lessonSverka(data) {
    return axios.post(END_POINT + `/lesson-sverka`, data).then((res) => {
      return res;
    });
  }
  
  courseReport(data) {
    return axios.post(END_POINT + "//course-report", data).then((res) => {
      return res;
    });
  }

  courseSverka(data) {
    return axios.post(END_POINT + "/course-sverka", data).then((res) => {
      return res;
    });
  }

  

  

 
}
export default new Service();
