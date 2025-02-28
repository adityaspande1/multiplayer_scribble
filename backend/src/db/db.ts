import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config(); // Load environment variables

const supabaseUrl = 'https://dqnqkkldwsjlqgohgptv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxbnFra2xkd3NqbHFnb2hncHR2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDc1MDEyMSwiZXhwIjoyMDU2MzI2MTIxfQ.Yhcw_t0Qql8SIRcJBZ_QHnMW1TXd6ePXIegp26f9xdw'
;
console.log("supabaseUrl", supabaseUrl);
console.log("supabaseKey", supabaseKey);
if (!supabaseKey) {
  throw new Error("SUPABASE_KEY is missing. Check your .env file.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
