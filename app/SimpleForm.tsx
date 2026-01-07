"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { submitForm } from "./actions";
import { FormDataSchema, Inputs } from "./schema";

export default function SimpleForm() {
  const [status, setStatus] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(FormDataSchema),
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setStatus("Submitting...");
    try {
      // The server action will handle the redirect on success
      const result = await submitForm(data);

      // If we are here, it means there was no redirect (so likely an error handled by return)
      if (result && !result.success) {
        setStatus(result.message as string);
      }
    } catch (error) {
      // Check if it is not a redirect error (although safeParse handles logic errors, redirect throws)
      // Actually redirect() throws a NEXT_REDIRECT error which is caught by Next.js boundaries mostly, 
      // but in client component await it might appear.
      // However, usually it just works. But safe to log just in case.
      console.error("Error or Redirect:", error);
    }
  };

  return (
    <div className="w-full max-w-md p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
        Simple Form
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            First Name
          </label>
          <input
            id="firstName"
            {...register("firstName")}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white dark:bg-zinc-700 text-black dark:text-white"
          />
          {errors.firstName && (
            <span className="text-red-500 text-xs">{errors.firstName.message}</span>
          )}
        </div>

        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Last Name
          </label>
          <input
            id="lastName"
            {...register("lastName")}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white dark:bg-zinc-700 text-black dark:text-white"
          />
          {errors.lastName && (
            <span className="text-red-500 text-xs">{errors.lastName.message}</span>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white dark:bg-zinc-700 text-black dark:text-white"
          />
          {errors.email && (
            <span className="text-red-500 text-xs">{errors.email.message}</span>
          )}
        </div>

        <input
          type="submit"
          disabled={!!status && status === "Submitting..."}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer disabled:opacity-50"
        />
        {status && (
          <p className="text-center mt-4 text-sm font-medium text-gray-600 dark:text-gray-400">
            {status}
          </p>
        )}
      </form>
    </div>
  );
}
