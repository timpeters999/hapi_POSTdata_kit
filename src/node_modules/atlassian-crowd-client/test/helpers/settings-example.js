//
// Copy this file to settings.js and provide your own values.
//

export default {
  crowd: {
    baseUrl: 'https://crowd.example.com/',  // The part that comes before 'rest/usermanagement/1'.
    application: {
      name: 'demo-app',                     // Crowd application name.
      password: 'example'                   // Crowd application password.
    },
    nesting: false,                         // Does your backend support nesting? OpenLDAP doesn't.
    sessionTimeout: 600,                    // Session timeout in seconds. Can never be more than the one configured in Crowd.
    debug: false                            // Enables verbose logging of requests and responses.
  }
};
