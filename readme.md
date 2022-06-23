# What's This?

This is a simple web application that is intended to be an admin helper tool for [VIES Vat Checker Bot](https://github.com/megafinz/ViesVatCheckerBot).

# What Does It Do?

It can display two lists:
- VAT numbers that are registered for monitoring.
- VAT numbers that failed to be validated in VIES for some reason. You can mark the the errors as resolved once you're sure that those VAT numbers can be validated again.

# How Do I Run This?

1. Create `.env` file.
   ```
   PORT="3000" # or any other value that fits you
   ADMIN_API_URL=%URL_OF_YOUR_ADMIN_API_FUNCTION%
   API_URL=%URL_OF_YOUR_API_FUNCTION%
   ADMIN_API_AUTH_CODE=%AUTH_CODE_FOR_YOUR_ADMIN_API_FUNCTION%
   API_AUTH_CODE=%AUTH_CODE_FOR_YOUR_API_FUNCTION%
   E2E_API_URL=%URL_OF_YOUR_E2E_API%
   ```
2. You have two choices:
   - 2.1. Have [Node.js](https://nodejs.dev) and [typescript](https://www.npmjs.com/package/typescript) installed locally, then run `npm install` in terminal, then run `npm start` in terminal.
   - 2.2. Have [Docker](https://www.docker.com) installed locally, then run `docker-compose up` in terminal. If you make any changes to the source code, run `docker-compose up --build` to rebuild the image.

# Tests

## E2E

1. Run the [backend](https://github.com/megafinz/ViesVatCheckerBot) in E2E mode.
2. Update `.env` file: set `E2E_API_URL` to point to your backend's `/e2e` endpoint address (e.g. `http://localhost:7071/e2e`).
3. Start the app as usual: `npm start`.
4. Run [cypress](https://www.cypress.io) via `npm run cypress:open`.
5. Click on "E2E Testing", then choose a browser.
6. Run tests.
