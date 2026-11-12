import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import 'backend.dart';

class AuthPage extends StatefulWidget {
  const AuthPage({super.key});

  @override
  State<AuthPage> createState() => _AuthPageState();
}

class _AuthPageState extends State<AuthPage> {
  final _email = TextEditingController();
  final _password = TextEditingController();
  var _creating = false;
  var _busy = false;
  var _messageIsError = true;
  String? _message;

  @override
  void dispose() {
    _email.dispose();
    _password.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    final email = _email.text.trim();
    final password = _password.text;
    if (email.isEmpty || password.length < 6) {
      setState(() {
        _messageIsError = true;
        _message = 'Use an email and a password of at least 6 characters.';
      });
      return;
    }
    setState(() {
      _busy = true;
      _message = null;
    });
    try {
      if (_creating) {
        final response = await backend.auth.signUp(
          email: email,
          password: password,
          emailRedirectTo: authRedirect,
        );
        if (response.session == null && mounted) {
          setState(() {
            _messageIsError = false;
            _message = 'Check your email to confirm the account, then sign in.';
          });
        }
      } else {
        await backend.auth.signInWithPassword(email: email, password: password);
      }
    } on AuthException catch (error) {
      if (mounted) {
        setState(() {
          _messageIsError = true;
          _message = error.message;
        });
      }
    } catch (_) {
      if (mounted) {
        setState(() {
          _messageIsError = true;
          _message = 'Could not reach CropPlot. Try again.';
        });
      }
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  Future<void> _oauth(OAuthProvider provider) async {
    setState(() {
      _busy = true;
      _message = null;
    });
    try {
      final opened = await signInWith(provider);
      if (!opened && mounted) {
        setState(() {
          _messageIsError = true;
          _message = 'Could not open the sign-in page.';
        });
      }
    } on AuthException catch (error) {
      if (mounted) {
        setState(() {
          _messageIsError = true;
          _message = error.message;
        });
      }
    } catch (_) {
      if (mounted) {
        setState(() {
          _messageIsError = true;
          _message = 'Could not reach CropPlot. Try again.';
        });
      }
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(24),
          children: [
            const SizedBox(height: 48),
            Image.asset('assets/logo.png', height: 72),
            const SizedBox(height: 8),
            const Text('Use the same email as cropplot.com so Pro can unlock.'),
            const SizedBox(height: 24),
            OutlinedButton(
              onPressed: _busy ? null : () => _oauth(OAuthProvider.google),
              child: const Text('Continue with Google'),
            ),
            const SizedBox(height: 8),
            FilledButton(
              style: FilledButton.styleFrom(backgroundColor: const Color(0xFF2B2118)),
              onPressed: _busy ? null : () => _oauth(OAuthProvider.apple),
              child: const Text('Continue with Apple'),
            ),
            const SizedBox(height: 20),
            const Text('or use email'),
            const SizedBox(height: 12),
            TextField(
              controller: _email,
              keyboardType: TextInputType.emailAddress,
              autofillHints: const [AutofillHints.email],
              decoration: const InputDecoration(labelText: 'Email'),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _password,
              obscureText: true,
              autofillHints: const [AutofillHints.password],
              decoration: const InputDecoration(labelText: 'Password'),
              onSubmitted: (_) => _busy ? null : _submit(),
            ),
            if (_message != null) ...[
              const SizedBox(height: 12),
              Text(
                _message!,
                style: TextStyle(
                  color: _messageIsError ? Theme.of(context).colorScheme.error : null,
                ),
              ),
            ],
            const SizedBox(height: 20),
            FilledButton(
              onPressed: _busy ? null : _submit,
              child: Text(_busy ? 'Please wait…' : (_creating ? 'Create account' : 'Sign in')),
            ),
            TextButton(
              onPressed: _busy
                  ? null
                  : () => setState(() {
                      _creating = !_creating;
                      _message = null;
                    }),
              child: Text(_creating ? 'I already have an account' : 'Create an account'),
            ),
          ],
        ),
      ),
    );
  }
}
