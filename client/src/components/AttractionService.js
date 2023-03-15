import http from "../axios-config";

const getAll = () => {
  return http.get("/attractions");
};
const get = (id) => {
  return http.get(`/attractions/${id}`);
};
const create = (data) => {
  return http.post("/attractions", data);
};
const update = (id, data) => {
  return http.put(`/attractions/${id}`, data);
};
const remove = (id) => {
  return http.delete(`/attractions/${id}`);
};
const removeAll = () => {
  return http.delete(`/attractions`);
};
const getByTripId = (tripId) => {
  return http.get(`/attractions/get/${tripId}`);
};

const deleteByTripId = (tripId) => {
  return http.delete(`attractions/delete/${tripId}`);
}

const AttractionService = {
  getAll,
  get,
  create,
  update,
  remove,
  removeAll,
  getByTripId,
  deleteByTripId,
};
export default AttractionService;