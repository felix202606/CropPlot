import 'package:supabase_flutter/supabase_flutter.dart';

const supabaseUrl = 'https://qxfdzcqdvsigipmypddn.supabase.co';

// Publishable key. Safe in the app. Row Level Security limits what it can read.
const supabasePublishableKey = 'sb_publishable_kfZnv9r9lhWMoQD9dj5KEQ_eMwlhsaK';

Future<void> startBackend() {
  return Supabase.initialize(url: supabaseUrl, publishableKey: supabasePublishableKey);
}

SupabaseClient get backend => Supabase.instance.client;

/// Pro is on when Stripe has marked this email active or trialing.
Future<bool> proActive() async {
  final email = backend.auth.currentUser?.email;
  if (email == null) return false;
  final rows = await backend.from('subscriptions').select('status').eq('email', email).limit(1);
  if (rows.isEmpty) return false;
  final status = rows.first['status'] as String?;
  return status == 'active' || status == 'trialing';
}
