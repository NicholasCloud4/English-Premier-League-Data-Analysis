import { useMemo } from "react";
import { ScatterChart } from "@mui/x-charts";
import {
    Paper,
    Typography,
    Box,
    Alert,
    Stack,
    Chip
} from "@mui/material";

export default function ShotsVsGoalsChart({ fixtures = [], selectedTeam }) {

    const data = useMemo(() => {
        const points = [];

        // Helper function to extract shots on goal from the statistics array
        const getShotsOnGoal = (fixture, teamName) => {
            const teamStats = fixture.statistics?.find(
                (t) => t.team.name === teamName
            );

            const shotStat = teamStats?.statistics?.find(
                (s) => s.type === "Shots on Goal"
            );

            return shotStat?.value ?? 0;
        };

        fixtures.forEach((fixture, fixtureIndex) => {
            // Using the new search logic by team name
            const teams = [
                {
                    name: fixture.teams.home.name,
                    goals: fixture.goals.home,
                    shots: getShotsOnGoal(fixture, fixture.teams.home.name),
                },
                {
                    name: fixture.teams.away.name,
                    goals: fixture.goals.away,
                    shots: getShotsOnGoal(fixture, fixture.teams.away.name),
                },
            ];

            teams.forEach(({ name, goals, shots }) => {
                if (selectedTeam && selectedTeam !== name) return;

                if (shots !== null && goals !== null) {
                    /**
                     * JITTER LOGIC:
                     * Uses fixtureIndex to ensure every match has a unique position,
                     * even if the scores are identical.
                     */
                    const jitterX = ((fixtureIndex % 3) - 1) * 0.18;
                    const jitterY = ((fixtureIndex % 2) === 0 ? 0.12 : -0.12);

                    points.push({
                        id: `${fixture.fixture?.id}-${name}`,
                        x: Number(shots) + jitterX,
                        y: Number(goals) + jitterY,
                        rawX: Number(shots), // Clean numbers for math
                        rawY: Number(goals)  // Clean numbers for math
                    });
                }
            });
        });

        return points;
    }, [fixtures, selectedTeam]);

    // 🧮 Correlation Calculation (Using rawX/rawY for accuracy)
    const correlation = useMemo(() => {
        if (data.length < 2) return 0;

        const n = data.length;
        const sumX = data.reduce((sum, p) => sum + p.rawX, 0);
        const sumY = data.reduce((sum, p) => sum + p.rawY, 0);
        const sumXY = data.reduce((sum, p) => sum + p.rawX * p.rawY, 0);
        const sumX2 = data.reduce((sum, p) => sum + p.rawX * p.rawX, 0);
        const sumY2 = data.reduce((sum, p) => sum + p.rawY * p.rawY, 0);

        const numerator = n * sumXY - sumX * sumY;
        const denominator = Math.sqrt(
            (n * sumX2 - sumX * sumX) *
            (n * sumY2 - sumY * sumY)
        );

        return denominator === 0 ? 0 : numerator / denominator;
    }, [data]);

    // 🎨 Dynamic Chip Color
    const correlationStrength = useMemo(() => {
        const abs = Math.abs(correlation);
        if (data.length < 3) return { label: "Insufficient Data", color: "warning" };
        if (abs > 0.7) return { label: "Strong Correlation", color: "success" };
        if (abs > 0.4) return { label: "Moderate Correlation", color: "info" };
        if (abs > 0.2) return { label: "Weak Correlation", color: "warning" };
        return { label: "Little / No Correlation", color: "error" };
    }, [correlation, data.length]);

    // Dynamic scale for X/Y axes to prevent cutoff
    const maxX = Math.max(...data.map(d => d.rawX), 5);
    const maxY = Math.max(...data.map(d => d.rawY), 4);

    return (
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3, marginTop: 4 }}>
            <Stack spacing={2}>
                <Typography variant="h5" fontWeight="bold">
                    Do More Shots on Goal Translate to More Goals?
                </Typography>

                <Typography variant="body2" color="text.secondary">
                    Each dot represents one match for <strong>{selectedTeam || "All Teams"}</strong>.
                </Typography>

                {data.length > 0 && data.length < 3 && (
                    <Alert severity="warning">Not enough data for reliable correlation.</Alert>
                )}

                <Box sx={{ height: 400, width: '100%' }}>
                    {data.length > 0 ? (
                        <ScatterChart
                            height={400}
                            margin={{ left: 60, right: 40, top: 60, bottom: 60 }}
                            series={[
                                {
                                    label: "Shots vs Goals",
                                    data: data,
                                    valueFormatter: (v) => `${v.rawY} Goals from ${v.rawX} Shots on Target`
                                },
                            ]}
                            xAxis={[{
                                label: "Shots on Goal",
                                min: -0.5,
                                max: maxX + 1,
                                tickMinStep: 1
                            }]}
                            yAxis={[{
                                label: "Goals Scored",
                                min: -0.5,
                                max: maxY + 1,
                                tickMinStep: 1
                            }]}
                            grid={{ horizontal: true, vertical: true }}
                            slotProps={{
                                legend: {
                                    position: { vertical: 'top', horizontal: 'middle' },
                                    padding: 0
                                }
                            }}
                        />
                    ) : (
                        <Alert severity="info">No data available for the selected team.</Alert>
                    )}
                </Box>

                <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="body1">
                        Correlation: <strong>{correlation.toFixed(2)}</strong>
                    </Typography>
                    <Chip
                        label={correlationStrength.label}
                        color={correlationStrength.color}
                    />
                </Stack>
            </Stack>
        </Paper>
    );
}