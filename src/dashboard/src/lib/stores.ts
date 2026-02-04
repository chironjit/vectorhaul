import { createSignal, createMemo } from 'solid-js';
import type { Asset, AssetFilters, AssetStatus, AssetType } from '~/types';
import { assets as dummyAssets, getDashboardStats } from '~/data/dummy-data';

// Auth store: session is managed server-side via cookies; client only reflects state from API
export const [authUser, setAuthUser] = createSignal<{ email: string } | null>(null);

export const isAuthenticated = () => !!authUser();

export async function initAuth(): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    const res = await fetch('/api/auth/me', { credentials: 'include' });
    const data = await res.json();
    const user = data?.user ?? null;
    setAuthUser(user);
  } catch {
    setAuthUser(null);
  }
}

export async function login(username: string, password: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username: username.trim(), password }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { ok: false, error: data?.error ?? 'Login failed' };
    }
    setAuthUser({ email: data.username ?? username.trim() });
    return { ok: true };
  } catch {
    return { ok: false, error: 'Network error' };
  }
}

export async function logout(): Promise<void> {
  try {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
  } finally {
    setAuthUser(null);
  }
}

// Theme store
const getInitialTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
  if (saved) return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const [theme, setTheme] = createSignal<'light' | 'dark'>('light');

export function initTheme() {
  const initialTheme = getInitialTheme();
  setTheme(initialTheme);
  document.documentElement.setAttribute('data-theme', initialTheme);
}

export function toggleTheme() {
  const newTheme = theme() === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
  localStorage.setItem('theme', newTheme);
  document.documentElement.setAttribute('data-theme', newTheme);
}

// Assets store
export const [assets, setAssets] = createSignal<Asset[]>(dummyAssets);

// Asset filters
export const [filters, setFilters] = createSignal<AssetFilters>({
  status: 'all',
  type: 'all',
  search: '',
});

// Filtered assets
export const filteredAssets = createMemo(() => {
  const { status, type, search } = filters();
  let result = assets();
  
  if (status !== 'all') {
    result = result.filter(a => a.status === status);
  }
  
  if (type !== 'all') {
    result = result.filter(a => a.type === type);
  }
  
  if (search.trim()) {
    const searchLower = search.toLowerCase();
    result = result.filter(a => 
      a.id.toLowerCase().includes(searchLower) ||
      a.name.toLowerCase().includes(searchLower) ||
      a.current_location?.address.toLowerCase().includes(searchLower)
    );
  }
  
  return result;
});

// Dashboard stats (reactive)
export const dashboardStats = createMemo(() => getDashboardStats());

// Selected asset for map focus
export const [selectedAssetId, setSelectedAssetId] = createSignal<string | null>(null);

export const selectedAsset = createMemo(() => {
  const id = selectedAssetId();
  if (!id) return null;
  return assets().find(a => a.id === id) || null;
});

// Sidebar state
export const [sidebarOpen, setSidebarOpen] = createSignal(true);

export function toggleSidebar() {
  setSidebarOpen(!sidebarOpen());
}

// Update filter helpers
export function updateStatusFilter(status: AssetStatus | 'all') {
  setFilters(prev => ({ ...prev, status }));
}

export function updateTypeFilter(type: AssetType | 'all') {
  setFilters(prev => ({ ...prev, type }));
}

export function updateSearchFilter(search: string) {
  setFilters(prev => ({ ...prev, search }));
}

export function clearFilters() {
  setFilters({ status: 'all', type: 'all', search: '' });
}

// Pagination state
export const [currentPage, setCurrentPage] = createSignal(1);
export const itemsPerPage = 20;

export const paginatedAssets = createMemo(() => {
  const all = filteredAssets();
  const start = (currentPage() - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return all.slice(start, end);
});

export const totalPages = createMemo(() => {
  return Math.ceil(filteredAssets().length / itemsPerPage);
});

// Sort state for asset table
export type SortField = 'id' | 'name' | 'type' | 'status' | 'speed' | 'last_update';
export type SortDirection = 'asc' | 'desc';

export const [sortField, setSortField] = createSignal<SortField>('id');
export const [sortDirection, setSortDirection] = createSignal<SortDirection>('asc');

export const sortedAssets = createMemo(() => {
  const field = sortField();
  const direction = sortDirection();
  const sorted = [...filteredAssets()];
  
  sorted.sort((a, b) => {
    let aVal: string | number = '';
    let bVal: string | number = '';
    
    switch (field) {
      case 'id':
        aVal = a.id;
        bVal = b.id;
        break;
      case 'name':
        aVal = a.name;
        bVal = b.name;
        break;
      case 'type':
        aVal = a.type;
        bVal = b.type;
        break;
      case 'status':
        aVal = a.status;
        bVal = b.status;
        break;
      case 'speed':
        aVal = a.current_location?.speed ?? 0;
        bVal = b.current_location?.speed ?? 0;
        break;
      case 'last_update':
        aVal = new Date(a.last_update).getTime();
        bVal = new Date(b.last_update).getTime();
        break;
    }
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return direction === 'asc' 
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    
    return direction === 'asc' 
      ? (aVal as number) - (bVal as number)
      : (bVal as number) - (aVal as number);
  });
  
  return sorted;
});

export function toggleSort(field: SortField) {
  if (sortField() === field) {
    setSortDirection(sortDirection() === 'asc' ? 'desc' : 'asc');
  } else {
    setSortField(field);
    setSortDirection('asc');
  }
}
