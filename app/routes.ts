import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("layout/app-layout.tsx", [
    layout("layout/footer-layout.tsx", [
      index("routes/index.tsx"),
      route("home", "routes/home.tsx"),
      route("about", "routes/about.tsx"),
      route("dashboard", "routes/dashboard.tsx"),
      route("profile", "routes/profile.tsx"),
      route("forum", "features/forum/routes/forum.new.tsx"),
      route("forum-old", "features/forum/routes/forum.tsx"),
      route("forum/all", "features/forum/routes/forum.all.tsx"),
      route("forum/detail/:questionId", "features/forum/routes/forum.$id.tsx"),
      route("events", "features/events/routes/events.tsx"),
      route("events/all", "features/events/routes/events.all.tsx"),
      route("events/detail/:id", "features/events/routes/events.$id.tsx"),
      route("volunteer", "features/volunteer/routes/volunteer.tsx"),
      route("volunteer/all", "features/volunteer/routes/volunteer.all.tsx"),
      route(
        "volunteer/create",
        "features/volunteer/routes/volunteer.create.tsx",
      ),
      route(
        "volunteer/detail/:id",
        "features/volunteer/routes/volunteer.$id.tsx",
      ),
      route("poc", "features/poc/routes/poc.tsx"),
      route("poc/detail/:id", "features/poc/routes/poc.$id.tsx"),
      route("launchpad", "features/launchpad/routes/launchpad.tsx"),
      route("launchpad/all", "features/launchpad/routes/launchpad.all.tsx"),
      route(
        "launchpad/create",
        "features/launchpad/routes/launchpad.create.tsx",
      ),
      route(
        "launchpad/detail/:id",
        "features/launchpad/routes/launchpad.$id.tsx",
      ),
    ]),
    route("myspace", "features/myspace/routes/myspace.tsx"),
    route("edit-profile", "features/myspace/routes/edit-profile.tsx"),
    route("my-applications", "features/myspace/routes/my-applications.tsx"),

    layout("layout/workspace-layout.tsx", [
      route("workspace", "features/workspace/routes/workspace.tsx"),
    ]),
  ]),
  route("onboarding", "routes/onboarding/pages/layout.tsx", [
    index("routes/onboarding/pages/index.tsx"),
    route("profile", "routes/onboarding/pages/profile.tsx"),
    route("interest", "routes/onboarding/pages/interest.tsx"),
    route("contribution", "routes/onboarding/pages/contribution.tsx"),
    route("tier", "routes/onboarding/pages/tier.tsx"),
  ]),
  route("tk-admin", "layout/admin-layout.tsx", [
    index("features/admin/index.tsx"),
    route("users", "features/admin/admin-users.tsx"),
  ]),
  route("login", "routes/auth/pages/login.tsx"),
  route("register", "routes/auth/pages/register.tsx"),
  route("forgot-password", "routes/auth/pages/forgot-password.tsx"),
  route(
    "forgot-password/check-email",
    "routes/auth/pages/forgot-password-check-email.tsx",
  ),
  route("reset-password", "routes/auth/pages/reset-password.tsx"),
  route("onboarding/completed", "routes/onboarding/pages/completed.tsx"),
  route("verify-otp", "routes/auth/pages/verify-otp.tsx"),
  route("logout", "routes/logout.tsx"),
  route("api/onboarding/cities", "routes/api/api.onboarding.cities.tsx"),
  route(
    "api/uploads/avatar/presign",
    "routes/api/api.uploads.avatar.presign.tsx",
  ),
  route("api/me", "routes/api/api.me.tsx"),
] satisfies RouteConfig;
