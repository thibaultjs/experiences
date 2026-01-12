"use client";

import { useState } from "react";
import {
  ChevronDown,
  MapPin,
  Calendar,
  Clock,
  Loader2,
  ChevronRight,
} from "lucide-react";

export interface Experience {
  id: string;
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
    // If we're on desktop, we might want different behavior,
    // but toggling logic remains similar: activate one, close others?
    // For "Flag Gun" logic, we definitely want only one active at a time usually.
    // Master-detail pattern usually implies one active.

    // Check if we are clicking the already expanded one
    const isExpanding = expandedId !== id;

    // On desktop, we might want to allow closing, or maybe always keep one open?
    // Let's stick to toggle for now.
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

  // Active Experience Data for Desktop View
  const activeExperience = initialExperiences.find((e) => e.id === expandedId);
  const activeDetails = expandedId ? dataCache[expandedId] : null;

  return (
    <div className="w-full mt-8">
      {/* 
        LAYOUT STRATEGY:
        Mobile: Standard Flex Col (original behavior)
        Desktop (md+): Grid with 2 columns. Left = List, Right = Details Panel
      */}
      <div className="flex flex-col md:grid md:grid-cols-12 md:gap-6 lg:gap-8 items-start">
        {/* LEFT COLUMN: List of Items */}
        <div className="flex flex-col gap-4 w-full md:col-span-4 lg:col-span-4">
          {initialExperiences.map((exp) => {
            const isExpanded = expandedId === exp.id;
            const colorBase = exp.colorClass.split(" ")[0];
            const duration = calculateDuration(exp.period);

            return (
              <div
                key={exp.id}
                className={`
                  bg-white dark:bg-zinc-900 rounded-xl shadow-sm border transition-all duration-200 overflow-hidden
                  ${
                    isExpanded
                      ? "border-zinc-300 dark:border-zinc-700 ring-1 ring-zinc-200 dark:ring-zinc-800 shadow-md md:border-r-4 md:border-r-indigo-500 md:translate-x-2"
                      : "border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                  }
                `}
              >
                {/* Clickable Header Area */}
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
                  className="w-full text-left p-0 flex flex-col items-stretch cursor-pointer outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                >
                  {/* Decorative Bar (Mobile/Desktop consistent) */}
                  <div
                    className={`h-2 w-full md:h-1 flex-shrink-0 ${colorBase}`}
                  />

                  <div className="flex-1 p-4 flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight">
                        {exp.label}
                      </h3>
                      {/* Mobile Only Chevron */}
                      <div className="md:hidden text-gray-400">
                        <ChevronDown
                          className={`w-5 h-5 transition-transform duration-300 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                      {/* Desktop Only Chevron (pointing right) */}
                      <div className="hidden md:block text-gray-400">
                        {isExpanded && (
                          <ChevronRight className="w-5 h-5 text-indigo-500" />
                        )}
                      </div>
                    </div>

                    <p className="text-indigo-600 dark:text-indigo-400 font-medium text-sm">
                      {exp.role}
                    </p>

                    {/* Meta info: Compact on Desktop List */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{exp.period}</span>
                      </div>

                      {duration && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                          <Clock className="w-3 h-3" />
                          {duration}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* MOBILE ONLY: Accordion Body (Hidden on Desktop) */}
                <div
                  className={`md:hidden transition-all duration-300 ease-in-out ${
                    isExpanded
                      ? "max-h-[1000px] opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-5 pb-5 pt-2 border-t border-dashed border-gray-100 dark:border-zinc-800">
                    <DetailsContent
                      isLoading={loadingId === exp.id}
                      detailsData={dataCache[exp.id]}
                      colorBase={colorBase}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT COLUMN: Desktop Details Panel (Sticky) */}
        <div className="hidden md:block md:col-span-8 lg:col-span-8 sticky top-24">
          {activeExperience ? (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-in fade-in slide-in-from-left-4 duration-300">
              <div
                className={`h-3 w-full ${
                  activeExperience.colorClass.split(" ")[0]
                }`}
              ></div>
              <div className="p-8">
                <div className="mb-6 pb-6 border-b border-zinc-100 dark:border-zinc-800 flex items-start justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                      {activeExperience.label}
                    </h2>
                    <h3 className="text-xl text-indigo-600 dark:text-indigo-400 font-medium">
                      {activeExperience.role}
                    </h3>
                  </div>
                  <div className="text-right text-sm text-gray-500 flex flex-col gap-1 items-end">
                    <span className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800 px-3 py-1 rounded-full">
                      <MapPin className="w-4 h-4" /> {activeExperience.location}
                    </span>
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> {activeExperience.period}
                    </span>
                  </div>
                </div>

                <DetailsContent
                  isLoading={loadingId === activeExperience.id}
                  detailsData={dataCache[activeExperience.id]}
                  colorBase={activeExperience.colorClass.split(" ")[0]}
                />
              </div>
            </div>
          ) : (
            <div className="h-[200px] flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
              <p>Sélectionnez une expérience pour voir les détails</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Sub-component for rendering the actual details text
function DetailsContent({
  isLoading,
  detailsData,
  colorBase,
}: {
  isLoading: boolean;
  detailsData?: FetchedDetails;
  colorBase: string;
}) {
  if (isLoading) {
    return (
      <div className="flex w-full min-h-[100px] items-center justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!detailsData) {
    return (
      <div className="py-4 text-gray-400 text-center text-sm">
        Cliquez pour charger les détails...
      </div>
    );
  }

  return (
    <>
      <ul className="grid grid-cols-1 gap-4">
        {detailsData.details?.map((point, index) => (
          <li
            key={index}
            className="flex items-start gap-4 text-gray-700 dark:text-gray-300 text-base leading-relaxed"
          >
            <span
              className={`mt-2 min-w-[8px] min-h-[8px] rounded-full flex-shrink-0 ${colorBase}`}
            />
            <span>{point}</span>
          </li>
        ))}
      </ul>

      {detailsData.techStack && (
        <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
            Stack Technique
          </h4>
          <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 group hover:border-indigo-200 dark:hover:border-indigo-900 transition-colors">
            <p className="font-mono text-sm leading-relaxed text-gray-800 dark:text-gray-200">
              {detailsData.techStack}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
