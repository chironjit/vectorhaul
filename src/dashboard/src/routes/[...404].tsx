import { Component } from 'solid-js';
import { A } from '@solidjs/router';

const NotFound: Component = () => {
  return (
    <div class="flex flex-col items-center justify-center h-full bg-base-100">
      <div class="text-center max-w-md px-4">
        {/* Icon */}
        <div class="text-8xl mb-6">🗺️</div>
        
        {/* Error code */}
        <h1 class="text-6xl font-bold text-primary mb-4">404</h1>
        
        {/* Title */}
        <h2 class="text-2xl font-semibold mb-2">Page Not Found</h2>
        
        {/* Description */}
        <p class="text-base-content/70 mb-8">
          Looks like this route doesn't exist on our map. 
          The page you're looking for may have been moved or doesn't exist.
        </p>
        
        {/* Actions */}
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <A href="/overview" class="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Go to Datahub
          </A>
          <A href="/assets" class="btn btn-outline">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            View Assets
          </A>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
