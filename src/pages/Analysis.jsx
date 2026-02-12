import { useEffect, useState, useMemo } from "react";
import { BarChart } from "@mui/x-charts/BarChart"; // MUI X Charts
import { Select, MenuItem, FormControl, InputLabel, Paper, Typography, Box } from "@mui/material";

export default function Analysis() {
    const [fixtures, setFixtures] = useState([]);
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState("");

    // Load fixtures
    useEffect(() => {
        fetch("/data/fixtures.json")
            .then(res => res.json())
            .then(data => setFixtures(data))
            .catch(() => setFixtures([]));
    }, []);

    // Load teams
    useEffect(() => {
        fetch("/data/teams.json")
            .then(res => res.json())
            .then(data => setTeams(data))
            .catch(() => setTeams([]));
    }, []);

    // Filter fixtures by team
    const filteredFixtures = useMemo(() => {
        if (!selectedTeam) return fixtures;
        return fixtures.filter(
            f => f.teams.home.name === selectedTeam || f.teams.away.name === selectedTeam
        );
    }, [fixtures, selectedTeam]);

    // Compute chart data
    const chartData = useMemo(() => {
        let homeWins = 0;
        let awayWins = 0;
        let draws = 0;

        filteredFixtures.forEach(f => {
            const homeGoals = f.goals.home;
            const awayGoals = f.goals.away;

            if (!selectedTeam) {
                // Count all matches if no team is selected
                if (homeGoals > awayGoals) homeWins++;
                else if (homeGoals < awayGoals) awayWins++;
                else draws++;
            } else if (f.teams.home.name === selectedTeam) {
                // Selected team is home
                if (homeGoals > awayGoals) homeWins++;
                else if (homeGoals === awayGoals) draws++;
                // Do NOT increment awayWins if selected team loses
            } else if (f.teams.away.name === selectedTeam) {
                // Selected team is away
                if (awayGoals > homeGoals) awayWins++;
                else if (awayGoals === homeGoals) draws++;
                // Do NOT increment homeWins if selected team loses
            }
        });

        return {
            labels: ["Home Wins", "Away Wins", "Draws"],
            values: [homeWins, awayWins, draws],
        };
    }, [filteredFixtures, selectedTeam]);


    return (
        <Box sx={{ maxWidth: '1152px', margin: '0 auto', padding: '24px' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: '16px' }}>
                EPL Analysis
            </Typography>

            {/* Team Filter */}
            <FormControl fullWidth sx={{ marginBottom: '24px', maxWidth: '400px' }}>
                <InputLabel id="team-select-label">Team</InputLabel>
                <Select
                    labelId="team-select-label"
                    value={selectedTeam}
                    label="Team"
                    onChange={(e) => setSelectedTeam(e.target.value)}
                >
                    <MenuItem value="">All Teams</MenuItem>
                    {teams.map((t) => (
                        <MenuItem key={t.team.id} value={t.team.name}>
                            {t.team.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Chart */}
            <Paper elevation={2} sx={{ padding: '16px' }}>
                <BarChart
                    // This is the part that changes the numbers to text
                    xAxis={[
                        {
                            id: 'categories',
                            data: chartData.labels,
                            scaleType: 'band',
                        },
                    ]}
                    series={[
                        {
                            data: chartData.values,
                            label: 'Match Outcomes',
                        },
                    ]}
                    height={350}
                    colors={["#38003c"]}
                    // Optional: Adds a margin to ensure labels aren't cut off
                    margin={{ top: 20, bottom: 30, left: 40, right: 10 }}
                />
            </Paper>
        </Box>
    );
}