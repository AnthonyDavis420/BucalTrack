"use client";

import { useState, useMemo } from "react";
import { ArrowLeft } from "lucide-react";

/* ========= Types ========= */
type DocStatus = "Not Submitted" | "Pending" | "Verified" | "Flagged";

type Player = {
  id: string;
  name: string;
  yearCourse: string;
  jerseyNumber: number | null;
  position: string;
  status: DocStatus;
};

type Team = {
  id: string;
  teamName: string;
  sport: string;
  players: Player[];
};

type SportGroup = {
  sport: string;
  teams: Team[];
};

/* ========= Mock Data (Ateneo Account) ========= */
const SPORT_GROUPS: SportGroup[] = [
  {
    sport: "Basketball",
    teams: [
      {
        id: "b-001",
        teamName: "ADNU Blue Knights (Men's)",
        sport: "Basketball",
        players: [
          {
            id: "p-001",
            name: "Juan Dela Cruz",
            yearCourse: "3rd Year BSIT",
            jerseyNumber: 7,
            position: "PG",
            status: "Verified",
          },
          {
            id: "p-002",
            name: "Pedro Santos",
            yearCourse: "2nd Year BSHM",
            jerseyNumber: 14,
            position: "SG",
            status: "Pending",
          },
          {
            id: "p-003",
            name: "Miguel Rodriguez",
            yearCourse: "4th Year BSBA",
            jerseyNumber: 23,
            position: "SF",
            status: "Flagged",
          },
          {
            id: "p-004",
            name: "Carlos Mendoza",
            yearCourse: "1st Year BSCS",
            jerseyNumber: 11,
            position: "PF",
            status: "Flagged",
          },
          {
            id: "p-005",
            name: "Rafael Torres",
            yearCourse: "3rd Year BSME",
            jerseyNumber: 33,
            position: "C",
            status: "Verified",
          },
          {
            id: "p-006",
            name: "Angelo Reyes",
            yearCourse: "2nd Year BSIT",
            jerseyNumber: 8,
            position: "PG",
            status: "Flagged",
          },
          {
            id: "p-007",
            name: "Christian Lopez",
            yearCourse: "4th Year BSECE",
            jerseyNumber: 21,
            position: "SG",
            status: "Verified",
          },
          {
            id: "p-008",
            name: "Joshua Garcia",
            yearCourse: "1st Year BSHM",
            jerseyNumber: 4,
            position: "SF",
            status: "Not Submitted",
          },
          {
            id: "p-009",
            name: "Mark Villanueva",
            yearCourse: "3rd Year BSBA",
            jerseyNumber: 15,
            position: "PF",
            status: "Pending",
          },
          {
            id: "p-010",
            name: "John Paul Cruz",
            yearCourse: "2nd Year BSCS",
            jerseyNumber: 6,
            position: "C",
            status: "Flagged",
          },
        ],
      },
      {
        id: "b-002",
        teamName: "ADNU Lady Eagles (Women's)",
        sport: "Basketball",
        players: [
          {
            id: "p-011",
            name: "Sarah Martinez",
            yearCourse: "3rd Year BSN",
            jerseyNumber: 10,
            position: "PG",
            status: "Verified",
          },
          {
            id: "p-012",
            name: "Maria Santos",
            yearCourse: "2nd Year BSED",
            jerseyNumber: 12,
            position: "SG",
            status: "Flagged",
          },
          {
            id: "p-013",
            name: "Ana Gonzales",
            yearCourse: "4th Year BSBA",
            jerseyNumber: 22,
            position: "SF",
            status: "Flagged",
          },
          {
            id: "p-014",
            name: "Kristine Dela Rosa",
            yearCourse: "1st Year BSIT",
            jerseyNumber: 5,
            position: "PF",
            status: "Verified",
          },
          {
            id: "p-015",
            name: "Nicole Rivera",
            yearCourse: "3rd Year BSA",
            jerseyNumber: 24,
            position: "C",
            status: "Flagged",
          },
        ],
      },
    ],
  },
  {
    sport: "Volleyball",
    teams: [
      {
        id: "v-001",
        teamName: "ADNU Lady Spikers",
        sport: "Volleyball",
        players: [
          {
            id: "p-101",
            name: "Maria Rivera",
            yearCourse: "4th Year BSA",
            jerseyNumber: 12,
            position: "OH",
            status: "Verified",
          },
          {
            id: "p-102",
            name: "Liza Gomez",
            yearCourse: "1st Year BSED",
            jerseyNumber: 5,
            position: "MB",
            status: "Flagged",
          },
          {
            id: "p-103",
            name: "Anna Cruz",
            yearCourse: "2nd Year BSBA",
            jerseyNumber: 8,
            position: "Libero",
            status: "Flagged",
          },
          {
            id: "p-104",
            name: "Carmen Flores",
            yearCourse: "3rd Year BSIT",
            jerseyNumber: 14,
            position: "OH",
            status: "Flagged",
          },
          {
            id: "p-105",
            name: "Jessica Torres",
            yearCourse: "2nd Year BSN",
            jerseyNumber: 7,
            position: "S",
            status: "Verified",
          },
          {
            id: "p-106",
            name: "Patricia Mendez",
            yearCourse: "4th Year BSME",
            jerseyNumber: 3,
            position: "MB",
            status: "Flagged",
          },
          {
            id: "p-107",
            name: "Isabella Santos",
            yearCourse: "1st Year BSHM",
            jerseyNumber: 11,
            position: "OH",
            status: "Pending",
          },
          {
            id: "p-108",
            name: "Sophia Garcia",
            yearCourse: "3rd Year BSCS",
            jerseyNumber: 9,
            position: "Libero",
            status: "Flagged",
          },
          {
            id: "p-109",
            name: "Michelle Lopez",
            yearCourse: "2nd Year BSBA",
            jerseyNumber: 16,
            position: "S",
            status: "Not Submitted",
          },
          {
            id: "p-110",
            name: "Andrea Villanueva",
            yearCourse: "4th Year BSA",
            jerseyNumber: 18,
            position: "MB",
            status: "Flagged",
          },
        ],
      },
    ],
  },
  {
    sport: "Football",
    teams: [
      {
        id: "f-001",
        teamName: "ADNU Blue Stallions (Men's)",
        sport: "Football",
        players: [
          {
            id: "p-201",
            name: "Roberto Martinez",
            yearCourse: "3rd Year BSPE",
            jerseyNumber: 9,
            position: "ST",
            status: "Flagged",
          },
          {
            id: "p-202",
            name: "Diego Fernandez",
            yearCourse: "2nd Year BSIT",
            jerseyNumber: 10,
            position: "CAM",
            status: "Flagged",
          },
          {
            id: "p-203",
            name: "Luis Castillo",
            yearCourse: "4th Year BSBA",
            jerseyNumber: 7,
            position: "LW",
            status: "Verified",
          },
          {
            id: "p-204",
            name: "Fernando Ramos",
            yearCourse: "1st Year BSCS",
            jerseyNumber: 11,
            position: "RW",
            status: "Flagged",
          },
          {
            id: "p-205",
            name: "Alejandro Morales",
            yearCourse: "3rd Year BSME",
            jerseyNumber: 6,
            position: "CDM",
            status: "Flagged",
          },
          {
            id: "p-206",
            name: "Antonio Herrera",
            yearCourse: "2nd Year BSHM",
            jerseyNumber: 8,
            position: "CM",
            status: "Verified",
          },
          {
            id: "p-207",
            name: "Manuel Santos",
            yearCourse: "4th Year BSECE",
            jerseyNumber: 4,
            position: "CB",
            status: "Flagged",
          },
          {
            id: "p-208",
            name: "Gabriel Torres",
            yearCourse: "1st Year BSED",
            jerseyNumber: 5,
            position: "CB",
            status: "Pending",
          },
          {
            id: "p-209",
            name: "Ricardo Flores",
            yearCourse: "3rd Year BSA",
            jerseyNumber: 3,
            position: "LB",
            status: "Flagged",
          },
          {
            id: "p-210",
            name: "Eduardo Cruz",
            yearCourse: "2nd Year BSN",
            jerseyNumber: 2,
            position: "RB",
            status: "Flagged",
          },
          {
            id: "p-211",
            name: "Andres Gomez",
            yearCourse: "4th Year BSIT",
            jerseyNumber: 1,
            position: "GK",
            status: "Verified",
          },
        ],
      },
    ],
  },
];

