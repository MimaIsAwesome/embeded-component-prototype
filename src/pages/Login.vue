<template>
  <div style="padding:20px; font-family: Arial, Helvetica, sans-serif;">
    <h2>Simulated Login (popup)</h2>
    <p>This page simulates a login using OIDC. Click the button to "sign in".</p>

    <label>
      User id:
      <input v-model="userId" />
    </label>
    <br/><br/>
    <button @click="doLogin">Sign in (simulate)</button>

    <p style="color:gray;margin-top:16px;font-size:0.9em">
      After sign-in, this popup will send a message to the opener with a fake JWT.
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userId: "user123"
    };
  },
  methods: {
    // create a fake JWT (NOT for production) - header.payload.signature (base64)
    makeFakeJwt(payloadObj) {
      const header = { alg: "HS256", typ: "JWT" };
      const base64 = (obj) =>
          btoa(unescape(encodeURIComponent(JSON.stringify(obj))))
              .replace(/\+/g, "-")
              .replace(/\//g, "_")
              .replace(/=+$/, "");
      return `${base64(header)}.${base64(payloadObj)}.signature`;
    },

    doLogin() {
      // Here you'd run your real OIDC flow (redirects, code exchange etc.)
      // For demo, we simulate a successful login and produce a JWT
      const now = Math.floor(Date.now() / 1000);
      const payload = {
        sub: this.userId,
        iss: window.location.origin,
        aud: "example-client",
        iat: now,
        exp: now + 60 * 60 // 1 hour
      };
      const token = this.makeFakeJwt(payload);

      // Send token to opener
      try {
        const message = { type: "OAUTH_TOKEN", token };
        // IMPORTANT: set targetOrigin to the real origin of the opener (App A)
        // For demo we allow any origin but in production use exact origin.
        if (window.opener && !window.opener.closed) {
          window.opener.postMessage(message, "*"); // replace "*" with allowed origin
          // Optionally you can wait for ack. Then close popup.
          window.close();
        } else {
          alert("No opener window found (open this page as a popup from App A).");
        }
      } catch (err) {
        console.error("postMessage failed", err);
        alert("Failed to send token to opener: " + err.message);
      }
    }
  }
};
</script>
