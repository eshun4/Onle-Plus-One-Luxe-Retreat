import { useEffect, useState } from 'react';
import { authClient } from '../../auth.js';
import AdminDashboard from './AdminDashboard.jsx';
import './AdminAuthGate.css';

export default function AdminAuthGate() {
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState('sign-in');
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  async function refreshSession() {
    try {
      const result = await authClient.getSession();

      if (result.data?.session && result.data?.user) {
        setSession(result.data.session);
        setUser(result.data.user);
      } else {
        setSession(null);
        setUser(null);
      }
    } catch (sessionError) {
      setSession(null);
      setUser(null);
      setError(
        sessionError.message ||
          'Could not connect to Neon Auth. Check VITE_NEON_AUTH_URL.'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshSession();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    const email = form.email.trim();
    const password = form.password;

    const result =
      mode === 'sign-up'
        ? await authClient.signUp.email({
            name: email.split('@')[0] || 'Admin',
            email,
            password,
          })
        : await authClient.signIn.email({
            email,
            password,
          });

    if (result.error) {
      setError(result.error.message || 'Authentication failed.');
      setLoading(false);
      return;
    }

    await refreshSession();
  }

  async function handleSignOut() {
    await authClient.signOut();
    setSession(null);
    setUser(null);
  }

  if (loading) {
    return (
      <div className="admin-auth-page">
        <div className="admin-auth-card">
          <p className="admin-auth-kicker">One Plus One Luxe Retreat</p>
          <h1>Loading admin...</h1>
        </div>
      </div>
    );
  }

  if (session && user) {
    return <AdminDashboard currentUser={user} onSignOut={handleSignOut} />;
  }

  return (
    <div className="admin-auth-page">
      <form className="admin-auth-card" onSubmit={handleSubmit}>
        <p className="admin-auth-kicker">Private admin area</p>
        <h1>{mode === 'sign-up' ? 'Create admin account' : 'Admin sign in'}</h1>
        <span>
          Use an email approved in the backend ADMIN_EMAILS value.
        </span>

        {error ? <div className="admin-auth-error">{error}</div> : null}

        <label>
          Email
          <input
            required
            type="email"
            value={form.email}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                email: event.target.value,
              }))
            }
          />
        </label>

        <label>
          Password
          <input
            required
            minLength={8}
            type="password"
            value={form.password}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                password: event.target.value,
              }))
            }
          />
        </label>

        <button type="submit">
          {mode === 'sign-up' ? 'Create account' : 'Sign in'}
        </button>

        <button
          className="admin-auth-switch"
          type="button"
          onClick={() => {
            setError('');
            setMode((current) =>
              current === 'sign-in' ? 'sign-up' : 'sign-in'
            );
          }}
        >
          {mode === 'sign-in'
            ? 'Need to recreate the admin account? Register'
            : 'Already have an account? Sign in'}
        </button>
      </form>
    </div>
  );
}
