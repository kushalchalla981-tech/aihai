"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { backfillEmbeddings, createScan, getHealth, getIncidentById, getIncidents, getLogs, getScan, getScans, promoteFinding, searchLogs } from "./api";
import type { IncidentFilters, LogFilters, ScanFilters, VectorSearchQuery } from "./types";

export function useHealth() {
  return useQuery({
    queryKey: ["health"],
    queryFn: getHealth,
    refetchInterval: 30000,
  });
}

export function useLogs(filters?: LogFilters) {
  return useQuery({
    queryKey: ["logs", filters],
    queryFn: () => getLogs(filters),
    refetchInterval: 5000,
  });
}

export function useLogSearch(query: VectorSearchQuery) {
  return useQuery({
    queryKey: ["search", query],
    queryFn: () => searchLogs(query),
    enabled: query.query.length > 0,
  });
}

export function useBackfill() {
  return useMutation({
    mutationFn: backfillEmbeddings,
  });
}

export function useIncidents(filters?: IncidentFilters) {
  return useQuery({
    queryKey: ["incidents", filters],
    queryFn: () => getIncidents(filters),
    refetchInterval: 15000,
  });
}

export function useIncident(id: string) {
  return useQuery({
    queryKey: ["incident", id],
    queryFn: () => getIncidentById(id),
    enabled: id.length > 0,
    retry: false,
  });
}

export function useScans(filters?: ScanFilters) {
  return useQuery({
    queryKey: ["scans", filters],
    queryFn: () => getScans(filters),
    refetchInterval: (query) =>
      query.state.data?.some((s) => s.status === "queued" || s.status === "running") ? 3000 : false,
  });
}

export function useScan(id: string) {
  return useQuery({
    queryKey: ["scan", id],
    queryFn: () => getScan(id),
    refetchInterval: (query) => {
      const st = query.state.data?.status;
      return st === "completed" || st === "failed" ? false : 3000;
    },
  });
}

export function useCreateScan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createScan,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["scans"] }),
  });
}

export function usePromoteFinding() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ scanId, findingId }: { scanId: string; findingId: string }) =>
      promoteFinding(scanId, findingId),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["scan", vars.scanId] });
      qc.invalidateQueries({ queryKey: ["scans"] });
      qc.invalidateQueries({ queryKey: ["incidents"] });
    },
  });
}
