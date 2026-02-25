import { useEffect, useState } from "react";

export default function Events() {
    const [fixtures, setFixtures] = useState([]);
    const [teams, setTeams] = useState([]);
    const [events, setEvents] = useState([]);
    const [selectedFixture, setSelectedFixture] = useState(null);
    const [selectedFixtureData, setSelectedFixtureData] = useState(null);
    const [teamFilter, setTeamFilter] = useState("");

    useEffect(() => {
        fetch("/data/fixtures.json")
            .then(res => res.json())
            .then(data => Array.isArray(data) ? setFixtures(data) : setFixtures([]))
            .catch(() => setFixtures([]));

        fetch("/data/teams.json")
            .then(res => res.json())
            .then(data => Array.isArray(data) ? setTeams(data) : setTeams([]))
            .catch(() => setTeams([]));
    }, []);

    const loadEvents = async (fixtureId) => {
        const fixtureData = fixtures.find(f => String(f.fixture.id) === String(fixtureId));
        setSelectedFixture(fixtureId);
        setSelectedFixtureData(fixtureData || null);
        setEvents([]);

        try {
            const res = await fetch(`/data/events/fixture_${fixtureId}.json`);
            if (!res.ok) throw new Error("File not found");
            const data = await res.json();
            setEvents(Array.isArray(data) ? data : []);
        } catch (err) {
            setEvents([]);
        }
    };

    const getTeamInfo = (teamId) =>
        teams.find(t => t.team.id === teamId) || null;

    const getTeamStats = (teamId) =>
        selectedFixtureData?.statistics?.find(s => s.team.id === teamId)?.statistics || [];

    const getStat = (stats, type) =>
        stats.find(s => s.type === type)?.value ?? "—";

    // Gather all unique teams from fixtures for the filter dropdown
    const allTeams = Array.from(
        new Map(
            fixtures.flatMap(f => [
                [f.teams.home.id, f.teams.home],
                [f.teams.away.id, f.teams.away],
            ])
        ).values()
    ).sort((a, b) => a.name.localeCompare(b.name));

    const filteredFixtures = teamFilter
        ? fixtures.filter(
            f => f.teams.home.id === Number(teamFilter) || f.teams.away.id === Number(teamFilter)
        )
        : fixtures;

    const formatDate = (dateStr) =>
        new Date(dateStr).toLocaleDateString("en-GB", {
            weekday: "short", day: "numeric", month: "short", year: "numeric",
        });

    const formatTime = (dateStr) =>
        new Date(dateStr).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-bold">Fixture Events</h1>

            {/* FILTERS */}
            <div className="flex flex-col md:flex-row gap-3">
                {/* Team Filter */}
                <select
                    className="border p-2 rounded w-full md:w-1/3 bg-white"
                    value={teamFilter}
                    onChange={(e) => {
                        setTeamFilter(e.target.value);
                        setSelectedFixture(null);
                        setSelectedFixtureData(null);
                        setEvents([]);
                    }}
                >
                    <option value="">All teams</option>
                    {allTeams.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                </select>

                {/* Fixture Select */}
                <select
                    className="border p-2 rounded w-full md:w-2/3 bg-white"
                    onChange={(e) => loadEvents(e.target.value)}
                    value={selectedFixture || ""}
                >
                    <option value="" disabled>Select a fixture</option>
                    {filteredFixtures.map(f => (
                        <option key={f.fixture.id} value={f.fixture.id}>
                            {f.teams.home.name} vs {f.teams.away.name} — {formatDate(f.fixture.date)}
                        </option>
                    ))}
                </select>
            </div>

            {/* FIXTURE INFO */}
            {selectedFixtureData && (() => {
                const { fixture, teams: matchTeams, goals, score } = selectedFixtureData;
                const homeInfo = getTeamInfo(matchTeams.home.id);
                const awayInfo = getTeamInfo(matchTeams.away.id);
                const homeStats = getTeamStats(matchTeams.home.id);
                const awayStats = getTeamStats(matchTeams.away.id);

                return (
                    <div className="space-y-4">
                        {/* Scoreboard */}
                        <div className="relative overflow-hidden rounded-2xl p-6 text-white 
                        bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 
                        shadow-2xl border border-slate-700">
                            <div className="text-center text-sm text-gray-400 mb-4">
                                {formatDate(fixture.date)} · {formatTime(fixture.date)} · {fixture.venue.name}, {fixture.venue.city}
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                {/* Home Team */}
                                <div className="flex-1 text-center">
                                    <img src={matchTeams.home.logo} alt={matchTeams.home.name} className="w-16 h-16 mx-auto mb-2 object-contain" />
                                    <div className="font-bold text-lg">{matchTeams.home.name}</div>
                                    {homeInfo && <div className="text-xs text-gray-400">{homeInfo.venue.name}</div>}
                                </div>

                                {/* Score */}
                                <div className="text-center">
                                    <div className="text-5xl font-extrabold tracking-tight">
                                        {goals.home} – {goals.away}
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1">
                                        HT: {score.halftime.home}–{score.halftime.away}
                                    </div>
                                    <div className={`mt-2 text-xs font-semibold px-2 py-0.5 rounded-full inline-block ${matchTeams.home.winner ? "bg-green-600" :
                                        matchTeams.away.winner ? "bg-red-700" : "bg-gray-600"
                                        }`}>
                                        {matchTeams.home.winner ? `${matchTeams.home.name} Win` :
                                            matchTeams.away.winner ? `${matchTeams.away.name} Win` : "Draw"}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        Ref: {fixture.referee?.split(",")[0]}
                                    </div>
                                </div>

                                {/* Away Team */}
                                <div className="flex-1 text-center">
                                    <img src={matchTeams.away.logo} alt={matchTeams.away.name} className="w-16 h-16 mx-auto mb-2 object-contain" />
                                    <div className="font-bold text-lg">{matchTeams.away.name}</div>
                                    {awayInfo && <div className="text-xs text-gray-400">{awayInfo.venue.name}</div>}
                                </div>
                            </div>
                        </div>

                        {/* Stats Comparison */}
                        {homeStats.length > 0 && (
                            <div className="bg-white border rounded-xl p-5">
                                <h3 className="font-bold text-lg mb-4 text-center">Match Statistics</h3>
                                <div className="space-y-3">
                                    {[
                                        "Ball Possession",
                                        "Total Shots",
                                        "Shots on Goal",
                                        "Corner Kicks",
                                        "Fouls",
                                        "Yellow Cards",
                                        "Total passes",
                                        "Passes %",
                                        "expected_goals",
                                    ].map(statType => {
                                        const homeVal = getStat(homeStats, statType);
                                        const awayVal = getStat(awayStats, statType);

                                        const homeNum = parseFloat(String(homeVal)) || 0;
                                        const awayNum = parseFloat(String(awayVal)) || 0;
                                        const total = homeNum + awayNum;
                                        const homePercent = total > 0 ? (homeNum / total) * 100 : 50;

                                        const label = statType === "expected_goals" ? "xG"
                                            : statType === "Total passes" ? "Passes"
                                                : statType === "Passes %" ? "Pass Accuracy"
                                                    : statType;

                                        return (
                                            <div key={statType}>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="font-semibold w-12 text-left">{homeVal}</span>
                                                    <span className="text-gray-500 text-xs">{label}</span>
                                                    <span className="font-semibold w-12 text-right">{awayVal}</span>
                                                </div>
                                                <div className="flex h-2 rounded-full overflow-hidden bg-gray-200">
                                                    <div
                                                        className="bg-blue-500 transition-all"
                                                        style={{ width: `${homePercent}%` }}
                                                    />
                                                    <div
                                                        className="bg-red-400 transition-all"
                                                        style={{ width: `${100 - homePercent}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="flex justify-between text-xs text-gray-400 mt-3 px-1">
                                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />{matchTeams.home.name}</span>
                                    <span className="flex items-center gap-1">{matchTeams.away.name}<span className="w-2 h-2 rounded-full bg-red-400 inline-block" /></span>
                                </div>
                            </div>
                        )}

                        {/* Team Info Cards */}
                        {(homeInfo || awayInfo) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { info: homeInfo, team: matchTeams.home },
                                    { info: awayInfo, team: matchTeams.away }
                                ].map(({ info, team }) => info && (
                                    <div key={team.id} className="border rounded-xl p-4 bg-white">
                                        <div className="flex items-center gap-3 mb-3">
                                            <img src={team.logo} alt={team.name} className="w-10 h-10 object-contain" />
                                            <div>
                                                <div className="font-bold">{info.team.name}</div>
                                                <div className="text-xs text-gray-500">Founded {info.team.founded} · {info.team.country}</div>
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-600 space-y-1">
                                            <div>🏟️ <span className="font-medium">{info.venue.name}</span> — {info.venue.city}</div>
                                            <div>👥 Capacity: {info.venue.capacity?.toLocaleString()}</div>
                                            <div>🌿 Surface: {info.venue.surface}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })()}

            {/* EVENTS */}
            {selectedFixture && (
                <div>
                    <h2 className="text-xl font-semibold mb-3">Match Events</h2>
                    {events.length === 0 ? (
                        <p className="text-gray-500">No events found.</p>
                    ) : (
                        <ul className="space-y-2">
                            {events.map((event, idx) => (
                                <li key={idx} className="border p-3 rounded-lg flex items-center gap-3">
                                    <span className="text-sm font-bold text-gray-500 w-10 shrink-0">{event.time.elapsed}'</span>
                                    <img src={event.team.logo} alt={event.team.name} className="w-6 h-6 object-contain shrink-0" />
                                    <div className="text-sm">
                                        <span className="font-semibold">{event.team.name}</span> — {event.type}
                                        {event.detail && <span className="text-gray-500"> ({event.detail})</span>}
                                        {event.player?.name && <span className="text-gray-600"> · {event.player.name}</span>}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}