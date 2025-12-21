import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email("Correo electrónico inválido"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export const registerSchema = z.object({
    email: z.string().email("Correo electrónico inválido"),
    password: z.string()
        .min(8, "Mínimo 8 caracteres")
        .regex(/[A-Z]/, "Debe tener una mayúscula")
        .regex(/[a-z]/, "Debe tener una minúscula")
        .regex(/[0-9]/, "Debe tener un número")
        .regex(/[^A-Za-z0-9]/, "Debe tener un símbolo (@$!%*?&)"),
    confirmPassword: z.string(),
    terms: z.boolean().refine(val => val === true, {
        message: "Debes aceptar los términos y condiciones"
    }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
