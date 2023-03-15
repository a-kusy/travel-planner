import http from "../axios-config";

const getAll = () => {
  return http.get("/trips");
};
const get = (id) => {
  return http.get(`/trips/${id}`);
};
const create = (data) => {
  return http.post("/trips", data);
};
const update = (id, data) => {
  return http.put(`/trips/${id}`, data);
};
const remove = (id) => {
  return http.delete(`/trips/${id}`);
};
const removeAll = () => {
  return http.delete(`/trips`);
};

const TripService = {
  getAll,
  get,
  create,
  update,
  remove,
  removeAll,
};
export default TripService;