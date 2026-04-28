// src/utils/response.js
const ok = (res, data, msg = 'OK', status = 200) =>
  res.status(status).json({ ok: true, status, message: msg, data });

const created = (res, data, msg = 'Creado correctamente') =>
  ok(res, data, msg, 201);

const fail = (res, msg = 'Error', status = 400, data = null) =>
  res.status(status).json({ ok: false, status, message: msg, data });

const notFound = (res, msg = 'No encontrado') => fail(res, msg, 404);

module.exports = { ok, created, fail, notFound };