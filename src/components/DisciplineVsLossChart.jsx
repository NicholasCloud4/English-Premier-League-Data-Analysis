import React, { useMemo } from "react";
import { ScatterChart } from "@mui/x-charts/ScatterChart";
import { Paper, Typography, Box, Alert, Stack, Chip } from "@mui/material";

export default function DisciplineVsLossChart({ fixtures = [], selectedTeam }) {

    const { chartSeries, hasData } = useMemo(() => {
        if (!fixtures || fixtures.length === 0 || !selectedTeam)
            return { chartSeries: [], hasData: false };

        const getDisciplineScore = (y, r) => (Number(y) || 0) * 1 + (Number(r) || 0) * 3;

        const dataPoints = fixtures.map((f) => {
            const isHome = f.teams.home.name === selectedTeam;
            const myStats = f.statistics?.find(s => s.team.name === selectedTeam);
            const oppStats = f.statistics?.find(s => s.team.name !== selectedTeam);

            if (!myStats || !oppStats) return null;

            // 1. Calculate Discipline (X-Axis)
            const myY = myStats.statistics.find(s => s.type === "Yellow Cards")?.value ?? 0;
            const myR = myStats.statistics.find(s => s.type === "Red Cards")?.value ?? 0;
            const xVal = getDisciplineScore(myY, myR);

            // 2. Calculate Points Earned (Y-Axis)
            const myGoals = isHome ? f.goals.home : f.goals.away;
            const oppGoals = isHome ? f.goals.away : f.goals.home;

            let points = 0;
            if (myGoals > oppGoals) points = 3;
            else if (myGoals === oppGoals) points = 1;

            // 3. Add "Jitter" so dots don't overlap perfectly on the 0, 1, and 3 lines
            const jitter = (Math.random() - 0.5) * 0.25;

            return {
                id: f.fixture.id,
                x: xVal,
                y: points + jitter,
                actualPoints: points,
                oppName: oppStats.team.name,
                cards: `Y:${myY} R:${myR}`,
                result: points === 3 ? "Win" : points === 1 ? "Draw" : "Loss"
            };
        }).filter(Boolean);

        const series = [{
            data: dataPoints,
            label: `Match Points for ${selectedTeam}`,
            color: "#1976d2",
            valueFormatter: (v) => `${v.result} vs ${v.oppName} (${v.cards})`
        }];

        return { chartSeries: series, hasData: dataPoints.length > 0 };
    }, [fixtures, selectedTeam]);

    if (!hasData) return <Alert severity="info">Select a team to see the discipline-to-points correlation.</Alert>;

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
                        label: "Discipline 'Weight' (Y=1, R=3)",
                        min: -0.5
                    }]}
                    yAxis={[{
                        label: "League Points Earned",
                        min: -0.5,
                        max: 3.5,
                        tickNumber: 4,
                        valueFormatter: (v) => {
                            if (v >= 2.8) return "3 (Win)";
                            if (v >= 0.8 && v <= 1.2) return "1 (Draw)";
                            if (v <= 0.2) return "0 (Loss)";
                            return "";
                        }
                    }]}
                    grid={{ horizontal: true }}
                />
                <Typography variant="caption" display="block" textAlign="center" sx={{ mt: 2, color: 'text.secondary' }}>
                    * Dots are slightly offset (jittered) vertically to show multiple matches with the same result.
                </Typography>
            </Paper>
        </Box>
    );
}