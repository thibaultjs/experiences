"use client";

import { useState } from "react";
import { ChevronDown, MapPin, Calendar, Clock, Loader2 } from "lucide-react";

export interface Experience {
  id: string; // Changed to string to be more generic since data comes from server
  label: string;
  role: string;
  period: string;
  location: string;
  colorClass: string;
  activeColorClass: string;
}

interface FetchedDetails {
  details: string[];
  techStack?: string;
}

interface ExperienceListProps {
  initialExperiences: Experience[];
}

const calculateDuration = (period: string) => {
  if (!period) return "";
  const parts = period.split("-").map((s) => s.trim());
  if (parts.length === 1) return "1 mois";
  const [startRaw, endRaw] = parts;
  const parse = (s: string) => {
    const [m, y] = s.split("/").map(Number);
    return y * 12 + m;
  };
  const startMonths = parse(startRaw);
  const endMonths = parse(endRaw);
  const diff = endMonths - startMonths + 1;
  if (diff <= 0) return "";
  const years = Math.floor(diff / 12);
  const months = diff % 12;
  const out = [];
  if (years > 0) out.push(`${years} an${years > 1 ? "s" : ""}`);
  if (months > 0) out.push(`${months} mois`);
  return out.join(" ");
};

export default function ExperienceList({
  initialExperiences,
}: ExperienceListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [dataCache, setDataCache] = useState<Record<string, FetchedDetails>>(
    {}
  );
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const fetchDetails = async (id: string) => {
    if (dataCache[id]) return;

    setLoadingId(id);
    try {
      const res = await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            query GetDetails($id: String!) {
              experience(id: $id) {
                details
                techStack
              }
            }
          `,
          variables: { id },
        }),
      });
      const json = await res.json();
      if (json.data?.experience) {
        setDataCache((prev) => ({
          ...prev,
          [id]: {
            details: json.data.experience.details,
            techStack: json.data.experience.techStack,
          },
        }));
      }
    } catch (error) {
      console.error("Failed to fetch details", error);
    } finally {
      setLoadingId(null);
    }
  };

  const toggleExp = (id: string) => {
    const isExpanding = expandedId !== id;
    setExpandedId(isExpanding ? id : null);

    if (isExpanding && !dataCache[id]) {
      fetchDetails(id);
    }
  };

  if (!initialExperiences || initialExperiences.length === 0) {
    return (
      <div className="text-gray-500 mt-8">Aucune expérience à afficher.</div>
    );
  }

  return (
    <div className="w-full max-w-4xl mt-8 flex flex-col gap-4">
      {initialExperiences.map((exp) => {
        const isExpanded = expandedId === exp.id;
        const colorBase = exp.colorClass.split(" ")[0];
        const duration = calculateDuration(exp.period);
        const detailsData = dataCache[exp.id];
        const isLoading = loadingId === exp.id;

        return (
          <div
            key={exp.id}
            className={`bg-white dark:bg-zinc-900 rounded-xl shadow-sm border transition-all duration-300 overflow-hidden ${
              isExpanded
                ? "border-zinc-300 dark:border-zinc-700 ring-1 ring-zinc-200 dark:ring-zinc-800 shadow-md transform scale-[1.01]"
                : "border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700"
            }`}
          >
            <div
              role="button"
              tabIndex={0}
              onClick={() => toggleExp(exp.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleExp(exp.id);
                }
              }}
              className="w-full text-left p-0 flex flex-col sm:flex-row items-stretch cursor-pointer outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <div className={`w-2 sm:w-3 flex-shrink-0 ${colorBase}`} />

              <div className="flex-1 p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-col">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    {exp.label}
                    {isExpanded && (
                      <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                        Active
                      </span>
                    )}
                  </h3>
                  <p className="text-indigo-600 dark:text-indigo-400 font-medium text-sm md:text-base">
                    {exp.role}
                  </p>
                </div>

                <div className="flex flex-col items-start sm:items-end text-sm text-gray-500 dark:text-gray-400 gap-1 min-w-[140px]">
                  {duration && (
                    <span className="mb-1.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800">
                      <Clock className="w-3 h-3" />
                      {duration}
                    </span>
                  )}
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>{exp.period}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    <span>{exp.location}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 flex items-center justify-center text-gray-400">
                <ChevronDown
                  className={`w-6 h-6 transition-transform duration-300 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>

            <div
              className={`transition-all duration-300 ease-in-out ${
                isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="px-5 pb-5 sm:px-8 sm:pb-8 pt-2">
                <div className="pt-6 border-t border-dashed border-gray-200 dark:border-zinc-800 min-h-[100px]">
                  {isLoading ? (
                    <div className="flex w-full h-full items-center justify-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                    </div>
                  ) : detailsData ? (
                    <>
                      <ul className="grid grid-cols-1 gap-3">
                        {detailsData.details?.map((point, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-3 text-gray-700 dark:text-gray-300 text-base leading-relaxed"
                          >
                            <span
                              className={`mt-2 min-w-[6px] min-h-[6px] rounded-full flex-shrink-0 ${colorBase.replace(
                                "bg-",
                                "bg-"
                              )}`}
                            />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>

                      {detailsData.techStack && (
                        <div className="mt-6">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                            Stack Technique
                          </h4>
                          <div className="bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800">
                            <p className="font-mono text-xs md:text-sm text-gray-800 dark:text-gray-200">
                              {detailsData.techStack}
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="py-4 text-gray-400 text-center text-sm">
                      Chargement des détails...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
