import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  publicRoutes: ["/", "/auth/signin", "/auth/signup"],
  afterAuth(auth, req, evt) {
    if (!auth.userId && !auth.isPublicRoute) {
      const landing = new URL("/", req.url);
      return NextResponse.redirect(landing);
    }

    if (auth.userId && !auth.orgId && req.nextUrl.pathname != "/home") {
      const home = new URL("/home", req.url);
      return NextResponse.redirect(home);
    }
  },
  signInUrl: "/",
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
