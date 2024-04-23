import { google } from "googleapis";
// import keys from "../../../../spreadsheets-keys.json";
import keys from "../../../spreadsheets-keys.json";

export default function handler(req, res) {
    const sheetName = req.body.sheet;
    try {
        const client = new google.auth.JWT(keys.client_email, undefined, keys.private_key, [
            "https://www.googleapis.com/auth/spreadsheets",
        ]);

        client.authorize(async function (err, tokens) {
            if (err) {
                return res.status(400).send(JSON.stringify({ error: true }));
            }

            const gsapi = google.sheets({ version: "v4", auth: client });

            // custom
            const opt = {
                spreadsheetId: process.env.SHEET_ID,
                range: `${ sheetName }!A1:Z`,
            };
            let data = await gsapi.spreadsheets.values.get(opt);

            const titles = data.data.values[0];
            var rows = data.data.values;
            rows.shift();

            // Filter by id
            const filteredRow = rows.find(row => row[0] == req.body.id);

            // Map titles with filtered row values
            const mappedObject = titles.reduce((obj, title, index) => {
                obj[title] = filteredRow[index];
                return obj;
            }, {});

            return res.status(200).send(JSON.stringify({ error: false, data: mappedObject }));
        });
    } catch (e) {
        return res.status(400).send(JSON.stringify({ error: true, message: e.message }));
    }
}