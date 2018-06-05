const redirectUriKey = 'cimpress.io.auth0-sso-login.redirectUri';

export default class RedirectHandler {
  /**
   * @constructor create a redirect handler to store the redirect
   * @param {Object} logger
   */
  constructor(logger) {
    this.logger = logger;
  }

  /**
   * @description Save a redirect
   * @param redirectUri redirectUrl to save
   * @return {*|void}
   */
  setRedirect(redirectUri) {
    try {
      this.logger.log({ title: 'Saving redirect in local storage', url: redirectUri });
      localStorage.setItem(redirectUriKey, redirectUri);
    } catch (error) {
      this.logger.log({ title: 'Failed to set redirect in local storage', error: error });
    }
  }

  /**
   * @description Navigate a redirect if one is stored, otherwise return
   * @return {*_void}
   */
  attemptRedirect() {
    try {
      let redirectUri = localStorage.getItem(redirectUriKey);
      localStorage.removeItem(redirectUriKey);
      let parsedUrl = new URL(window.location.href);
      let isFromAuth0 = parsedUrl.searchParams.get('state') || parsedUrl.searchParams.get('code');
      if (redirectUri && isFromAuth0) {
        parsedUrl.searchParams.delete('state');
        parsedUrl.searchParams.delete('code');
        history.replaceState(null, null, parsedUrl.toString());
        this.logger.log({ title: 'Auto redirect back to original location', url: redirectUri });
        window.location.replace(redirectUri);
      }
    } catch (error) {
      this.logger.log({ title: 'Failed to get redirect from local storage', error: error });
    }
  }
}
