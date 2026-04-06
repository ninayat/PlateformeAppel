import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

const roleRoutes: Record<string, Array<"client" | "pro" | "admin">> = {
  "/client": ["client"],
  "/pro": ["pro"],
  "/admin": ["admin"]
};

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res: response });

  const {
    data: { session }
  } = await supabase.auth.getSession();

  const matchedEntry = Object.entries(roleRoutes).find(([prefix]) => request.nextUrl.pathname.startsWith(prefix));
  if (!matchedEntry) return response;

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single();
  const allowedRoles = matchedEntry[1];

  // Commentaire: redirection si rôle absent ou non autorisé.
  if (!profile?.role || !allowedRoles.includes(profile.role)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/client/:path*", "/pro/:path*", "/admin/:path*"]
};
