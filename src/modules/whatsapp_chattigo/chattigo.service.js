const axios = require('axios');

let jwtToken = null;
let tokenExpiresAt = null;

const CHATTIGO_LOGIN_URL = 'https://login.chattigo.com/login';
const CHATTIGO_INBOUND_URL = 'https://login.chattigo.com/message/inbound';
const CHATTIGO_USER = process.env.CHATTIGO_USER;
const CHATTIGO_PASS = process.env.CHATTIGO_PASS;

async function getJwtToken() {
  const now = Date.now();
  if (jwtToken && tokenExpiresAt && now < tokenExpiresAt - 60 * 1000) {
    return jwtToken;
  }
  const resp = await axios.post(CHATTIGO_LOGIN_URL, {
    username: CHATTIGO_USER,
    password: CHATTIGO_PASS
  });
  jwtToken = resp.data.token;
  // El token dura 8 horas
  tokenExpiresAt = now + 8 * 60 * 60 * 1000;
  return jwtToken;
}

async function sendBulkMessage({ did, namespace, template_name, destinations }) {
  const token = await getJwtToken();
  const payload = {
    did,
    namespace,
    template_name,
    destinations // [{ destination, parameters: [...] }]
  };
  const resp = await axios.post(CHATTIGO_INBOUND_URL, payload, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return resp.data;
}

module.exports = {
  getJwtToken,
  sendBulkMessage
};
