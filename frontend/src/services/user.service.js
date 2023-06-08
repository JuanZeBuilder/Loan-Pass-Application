import axios from "axios";
import authHeader from "./auth-header.js";
import username from "./username.js";

const API_URL = "http://localhost:8080/api/";
const ADMIN_URL = "http://localhost:8080/admin/";

const headers = {
  headers: authHeader(),
};

const getCorporatePasses = () => {
  return axios.get(API_URL + "pass/corporatepass", headers);
};

const getLoans = () => {
  return axios.get(API_URL + "loan/getbyemail/" + username(), headers);
};

const getPreviousBorrower = (id) => {
  return axios.get(API_URL + "loan/getpreviousborrower/" + id, headers);
};

const createLoan = (payload) => {
  return axios.post(
    API_URL + "loan/create",
    {
      ...payload,
    },
    headers
  );
};

const cancelLoan = (id) => {
  return axios.put(
    API_URL + "loan/updateloanstatus",
    { loanID: id, status: "cancelled" },
    headers
  );
};

const createLostPass = (payload) => {
  return axios.post(
    ADMIN_URL + "outstandingfee/createOutStandingFee",
    {
      ...payload,
    },
    headers
  );
};

const UserService = {
  getCorporatePasses,
  getLoans,
  getPreviousBorrower,
  createLoan,
  cancelLoan,
  createLostPass,
};

export default UserService;
