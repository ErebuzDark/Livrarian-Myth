const React = require('react');
const { Body, Container, Head, Html, Preview } = require('@react-email/components');

const ChangePassEmailer = ({ name }) => (
  <Html>
    <Head />
    <Preview>Change Password</Preview>
    <Body>
      <Container>
        <h1>Hello, {name}</h1>
        <p>Click the link below to change your password.</p>
      </Container>
    </Body>
  </Html>
);

module.exports = { ChangePassEmailer };