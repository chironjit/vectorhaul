import { Component, JSX, onMount } from 'solid-js';
import Header from './Header';
import { initTheme } from '~/lib/stores';

interface DashboardLayoutProps {
  children: JSX.Element;
}

const DashboardLayout: Component<DashboardLayoutProps> = (props) => {
  onMount(() => {
    initTheme();
  });

  return (
    <div class="dashboard-layout bg-base-100">
      <Header />
      <main class="dashboard-content">
        {props.children}
      </main>
    </div>
  );
};

export default DashboardLayout;
