import { Component, For } from 'solid-js';
import { useLanguage } from '../context/LanguageContext';
import type { UseCaseEntry } from '../translations';

const UseCaseIcon: Component<{ type: string }> = (props) => {
  const icons: Record<string, any> = {
    truck: (
      <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 17h12m-8 0a4 4 0 11-8 0m8 0a4 4 0 10-8 0m8 0h8m-8-8V5a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2h2m14-4h.01M17 17h4v-6a2 2 0 00-2-2h-4" />
      </svg>
    ),
    chain: (
      <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
    package: (
      <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    network: (
      <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
  };

  return icons[props.type] || icons.truck;
};

const UseCases: Component = () => {
  const { t } = useLanguage();
  const useCases = () => (t('useCases.list') as UseCaseEntry[]) ?? [];

  return (
    <section id="use-cases" class="py-24 bg-base-200">
      <div class="container mx-auto px-4 max-w-6xl">
        {/* Section header */}
        <div class="text-center mb-16">
          <div class="badge badge-accent badge-outline mb-4">{t('useCases.badge') as string}</div>
          <h2 class="text-4xl font-bold mb-4">
            {(t('useCases.title') as string)}
            <span class="text-secondary">{(t('useCases.titleHighlight') as string)}</span>
          </h2>
          <p class="text-base-content/70 max-w-2xl mx-auto">
            {(t('useCases.subtitle') as string)}
          </p>
        </div>

        {/* Use cases grid */}
        <div class="grid md:grid-cols-2 gap-8">
          <For each={useCases()}>
            {(useCase) => (
              <div class="card bg-base-100 shadow-md hover:shadow-xl transition-all duration-300">
                <div class="card-body">
                  <div class="flex items-center gap-4 mb-4">
                    <div class="bg-gradient-to-br from-primary to-secondary text-primary-content p-4 rounded-2xl">
                      <UseCaseIcon type={useCase.icon} />
                    </div>
                    <div>
                      <h3 class="card-title text-xl">{useCase.title}</h3>
                      <p class="text-base-content/60 text-sm">{useCase.description}</p>
                    </div>
                  </div>
                  <ul class="space-y-2">
                    <For each={useCase.benefits}>
                      {(benefit) => (
                        <li class="flex items-center gap-2 text-base-content/80">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-success shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                          </svg>
                          {benefit}
                        </li>
                      )}
                    </For>
                  </ul>
                </div>
              </div>
            )}
          </For>
        </div>
      </div>
    </section>
  );
};

export default UseCases;
