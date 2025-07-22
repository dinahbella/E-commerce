export default (controllerFunction) => (res, req, next) => {
  Promise.resolve(controllerFunction(res, req, next)).catch(next);
};
