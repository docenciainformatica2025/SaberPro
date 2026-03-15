"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ContactPage() {
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success("Mensaje enviado", {
      description: "Te responderemos en breve."
    });
    setSending(false);
  };

  return (
    <div className="min-h-screen bg-[var(--theme-bg-base)] p-8 md:p-16">
      <div className="max-w-3xl mx-auto">
        <Badge variant="outline" className="mb-6">Contacto</Badge>
        <h1 className="text-4xl font-bold text-[var(--theme-text-primary)] mb-4">Escríbenos</h1>
        <p className="text-[var(--theme-text-secondary)] mb-8">
          ¿Tienes preguntas? Estamos aquí para ayudarte.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card variant="glass" className="p-6 flex items-center gap-4">
            <div className="p-3 bg-brand-primary/10 rounded-xl text-brand-primary">
              <Mail size={24} />
            </div>
            <div>
              <p className="font-bold text-[var(--theme-text-primary)]">Email</p>
              <p className="text-sm text-[var(--theme-text-secondary)]">soporte@saberpro.com</p>
            </div>
          </Card>

          <Card variant="glass" className="p-6 flex items-center gap-4">
            <div className="p-3 bg-green-500/10 rounded-xl text-green-500">
              <MessageCircle size={24} />
            </div>
            <div>
              <p className="font-bold text-[var(--theme-text-primary)]">WhatsApp</p>
              <p className="text-sm text-[var(--theme-text-secondary)]">+57 300 123 4567</p>
            </div>
          </Card>
        </div>

        <Card variant="glass" className="p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-[var(--theme-text-primary)] mb-2">Nombre</label>
              <input 
                type="text" 
                required
                className="w-full p-3 rounded-xl border border-[var(--theme-border-soft)] bg-[var(--theme-bg-surface)] text-[var(--theme-text-primary)]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[var(--theme-text-primary)] mb-2">Email</label>
              <input 
                type="email" 
                required
                className="w-full p-3 rounded-xl border border-[var(--theme-border-soft)] bg-[var(--theme-bg-surface)] text-[var(--theme-text-primary)]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[var(--theme-text-primary)] mb-2">Mensaje</label>
              <textarea 
                required
                rows={4}
                className="w-full p-3 rounded-xl border border-[var(--theme-border-soft)] bg-[var(--theme-bg-surface)] text-[var(--theme-text-primary)]"
              />
            </div>
            <Button type="submit" variant="primary" disabled={sending} className="w-full">
              {sending ? "Enviando..." : "Enviar Mensaje"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
