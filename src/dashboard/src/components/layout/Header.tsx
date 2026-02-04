import { Component } from 'solid-js';
import { A, useLocation, useNavigate } from '@solidjs/router';
import ThemeToggle from './ThemeToggle';
import { authUser, logout } from '~/lib/stores';

const Header: Component = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };
  
  const isActive = (path: string) => {
    if (path === '/map') {
      return location.pathname === '/map';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header class="bg-base-100/90 backdrop-blur border-b border-base-200">
      <div class="navbar px-4 min-h-16">
        {/* Logo */}
        <div class="navbar-start">
          <A href="/overview" class="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div class="bg-primary text-primary-content p-2 rounded-lg shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <div class="hidden sm:flex flex-col">
              <span class="font-bold text-lg leading-tight">Logistics Tracker</span>
              <span class="text-xs text-base-content/60">Fleet Command Center</span>
            </div>
          </A>
        </div>

        {/* Right side */}
        <div class="navbar-end gap-2">
          {/* Environment + region */}
          <div class="hidden md:flex items-center gap-2">
            <span class="badge badge-outline badge-sm">SEA Region</span>
            <span class="badge badge-success badge-sm">Realtime</span>
          </div>

          {/* Connection status indicator */}
          <div class="flex items-center gap-2 text-sm text-base-content/70">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
            </span>
            <span class="hidden lg:inline">Data pipeline healthy</span>
          </div>
          
          {/* Theme toggle */}
          <ThemeToggle />
          
          {/* User menu */}
          <div class="dropdown dropdown-end">
            <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar placeholder">
              <div class="bg-neutral text-neutral-content w-8 rounded-full">
                <span class="text-xs">{authUser() ? authUser()!.email.charAt(0).toUpperCase() : 'U'}</span>
              </div>
            </div>
            <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li><a>Profile</a></li>
              <li><a>Settings</a></li>
              <li><button type="button" onClick={handleLogout}>Logout</button></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Navigation row */}
      <div class="px-4 pb-3">
        <div class="flex items-center">
          <div class="tabs tabs-boxed bg-base-200/70 p-1 shadow-sm w-full">
          <A
            href="/overview"
            class={`tab flex-1 justify-center gap-2 ${isActive('/overview') ? 'tab-active bg-base-100 text-primary shadow-sm' : 'text-base-content/70'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 13h8V5H3v8zm10 8h8v-6h-8v6zm0-16v6h8V5h-8z" />
            </svg>
            Overview
          </A>
          <A
            href="/map"
            class={`tab flex-1 justify-center gap-2 ${isActive('/map') ? 'tab-active bg-base-100 text-primary shadow-sm' : 'text-base-content/70'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Map
          </A>
          <A
            href="/assets"
            class={`tab flex-1 justify-center gap-2 ${isActive('/assets') ? 'tab-active bg-base-100 text-primary shadow-sm' : 'text-base-content/70'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Assets
          </A>
          <A
            href="/alerts"
            class={`tab flex-1 justify-center gap-2 ${isActive('/alerts') ? 'tab-active bg-base-100 text-primary shadow-sm' : 'text-base-content/70'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Alerts
          </A>
          <A
            href="/geofences"
            class={`tab flex-1 justify-center gap-2 ${isActive('/geofences') ? 'tab-active bg-base-100 text-primary shadow-sm' : 'text-base-content/70'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2c3.866 0 7 3.134 7 7 0 5.25-7 13-7 13S5 14.25 5 9c0-3.866 3.134-7 7-7z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
            Geofences
          </A>
          <A
            href="/integrations"
            class={`tab flex-1 justify-center gap-2 ${isActive('/integrations') ? 'tab-active bg-base-100 text-primary shadow-sm' : 'text-base-content/70'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12a4 4 0 018 0m-8 0v6a2 2 0 002 2h4a2 2 0 002-2v-6m-8 0V8a4 4 0 118 0v4" />
            </svg>
            Integrations
          </A>
          <A
            href="/reports"
            class={`tab flex-1 justify-center gap-2 ${isActive('/reports') ? 'tab-active bg-base-100 text-primary shadow-sm' : 'text-base-content/70'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0h6m2 0a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v8a2 2 0 002 2h10z" />
            </svg>
            Reports
          </A>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
