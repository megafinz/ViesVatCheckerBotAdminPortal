import dotenv from "dotenv";
import express, { Response } from "express";
import path from "path";
import axios from "axios";
import mustache from "mustache-express";
import { VatRequest, VatRequestError } from "./models";

dotenv.config();

const { PORT, ADMIN_API_URL, ADMIN_API_AUTH_CODE } = process.env;
const root = path.join(__dirname, "www");

const app = express();

app.use(express.static(root));

app.engine("mst", mustache());
app.set("view engine", "mst");
app.set("views", path.join(__dirname, "www", "templates"));

app.get("/vat-requests", async (_, res) => {
    await apiCall(async () => {
        const result = await axios.get(getApiUrl("list"));
        const vatRequests = <VatRequest[]>result.data;
        res.render("vat-requests", {
            vatRequests: vatRequests
        });
        console.log("Successfully retrieved VAT Requests");
    }, res, "Failed to retrieve VAT Requests");
});

app.get("/vat-request-errors", async (_, res) => {
    await apiCall(async () => {
        const result = await axios.get(getApiUrl("listErrors"));
        const vatRequestErrors = <VatRequestError[]>result.data;
        res.render("vat-request-errors", {
            vatRequestErrors: vatRequestErrors
        });
        console.log("Successfully retrieved VAT Request Errors");
    }, res, "Failed to retrieve VAT Request Errors");
});

app.post("/resolve-error", async (req, res) => {
    const telegramChatId = req.query.telegramChatId || req.body?.telegramChatId;
    const vatNumber = req.query.vatNumber || req.body?.vatNumber;
    if (!telegramChatId) {
        res.status(400).send("Missing Telegram Chat Id");
        console.warn("Invalid request: missing Telegram Chat Id");
    } else if (!vatNumber) {
        res.status(400).send("Missing VAT Number");
        console.log("Invalid request: missing VAT Number");
    } else {
        await apiCall(async () => {
            await axios.post(getApiUrl("resolveError"), {
                telegramChatId: telegramChatId,
                vatNumber: vatNumber
            });
            res.status(204).send();
            console.log("Successfully resolved VAT Request Error");
        }, res, "Failed to resolve VAT Request Error");
    }
});

const port = PORT || 80;

app.listen(port, () => {
    console.log(`Started server listening on port ${port}.`);
});

function getApiUrl(action: "list" | "listErrors" | "resolveError") {
    return `${ADMIN_API_URL}/${action}?code=${ADMIN_API_AUTH_CODE}`;
}

async function apiCall(fn: () => Promise<void>, res: Response<any>, errorMessage: string) {
    try {
        await fn();
    } catch (error: any) {
        console.error(`${errorMessage}\n`, error.message || error);
        res.status(error.response?.status || 500).send(errorMessage);
    }
}
