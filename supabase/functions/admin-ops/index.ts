// QIF Survey Master - admin-ops edge function (property of AUDA-NEPAD)
// Actions (all require a signed-in profile; role checks below):
//   create_admin  : super only. Creates the auth user with a temporary password,
//                   writes the profile, and emails the credentials (Resend if
//                   RESEND_API_KEY is set; otherwise the temp password is
//                   returned to the console for manual sending).
//   remove_admin  : super only. Deletes the auth user (cascade removes profile).
//   email_invite  : any admin in scope. Emails a respondent their 7-day survey
//                   link (Resend if configured, else returns the link).
// Secrets used: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (auto-injected),
//               RESEND_API_KEY (optional), MAIL_FROM (optional).
import { createClient } from "npm:@supabase/supabase-js@2";

const admin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  { auth: { persistSession: false } },
);

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const J = (o: unknown, s = 200) =>
  new Response(JSON.stringify(o), { status: s, headers: { ...CORS, "Content-Type": "application/json" } });

function tempPassword(): string {
  const a = crypto.getRandomValues(new Uint8Array(9));
  return "QIF-" + Array.from(a, (b) => "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789"[b % 55]).join("");
}

async function sendMail(to: string, subject: string, html: string) {
  const key = Deno.env.get("RESEND_API_KEY");
  if (!key) return { emailed: false, why: "no_mail_provider" };
  const from = Deno.env.get("MAIL_FROM") || "QIF Survey Master <onboarding@resend.dev>";
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], subject, html }),
  });
  return { emailed: r.ok, why: r.ok ? undefined : await r.text() };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  try {
    const auth = req.headers.get("Authorization") ?? "";
    const { data: userData } = await admin.auth.getUser(auth.replace("Bearer ", ""));
    const uid = userData?.user?.id;
    if (!uid) return J({ ok: false, why: "unauthenticated" }, 401);
    const { data: me } = await admin.from("profiles").select("*").eq("id", uid).single();
    if (!me) return J({ ok: false, why: "no_profile" }, 403);

    const { action, p } = await req.json();

    if (action === "create_admin") {
      if (me.role !== "super") return J({ ok: false, why: "forbidden" }, 403);
      const temp = tempPassword();
      const { data: created, error } = await admin.auth.admin.createUser({
        email: p.email, password: temp, email_confirm: true,
      });
      if (error) return J({ ok: false, why: error.message });
      await admin.from("profiles").insert({
        id: created.user.id, email: p.email, name: p.name ?? "", org: p.org ?? "",
        role: p.role, scope_regions: p.scope_regions ?? [], scope_countries: p.scope_countries ?? [],
        can_view: true, can_download: !!p.can_download, must_change: true, created_by: me.email,
      });
      await admin.from("audit_log").insert({ actor: me.email, action: "admin_created", detail: { email: p.email, role: p.role } });
      const mail = await sendMail(
        p.email,
        "Your QIF Survey Master administrator profile",
        `<p>Dear ${p.name ?? "colleague"},</p>
         <p>An administrator profile has been created for you on <b>QIF Survey Master</b>,
         the survey platform of AUDA-NEPAD operated with UNIDO, the African Union Commission and the OACPS.</p>
         <p>Sign in at <a href="${p.origin ?? ""}/admin.html">${p.origin ?? "the platform"}</a> with:</p>
         <p>Email: <b>${p.email}</b><br>Temporary password: <b>${temp}</b></p>
         <p>You will be asked to change this password at your first sign-in.</p>
         <p>QIF Survey Master · © AUDA-NEPAD</p>`,
      );
      return J({ ok: true, temp_password: mail.emailed ? undefined : temp, emailed: mail.emailed });
    }

    if (action === "remove_admin") {
      if (me.role !== "super") return J({ ok: false, why: "forbidden" }, 403);
      const { error } = await admin.auth.admin.deleteUser(p.id);
      if (error) return J({ ok: false, why: error.message });
      await admin.from("audit_log").insert({ actor: me.email, action: "admin_removed", detail: { id: p.id } });
      return J({ ok: true });
    }

    if (action === "email_invite") {
      const { data: inv } = await admin.from("invites").select("*").eq("token", p.token).single();
      if (!inv) return J({ ok: false, why: "not_found" });
      const link = `${p.origin}/survey.html?rt=${inv.token}`;
      const mail = await sendMail(
        inv.email,
        "Invitation: Survey on Financing Quality Infrastructure",
        `<p>Dear ${inv.name ?? "respondent"},</p>
         <p>You are invited to complete the <b>Survey on Financing Quality Infrastructure and MSME Access to Finance</b>,
         conducted by AUDA-NEPAD, UNIDO and the African Union Commission under the ACP Quality Infrastructure
         Programme, in collaboration with the OACPS.</p>
         <p><a href="${link}">Start your country's survey</a> (20 to 25 minutes; the link is personal and expires in 7 days).</p>
         <p>QIF Survey Master · © AUDA-NEPAD</p>`,
      );
      return J({ ok: true, link, emailed: mail.emailed, why: mail.why });
    }

    return J({ ok: false, why: "unknown_action" }, 400);
  } catch (e) {
    return J({ ok: false, why: String(e) }, 500);
  }
});

