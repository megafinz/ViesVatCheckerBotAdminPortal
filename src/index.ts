import dotenv from 'dotenv';
import express, { Request, RequestHandler, Response } from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import axios from 'axios';
import mustache from 'mustache-express';
import { VatRequest, VatRequestError } from './models';

dotenv.config();

const { PORT, API_URL, ADMIN_API_URL, API_AUTH_CODE, ADMIN_API_AUTH_CODE } = process.env;
const root = path.join(__dirname, 'www');

const app = express();

app.use(express.static(root));
app.use(bodyParser.urlencoded({ extended: false }));

app.engine('mst', mustache());
app.set('view engine', 'mst');
app.set('views', path.join(__dirname, 'www', 'templates'));

app.get('/vat-requests', async (_, res) => {
  await apiCall(async () => {
    const result = await axios.get(getAdminApiUrl('list'));
    const vatRequests = <VatRequest[]>result.data;
    res.render('vat-requests', {
      vatRequests
    });
  }, res, 'Retrieve VAT Requests');
});

app.get('/vat-request-errors', async (_, res) => {
  await apiCall(async () => {
    const result = await axios.get(getAdminApiUrl('listErrors'));
    const vatRequestErrors = <VatRequestError[]>result.data;
    res.render('vat-request-errors', {
      vatRequestErrors
    });
  }, res, 'Retrieve VAT Request Errors');
});

app.post('/resolve-error', async (req, res) => {
  const errorId = getErrorId(req);
  const silent = getSilent(req);
  if (!errorId) {
    res.status(400).send('Missing VAT Request Error Id');
    console.warn('Invalid request: missing VAT Request Error Id');
  } else {
    await apiCall(async () => {
      await axios.post(getAdminApiUrl('resolveError'), {
        errorId,
        silent
      });
      res.status(204).send();
    }, res, 'Resolve VAT Request Error');
  }
});

app.post('/resolve-all-errors', async (req, res) => {
  const silent = getSilent(req);
  await apiCall(async () => {
    await axios.post(getAdminApiUrl('resolveAllErrors'), {
      silent
    });
    res.status(204).send();
  }, res, 'Resolve all VAT Request Errors');
});

const validateTelegramChatId: RequestHandler = (req, res, next) => {
  const telegramChatId = getTelegramChatId(req);
  if (!telegramChatId) {
    res.status(400).send('Missing Telegram Chat ID');
    return;
  }
  next();
};

const validateVatNumber: RequestHandler = (req, res, next) => {
  const vatNumber = getVatNumber(req);
  if (!vatNumber) {
    res.status(400).send('Missing VAT number');
    return;
  }
  next();
};

app.post('/check', validateTelegramChatId, validateVatNumber, async (req, res) => {
  const telegramChatId = getTelegramChatId(req);
  const vatNumber = getVatNumber(req);
  const silent = getSilent(req);
  await apiCall(async () => {
    const result = await axios.post(getApiUrl('check'), {
      telegramChatId,
      vatNumber,
      silent
    });
    res.status(200).send(result.data);
  }, res, `Register VAT number '${vatNumber}' for Telegram user '${telegramChatId}'`);
});

app.post('/uncheck', validateTelegramChatId, validateVatNumber, async (req, res) => {
  const telegramChatId = getTelegramChatId(req);
  const vatNumber = getVatNumber(req);
  const silent = getSilent(req);
  await apiCall(async () => {
    const result = await axios.post(getApiUrl('uncheck'), {
      telegramChatId,
      vatNumber,
      silent
    });
    res.status(200).send(result.data);
  }, res, `Unregister VAT number '${vatNumber}' for Telegram user '${telegramChatId}'`);
});

const port = PORT || 80;

app.listen(port, () => {
  console.log(`Started server listening on port ${port}`);
  console.log(`Admin API location: ${ADMIN_API_URL}`);
});

function getApiUrl(action: 'check' | 'uncheck' | 'list' | 'uncheckAll') {
  return `${API_URL}/${action}?code=${API_AUTH_CODE}`;
}

function getAdminApiUrl(action: 'list' | 'listErrors' | 'resolveError' | 'resolveAllErrors') {
  return `${ADMIN_API_URL}/${action}?code=${ADMIN_API_AUTH_CODE}`;
}

async function apiCall(fn: () => Promise<void>, res: Response<any>, desc: string) {
  try {
    console.log(`[START] ${desc}`);
    await fn();
    console.log(`[SUCCESS] ${desc}`);
  } catch (error: any) {
    const errorMessage = error.response?.data || error.message || JSON.stringify(error);
    console.error(`[ERROR] ${desc}:`, errorMessage);
    res.status(error.response?.status || 500).send(errorMessage);
  }
}

function getTelegramChatId(req: Request): string | null {
  return req.query.telegramChatId ||
    req.body?.telegramChatId ||
    (req.body ? req.body['input-telegram-chat-id'] : null);
}

function getVatNumber(req: Request): string | null {
  return req.query.vatNumber ||
    req.body?.vatNumber ||
    (req.body ? req.body['input-vat-number'] : null);
}

function getErrorId(req: Request): string | null {
  return req.query.errorId ||
    req.body?.errorId ||
    (req.body ? req.body['input-error-id'] : null);
}

function getSilent(req: Request): boolean {
  return req.query.silent === 'on' ||
    req.body?.silent === 'on' ||
    (req.body ? req.body['check-silent'] === 'on' : false);
}
