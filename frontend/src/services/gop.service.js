import axios from "axios";
import authHeader from "./auth-header.js";

const API_URL = "http://localhost:8080/api/";
const ADMIN_URL = "http://localhost:8080/admin/api/";

const headers = {
  headers: authHeader(),
};

const getLoans = () => {
  return axios.get(API_URL + "loan/get", headers);
};

const updateLoanStatus = (payload) => {
  return axios.put(API_URL + "loan/updateloanstatus", { ...payload }, headers);
};

const issuePasses = (id) => {
  return axios.put(API_URL + "loan/updatecardinssuance/" + id, {}, headers);
};

const returnPasses = (id) => {
  return axios.put(API_URL + "loan/returncardinssuance/" + id, {}, headers);
};

const updatePassStatusToLoan = (payload) => {
  return axios.put(
    API_URL + "pass/corporatepass/updatetoloan",
    { ...payload },
    headers
  );
};

const updatePassStatusToAvailable = (payload) => {
  return axios.put(
    API_URL + "pass/corporatepass/updatetoavailable",
    { ...payload },
    headers
  );
};

const GOPService = {
  getLoans,
  updateLoanStatus,
  issuePasses,
  returnPasses,
  updatePassStatusToLoan,
  updatePassStatusToAvailable,
};

export default GOPService;
