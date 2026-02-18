import React, { useMemo } from "react";
import { ScatterChart } from "@mui/x-charts/ScatterChart";
import { Paper, Typography, Box, Alert, Stack, Chip } from "@mui/material";

export default function DisciplineVsLossChart({ fixtures = [], selectedTeam }) {
    const { chartSeries, hasData } = useMemo(() => {
        if (!fixtures || fixtures.length === 0 || !selectedTeam)
            return { chartSeries: [], hasData: false };

        const getDisciplineScore = (y, r) => (Number(y) || 0) * 1 + (Number(r) || 0) * 3;

        // Step 1: Collect all raw points
        const allPoints = fixtures.map((f, index) => {
            const isHome = f.teams.home.name === selectedTeam;
            const myStats = f.statistics?.find(s => s.team.name === selectedTeam);
            const oppStats = f.statistics?.find(s => s.team.name !== selectedTeam);

            if (!myStats || !oppStats) return null;

            const myY = myStats.statistics.find(s => s.type === "Yellow Cards")?.value ?? 0;
            const myR = myStats.statistics.find(s => s.type === "Red Cards")?.value ?? 0;
            const rawX = getDisciplineScore(myY, myR);

            const myGoals = isHome ? f.goals.home : f.goals.away;
            const oppGoals = isHome ? f.goals.away : f.goals.home;

            let actualPoints = 0;
            if (myGoals > oppGoals) actualPoints = 3;
            else if (myGoals === oppGoals) actualPoints = 1;

            return {
                id: f.fixture?.id || `idx-${index}`,
                rawX,
                // Y is fixed — no jitter, labels are categorical (Loss/Draw/Win)
                y: actualPoints,
                actualPoints,
                oppName: oppStats.team.name,
                cards: `Y:${myY} R:${myR}`,
                result: actualPoints === 3 ? "Win" : actualPoints === 1 ? "Draw" : "Loss"
            };
        }).filter(Boolean);

        // Step 2: Circular spreading on X only — group by (rawX, y)
        const grouped = {};
        allPoints.forEach((p) => {
            const key = `${p.rawX},${p.y}`;
            if (!grouped[key]) grouped[key] = [];
            grouped[key].push(p);
        });

        const SPREAD = 0.2;
        const spreadPoints = allPoints.map((p) => {
            const key = `${p.rawX},${p.y}`;
            const group = grouped[key];
            const total = group.length;
            const index = group.indexOf(p);

            let offsetX = 0;
            if (total === 2) {
                offsetX = index === 0 ? -SPREAD * 0.7 : SPREAD * 0.7;
            } else if (total > 2) {
                // Spread along X axis only to avoid crossing category boundaries on Y
                const step = (SPREAD * 2) / (total - 1);
                offsetX = -SPREAD + step * index;
            }

            return { ...p, x: p.rawX + offsetX };
        });

        // Step 3: Split into color-coded series
        const series = [
            { label: "Win", data: spreadPoints.filter(p => p.actualPoints === 3), color: "#2e7d32" },
            { label: "Draw", data: spreadPoints.filter(p => p.actualPoints === 1), color: "#0288d1" },
            { label: "Loss", data: spreadPoints.filter(p => p.actualPoints === 0), color: "#d32f2f" },
        ]
            .map(s => ({
                ...s,
                markerSize: 10,
                valueFormatter: (v) => `${v.result} vs ${v.oppName} (${v.cards})`
            }))
            .filter(s => s.data.length > 0);

        return { chartSeries: series, hasData: spreadPoints.length > 0 };

    }, [fixtures, selectedTeam]);

    if (!hasData) {
        return (
            <Alert severity="info" sx={{ mt: 4 }}>
                Select a team to see the discipline-to-points correlation.
            </Alert>
        );
    }

    return (
        <Box sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" align="center" sx={{ fontWeight: 'bold' }}>
                    Discipline Score vs. Points Earned
                </Typography>

                <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
                    <Chip size="small" label="Win = 3pts" color="success" variant="outlined" />
                    <Chip size="small" label="Draw = 1pt" color="primary" variant="outlined" />
                    <Chip size="small" label="Loss = 0pts" color="error" variant="outlined" />
                </Stack>

                <ScatterChart
                    height={400}
                    series={chartSeries}
                    xAxis={[{
                        label: "Discipline Weight (Yellow=1, Red=3)",
                        min: -0.5,
                        tickMinStep: 1,
                        valueFormatter: (v) => Math.round(v).toString()
                    }]}
                    yAxis={[{
                        label: "Match Outcome",
                        tickValues: [0, 1, 3],
                        min: -0.8,
                        max: 3.8,
                        valueFormatter: (v) => {
                            if (v === 3) return "Win";
                            if (v === 1) return "Draw";
                            if (v === 0) return "Loss";
                            return "";
                        }
                    }]}
                    grid={{ horizontal: true }}
                    slotProps={{
                        legend: {
                            direction: 'row',
                            position: { vertical: 'top', horizontal: 'middle' },
                            padding: 0,
                        },
                        popper: { sx: { pointerEvents: 'none' } }
                    }}
                />

                <Typography variant="caption" display="block" textAlign="center" sx={{ mt: 2, color: 'text.secondary' }}>
                    * Dots with identical discipline scores are spread horizontally to prevent overlap.
                </Typography>
            </Paper>
        </Box>
    );
}