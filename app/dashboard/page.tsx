import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import { LogOut, User } from "lucide-react";
// Ensure this path matches where your ExperienceList component is located
import ExperienceList from "../dashboard/ExperienceList";

export default async function Dashboard() {
  const cookieStore = await cookies();
  const userSession = cookieStore.get("user_session");
  // Switch to standard Prisma import if you aren't using a custom output path
  const prisma = new PrismaClient().$extends(withAccelerate());

  if (!userSession) {
    redirect("/");
  }

  const user = JSON.parse(userSession.value);

  if (user.email !== "toto@toto.fr") {
    redirect("/");
  }

  // Fetch initial list from SQLite via Prisma
  // We rely on insertion order for now (rowid), or we could implement robust sorting.
  const experiences = await prisma.experience.findMany();

  const initialExperiences = experiences.map((exp) => ({
    id: exp.id,
    label: exp.label,
    role: exp.role,
    period: exp.period,
    location: exp.location,
    colorClass: exp.colorClass,
    activeColorClass: exp.activeColorClass,
  }));

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-black/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-zinc-900 dark:bg-zinc-100 rounded-full flex items-center justify-center text-white dark:text-black font-bold">
              {user.firstName[0]}
            </div>
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              Dashboard
            </span>
          </div>

          <a
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Déconnexion</span>
          </a>
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 sm:py-12 flex flex-col gap-12">
        {/* User Info Section */}
        <section className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Vos informations
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-500 font-semibold">
                Nom
              </span>
              <span className="text-gray-900 dark:text-gray-100 font-medium">
                {user.lastName}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-500 font-semibold">
                Prénom
              </span>
              <span className="text-gray-900 dark:text-gray-100 font-medium">
                {user.firstName}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-500 font-semibold">
                Email
              </span>
              <span className="text-gray-900 dark:text-gray-100 font-medium">
                {user.email}
              </span>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Mon Parcours
            </h2>
            <div className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
              {experiences.length} missions
            </div>
          </div>

          <ExperienceList initialExperiences={initialExperiences} />
        </section>
      </main>
    </div>
  );
}
