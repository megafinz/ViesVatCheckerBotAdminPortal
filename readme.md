# What's This?

This is a simple web application that is intended to be an admin helper tool for [VIES Vat Checker Bot](https://github.com/megafinz/ViesVatCheckerBot).

# What Does It Do?

It can display two lists:

- VAT numbers that are registered for monitoring.
- VAT numbers that failed to be validated in VIES for some reason. You can mark the the errors as resolved once you're sure that those VAT numbers can be validated again.

# How Do I Run This?

1. Create `.env.local` file.
   ```
   ADMIN_API_URL=%URL_OF_YOUR_ADMIN_API_FUNCTION%
   API_URL=%URL_OF_YOUR_API_FUNCTION%
   ADMIN_API_AUTH_CODE=%AUTH_CODE_FOR_YOUR_ADMIN_API_FUNCTION%
   API_AUTH_CODE=%AUTH_CODE_FOR_YOUR_API_FUNCTION%
   TG_ADMIN_CHAT_ID=%TG_ADMIN_CHAT_ID% (optional, used only to highlight VAT requests issued by the admin)
   ```
2. You have two choices:
   - 2.1. Have [Node.js](https://nodejs.dev) installed locally, then run `yarn install` in terminal, then run `yarn dev` in terminal.
   - 2.2. Have [Docker](https://www.docker.com) installed locally, then run `docker-compose up` in terminal. If you make any changes to the source code, run `docker-compose up --build` to rebuild the image.
