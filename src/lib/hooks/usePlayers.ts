"use client";

import { useEffect, useState } from "react";

import { getRoster } from "@/lib/mock/selectors";
import { getRosterForTeam } from "@/lib/supabase/queries";
import type { PlayerListItem } from "@/types";

export function usePlayers(teamId?: string | null, isDemo = false) {
  const [players, setPlayers] = useState<PlayerListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (isDemo) {
        setPlayers(getRoster(teamId ?? undefined));
        setError(null);
        setLoading(false);
        return;
      }
      if (!teamId) {
        setPlayers([]);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const roster = await getRosterForTeam(teamId);
        if (!cancelled) {
          setPlayers(roster);
          setError(null);
        }
      } catch (nextError) {
        if (!cancelled) setError(nextError instanceof Error ? nextError.message : "Failed to load roster.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [isDemo, teamId]);

  return { players, loading, error };
}
