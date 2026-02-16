import { useMemo } from "react";
import { ScatterChart } from "@mui/x-charts";
import { Paper, Typography, Box, Alert, Stack, Chip } from "@mui/material";

function calculateCorrelation(data) {
    const n = data.length;
    if (n < 2) return 0;
    const sumX = data.reduce((acc, p) => acc + p.rawX, 0);
    const sumY = data.reduce((acc, p) => acc + p.rawY, 0);
    const sumXY = data.reduce((acc, p) => acc + p.rawX * p.rawY, 0);
    const sumX2 = data.reduce((acc, p) => acc + p.rawX * p.rawX, 0);
    const sumY2 = data.reduce((acc, p) => acc + p.rawY * p.rawY, 0);

    const numerator = (n * sumXY) - (sumX * sumY);
    const denominator = Math.sqrt(
        (n * sumX2 - sumX * sumX) *
        (n * sumY2 - sumY * sumY)
    );

    return denominator === 0 ? 0 : numerator / denominator;
}

export default function ShotsVsGoalsChart({ fixtures = [], selectedTeam }) {

    const data = useMemo(() => {
        if (!fixtures.length) return [];

        const points = [];

        fixtures.forEach((fixture, index) => {
            fixture.statistics?.forEach((teamBlock) => {
                const teamName = teamBlock.team.name;
                const teamId = teamBlock.team.id;

                if (selectedTeam && selectedTeam !== teamName) return;

                const shotsStat = teamBlock.statistics.find(
                    (stat) => stat.type === "Shots on Goal"
                );

                const shotsOnGoal = Number(shotsStat?.value ?? 0);
                const isHome = teamId === fixture.teams.home.id;
                const goals = Number(isHome ? fixture.goals.home ?? 0 : fixture.goals.away ?? 0);

                // Add deterministic jitter so dots don't stack perfectly
                const xJitter = ((index % 3) - 1) * 0.15;
                const yJitter = ((index % 2) === 0 ? 1 : -1) * 0.12;

                points.push({
                    id: `${fixture.fixture?.id}-${teamId}`,
                    x: shotsOnGoal + xJitter,
                    y: goals + yJitter,
                    rawX: shotsOnGoal, // Used for correlation math
                    rawY: goals,      // Used for correlation math
                });
            });
        });

        return points;
    }, [fixtures, selectedTeam]);

    if (!data.length) {
        return (
            <Alert severity="info" sx={{ mt: 2 }}>
                No data available for selected filters.
            </Alert>
        );
    }

    const correlation = calculateCorrelation(data);

    const correlationStrength =
        correlation > 0.7
            ? "Strong Positive"
            : correlation > 0.4
                ? "Moderate Positive"
                : correlation > 0.2
                    ? "Weak Positive"
                    : "Little / No Correlation";

    return (
        <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
            <Stack spacing={2}>

                {/* Title Section */}
                <Box>
                    <Typography variant="h5" fontWeight={600}>
                        Do More Shots on Goal Translate to More Goals?
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Each point represents a team's performance in a single match.
                    </Typography>
                </Box>

                {/* Correlation Chip - Uses same Blue as the chart */}
                <Chip
                    label={`Correlation: ${correlation.toFixed(2)} (${correlationStrength})`}
                    color="primary"
                    sx={{ width: "fit-content", fontWeight: 'bold' }}
                />

                {/* Chart */}
                <Box sx={{ width: '100%', height: 400 }}>
                    <ScatterChart
                        height={400}
                        series={[
                            {
                                label: "Shots vs Goals",
                                data: data,
                                color: "#0288d1", // Matching the "Blue" (Draw/Primary) color
                                markerSize: 8,
                                valueFormatter: (v) => `${v.rawY} Goals from ${v.rawX} Shots on Target`
                            },
                        ]}
                        xAxis={[
                            {
                                label: "Shots on Goal",
                                tickMinStep: 1,
                                valueFormatter: (v) => Math.round(v).toString()
                            },
                        ]}
                        yAxis={[
                            {
                                label: "Goals Scored",
                                tickMinStep: 1,
                                valueFormatter: (v) => Math.round(v).toString()
                            },
                        ]}
                        grid={{ horizontal: true, vertical: true }}
                    />
                </Box>

                {/* Insight Box */}
                <Alert severity="success" variant="outlined">
                    A positive correlation suggests that teams generating more shots on
                    target generally score more goals. Variation indicates finishing efficiency issues.
                </Alert>

            </Stack>
        </Paper>
    );
}