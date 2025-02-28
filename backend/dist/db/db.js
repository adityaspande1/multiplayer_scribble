"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supabase_js_1 = require("@supabase/supabase-js");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Load environment variables
const supabaseUrl = 'https://dqnqkkldwsjlqgohgptv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxbnFra2xkd3NqbHFnb2hncHR2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDc1MDEyMSwiZXhwIjoyMDU2MzI2MTIxfQ.Yhcw_t0Qql8SIRcJBZ_QHnMW1TXd6ePXIegp26f9xdw';
console.log("supabaseUrl", supabaseUrl);
console.log("supabaseKey", supabaseKey);
if (!supabaseKey) {
    throw new Error("SUPABASE_KEY is missing. Check your .env file.");
}
const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
exports.default = supabase;
