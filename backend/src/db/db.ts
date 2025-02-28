import dotenv from "dotenv";
import path from "path";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_KEY ||"";
console.log("supabaseUrl", supabaseUrl);
console.log("supabaseKey", supabaseKey);
if (!supabaseKey) {
  throw new Error("SUPABASE_KEY is missing. Check your .env file.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
