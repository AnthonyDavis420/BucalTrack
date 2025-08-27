"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, Users } from "lucide-react";
import RegistrationTimeline from "@components/modals/RegistrationTimeline";

/* ========= Types ========= */
type ReviewStatus = "Draft" | "Pending" | "Approved" | "Rejected";

type TimelineEntry = {
  status: ReviewStatus;
  timestamp: string;
  actor: string;
  remarks?: string;
};

type Team = {
  id: string;
  teamName: string;
  schoolName: string;
  headCoach: string;
  coachEmail: string;
  submittedAt?: string;
  status: ReviewStatus;
  timeline: TimelineEntry[];
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
        teamName: "ADNU Blue Knights (Men’s)",
        schoolName: "Ateneo de Naga University",
        headCoach: "Coach Ana Lim",
        coachEmail: "ana.lim@adnu.edu",
        submittedAt: "2025-08-11 09:05",
        status: "Approved",
        timeline: [
          {
            status: "Draft",
            timestamp: "2025-08-09 15:20",
            actor: "Coach Ana Lim",
          },
          {
            status: "Pending",
            timestamp: "2025-08-10 10:05",
            actor: "Coach Ana Lim",
          },
          {
            status: "Approved",
            timestamp: "2025-08-11 09:05",
            actor: "League Admin",
          },
        ],
      },
      {
        id: "b-002",
        teamName: "ADNU Lady Knights (Women’s)",
        schoolName: "Ateneo de Naga University",
        headCoach: "Coach Carol Uy",
        coachEmail: "carol.uy@adnu.edu",
        submittedAt: "2025-08-12 14:40",
        status: "Pending",
        timeline: [
          {
            status: "Draft",
            timestamp: "2025-08-11 18:40",
            actor: "Coach Carol Uy",
          },
          {
            status: "Pending",
            timestamp: "2025-08-12 14:40",
            actor: "Coach Carol Uy",
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
        schoolName: "Ateneo de Naga University",
        headCoach: "Coach Rhea Dizon",
        coachEmail: "rhea.dizon@adnu.edu",
        submittedAt: "2025-08-10 15:10",
        status: "Approved",
        timeline: [
          {
            status: "Draft",
            timestamp: "2025-08-09 14:00",
            actor: "Coach Rhea Dizon",
          },
          {
            status: "Pending",
            timestamp: "2025-08-09 19:10",
            actor: "Coach Rhea Dizon",
          },
          {
            status: "Approved",
            timestamp: "2025-08-10 15:10",
            actor: "League Admin",
          },
        ],
      },
    ],
  },
  {
    sport: "Cheer and Dance",
    teams: [
      {
        id: "c-001",
        teamName: "ADNU Pep Squad",
        schoolName: "Ateneo de Naga University",
        headCoach: "Coach Bea Rivera",
        coachEmail: "bea.rivera@adnu.edu",
        submittedAt: "2025-08-12 16:25",
        status: "Draft",
        timeline: [
          {
            status: "Draft",
            timestamp: "2025-08-12 16:25",
            actor: "Coach Bea Rivera",
          },
        ],
      },
    ],
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
  const statusStyles: Record<ReviewStatus, string> = {
    Draft: "bg-gray-100 text-gray-800",
    Pending: "bg-yellow-100 text-yellow-800",
    Approved: "bg-green-100 text-green-800",
    Rejected: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${statusStyles[status]}`}
    >
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
          <div className="text-base font-semibold text-gray-900">
            {t.teamName}
          </div>
          <div className="mt-1 text-sm text-gray-500">
            Coach: {t.headCoach} ({t.coachEmail})
          </div>
        </div>
        <StatusBadge status={t.status} />
      </div>
      {t.submittedAt && (
        <div className="mt-2 text-xs text-gray-500">
          Submitted: {t.submittedAt}
        </div>
      )}
      <div className="mt-4 flex items-center justify-between">
        <Badge>{t.schoolName}</Badge>
        <div className="inline-flex items-center gap-2 text-sm text-gray-700">
          <Users className="h-4 w-4" />
          Team
        </div>
      </div>
      <div className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-[#071689] px-4 py-2.5 text-sm font-medium text-white">
        Submission Timeline
      </div>
    </button>
  );
}

/* ========= Page ========= */
export default function TeamRegistrationSchoolView() {
  const [groups] = useState<SportGroup[]>(SPORT_GROUPS);
  const [sportOpen, setSportOpen] = useState<string | null>(null);
  const [openTeamId, setOpenTeamId] = useState<string | null>(null);

  const currentGroup = useMemo(
    () => groups.find((g) => g.sport === sportOpen) || null,
    [groups, sportOpen]
  );
  const openTeam = useMemo(
    () =>
      currentGroup
        ? currentGroup.teams.find((t) => t.id === openTeamId) ?? null
        : null,
    [currentGroup, openTeamId]
  );

  return (
    <div className="space-y-6 pt-8">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            Team Registration Progress
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            View your school’s team registrations and their submission timeline.
          </p>
        </div>
      </header>

      {/* SPORTS GRID */}
      {!currentGroup && (
        <section>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {groups.map((g) => (
              <SportCard
                key={g.sport}
                sport={g.sport}
                count={g.teams.length}
                onOpen={() => setSportOpen(g.sport)}
              />
            ))}
          </div>
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
            <h2 className="text-xl font-semibold text-gray-900">
              {currentGroup.sport}
            </h2>
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

      {/* MODAL (Submission Timeline) */}
      {openTeam && currentGroup && (
        <RegistrationTimeline
          teamName={openTeam.teamName}
          sport={currentGroup.sport}
          timeline={openTeam.timeline}
          onClose={() => setOpenTeamId(null)}
        />
      )}
    </div>
  );
}
