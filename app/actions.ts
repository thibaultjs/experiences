'use server'

import { FormDataSchema } from './schema';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

type Inputs = z.infer<typeof FormDataSchema>;

export async function submitForm(data: Inputs) {
  const result = FormDataSchema.safeParse(data);

  if (!result.success) {
    return { success: false, message: 'Invalid data', errors: result.error.flatten().fieldErrors };
  }

  // Simulate a delay or database operation
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  console.log('Server Action received data:', result.data);

  // Store user data in a cookie
  (await cookies()).set('user_session', JSON.stringify(result.data), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  });
  
  // Navigate to the dashboard
  redirect('/dashboard');
}
