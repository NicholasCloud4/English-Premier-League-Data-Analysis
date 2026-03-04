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
        const getShotsOnGoal = (fixture, teamName) => {
            const teamStats = fixture.statistics?.find(
                (t) => t.team.name === teamName
            );
            const shotStat = teamStats?.statistics?.find(
                (s) => s.type === "Shots on Goal"
            );
            return shotStat?.value ?? 0;
        };

        // Step 1: Collect all raw points first
        const rawPoints = [];
        fixtures.forEach((fixture) => {
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
                    rawPoints.push({
                        id: `${fixture.fixture?.id}-${name}`,
                        rawX: Number(shots),
                        rawY: Number(goals),
                        label: name,
                    });
                }
            });
        });

        // Step 2: Group by identical (rawX, rawY) so we know which dots overlap
        const grouped = {};
        rawPoints.forEach((p) => {
            const key = `${p.rawX},${p.rawY}`;
            if (!grouped[key]) grouped[key] = [];
            grouped[key].push(p);
        });

        // Step 3: Spread overlapping dots evenly in a circle around the true position.
        // Radius is large enough to clearly separate dots but small enough they
        // still obviously belong to their grid coordinate.
        const RADIUS = 0.4;
        return rawPoints.map((p) => {
            const key = `${p.rawX},${p.rawY}`;
            const group = grouped[key];
            const total = group.length;
            const index = group.indexOf(p);

            let offsetX = 0;
            let offsetY = 0;

            if (total === 2) {
                // For exactly 2 points, place them side by side horizontally
                offsetX = index === 0 ? -RADIUS * 0.7 : RADIUS * 0.7;
            } else if (total > 2) {
                // For 3+, spread evenly around a circle
                const angle = (2 * Math.PI * index) / total - Math.PI / 2;
                offsetX = RADIUS * Math.cos(angle);
                offsetY = RADIUS * Math.sin(angle);
            }

            return {
                ...p,
                x: p.rawX + offsetX,
                y: p.rawY + offsetY,
            };
        });
    }, [fixtures, selectedTeam]);

    // Pearson correlation — always uses rawX/rawY, never the spread positions
    // const correlation = useMemo(() => {
    //     if (data.length < 2) return 0;

    //     const n = data.length;
    //     const sumX = data.reduce((s, p) => s + p.rawX, 0);
    //     const sumY = data.reduce((s, p) => s + p.rawY, 0);
    //     const sumXY = data.reduce((s, p) => s + p.rawX * p.rawY, 0);
    //     const sumX2 = data.reduce((s, p) => s + p.rawX * p.rawX, 0);
    //     const sumY2 = data.reduce((s, p) => s + p.rawY * p.rawY, 0);

    //     const numerator = n * sumXY - sumX * sumY;
    //     const denominator = Math.sqrt(
    //         (n * sumX2 - sumX * sumX) *
    //         (n * sumY2 - sumY * sumY)
    //     );

    //     return denominator === 0 ? 0 : numerator / denominator;
    // }, [data]);

    // const correlationStrength = useMemo(() => {
    //     const abs = Math.abs(correlation);
    //     if (data.length < 3) return { label: "Insufficient Data", color: "warning" };
    //     if (abs > 0.7) return { label: "Strong Correlation", color: "success" };
    //     if (abs > 0.4) return { label: "Moderate Correlation", color: "info" };
    //     if (abs > 0.2) return { label: "Weak Correlation", color: "warning" };
    //     return { label: "Little / No Correlation", color: "error" };
    // }, [correlation, data.length]);

    const maxX = Math.max(...data.map(d => d.rawX), 5);
    const maxY = Math.max(...data.map(d => d.rawY), 4);

    return (
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3, marginTop: 4 }}>
            <Stack spacing={2}>
                <Typography variant="h5" fontWeight="bold">
                    Do More Shots on Goal Translate to More Goals?
                </Typography>

                <Typography variant="body2" color="text.secondary">
                    Each dot represents one match for{" "}
                    <strong>{selectedTeam || "All Teams"}</strong>.
                    Overlapping results are spread in a small circle.
                </Typography>

                {data.length > 0 && data.length < 3 && (
                    <Alert severity="warning">
                        Not enough data for reliable correlation — need at least 3 data points.
                    </Alert>
                )}

                <Box sx={{ height: 400, width: "100%" }}>
                    {data.length > 0 ? (
                        <ScatterChart
                            height={400}
                            margin={{ left: 60, right: 40, top: 60, bottom: 60 }}
                            series={[
                                {
                                    label: "Shots vs Goals",
                                    data,
                                    valueFormatter: (v) =>
                                        `${v.label}: ${v.rawY} goal${v.rawY !== 1 ? "s" : ""} from ${v.rawX} shots on target`,
                                },
                            ]}
                            xAxis={[{
                                label: "Shots on Goal",
                                min: 0,
                                max: maxX + 1,
                                tickMinStep: 1,
                            }]}
                            yAxis={[{
                                label: "Goals Scored",
                                min: 0,
                                max: maxY + 1,
                                tickMinStep: 1,
                            }]}
                            grid={{ horizontal: true, vertical: true }}
                            slotProps={{
                                legend: {
                                    position: { vertical: "top", horizontal: "middle" },
                                    padding: 0,
                                },
                            }}
                        />
                    ) : (
                        <Alert severity="info">
                            No data available for the selected team.
                        </Alert>
                    )}
                </Box>

                {/* <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="body1">
                        Pearson r: <strong>{correlation.toFixed(2)}</strong>
                    </Typography>
                    <Chip
                        label={correlationStrength.label}
                        color={correlationStrength.color}
                    />
                </Stack> */}
            </Stack>
        </Paper>
    );
}