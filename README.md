# Saml Login Example using NodeJS
Example of SAML login using nodejs and samlify

### IdP
`http://localhost:3000`

### SP
`http://localhost:4000`

### open (SP Login Page)
`http://localhost:4000/login`

## Login Procedure
1. Access SP login page 
2. Redirect to IdP login page with SAMLRequest
3. (You must handle the user login process on your website)
4. If Login completed on IdP then redirect to acs path of SP with SAMLResponse
5. Login completed on SP

## More info here
1. [Create Pem Key file](https://support.google.com/a/answer/6342198)
2. [SAML 2.0 Login Overview - Spring](https://docs.spring.io/spring-security/reference/servlet/saml2/login/overview.html)