/* ========= Team Card ========= */
function TeamCard({ team }: { team: Team }) {
  const total = team.players.length;
  const verified = team.players.filter((p) => p.status === "Verified").length;
  const flaggedPlayers = team.players.filter((p) => p.status === "Flagged");

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition">
      <h3 className="text-base font-semibold text-gray-900">{team.teamName}</h3>
      <p className="mt-1 text-sm text-gray-500">{team.sport}</p>

      {/* Progress summary */}
      <div className="mt-3 text-sm font-medium text-gray-700">
        Players Verified:{" "}
        <span className="text-[#071689]">
          {verified}/{total}
        </span>{" "}
        · Total Players: {total}
      </div>

      {/* Flagged players */}
      {flaggedPlayers.length > 0 && (
        <div className="mt-2 text-xs text-orange-600">
          Flagged: {flaggedPlayers.map((p) => p.name).join(", ")}
        </div>
      )}
    </div>
  );
}

/* ========= Page ========= */
export default function PlayerScreeningSchoolView() {
  const [groups] = useState<SportGroup[]>(SPORT_GROUPS);
  const [sportOpen, setSportOpen] = useState<string | null>(null);

  const currentGroup = useMemo(
    () => groups.find((g) => g.sport === sportOpen) || null,
    [groups, sportOpen]
  );

  return (
    <div className="space-y-6 pt-8">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            Player Screening
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Track your players' screening progress across all teams.
          </p>
        </div>
      </header>

      {/* SPORTS GRID */}
      {!currentGroup && (
        <section>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {groups.map((g) => (
              <button
                key={g.sport}
                onClick={() => setSportOpen(g.sport)}
                className="text-left rounded-xl border bg-white shadow-sm p-5 hover:shadow-md transition"
              >
                <div className="text-lg font-semibold text-gray-900">
                  {g.sport}
                </div>
                <p className="mt-1 text-sm text-gray-500">Teams</p>
                <div className="mt-6 text-2xl font-bold text-gray-900">
                  {g.teams.length}
                </div>
                <div className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-[#071689] px-4 py-2.5 text-sm font-medium text-white">
                  View Teams
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* TEAMS GRID */}
      {currentGroup && (
        <section className="space-y-4">
          <button
            onClick={() => setSportOpen(null)}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sports
          </button>

          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {currentGroup.sport}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Player screening progress for {currentGroup.sport}.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {currentGroup.teams.map((t) => (
              <TeamCard key={t.id} team={t} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}