const fs = require('fs');

const SAML = require('samlify');
SAML.setSchemaValidator({
  validate: (response) => {
    return Promise.resolve('skipped');
  },
});
const { ServiceProvider, IdentityProvider } = SAML;
const IdP = new IdentityProvider({
  metadata: fs.readFileSync(__dirname + '/../support/metadata_idp.xml'),
  privateKey: fs.readFileSync(__dirname + '/../support/private-rsa.pem'),
  requestSignatureAlgorithm: 'http://www.w3.org/2000/09/xmldsig#rsa-sha1',
  loginResponseTemplate: {
    additionalTemplates: {
      attributeStatementTemplate: {
        context: '<saml2:AttributeStatement>{Attributes}</saml2:AttributeStatement>',
      },
      attributeTemplate: {
        context:
          '<saml2:Attribute Name="{Name}" NameFormat="{NameFormat}"><saml2:AttributeValue xmlns:xs="{ValueXmlnsXs}" xmlns:xsi="{ValueXmlnsXsi}" xsi:type="{ValueXsiType}">{Value}</saml2:AttributeValue></saml2:Attribute>',
      },
    },
    context: '<saml2p:Response xmlns:saml2p="urn:oasis:names:tc:SAML:2.0:protocol" xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion" ID="{ID}" Version="2.0"><saml2p:Status><saml2p:StatusCode Value="urn:oasis:names:tc:SAML:2.0:status:Success"/></saml2p:Status><saml2:Assertion xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion" ID="{ID}" Version="2.0" IssueInstant="{IssueInstant}" xmlns:xs="http://www.w3.org/2001/XMLSchema"><saml2:Issuer>{Issuer}</saml2:Issuer>{AttributeStatement}</saml2:Assertion></saml2p:Response>',
    attributes: [
      {
        name: 'id',
        valueTag: 'id',
        nameFormat: 'urn:oasis:names:tc:SAML:2.0:attrname-format:basic',
        valueXsiType: 'xs:anyType',
      },
      {
        name: 'name',
        valueTag: 'name',
        nameFormat: 'urn:oasis:names:tc:SAML:2.0:attrname-format:basic',
        valueXsiType: 'xs:anyType',
      },
      {
        name: 'email',
        valueTag: 'email',
        nameFormat: 'urn:oasis:names:tc:SAML:2.0:attrname-format:basic',
        valueXsiType: 'xs:anyType',
      },
    ],
  },
});

const SP = new ServiceProvider({
  signatureConfig: {
    prefix: 'ds',
    location: { reference: "/*[local-name(.)='Response']/*[local-name(.)='Assertion']", action: 'after' },
  },
});

module.exports = {
  IdP, SP,
}
