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
   ADMIN_API_AUTH_CODE=%AUTH_CODE_OF_YOUR_ADMIN_API_FUNCTION%
   ```
2. Type `npm install` in terminal.
3. Type `npm start` in terminal.

This app is not intended to be distributed as it lacks any authentication/authorization checks (although you'll need an auth code to call your bot's admin API).
