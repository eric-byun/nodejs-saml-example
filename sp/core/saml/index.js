const fs = require('fs');

const SAML = require('samlify');
SAML.setSchemaValidator({
  validate: (response) => {
    return Promise.resolve('skipped');
  },
});

const { ServiceProvider, IdentityProvider } = SAML;
const IdP = new IdentityProvider({
  // Provided File from IdP
  metadata: fs.readFileSync(__dirname + '/../support/metadata_idp.xml'),
});

const SP = new ServiceProvider({
  metadata: fs.readFileSync(__dirname + '/../support/metadata_sp.xml'),
});

module.exports = {
  IdP, SP,
}
