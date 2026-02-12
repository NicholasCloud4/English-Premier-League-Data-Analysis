import { useEffect, useState } from "react";
import { Select, MenuItem, FormControl, InputLabel, Typography, Box } from "@mui/material";
import DisciplineVsLossChart from "../components/DisciplineVsLossChart";
import TeamOutcomeChart from "../components/TeamOutcomeChart";

export default function Analysis() {
    const [fixtures, setFixtures] = useState([]);
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState("");

    useEffect(() => {
        fetch("/data/fixtures.json")
            .then(res => res.json())
            .then(data => setFixtures(data))
            .catch(() => setFixtures([]));
    }, []);

    useEffect(() => {
        fetch("/data/teams.json")
            .then(res => res.json())
            .then(data => setTeams(data))
            .catch(() => setTeams([]));
    }, []);

    return (
        <Box sx={{ maxWidth: "1152px", margin: "0 auto", padding: "24px" }}>
            <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: "16px" }}>
                EPL Analysis
            </Typography>

            <FormControl fullWidth sx={{ marginBottom: "24px", maxWidth: "400px" }}>
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

            <TeamOutcomeChart
                fixtures={fixtures}
                selectedTeam={selectedTeam}
            />

            <DisciplineVsLossChart fixtures={fixtures} selectedTeam={selectedTeam} />
        </Box>
    );
}
