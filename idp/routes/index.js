const express = require('express');
const router = express.Router();
const { IdP, SP } = require('../core/saml');

router.get('/', (req, res, next) => {
  return res.send('IdP');
});

router.get('/login', async (req, res) => {
  try {
    const SAMLRequest = req.query.SAMLRequest;

    // login user info
    const user = {
      id: 1,
      name: 'Hello World',
      email: 'hello@world.com',
    }

    const parseRequest = await IdP.parseLoginRequest(SP, 'redirect', { query: { SAMLRequest } });
    const aclPath = parseRequest.extract?.request?.assertionConsumerServiceUrl ?? '';

    const tagReplacement = (template) => {
      const replaceTagsByValue = (rawXML, tagValues) => {
        Object.keys(tagValues).forEach((t) => {
          rawXML = rawXML.replace(new RegExp(`{${t}}`, 'g'), tagValues[t]);
        });
        return rawXML;
      };

      const idpSetting = IdP.entitySetting;
      const id = idpSetting.generateID ?? '';
      const tagValues = {
        ID: id,
        Issuer: IdP.entityMeta.getEntityID(),

        attrId: user.id,
        attrEmail: user.email,
        attrName: user.name,
      };

      // replace tag
      const context = replaceTagsByValue(template, tagValues);
      return {
        id,
        context,
      };
    };

    const loginSAMLResponse = await IdP.createLoginResponse(SP, parseRequest, 'post', user, tagReplacement);

    res
      .send(
        `
      <form id="saml-form" method="post" action="${aclPath}" autocomplete="off">
          <input type="hidden" name="SAMLResponse" id="SAMLResponse" value="${loginSAMLResponse.context}" />
      </form>

      <script type="text/javascript">
          document.forms[0].submit();
      </script>
    `
      )
      .end();
  } catch (err) {
    console.log('err', err.toString());
    throw new Error(err);
  }
});

router.get('/sign-out', async (req, res) => {
  const SAMLRequest = req.query.SAMLRequest;

  const parseResponse = await IdP.parseLogoutRequest(SP, 'redirect', { query: { SAMLRequest } });
  const redirectDestination = parseResponse.extract?.request?.destination ?? '';
  return res.redirect(redirectDestination);
});

// Provide IdP Metadata to SP
router.get('/metadata',  (req, res) => {
  return res.header('Content-Type', 'text/xml').send(IdP.getMetadata());
});

module.exports = router;
