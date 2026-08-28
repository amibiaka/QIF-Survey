# QIF Survey Master - live database runbook (Supabase)

Property of AUDA-NEPAD. The website runs in two modes automatically:
demo mode (no configuration, everything stored in the browser) and live mode
(config.js contains the Supabase project URL and anon public key). The anon key
is safe to publish; every table is protected by Row Level Security and all
writes go through server-side functions.

## 1. One-time database setup
1. Supabase dashboard -> SQL editor -> paste the whole of `supabase/schema.sql` -> Run.
   It is idempotent (safe to run again). It creates the tables, policies, RPCs
   and enables the 18 confirmed African implementation countries.
2. Authentication -> Users -> Add user -> "Create new user":
   the super admin's email + a temporary password, "Auto confirm user" ON.
3. SQL editor, run (replace the email if different):
   insert into public.profiles (id, email, name, role, scope_regions, can_view, can_download, must_change)
   select id, email, 'Super Administrator', 'super', array['africa','caribbean','pacific'], true, true, true
   from auth.users where email = 'idriss.amine@gmail.com'
   on conflict (id) do update set role = 'super';
4. Authentication -> URL configuration -> Site URL: the production site URL.

## 2. Edge function (admin creation + emails)
Dashboard -> Edge Functions -> Deploy new function -> name: `admin-ops` ->
paste `supabase/functions/admin-ops/index.ts` -> Deploy.
SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are injected automatically; the
service key never appears in the website.

Emails: out of the box the platform always shows the invitation link and the
temporary password in the console so they can be sent manually. For automatic
emails add one secret: Edge Functions -> admin-ops -> Secrets ->
`RESEND_API_KEY` (free tier at resend.com, 100 emails/day) and optionally
`MAIL_FROM` (e.g. `QIF Survey Master <surveys@yourdomain>`, a domain verified
in Resend). Supabase's built-in auth mailer is not used for invitations.

## 3. How access works
- Respondents: an admin creates a respondent with their email; the system
  issues a personal link `survey.html?rt=<token>` valid for 7 days, single
  submission, that opens their country's survey directly (no password).
  Public sign-up remains available: valid requests in open countries with a
  free quota seat are auto-granted a link; everything else queues for review.
- Admins: the super admin creates administrator profiles (country, MDB/RDB,
  regional organisation, OACPS, partner), scoped by regions and/or countries,
  with or without download rights. New admins receive a temporary password and
  must change it at first sign-in (enforced).
- Quotas: 2 respondents per country x sector x level; 1 for the head of the
  unique national QI institutions (NSB, NMI, NLMB, NAB). Enforced in the
  database.
- Countries: Africa starts with the 18 confirmed countries enabled; the super
  admin can enable any AU member state (incl. the Sahrawi Arab Democratic
  Republic) and any Caribbean or Pacific OACPS member at any time.

## 4. Data
- `responses` holds one row per submission (meta columns + full answers JSON).
- Admin downloads (Excel/CSV) are scoped by each profile's rights; RLS applies
  the same scope server-side, so even a modified client cannot read more.
- The audit log records country changes, invitations, admin changes, downloads.

## 5. Security notes
- Only the anon public key ships in the website; the service-role key lives
  exclusively inside the edge function environment.
- All writes go through SECURITY DEFINER RPCs with server-side checks
  (scope, quotas, expiry); direct table writes are revoked.
- CSP on the site restricts connections to the Supabase project only.
- Consider enabling Supabase's built-in rate limits and captcha
  (Auth -> Attack protection) before large-scale fieldwork.

