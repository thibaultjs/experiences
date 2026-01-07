import { PrismaClient } from "@prisma/client";

const experiencesData = [
  {
    id: "ekwateur",
    label: "Ekwateur",
    role: "Senior Web Developer",
    period: "10/2024 - 12/2025",
    location: "Paris",
    colorClass:
      "bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800",
    activeColorClass: "bg-green-800 dark:bg-green-900",
    details: [
      "Maintenance et évolutions majeures sur le parcours de souscription",
      "Evolutions sur le design system maison",
      "Création d'une solution SaaS de parcours de souscription pour fournisseurs d'énergie avec gestion de rachat de surplus",
    ],
    techStack: "React18, React19, Redux, React Query, i18n, Vitest, RHF...",
  },
  {
    id: "dior",
    label: "Christian Dior Couture",
    role: "Senior Web Developer",
    period: "11/2021 - 08/2024",
    location: "Paris",
    colorClass:
      "bg-gray-800 hover:bg-gray-900 dark:bg-zinc-700 dark:hover:bg-zinc-600",
    activeColorClass: "bg-gray-900 dark:bg-zinc-800",
    details: [
      "Intégration de 2 équipes distinctes, le checkout (tunnel de paiement) puis le catalogue (homepage + pages produits)",
      "Participation au revamp de la homepage avec réalisation from scratch de composants visuels (images, videos, packshots, ...) animés avec Framer Motion",
      "Reskin de nombreux composants legacy passés sous MaterialUI en s'appuyant sur un nouveau Design System maison",
      "Maintenance et évolutions sur le tunnel d'achat d'une application complexe (mono-repo) avec partage de librairies internes",
    ],
    techStack:
      "React18, Next13, graphQL (Apollo), REST, GooglePay, ApplePay, Paypal, MaterialUI, Framer Motion...",
  },
  {
    id: "ing",
    label: "ING France",
    role: "Web Developer",
    period: "05/2020 - 11/2021",
    location: "Paris",
    colorClass:
      "bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700",
    activeColorClass: "bg-orange-700 dark:bg-orange-800",
    details: [
      "Intégration d'une équipe existante (orientée back) en tant qu'expert Javascript Front",
      "Réalisation d'un parcours de souscription à l'assurance vie",
      "Mise à jour de profil investisseur en Web Components (LitElement)",
      "Développement d'une application pour chaque projet et d'une librairie publiée sur npm et partagée par lesdits projets",
    ],
  },
  {
    id: "lefebvre",
    label: "Editions Francis Lefebvre",
    role: "Web Developer",
    period: "09/2019 - 03/2020",
    location: "Paris",
    colorClass:
      "bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800",
    activeColorClass: "bg-red-800 dark:bg-red-900",
    details: [
      "Réalisation à partir de zéro de la nouvelle version du site d'actualité légale 'La Quotidienne'",
      "Optimisation pour un affichage ultra-rapide",
      "Collaboration avec les équipes existantes (devops, charges des différents microservices...)",
      "Front: React 16 100% hooks, Typescript, React-router, new Context API, Bootstrap 4",
      "Back: API en Node.js - Express pour centraliser et optimiser les appels aux microservices",
    ],
  },
  {
    id: "quos",
    label: "Quos",
    role: "Web Developer",
    period: "02/2019 - 09/2019",
    location: "Paris",
    colorClass:
      "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700",
    activeColorClass: "bg-blue-700 dark:bg-blue-800",
    details: [
      "Réalisation à partir de zéro d'une application de gestion de mobilier urbain connecté",
      "Front: React 16, React-router, new Context API, Lingui, Bootstrap 4, socket.io, cartographie Leaflet",
      "Back: Node.js avec Express, authentification JWT, RESTful API, validation JSON Schema (AJV)",
      "BDD en PostgreSQL avec Knex",
    ],
  },
  {
    id: "accenta",
    label: "Accenta",
    role: "Web Developer",
    period: "02/2018 - 09/2019",
    location: "Paris",
    colorClass:
      "bg-cyan-500 hover:bg-cyan-600 dark:bg-cyan-600 dark:hover:bg-cyan-700",
    activeColorClass: "bg-cyan-700 dark:bg-cyan-800",
    details: [
      "Réalisation à partir de zéro d'une application d'optimisation du dimensionnement des systèmes thermiques dans le bâtiment",
      "Conception en collaboration avec le client",
      "Front: React 16, React-router, new Context API, Lingui, Bootstrap 4",
      "Back: Node.js avec Express, validation JSON Schema (AJV), BDD MySQL avec Knex",
    ],
  },
  {
    id: "monsieurtshirt",
    label: "Monsieur Tshirt",
    role: "Web Developer",
    period: "06/2018 - 09/2018",
    location: "Paris",
    colorClass:
      "bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700",
    activeColorClass: "bg-indigo-700 dark:bg-indigo-800",
    details: [
      "Réalisation de la déclinaison desktop de la refonte de monsieurtshirt.com",
      "Mutualisation de code entre la version desktop et mobile",
      "Refactoring en composants de comportement et fonctions de render pures",
      "Stack: React 16, GraphQL, PostCSS, new Context API, react-grid-system",
    ],
  },
  {
    id: "fred",
    label: "Fred de la compta",
    role: "Web Developer",
    period: "04/2018 - 06/2018",
    location: "Paris",
    colorClass:
      "bg-teal-500 hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700",
    activeColorClass: "bg-teal-700 dark:bg-teal-800",
    details: [
      "Réalisation de la nouvelle homepage pour les entreprises et évolutions sur des écrans à haute valeur business",
      "Application des best practices sur la stack existante (React 16.4, redux, flow, Antd)",
      "Corrections de bugs dans l'existant, ajouts de nouvelles fonctionnalités",
    ],
  },
  {
    id: "ofosarl",
    label: "Creation Officielle de OFO SARL",
    role: "Web Developer",
    period: "01/2018",
    location: "Paris",
    colorClass:
      "bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700",
    activeColorClass: "bg-purple-700 dark:bg-purple-800",
    details: [
      "Studio de développeurs composé de trois gérants principaux",
      "Objectif de réaliser les projets de ses clients dans les règles de l'Art",
      "Veille technologique poussée",
    ],
  },
  {
    id: "ofo",
    label: "OFO SARL",
    role: "Web Developer",
    period: "09/2017 - 04/2018",
    location: "Paris",
    colorClass:
      "bg-violet-500 hover:bg-violet-600 dark:bg-violet-600 dark:hover:bg-violet-700",
    activeColorClass: "bg-violet-700 dark:bg-violet-800",
    details: [
      "Formation intensive et renforcement des connaissances sous mentorat d'un expert FullStack Javascript",
      "Technologies modernes de développement Web (Node, angularJS, React, postgreSQL...)",
    ],
  },
  {
    id: "mcway",
    label: "McWay Consulting SAS",
    role: "International Business Developer",
    period: "12/2011 - 01/2018",
    location: "Paris",
    colorClass:
      "bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700",
    activeColorClass: "bg-yellow-700 dark:bg-yellow-800",
    details: [
      "Création et exploitation d'une S.A.S de consulting spécialisée sur le marché international civil et militaire de la simulation de véhicules aériens et terrestres",
    ],
  },
];

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding ...");

  for (const exp of experiencesData) {
    const { details, ...rest } = exp;
    const experience = await prisma.experience.upsert({
      where: { id: exp.id },
      update: {},
      create: {
        ...rest,
        details: {
          create: details.map((text) => ({
            text,
          })),
        },
      },
    });
    console.log(`Created experience with id: ${experience.id}`);
  }

  console.log("Seeding finished.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
