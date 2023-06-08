import axios from "axios";
import authHeader from "./auth-header.js";

const API_URL = "http://localhost:8080/api/";
const ADMIN_URL = "http://localhost:8080/admin/api/";
const LOST_URL = "http://localhost:8080/admin/";

const headers = {
  headers: authHeader(),
};

const getCorporateMemberships = () => {
  return axios.get(API_URL + "pass/corporatepass", headers);
};

const createMembership = (payload) => {
  return axios.post(
    ADMIN_URL + "pass/corporatepass/mass",
    {
      ...payload,
    },
    headers
  );
};

const editCorporateMembership = (membershipName, payload) => {
  return axios.put(
    ADMIN_URL + "pass/corporatepass/massupdatebymembershipname",
    {
      membershipName,
      newDetails: { ...payload },
    },
    headers
  );
};

const getCorporatePasses = (membershipName) => {
  return axios.get(
    API_URL + "pass/corporatepass/getallbymembershipname/" + membershipName,
    headers
  );
};

const createPass = (payload) => {
  return axios.post(
    ADMIN_URL + "pass/corporatepass",
    {
      ...payload,
    },
    headers
  );
};

const updatePassStatusToActive = (payload) => {
  return axios.put(
    API_URL + "pass/corporatepass/updatetoactive",
    { ...payload },
    headers
  );
};

const updatePassStatusToInactive = (payload) => {
  return axios.put(
    API_URL + "pass/corporatepass/updatetononactive",
    { ...payload },
    headers
  );
};

const deletePass = (id) => {
  return axios.delete(ADMIN_URL + "pass/corporatepass/byid/" + id, headers);
};

const getTemplate = (type) => {
  return axios.get(LOST_URL + "preview/" + type, headers);
};

const getTemplateParameters = (type) => {
  return axios.get(LOST_URL + "parameters/" + type, headers);
};

const getEditTemplate = (type) => {
  return axios.get(LOST_URL + "populate_edit/" + type, headers);
};

const editTemplate = (type, body) => {
  return axios.put(
    LOST_URL + "updateTemplate/" + type,
    { newTemplate: body },
    headers
  );
};

const getSystemSettings = () => {
  return axios.get(ADMIN_URL + "systemSettings", headers);
};

const updateSystemSettings = (payload) => {
  return axios.put(ADMIN_URL + "systemSettings", { ...payload }, headers);
};

const getUsers = () => {
  return axios.get(ADMIN_URL + "user", headers);
};

const updateUserRole = (username, roles) => {
  return axios.put(
    ADMIN_URL + "user/role",
    {
      username,
      roles,
    },
    headers
  );
};

const updateUserStatus = (username, enabled) => {
  return axios.put(
    ADMIN_URL + "user/enabled",
    {
      username,
      enabled,
    },
    headers
  );
};

const getLoans = () => {
  return axios.get(API_URL + "loan/get", headers);
};

const getLostPasses = () => {
  return axios.get(
    LOST_URL + "outstandingfee/fetchOutstandingFeeList",
    headers
  );
};

const clearLostPass = (id) => {
  return axios.put(
    LOST_URL + "outstandingfee/updateOutstandFeeDateClearedById/" + id,
    {},
    headers
  );
};

const clearLostPassAmount = (id, amount) => {
  return axios.put(
    LOST_URL + "outstandingfee/updateOutstandFeeById/" + id,
    { amount },
    headers
  );
};

const getMonthlyLoanStatistics = () => {
  return axios.get(
    API_URL + "loan/monthlyloanstatistics/" + new Date().getFullYear(),
    headers
  );
};

const getMonthlyBorrowerStatistics = () => {
  return axios.get(
    API_URL + "loan/monthlyborrowerstatistics/" + new Date().getFullYear(),
    headers
  );
};

const AdminService = {
  getCorporateMemberships,
  createMembership,
  editCorporateMembership,
  getCorporatePasses,
  createPass,
  updatePassStatusToActive,
  updatePassStatusToInactive,
  deletePass,
  getTemplate,
  getTemplateParameters,
  getEditTemplate,
  editTemplate,
  getSystemSettings,
  updateSystemSettings,
  getUsers,
  updateUserRole,
  updateUserStatus,
  getLoans,
  getLostPasses,
  clearLostPass,
  clearLostPassAmount,
  getMonthlyLoanStatistics,
  getMonthlyBorrowerStatistics,
};

export default AdminService;
