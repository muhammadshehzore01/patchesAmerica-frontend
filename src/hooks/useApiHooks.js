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

const fetcher = (path) => fetchJson(path);

const swrCommonOptions = {
  revalidateOnFocus: false,
  dedupingInterval: 60000,
  keepPreviousData: true,
  onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
    if (retryCount >= 3 || error.status === 404) return; // max 3 retries, skip 404
    setTimeout(() => revalidate({ retryCount }), 5000 * (retryCount + 1));
  },
};

/* HOME PAGE DATA */
export function useHomeData() {
  const { data, error, mutate } = useSWR("/home/", fetcher, swrCommonOptions);
  const home = data || {};
  return {
    sliders: (home.sliders ?? []).map(normalizeSlide).filter(Boolean),
    hero: home.hero ?? {},
    services: (home.services ?? []).map(normalizeService).filter(Boolean),
    blogs: (home.blogs ?? []).map(normalizeBlog).filter(Boolean),
    isLoading: !data && !error,
    isError: !!error,
    mutate, // expose for manual refresh if needed
  };
}

/* SERVICES */
export function useServices() {
  const { data, error } = useSWR("/services/", fetcher, swrCommonOptions);
  return {
    services: (data ?? []).map(normalizeService).filter(Boolean),
    isLoading: !data && !error,
    isError: !!error,
  };
}

export function useService(slug) {
  const { data, error } = useSWR(slug ? `/services/${slug}/` : null, fetcher, swrCommonOptions);
  return {
    service: data ? normalizeService(data) : null,
    isLoading: !data && !error,
    isError: !!error,
  };
}

/* BLOGS - similar pattern */
export function useBlogs() {
  const { data, error } = useSWR("/blogs/", fetcher, swrCommonOptions);
  return {
    blogs: (data ?? []).map(normalizeBlog).filter(Boolean),
    isLoading: !data && !error,
    isError: !!error,
  };
}

export function useBlog(slug) {
  const { data, error } = useSWR(slug ? `/blogs/${slug}/` : null, fetcher, swrCommonOptions);
  return {
    blog: data ? normalizeBlog(data) : null,
    isLoading: !data && !error,
    isError: !!error,
  };
}

/* PATCH REQUESTS (ADMIN) - no-store + retry limited */
export function usePatchRequests() {
  const { data, error } = useSWR("/patch-requests/list/", adminFetch, {
    ...swrCommonOptions,
    revalidateOnFocus: true, // admin can refresh on focus
  });
  return {
    patches: (data ?? []).map(normalizePatchRequest).filter(Boolean),
    isLoading: !data && !error,
    isError: !!error,
  };
}

export function usePatchRequest(id) {
  const { data, error } = useSWR(
    id ? `/patch-requests/${id}/` : null,
    adminFetch,
    swrCommonOptions
  );
  return {
    patch: data ? normalizePatchRequest(data) : null,
    isLoading: !data && !error,
    isError: !!error,
  };
}