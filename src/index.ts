import dotenv from "dotenv";
import express from "express";
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
    const result = await axios.get(getApiUrl("list"));
    const vatRequests = <VatRequest[]>result.data;
    res.render("vat-requests", {
        vatRequests: vatRequests
    });
});

app.get("/vat-request-errors", async (_, res) => {
    const result = await axios.get(getApiUrl("listErrors"));
    const vatRequestErrors = <VatRequestError[]>result.data;
    res.render("vat-request-errors", {
        vatRequestErrors: vatRequestErrors
    });
});

app.post("/resolve-error", async (req, res) => {
    const telegramChatId = req.query.telegramChatId || req.body?.telegramChatId;
    const vatNumber = req.query.vatNumber || req.body?.vatNumber;
    if (!telegramChatId) {
        res.status(400).send("Missing Telegram Chat Id");
    } else if (!vatNumber) {
        res.status(400).send("Missing VAT Number");
    } else {
        await axios.post(getApiUrl("resolveError"), {
            telegramChatId: telegramChatId,
            vatNumber: vatNumber
        });
        res.status(204);
        res.header("HX-Refresh", "true");
        res.send();
    }
});

const port = PORT || 80;

app.listen(port, () => {
    console.log(`Started server listening on port ${port}.`);
});

function getApiUrl(action: "list" | "listErrors" | "resolveError") {
    return `${ADMIN_API_URL}/${action}?code=${ADMIN_API_AUTH_CODE}`;
}
