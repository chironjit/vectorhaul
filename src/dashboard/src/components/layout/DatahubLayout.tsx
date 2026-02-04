import { Component, JSX, onMount } from 'solid-js';
import Header from './Header';
import { initTheme } from '~/lib/stores';

interface DatahubLayoutProps {
  children: JSX.Element;
}

const DatahubLayout: Component<DatahubLayoutProps> = (props) => {
  onMount(() => {
    initTheme();
  });

  return (
    <div class="datahub-layout bg-base-100">
      <Header />
      <main class="datahub-content">
        {props.children}
      </main>
    </div>
  );
};

export default DatahubLayout;
