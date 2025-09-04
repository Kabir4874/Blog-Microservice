import dotenv from "dotenv";
import { google } from "googleapis";
dotenv.config();
export const oauth2client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, "postmessage");
//# sourceMappingURL=googleConfig.js.map