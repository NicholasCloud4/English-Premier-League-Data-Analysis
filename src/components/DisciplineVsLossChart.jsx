import React, { useMemo } from "react";
import { ScatterChart } from "@mui/x-charts/ScatterChart";
import { Paper, Typography, Box, Alert, Stack, Chip } from "@mui/material";

export default function DisciplineVsLossChart({ fixtures = [], selectedTeam }) {
    const { chartSeries, hasData } = useMemo(() => {
        if (!fixtures || fixtures.length === 0 || !selectedTeam)
            return { chartSeries: [], hasData: false };

        const getDisciplineScore = (y, r) => (Number(y) || 0) * 1 + (Number(r) || 0) * 3;

        // 1. Process all raw data points first
        const allPoints = fixtures.map((f, index) => {
            const isHome = f.teams.home.name === selectedTeam;
            const myStats = f.statistics?.find(s => s.team.name === selectedTeam);
            const oppStats = f.statistics?.find(s => s.team.name !== selectedTeam);

            if (!myStats || !oppStats) return null;

            // Calculate Discipline (X-Axis)
            const myY = myStats.statistics.find(s => s.type === "Yellow Cards")?.value ?? 0;
            const myR = myStats.statistics.find(s => s.type === "Red Cards")?.value ?? 0;
            const xBase = getDisciplineScore(myY, myR);

            // Calculate Points (Y-Axis)
            const myGoals = isHome ? f.goals.home : f.goals.away;
            const oppGoals = isHome ? f.goals.away : f.goals.home;

            let points = 0;
            if (myGoals > oppGoals) points = 3;
            else if (myGoals === oppGoals) points = 1;

            // Deterministic Jitter
            const xJitter = ((index % 3) - 1) * 0.12;
            const yJitter = ((index % 2) === 0 ? 1 : -1) * 0.15;

            return {
                id: f.fixture?.id || `idx-${index}`,
                x: xBase + xJitter,
                y: points + yJitter,
                actualPoints: points,
                oppName: oppStats.team.name,
                cards: `Y:${myY} R:${myR}`,
                result: points === 3 ? "Win" : points === 1 ? "Draw" : "Loss"
            };
        }).filter(Boolean);

        // 2. Split points into three distinct series for color-coding
        const series = [
            {
                label: "Win",
                data: allPoints.filter(p => p.actualPoints === 3),
                color: "#2e7d32",
            },
            {
                label: "Draw",
                data: allPoints.filter(p => p.actualPoints === 1),
                color: "#0288d1",
            },
            {
                label: "Loss",
                data: allPoints.filter(p => p.actualPoints === 0),
                color: "#d32f2f",
            }
        ]
            .map(s => ({
                ...s,
                markerSize: 10,
                valueFormatter: (v) => `${v.result} vs ${v.oppName} (${v.cards})`
            }))
            // CRITICAL FIX: Filter out series with no data to prevent the Flatbush error
            .filter(s => s.data.length > 0);

        return {
            chartSeries: series,
            hasData: allPoints.length > 0
        };


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
                    <Chip size="small" label="Win = 3pts" color="success" variant="filled" />
                    <Chip size="small" label="Draw = 1pt" color="primary" variant="filled" />
                    <Chip size="small" label="Loss = 0pts" color="error" variant="filled" />
                </Stack>

                <ScatterChart
                    height={400}
                    series={chartSeries}
                    xAxis={[{
                        label: "Discipline 'Weight' (Yellow=1, Red=3)",
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
                        // Hide the default legend if you want to use the Chips above,
                        // or keep it for interactive filtering.
                        legend: {
                            direction: 'row',
                            position: { vertical: 'top', horizontal: 'middle' },
                            padding: 0,
                        },
                        popper: {
                            sx: { pointerEvents: 'none' }
                        }
                    }}
                />

                <Typography variant="caption" display="block" textAlign="center" sx={{ mt: 2, color: 'text.secondary' }}>
                    * Dots are jittered to reveal overlapping matches with identical cards/results.
                </Typography>
            </Paper>
        </Box>
    );
}