"use client";

import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import TeamPlayersModal from "@components/modals/TeamPlayers"; // adjust path if needed

/* ========= Types ========= */
type DocStatus = "Pending" | "Verified" | "Flagged" | "Not Submitted";
type DocType =
  | "Birth Certificate"
  | "School Matriculation"
  | "School ID"
  | "Transcript of Grades"
  | "Medical Certificate";

type PlayerDoc = { type: DocType; url?: string; status: DocStatus };

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
  docs: PlayerDoc[];
};

type Team = {
  id: string;
  teamName: string;
  sport: string;
  schoolCode: string;
  schoolName: string;
  players: Player[];
};

type SchoolGroup = {
  schoolCode: string;
  schoolName: string;
  teams: Team[];
};

type SportGroup = {
  sport: string;
  schools: SchoolGroup[];
};

/* ========= Mock Data ========= */
const SEED: SportGroup[] = [
  {
    sport: "Basketball",
    schools: [
      {
        schoolCode: "NCF",
        schoolName: "Naga College Foundation",
        teams: [
          {
            id: "b-ncf-001",
            teamName: "NCF Tigers",
            sport: "Basketball",
            schoolCode: "NCF",
            schoolName: "Naga College Foundation",
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
                docs: [
                  { type: "Birth Certificate", status: "Verified", url: "#" },
                  { type: "School Matriculation", status: "Pending", url: "#" },
                  { type: "School ID", status: "Verified", url: "#" },
                  { type: "Transcript of Grades", status: "Pending", url: "#" },
                  { type: "Medical Certificate", status: "Flagged", url: "#" },
                ],
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
                docs: [
                  { type: "Birth Certificate", status: "Verified", url: "#" },
                  { type: "School Matriculation", status: "Verified", url: "#" },
                  { type: "School ID", status: "Pending", url: "#" },
                  { type: "Transcript of Grades", status: "Pending", url: "#" },
                  { type: "Medical Certificate", status: "Not Submitted" },
                ],
              },
            ],
          },
        ],
      },
      {
        schoolCode: "ADNU",
        schoolName: "Ateneo de Naga University",
        teams: [
          {
            id: "b-adnu-001",
            teamName: "ADNU Blue Knights",
            sport: "Basketball",
            schoolCode: "ADNU",
            schoolName: "Ateneo de Naga University",
            players: [
              {
                id: "p-003",
                name: "Miguel Cruz",
                yearCourse: "4th Year BSA",
                birthdate: "2003-02-14",
                jerseyNumber: 3,
                position: "SF",
                isBicolano: true,
                isTransferee: false,
                yearsPlayed: 2,
                docs: [
                  { type: "Birth Certificate", status: "Verified", url: "#" },
                  { type: "School Matriculation", status: "Verified", url: "#" },
                  { type: "School ID", status: "Verified", url: "#" },
                  { type: "Transcript of Grades", status: "Verified", url: "#" },
                  { type: "Medical Certificate", status: "Verified", url: "#" },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    sport: "Volleyball",
    schools: [
      {
        schoolCode: "ADNU",
        schoolName: "Ateneo de Naga University",
        teams: [
          {
            id: "v-adnu-001",
            teamName: "ADNU Lady Knights",
            sport: "Volleyball",
            schoolCode: "ADNU",
            schoolName: "Ateneo de Naga University",
            players: [
              {
                id: "p-101",
                name: "Maria Rivera",
                yearCourse: "4th Year BSA",
                birthdate: "2003-02-14",
                jerseyNumber: 3,
                position: "OH",
                isBicolano: true,
                isTransferee: false,
                yearsPlayed: 2,
                docs: [
                  { type: "Birth Certificate", status: "Verified", url: "#" },
                  { type: "School Matriculation", status: "Verified", url: "#" },
                  { type: "School ID", status: "Verified", url: "#" },
                  { type: "Transcript of Grades", status: "Verified", url: "#" },
                  { type: "Medical Certificate", status: "Verified", url: "#" },
                ],
              },
            ],
          },
        ],
      },
      {
        schoolCode: "USI",
        schoolName: "Universidad de Sta. Isabel",
        teams: [
          {
            id: "v-usi-001",
            teamName: "USI Spikers",
            sport: "Volleyball",
            schoolCode: "USI",
            schoolName: "Universidad de Sta. Isabel",
            players: [],
          },
        ],
      },
    ],
  },
];

/* ========= Card Component ========= */
function CardButton({
  title,
  label,
  count,
  cta,
  onClick,
}: {
  title: string;
  label: string;
  count: number;
  cta: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="text-left rounded-xl border bg-white shadow-sm p-5 hover:shadow-md transition"
    >
      <div className="text-lg font-semibold text-gray-900">{title}</div>
      <p className="mt-1 text-sm text-gray-500">{label}</p>
      <div className="mt-6 text-2xl font-bold text-gray-900">{count}</div>
      <div className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-[#071689] px-4 py-2.5 text-sm font-medium text-white">
        {cta}
      </div>
    </button>
  );
}


/* ========= Main Page Component ========= */
export default function PlayerScreeningPage() {
  const [groups] = useState<SportGroup[]>(SEED);
  const [sportOpen, setSportOpen] = useState<string | null>(null);
  const [schoolOpen, setSchoolOpen] = useState<string | null>(null);
  const [teamOpen, setTeamOpen] = useState<string | null>(null);

  // Per-player review state (front-end only)
  const [reviews, setReviews] = useState<Record<string, { status: ReviewStatus; note?: string }>>(
    {}
  );

  const currentSport = useMemo(
    () => groups.find((s) => s.sport === sportOpen) || null,
    [groups, sportOpen]
  );
  
  const currentSchool = useMemo(
    () => currentSport?.schools.find((s) => s.schoolCode === schoolOpen) || null,
    [currentSport, schoolOpen]
  );
  
  const currentTeam = useMemo(
    () => currentSchool?.teams.find((t) => t.id === teamOpen) || null,
    [currentSchool, teamOpen]
  );

  const teamCountInSport = (g: SportGroup) =>
    g.schools.reduce((sum, sch) => sum + sch.teams.length, 0);

  // Player review handlers
  const handleApprovePlayer = (playerId: string) => {
    setReviews((prev) => ({ 
      ...prev, 
      [playerId]: { status: "Approved" } 
    }));
  };

  const handleDeclinePlayer = (playerId: string, note: string) => {
    setReviews((prev) => ({ 
      ...prev, 
      [playerId]: { status: "Rejected", note } 
    }));
  };

  const handleCloseModal = () => {
    setTeamOpen(null);
  };

  return (
    <div className="space-y-6 pt-8">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-semibold text-gray-900">Player Screening</h1>
        <p className="mt-2 text-sm text-gray-500">
          You can view the Player Documents sent by different teams
        </p>
      </header>

      {/* Level 1: Sports */}
      {!currentSport && (
        <section>
          <h2 className="sr-only">Sports</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {groups.map((g) => (
              <CardButton
                key={g.sport}
                title={g.sport}
                label="Teams Registered"
                count={teamCountInSport(g)}
                cta="View Teams"
                onClick={() => {
                  setSportOpen(g.sport);
                  setSchoolOpen(null);
                  setTeamOpen(null);
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* Level 2: Schools */}
      {currentSport && !currentSchool && (
        <section className="space-y-4">
          <button
            onClick={() => {
              setSportOpen(null);
              setSchoolOpen(null);
              setTeamOpen(null);
            }}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sports
          </button>

          <div>
            <h2 className="text-xl font-semibold text-gray-900">{currentSport.sport}</h2>
            <p className="mt-1 text-sm text-gray-500">Select a school to view its teams.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {currentSport.schools.map((s) => (
              <CardButton
                key={s.schoolCode}
                title={s.schoolName}
                label="Teams Registered"
                count={s.teams.length}
                cta="View Teams"
                onClick={() => {
                  setSchoolOpen(s.schoolCode);
                  setTeamOpen(null);
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* Level 3: Teams */}
      {currentSport && currentSchool && !teamOpen && (
        <section className="space-y-4">
          <button
            onClick={() => {
              setSchoolOpen(null);
              setTeamOpen(null);
            }}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Schools
          </button>

          <div>
            <h2 className="text-xl font-semibold text-gray-900">{currentSchool.schoolName}</h2>
            <p className="mt-1 text-sm text-gray-500">Select a team to view its players.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {currentSchool.teams.map((t) => (
              <CardButton
                key={t.id}
                title={t.teamName}
                label="Players"
                count={t.players.length}
                cta="Open Player List"
                onClick={() => setTeamOpen(t.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Team Players Modal */}
      {currentTeam && (
        <TeamPlayersModal
          team={currentTeam}
          isOpen={!!currentTeam}
          onClose={handleCloseModal}
          reviews={reviews}
          onApprovePlayer={handleApprovePlayer}
          onDeclinePlayer={handleDeclinePlayer}
        />
      )}
    </div>
  );
}