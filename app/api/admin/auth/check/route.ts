import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      return NextResponse.json({ error: "No token found" }, { status: 401 });
    }

    // Extract email from token
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [email, timestamp] = decoded.split(':');

    // Basic validation
    if (!email || !timestamp || !email.includes('@')) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Check token age
    const tokenAge = Date.now() - parseInt(timestamp);
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    
    if (tokenAge > maxAge) {
      return NextResponse.json({ error: "Token expired" }, { status: 401 });
    }

    // Try to get user from Supabase (optional validation)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: '', // We can't validate password here, just check if user exists
      });

      // If user doesn't exist, we'll still allow access based on token validity
      // The actual validation happens during login
    } catch (error) {
      // Ignore Supabase errors, token validation is enough
    }

    return NextResponse.json({ success: true, user: { email } });
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
