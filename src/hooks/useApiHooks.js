// project/frontend/src/hooks/useApiHooks.js
"use client";

import useSWR from "swr";
import {
  fetchJson,
  normalizeSlide,
  normalizeService,
  normalizeBlog,
  normalizePatchRequest,
  adminFetch,
} from "../lib/api";

/* =====================================================
   SWR Fetcher
===================================================== */
const fetcher = path => fetchJson(path);

/* =====================================================
   HOME PAGE DATA
===================================================== */
export function useHomeData() {
  const { data, error } = useSWR("/home/", fetcher);
  const home = data || {};

  return {
    sliders: (home.sliders ?? []).map(normalizeSlide).filter(Boolean),
    hero: home.hero ?? {},
    services: (home.services ?? []).map(normalizeService).filter(Boolean),
    blogs: (home.blogs ?? []).map(normalizeBlog).filter(Boolean),
    isLoading: !data && !error,
    isError: error,
  };
}

/* =====================================================
   SERVICES
===================================================== */
export function useServices() {
  const { data, error } = useSWR("/services/", fetcher);
  return {
    services: (data ?? []).map(normalizeService).filter(Boolean),
    isLoading: !data && !error,
    isError: error,
  };
}

export function useService(slug) {
  const { data, error } = useSWR(slug ? `/services/${slug}/` : null, fetcher);
  return {
    service: data ? normalizeService(data) : null,
    isLoading: !data && !error,
    isError: error,
  };
}

/* =====================================================
   BLOGS
===================================================== */
export function useBlogs() {
  const { data, error } = useSWR("/blogs/", fetcher);
  return {
    blogs: (data ?? []).map(normalizeBlog).filter(Boolean),
    isLoading: !data && !error,
    isError: error,
  };
}

export function useBlog(slug) {
  const { data, error } = useSWR(slug ? `/blogs/${slug}/` : null, fetcher);
  return {
    blog: data ? normalizeBlog(data) : null,
    isLoading: !data && !error,
    isError: error,
  };
}

/* =====================================================
   PATCH REQUESTS (ADMIN)
===================================================== */
export function usePatchRequests() {
  const { data, error } = useSWR("/patch-requests/list/", adminFetch);
  return {
    patches: (data ?? []).map(normalizePatchRequest).filter(Boolean),
    isLoading: !data && !error,
    isError: error,
  };
}

export function usePatchRequest(id) {
  const { data, error } = useSWR(
    id ? `/patch-requests/${id}/` : null,
    adminFetch
  );
  return {
    patch: data ? normalizePatchRequest(data) : null,
    isLoading: !data && !error,
    isError: error,
  };
}
