import { useMemo } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { Paper, Typography, Box } from "@mui/material";

export default function TeamOutcomeChart({ fixtures, selectedTeam }) {
    const stats = useMemo(() => {
        let homeWins = 0;
        let awayWins = 0;
        let draws = 0;
        let homeLosses = 0; // Only being used for specific team view
        let awayLosses = 0; // Only being used for specific team view

        // 1. Filter fixtures: All matches if no team selected, else only that team's matches
        const targetFixtures = !selectedTeam
            ? fixtures
            : fixtures.filter(
                (f) =>
                    f.teams.home.name === selectedTeam ||
                    f.teams.away.name === selectedTeam
            );

        targetFixtures.forEach((f) => {
            const homeGoals = f.goals.home;
            const awayGoals = f.goals.away;

            if (!selectedTeam) {
                // LEAGUE VIEW: General home vs away performance
                if (homeGoals > awayGoals) homeWins++;
                else if (awayGoals > homeGoals) awayWins++;
                else draws++;
            } else {
                // SPECIFIC TEAM VIEW: How does THIS team do home vs away?
                const isHome = f.teams.home.name === selectedTeam;

                if (isHome) {
                    if (homeGoals > awayGoals) homeWins++;
                    else if (homeGoals < awayGoals) homeLosses++;
                    else draws++;
                } else {
                    // Team is playing Away
                    if (awayGoals > homeGoals) awayWins++;
                    else if (awayGoals < homeGoals) awayLosses++;
                    else draws++;
                }
            }
        });

        const totalPlayed = targetFixtures.length;

        // Defined the labels and data based on the view
        const chartLabels = selectedTeam
            ? ["Home Wins", "Away Wins", "Home Losses", "Away Losses", "Draws"]
            : ["Home Wins (League)", "Away Wins (League)", "Draws"];

        const chartValues = selectedTeam
            ? [homeWins, awayWins, homeLosses, awayLosses, draws]
            : [homeWins, awayWins, draws];

        return {
            totalPlayed,
            chartLabels,
            chartValues,
            homeWins,
            awayWins,
            draws,
        };
    }, [fixtures, selectedTeam]);

    return (
        <Paper elevation={2} sx={{ padding: "24px", marginBottom: "24px" }}>
            <Box sx={{ marginBottom: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {selectedTeam || "League-Wide"} Home Advantage Analysis
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {selectedTeam
                        ? `Analyzing ${selectedTeam}'s performance at home vs. on the road.`
                        : "Comparing total home wins vs. away wins across the entire Premier League."}
                </Typography>
            </Box>

            <Box sx={{ width: '100%', height: 350 }}>
                <BarChart
                    xAxis={[
                        {
                            data: stats.chartLabels,
                            scaleType: "band",
                        },
                    ]}
                    series={[
                        {
                            data: stats.chartValues,
                            label: "Number of Matches",
                            color: "#1976d2",
                        },
                    ]}
                    margin={{ top: 20, bottom: 40, left: 50, right: 10 }}
                />
            </Box>

            <Box sx={{ mt: 2, display: "flex", gap: 3 }}>
                <Typography variant="body2">
                    Total Matches: <strong>{stats.totalPlayed}</strong>
                </Typography>
                <Typography variant="body2">
                    Home Win Rate:{" "}
                    <strong>
                        {stats.totalPlayed
                            ? ((stats.homeWins / stats.totalPlayed) * 100).toFixed(1)
                            : 0}
                        %
                    </strong>
                </Typography>
            </Box>
        </Paper>
    );
}