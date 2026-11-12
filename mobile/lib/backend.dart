import 'package:supabase_flutter/supabase_flutter.dart';

const supabaseUrl = 'https://qxfdzcqdvsigipmypddn.supabase.co';

// Publishable key. Safe in the app. Row Level Security limits what it can read.
const supabasePublishableKey = 'sb_publishable_kfZnv9r9lhWMoQD9dj5KEQ_eMwlhsaK';

Future<void> startBackend() {
  return Supabase.initialize(url: supabaseUrl, publishableKey: supabasePublishableKey);
}

SupabaseClient get backend => Supabase.instance.client;

/// Deep link Supabase sends the user back to after Google or Apple sign-in.
const authRedirect = 'cropplot://login-callback';

Future<bool> signInWith(OAuthProvider provider) {
  return backend.auth.signInWithOAuth(provider, redirectTo: authRedirect);
}

class AppBanner {
  const AppBanner({
    required this.id,
    required this.title,
    required this.body,
    this.ctaLabel,
    this.ctaUrl,
  });

  final String id;
  final String title;
  final String body;
  final String? ctaLabel;
  final String? ctaUrl;
}

/// Active app campaigns. Dates are checked here so a signed-in admin
/// does not see drafts that the admin policy would otherwise return.
Future<List<AppBanner>> liveAppBanners() async {
  final rows = await backend
      .from('banners')
      .select('id,title,body,cta_label,cta_url,active,starts_at,ends_at')
      .eq('audience', 'app');
  final now = DateTime.now().toUtc();
  return [
    for (final row in rows)
      if (_bannerLive(row, now))
        AppBanner(
          id: row['id'] as String,
          title: row['title'] as String,
          body: (row['body'] as String?) ?? '',
          ctaLabel: row['cta_label'] as String?,
          ctaUrl: row['cta_url'] as String?,
        ),
  ];
}

bool _bannerLive(Map<String, dynamic> row, DateTime now) {
  if (row['active'] != true) return false;
  final start = row['starts_at'] == null ? null : DateTime.parse(row['starts_at'] as String);
  final end = row['ends_at'] == null ? null : DateTime.parse(row['ends_at'] as String);
  if (start != null && now.isBefore(start.toUtc())) return false;
  if (end != null && now.isAfter(end.toUtc())) return false;
  return true;
}

Future<String?> inviteCode() async {
  final id = backend.auth.currentUser?.id;
  if (id == null) return null;
  final row = await backend.from('profiles').select('referral_code').eq('id', id).maybeSingle();
  return row?['referral_code'] as String?;
}

/// Pro is on when Stripe has marked this email active or trialing.
Future<bool> proActive() async {
  final email = backend.auth.currentUser?.email;
  if (email == null) return false;
  final rows = await backend.from('subscriptions').select('status').eq('email', email).limit(1);
  if (rows.isEmpty) return false;
  final status = rows.first['status'] as String?;
  return status == 'active' || status == 'trialing';
}
