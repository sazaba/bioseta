"use server";

import { prisma } from "../lib/prisma";
import { compare } from "bcryptjs";
import { createSession, logout } from "@/lib/session";
import { redirect } from "next/navigation";

// Definimos la interfaz para que TypeScript sepa qué es 'FormState'
interface FormState {
  error?: string;
}

// Nota: Aquí ya podemos usar los tipos ': FormState' y ': FormData' porque es un archivo .ts
export async function loginAction(prevState: FormState | undefined, formData: FormData) {
  
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Por favor completa todos los campos." };
  }

  try {
    // 1. Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // 2. Verificar contraseña
    if (!user || !(await compare(password, user.password))) {
      return { error: "Credenciales inválidas." };
    }

    // 3. Crear sesión
    await createSession(user.id.toString());
    
  } catch (error) {
    return { error: "Error en el servidor. Intenta de nuevo." };
  }
  
  // 4. Redirigir
  redirect("/admin/dashboard");
}

export async function logoutAction() {
  await logout();
  redirect("/admin/login");
}