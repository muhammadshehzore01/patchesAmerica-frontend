// src/hooks/useApiHooks.js
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
    console.error("SWR retry error for key:", key, error);
    if (retryCount >= 3 || error?.status === 404) return;
    setTimeout(() => revalidate({ retryCount }), 5000 * (retryCount + 1));
  },
};

/* HOME PAGE DATA – FIXED VERSION (forced correct key + logs) */
export function useHomeData() {
  const key = "/api/home/"; // ← yeh sab se zaroori change hai (pehle /home/ tha jo galat tha)



  const { data, error, mutate, isLoading } = useSWR(
    key,
    fetcher,
    {
      ...swrCommonOptions,
      revalidateOnMount: true,      // force fetch on component mount
      revalidateOnFocus: false,
      dedupingInterval: 60000,          // no cache deduping – fresh fetch har baar
    }
  );

  console.log("🚨 useHomeData SWR STATE:", {
    hasData: !!data,
    dataSliders: data?.sliders?.length || 0,
    dataServices: data?.services?.length || 0,
    dataBlogs: data?.blogs?.length || 0,
    isLoading,
    isError: !!error,
    errorMessage: error?.message || null,
  });

  const home = data || {};

  return {
    sliders: (home.sliders ?? []).map(normalizeSlide).filter(Boolean),
    hero: home.hero ?? {},
    services: (home.services ?? []).map(normalizeService).filter(Boolean),
    blogs: (home.blogs ?? []).map(normalizeBlog).filter(Boolean),
    isLoading,
    isError: !!error,
    mutate,
  };
}

/* SERVICES – unchanged (working hai to mat chhedo) */
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

/* BLOGS – unchanged */
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

/* PATCH REQUESTS (ADMIN) – unchanged */
export function usePatchRequests() {
  const { data, error } = useSWR("/patch-requests/list/", adminFetch, {
    ...swrCommonOptions,
    revalidateOnFocus: true,
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