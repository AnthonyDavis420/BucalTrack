"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, Users, Plus } from "lucide-react";
import  { TeamDetails }from "@components/modals/TeamDetails"; // adjust path if needed
import { CreateRegistrationModal } from "@components/modals/CreateRegistration";

/* ========= Types ========= */
type ReviewStatus = "Pending" | "Approved" | "Rejected";

type Player = {
  id: string;
  name: string;
  yearCourse: string;
  birthdate: string;
  jerseyNumber: number | null;
  position: string;
  isBicolano: boolean;
  isTransferee: boolean;
  lastSchool?: string;
  yearsPlayed: number;
};

type Team = {
  id: string;
  teamName: string;
  schoolName: string;
  schoolPresident: string;
  athleticsDirector: string;
  headCoach: string;
  assistantCoach?: string;
  headCoachESignUrl?: string;
  players: Player[];
  submittedAt: string;
  status: ReviewStatus;
};

type SportGroup = {
  sport: string;
  teams: Team[];
};

/* ========= Mock Data ========= */
const SPORT_GROUPS: SportGroup[] = [
  {
    sport: "Basketball",
    teams: [
      {
        id: "b-001",
        teamName: "NCF Tigers",
        schoolName: "Naga College Foundation",
        schoolPresident: "Dr. Maria Lopez",
        athleticsDirector: "Engr. Ramon Cruz",
        headCoach: "Coach Luis Santos",
        assistantCoach: "Coach Bea Rivera",
        headCoachESignUrl: "#",
        submittedAt: "2025-08-12 11:30",
        status: "Pending",
        players: [
          {
            id: "p-001",
            name: "Juan Dela Cruz",
            yearCourse: "3rd Year BSIT",
            birthdate: "2004-04-10",
            jerseyNumber: 7,
            position: "PG",
            isBicolano: true,
            isTransferee: false,
            yearsPlayed: 1,
          },
          {
            id: "p-002",
            name: "Pedro Santos",
            yearCourse: "2nd Year BSHM",
            birthdate: "2005-08-21",
            jerseyNumber: 14,
            position: "SG",
            isBicolano: false,
            isTransferee: true,
            lastSchool: "USI",
            yearsPlayed: 0,
          },
        ],
      },
      {
        id: "b-002",
        teamName: "ADNU Blue Knights",
        schoolName: "Ateneo de Naga University",
        schoolPresident: "Fr. Jose Aquino, SJ",
        athleticsDirector: "Ma. Teresa Dy",
        headCoach: "Coach Ana Lim",
        assistantCoach: "Coach Carol Uy",
        headCoachESignUrl: "#",
        submittedAt: "2025-08-11 09:05",
        status: "Approved",
        players: [
          {
            id: "p-101",
            name: "Miguel Cruz",
            yearCourse: "4th Year BSA",
            birthdate: "2003-02-14",
            jerseyNumber: 3,
            position: "SF",
            isBicolano: true,
            isTransferee: false,
            yearsPlayed: 2,
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
        teamName: "ADNU Lady Knights",
        schoolName: "Ateneo de Naga University",
        schoolPresident: "Fr. Jose Aquino, SJ",
        athleticsDirector: "Ma. Teresa Dy",
        headCoach: "Coach Ana Lim",
        assistantCoach: "Coach Carol Uy",
        headCoachESignUrl: "#",
        submittedAt: "2025-08-10 14:22",
        status: "Approved",
        players: [
          {
            id: "p-201",
            name: "Maria Rivera",
            yearCourse: "4th Year BSA",
            birthdate: "2003-02-14",
            jerseyNumber: 3,
            position: "OH",
            isBicolano: true,
            isTransferee: false,
            yearsPlayed: 2,
          },
        ],
      },
      {
        id: "v-002",
        teamName: "USI Spikers",
        schoolName: "Universidad de Sta. Isabel",
        schoolPresident: "Sr. Teresa Santos",
        athleticsDirector: "Engr. Paolo Manansala",
        headCoach: "Coach Rhea Dizon",
        assistantCoach: "Coach Kim Valdez",
        headCoachESignUrl: "#",
        submittedAt: "2025-08-12 16:41",
        status: "Pending",
        players: [],
      },
    ],
  },
  {
    sport: "Cheer and Dance",
    teams: [],
  },
];

/* ========= Small UI bits ========= */
function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
      {children}
    </span>
  );
}

