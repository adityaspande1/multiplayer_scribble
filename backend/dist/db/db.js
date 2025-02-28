"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const supabase_js_1 = require("@supabase/supabase-js");
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../../.env") });
console.log("SUPABASE_URL:", JSON.stringify(process.env.SUPABASE_URL));
console.log("SUPABASE_KEY:", JSON.stringify(process.env.SUPABASE_KEY));
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_KEY || "";
console.log("supabaseUrl", supabaseUrl);
console.log("supabaseKey", supabaseKey);
if (!supabaseKey) {
    throw new Error("SUPABASE_KEY is missing. Check your .env file.");
}
const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
exports.default = supabase;
