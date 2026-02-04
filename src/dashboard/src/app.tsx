import { Router, useLocation, Navigate } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense, createSignal, onMount, Show } from "solid-js";
import DatahubLayout from "~/components/layout/DatahubLayout";
import { initTheme, initAuth, isAuthenticated } from "~/lib/stores";
import "./app.css";

function AppRoot(props: { children: unknown }) {
  const location = useLocation();
  const [authReady, setAuthReady] = createSignal(false);
  const isLoginPage = () => location.pathname === "/login";

  onMount(() => {
    initTheme();
    initAuth().then(() => setAuthReady(true));
  });

  return (
    <Show
      when={isLoginPage()}
      fallback={
        <Show
          when={authReady()}
          fallback={
            <div class="flex items-center justify-center min-h-screen bg-base-200">
              <span class="loading loading-spinner loading-lg text-primary"></span>
            </div>
          }
        >
          <Show
            when={isAuthenticated()}
            fallback={<Navigate href="/login" />}
          >
            <DatahubLayout>
              <Suspense fallback={
                <div class="flex items-center justify-center h-full">
                  <span class="loading loading-spinner loading-lg text-primary"></span>
                </div>
              }>
                {props.children}
              </Suspense>
            </DatahubLayout>
          </Show>
        </Show>
      }
    >
      <Suspense fallback={
        <div class="flex items-center justify-center min-h-screen bg-base-200">
          <span class="loading loading-spinner loading-lg text-primary"></span>
        </div>
      }>
        {props.children}
      </Suspense>
    </Show>
  );
}

export default function App() {
  return (
    <Router root={props => <AppRoot>{props.children}</AppRoot>}>
      <FileRoutes />
    </Router>
  );
}
