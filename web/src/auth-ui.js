// Login / sign-up / password-reset screen shown before the garage loads.

import { SITE_URL } from './config.js';

const LOGO = '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2.5"/><path d="M12 3v6.5M4.2 16.5l5.6-3.2M19.8 16.5l-5.6-3.2"/></svg>';

// Links in confirmation / password-reset emails open the website. The desktop and Android apps
// have no web address of their own (file:// and https://localhost), so they use the site's.
const redirectUrl = () =>
  location.protocol === 'https:' && location.hostname !== 'localhost' ? location.origin + location.pathname : SITE_URL;

/**
 * Shows the auth screen and resolves with the signed-in user.
 * `mode` can be 'signin' (default) or 'recovery' (user came from a reset-password email).
 */
export function showAuth(supabase, mode = 'signin') {
  return new Promise((resolve) => {
    const el = document.createElement('div');
    el.className = 'auth';
    document.body.appendChild(el);

    let view = mode;
    let notice = '';
    let error = '';
    let busy = false;

    const draw = () => {
      const titles = {
        signin: ['Welcome back', 'Sign in to your garage'],
        signup: ['Create your account', 'Your garage, on every device'],
        reset: ['Reset password', 'We’ll email you a link to choose a new one'],
        recovery: ['Choose a new password', 'Then you’re straight back in'],
      };
      const [title, sub] = titles[view];
      el.innerHTML = `
        <form class="auth-card" novalidate>
          <div class="auth-brand"><span class="brand-mark">${LOGO}</span><span>Tuning<b>Book</b></span></div>
          <h1>${title}</h1>
          <p class="muted">${sub}</p>
          ${notice ? `<div class="auth-notice"></div>` : ''}
          ${error ? `<div class="auth-error"></div>` : ''}
          ${view !== 'recovery' ? `
          <div class="field"><label for="a-email">Email</label>
            <input type="text" inputmode="email" id="a-email" autocomplete="email" required></div>` : ''}
          ${view !== 'reset' ? `
          <div class="field"><label for="a-pass">${view === 'recovery' ? 'New password' : 'Password'}</label>
            <input type="password" id="a-pass" autocomplete="${view === 'signin' ? 'current-password' : 'new-password'}" minlength="8" required>
            ${view !== 'signin' ? '<span class="hint">At least 8 characters</span>' : ''}</div>` : ''}
          <button class="btn primary auth-submit" ${busy ? 'disabled' : ''}>${busy ? 'Please wait…' : {
            signin: 'Sign in', signup: 'Create account', reset: 'Send reset link', recovery: 'Save password',
          }[view]}</button>
          <div class="auth-links">
            ${view === 'signin' ? '<button type="button" data-view="signup">Create an account</button><button type="button" data-view="reset">Forgot password?</button>' : ''}
            ${view === 'signup' || view === 'reset' ? '<button type="button" data-view="signin">Back to sign in</button>' : ''}
          </div>
        </form>`;
      // Messages go in as text, never as HTML.
      if (notice) el.querySelector('.auth-notice').textContent = notice;
      if (error) el.querySelector('.auth-error').textContent = error;
      const email = el.querySelector('#a-email');
      if (email) { email.value = draw.email || ''; email.addEventListener('input', () => (draw.email = email.value)); }
      (email || el.querySelector('#a-pass'))?.focus();
    };

    const finish = (user) => { el.remove(); resolve(user); };

    el.addEventListener('click', (e) => {
      const b = e.target.closest('[data-view]');
      if (!b) return;
      view = b.dataset.view;
      notice = error = '';
      draw();
    });

    el.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = el.querySelector('#a-email')?.value.trim();
      const password = el.querySelector('#a-pass')?.value;
      error = notice = '';
      if (view !== 'recovery' && !/^\S+@\S+\.\S+$/.test(email || '')) { error = 'Please enter a valid email address.'; draw(); return; }
      if (view !== 'reset' && view !== 'signin' && (password || '').length < 8) { error = 'Password must be at least 8 characters.'; draw(); return; }
      if (view === 'signin' && !password) { error = 'Please enter your password.'; draw(); return; }

      busy = true; draw();
      try {
        if (view === 'signin') {
          const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
          if (err) throw err;
          return finish(data.user);
        }
        if (view === 'signup') {
          const { data, error: err } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: redirectUrl() } });
          if (err) throw err;
          if (data.session) return finish(data.user);
          view = 'signin';
          notice = 'Almost done — we sent a confirmation link to ' + email + '. Open it, then sign in here.';
        } else if (view === 'reset') {
          const { error: err } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: redirectUrl() });
          if (err) throw err;
          view = 'signin';
          notice = 'If an account exists for ' + email + ', a reset link is on its way.';
        } else if (view === 'recovery') {
          const { data, error: err } = await supabase.auth.updateUser({ password });
          if (err) throw err;
          history.replaceState(null, '', redirectUrl());
          return finish(data.user);
        }
      } catch (err) {
        error = friendlyError(err);
      } finally {
        busy = false;
      }
      if (el.isConnected) draw();
    });

    draw();
  });
}

function friendlyError(err) {
  const msg = String(err?.message || err);
  if (/invalid login credentials/i.test(msg)) return 'Wrong email or password.';
  if (/email not confirmed/i.test(msg)) return 'Please confirm your email first — check your inbox for the link.';
  if (/already registered/i.test(msg)) return 'An account with this email already exists. Try signing in.';
  if (/rate limit|too many/i.test(msg)) return 'Too many attempts. Please wait a minute and try again.';
  if (/failed to fetch|network/i.test(msg)) return 'Can’t reach the server. Check your internet connection.';
  return msg;
}

/** Full-screen message with a retry button (used when the garage can't be loaded). */
export function showFatal(message) {
  const el = document.createElement('div');
  el.className = 'auth';
  el.innerHTML = `<div class="auth-card"><div class="auth-brand"><span class="brand-mark">${LOGO}</span><span>Tuning<b>Book</b></span></div>
    <h1>Couldn’t load your garage</h1><p class="muted"></p><button class="btn primary auth-submit" onclick="location.reload()">Try again</button></div>`;
  el.querySelector('p').textContent = message;
  document.body.appendChild(el);
}
