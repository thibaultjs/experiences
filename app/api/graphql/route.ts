import { createSchema, createYoga } from "graphql-yoga";
import prisma from "@/lib/prisma";

const typeDefs = /* GraphQL */ `
  type Experience {
    id: String!
    label: String
    role: String
    period: String
    location: String
    details: [String]
    techStack: String
  }

  type Query {
    experience(id: String!): Experience
    experiences: [Experience]
  }
`;

const resolvers = {
  Query: {
    experience: async (_: unknown, { id }: { id: string }) => {
      const exp = await prisma.experience.findUnique({
        where: { id },
        include: { details: true },
      });
      if (!exp) return null;
      return {
        ...exp,
        details: exp.details.map((d: { text: string }) => d.text),
      };
    },
    experiences: async () => {
      const exps = await prisma.experience.findMany({
        include: { details: true },
        orderBy: { period: "desc" }, // Optional: order by period logic if needed, but strings are trickier
      });
      // Sort manually or rely on DB order. The string format "10/2024" is not good for SQL ordering.
      // I'll leave ordering natural for now or replicate the array order if possible?
      // The DB doesn't guarantee order.
      // With the current string dates, I can't easily sort in SQL.

      return exps.map((exp: any) => ({
        ...exp,
        details: exp.details.map((d: any) => d.text),
      }));
    },
  },
};

const schema = createSchema({
  typeDefs,
  resolvers,
});

const { handleRequest } = createYoga({
  schema,
  graphqlEndpoint: "/api/graphql",
  fetchAPI: { Response },
});

export const GET = handleRequest as any;
export const POST = handleRequest as any;
