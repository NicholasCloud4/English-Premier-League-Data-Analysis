import { useEffect, useState } from "react";

export default function Events() {
    const [fixtures, setFixtures] = useState([]); // must be array
    const [events, setEvents] = useState([]);
    const [selectedFixture, setSelectedFixture] = useState(null);

    useEffect(() => {
        fetch("/data/fixtures.json")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setFixtures(data);
                }
            })
            .catch(() => setFixtures([]));
    }, []);


    const loadEvents = async (fixtureId) => {
        setSelectedFixture(fixtureId);
        setEvents([]); // reset

        try {
            const res = await fetch(`/data/events/fixture_${fixtureId}.json`);
            if (!res.ok) throw new Error("File not found");

            const data = await res.json();

            // event data
            if (Array.isArray(data)) {
                setEvents(data);
            } else {
                setEvents([]);
            }
        } catch (err) {
            console.error(err);
            setEvents([]);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Fixture Events</h1>

            {/* FIXTURE SELECT */}
            <select
                className="border p-2 rounded w-full md:w-1/2 mb-6"
                onChange={(e) => loadEvents(e.target.value)}
                defaultValue=""
            >
                <option value="" disabled>
                    Select a fixture
                </option>

                {fixtures.length > 0 &&
                    fixtures.map(f => (
                        <option key={f.fixture.id} value={f.fixture.id}>
                            {f.teams.home.name} vs {f.teams.away.name}
                        </option>
                    ))}
            </select>

            {/* EVENTS */}
            {selectedFixture && (
                <>
                    <h2 className="text-xl font-semibold mb-3">
                        Events for Fixture {selectedFixture}
                    </h2>

                    {events.length === 0 ? (
                        <p className="text-gray-500">No events found.</p>
                    ) : (
                        <ul className="space-y-2">
                            {events.map((event, idx) => (
                                <li key={idx} className="border p-3 rounded">
                                    <strong>{event.time.elapsed}'</strong>{" "}
                                    {event.team.name} — {event.type}
                                    {event.detail && ` (${event.detail})`}
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            )}
        </div>
    );
}
