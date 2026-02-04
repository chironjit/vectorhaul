import { Component, createSignal } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { login as doLogin } from '~/lib/stores';

const Login: Component = () => {
  const navigate = useNavigate();
  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [error, setError] = createSignal('');
  const [loading, setLoading] = createSignal(false);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setError('');
    const emailVal = email().trim();
    const passwordVal = password();

    if (!emailVal) {
      setError('Please enter your username.');
      return;
    }
    if (!passwordVal) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    const result = await doLogin(emailVal, passwordVal);
    setLoading(false);

    if (result.ok) {
      navigate('/overview', { replace: true });
    } else {
      setError(result.error ?? 'Invalid credentials. Please try again.');
    }
  };

  return (
    <div class="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div class="w-full max-w-md">
        <div class="card bg-base-100 shadow-xl border border-base-200">
          <div class="card-body">
            <div class="flex items-center gap-3 mb-2">
              <div class="bg-primary text-primary-content p-3 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <div>
                <h1 class="card-title text-2xl">Logistics Tracker</h1>
                <p class="text-sm text-base-content/60">Sign in to the datahub</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} class="flex flex-col gap-4 mt-4">
              <div class="form-control">
                <label class="label" for="login-username">
                  <span class="label-text">Username</span>
                </label>
                <input
                  id="login-username"
                  type="text"
                  placeholder="Username"
                  class="input input-bordered w-full"
                  value={email()}
                  onInput={(e) => setEmail(e.currentTarget.value)}
                  autocomplete="username"
                  disabled={loading()}
                />
              </div>
              <div class="form-control">
                <label class="label" for="login-password">
                  <span class="label-text">Password</span>
                </label>
                <input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  class="input input-bordered w-full"
                  value={password()}
                  onInput={(e) => setPassword(e.currentTarget.value)}
                  autocomplete="current-password"
                  disabled={loading()}
                />
              </div>
              {error() && (
                <div class="alert alert-error text-sm">
                  <span>{error()}</span>
                </div>
              )}
              <button
                type="submit"
                class="btn btn-primary w-full mt-2"
                disabled={loading()}
              >
                {loading() ? (
                  <span class="loading loading-spinner loading-sm"></span>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>

            <p class="text-xs text-base-content/50 mt-4 text-center">
              Use the username and password configured in your server .env
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
