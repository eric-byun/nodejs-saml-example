const express = require('express');
const router = express.Router();
const { IdP, SP } = require('../core/saml');

router.get('/', (req, res, next) => {
  return res.send('SP');
});

router.post('/acs', async (req, res) => {
  try {
    console.log('req', req.body.SAMLResponse);
    const { samlContent, extract } = await SP.parseLoginResponse(IdP, 'post', req);

    return res.send(`
      ${JSON.stringify(extract.attributes)}
    `);
  } catch (e) {
    throw e.toString();
  }
});

router.get('/login', (req, res) => {
  const { id, context } = SP.createLoginRequest(IdP, 'redirect');
  return res.redirect(context);
});

module.exports = router;