function StatusBadge({ status }: { status: ReviewStatus }) {
  const statusStyles = {
    "Pending": "bg-yellow-100 text-yellow-800",
    "Approved": "bg-green-100 text-green-800",
    "Rejected": "bg-red-100 text-red-800"
  };

  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${statusStyles[status]}`}>
      {status}
    </span>
  );
}

function SportCard({
  sport,
  count,
  onOpen,
}: {
  sport: string;
  count: number;
  onOpen: () => void;
}) {
  return (
    <button
      onClick={onOpen}
      className="text-left rounded-xl border bg-white shadow-sm p-5 hover:shadow-md transition"
    >
      <div className="text-lg font-semibold text-gray-900">{sport}</div>
      <p className="mt-1 text-sm text-gray-500">Teams Registered</p>
      <div className="mt-6 text-2xl font-bold text-gray-900">{count}</div>
      <div className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-[#071689] px-4 py-2.5 text-sm font-medium text-white">
        View Teams
      </div>
    </button>
  );
}

function TeamCard({ t, onOpen }: { t: Team; onOpen: (id: string) => void }) {
  return (
    <button
      onClick={() => onOpen(t.id)}
      className="text-left rounded-xl border bg-white shadow-sm p-5 hover:shadow-md transition"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="text-base font-semibold text-gray-900">{t.teamName}</div>
          <div className="mt-1 text-sm text-gray-500">{t.schoolName}</div>
        </div>
        <StatusBadge status={t.status} />
      </div>
      <div className="mt-2 text-xs text-gray-500">Submitted: {t.submittedAt}</div>
      <div className="mt-4 flex items-center justify-between">
        <Badge>Team</Badge>
        <div className="inline-flex items-center gap-2 text-sm text-gray-700">
          <Users className="h-4 w-4" />
          Players: <strong className="text-gray-900">{t.players.length}</strong>
        </div>
      </div>
      <div className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-[#071689] px-4 py-2.5 text-sm font-medium text-white">
        View Details
      </div>
    </button>
  );
}

/* ========= Page ========= */
export default function TeamRegistrationBySport() {
  const [groups, setGroups] = useState<SportGroup[]>(SPORT_GROUPS);
  const [sportOpen, setSportOpen] = useState<string | null>(null);
  const [openTeamId, setOpenTeamId] = useState<string | null>(null);

  // Registration forms visible to coaches (by sport name)
  const [forms, setForms] = useState<string[]>(["Basketball", "Volleyball"]);
  // Create-registration modal state
  const [createOpen, setCreateOpen] = useState(false);

  const currentGroup = useMemo(
    () => groups.find((g) => g.sport === sportOpen) || null,
    [groups, sportOpen]
  );
  const openTeam = useMemo(
    () =>
      currentGroup ? currentGroup.teams.find((t) => t.id === openTeamId) ?? null : null,
    [currentGroup, openTeamId]
  );

  const visibleGroups = useMemo(
    () => groups.filter((g) => forms.includes(g.sport)),
    [groups, forms]
  );

  const totalTeamsPerSport = (sport: string) =>
    groups.find((g) => g.sport === sport)?.teams.length ?? 0;

  const setTeamStatus = (teamId: string, status: ReviewStatus) => {
    setGroups((prev) =>
      prev.map((g) => ({
        ...g,
        teams: g.teams.map((t) => (t.id === teamId ? { ...t, status } : t)),
      }))
    );
  };

  return (
    <div className="space-y-6 pt-8">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Team Registration</h1>
          <p className="mt-2 text-sm text-gray-500">
            Choose a <span className="font-medium text-gray-700">Sport</span>, then review its teams.
          </p>
        </div>

        {/* Create Registration Form button (opens modal) */}
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-[#071689] px-4 py-2 text-sm font-medium text-white hover:bg-[#1A2DB3]"
        >
          <Plus className="h-4 w-4" />
          Create Registration Form
        </button>
      </header>

      {/* SPORTS GRID (shows created registration forms only) */}
      {!currentGroup && (
        <section>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {visibleGroups.slice(0, 3).map((g) => (
              <SportCard
                key={g.sport}
                sport={g.sport}
                count={totalTeamsPerSport(g.sport)}
                onOpen={() => setSportOpen(g.sport)}
              />
            ))}
          </div>
          {visibleGroups.length > 3 && (
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {visibleGroups.slice(3).map((g) => (
                <SportCard
                  key={g.sport}
                  sport={g.sport}
                  count={totalTeamsPerSport(g.sport)}
                  onOpen={() => setSportOpen(g.sport)}
                />
              ))}
            </div>
          )}
          {visibleGroups.length === 0 && (
            <div className="mt-4 text-sm text-gray-500">
              No registration forms yet. Click <span className="font-medium">Create Registration Form</span> to start one.
            </div>
          )}
        </section>
      )}

      {/* TEAMS GRID */}
      {currentGroup && !openTeam && (
        <section className="space-y-4">
          <button
            onClick={() => setSportOpen(null)}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sports
          </button>

          <div>
            <h2 className="text-xl font-semibold text-gray-900">{currentGroup.sport}</h2>
            <p className="mt-1 text-sm text-gray-500">
              Teams registered for {currentGroup.sport}.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {currentGroup.teams.map((t) => (
              <TeamCard key={t.id} t={t} onOpen={setOpenTeamId} />
            ))}
          </div>
        </section>
      )}

      {/* MODAL (team details) */}
      {openTeam && currentGroup && (
        <TeamDetails
          team={openTeam}
          sport={currentGroup.sport}
          onClose={() => setOpenTeamId(null)}
          onSetStatus={setTeamStatus}
        />
      )}

      {/* MODAL (create registration) */}
      <CreateRegistrationModal
        open={createOpen}
        sports={groups.map((g) => g.sport)} // Basketball, Volleyball, Cheer and Dance
        onClose={() => setCreateOpen(false)}
        onCreate={({ sport, deadlineISO }) => {
          // Show newly created form in the grid
          setForms((prev) => (prev.includes(sport) ? prev : [...prev, sport]));
          console.log("Create Registration ->", { sport, deadlineISO });
          setCreateOpen(false);
        }}
      />
    </div>
  );
}