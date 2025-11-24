// frontend/src/hooks/useApiHooks.js
'use client';

import useSWR from 'swr';
import {
  fetchJson as apiFetchJson,
  normalizeSlide,
  normalizeService,
  normalizeBlog,
  normalizePatchRequest,
} from '../lib/api';
const API_BASE = process.env.NEXT_PUBLIC_API_BASE;



// -----------------------------
// SWR Hooks
// -----------------------------
export function useHomeData() {
  const { data, error } = useSWR(`${API_BASE}/home/`, apiFetchJson);
  const home = data || {};
  return {
    sliders: (home?.sliders ?? []).map(normalizeSlide).filter(Boolean),
    hero: home?.hero ?? {},
    features: home?.features ?? [],
    services: (home?.services ?? []).map(normalizeService).filter(Boolean),
    blogs: (home?.blogs ?? []).map(normalizeBlog).filter(Boolean),
    isLoading: !data && !error,
    isError: error,
  };
}

export function useServices() {
  const { data, error } = useSWR('/services/', apiFetchJson);
  const services = data || [];
  return {
    services: services.map(normalizeService).filter(Boolean),
    isLoading: !data && !error,
    isError: error,
  };
}

export function useService(slug) {
  const { data, error } = useSWR(slug ? `/services/${slug}/` : null, apiFetchJson);
  return {
    service: data ? normalizeService(data) : null,
    isLoading: !data && !error,
    isError: error,
  };
}

export function useBlogs() {
  const { data, error } = useSWR('/blogs/', apiFetchJson);
  const blogs = data || [];
  return {
    blogs: blogs.map(normalizeBlog).filter(Boolean),
    isLoading: !data && !error,
    isError: error,
  };
}

export function useBlog(slug) {
  const { data, error } = useSWR(slug ? `/blogs/${slug}/` : null, apiFetchJson);
  return {
    blog: data ? normalizeBlog(data) : null,
    isLoading: !data && !error,
    isError: error,
  };
}

export function usePatchRequests() {
  const { data, error } = useSWR('/patch-requests/list/', apiFetchJson); // ✅ now GET works
  const patches = data || [];
  return {
    patches: patches.map(normalizePatchRequest).filter(Boolean),
    isLoading: !data && !error,
    isError: error,
  };
}

export function usePatchRequest(id) {
  const { data, error } = useSWR(id ? `/patch-requests/${id}/` : null, apiFetchJson); // ✅ backend URL correct
  return {
    patch: data ? normalizePatchRequest(data) : null,
    isLoading: !data && !error,
    isError: error,
  };
}

// -----------------------------
// Admin login / fetch
// -----------------------------
export async function loginAdmin(username, password) {
  if (typeof window === 'undefined') return { success: false, error: 'Client-only' };

  const res = await fetch('/obtain_admin_token/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();
  if (res.ok && data.token) {
    localStorage.setItem('adminToken', data.token);
    return { success: true, token: data.token };
  } else {
    return { success: false, error: data.detail || 'Invalid credentials' };
  }
}

export async function adminFetch(path, options = {}) {
  if (typeof window === 'undefined') throw new Error('adminFetch client-only');
  const token = localStorage.getItem('adminToken');
  const headers = {
    ...options.headers,
    Authorization: token ? `Token ${token}` : undefined,
    'Content-Type': 'application/json',
  };
  return apiFetchJson(path, { ...options, headers });
}
