import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({ request });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // Refresh session if expired — required for Server Components
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Check protected routes
    const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");
    const isVetDashboard = request.nextUrl.pathname.startsWith("/vet-dashboard");

    if (isDashboard || isVetDashboard) {
        if (!user) {
            // Unauthenticated
            const url = request.nextUrl.clone();
            url.pathname = "/auth/login";
            return NextResponse.redirect(url);
        }

        // Authenticated — Enforce strict isolation based on role
        const activeRole = request.cookies.get("vetya-active-role")?.value || "owner";

        if (activeRole === "vet" && isDashboard) {
            // Vet trying to access owner dashboard
            const url = request.nextUrl.clone();
            url.pathname = "/vet-dashboard";
            return NextResponse.redirect(url);
        }

        if (activeRole === "owner" && isVetDashboard) {
            // Owner trying to access vet dashboard
            const url = request.nextUrl.clone();
            url.pathname = "/dashboard";
            return NextResponse.redirect(url);
        }
    }

    return supabaseResponse;
}
