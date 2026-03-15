import { Badge } from "@/components/ui/Badge";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--theme-bg-base)] p-8 md:p-16">
      <div className="max-w-3xl mx-auto">
        <Badge variant="outline" className="mb-6">Términos y Condiciones</Badge>
        <h1 className="text-4xl font-bold text-[var(--theme-text-primary)] mb-8">Términos y Condiciones</h1>
        
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-[var(--theme-text-secondary)]">
          <p>Al usar Saber Pro, aceptas los siguientes términos y condiciones.</p>
          
          <h2 className="text-xl font-bold text-[var(--theme-text-primary)]">Uso del servicio</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Debes tener al menos 13 años para registrarte</li>
            <li>Es responsabilidad tuya mantener segura tu cuenta</li>
            <li>No puedes compartir tu cuenta con otras personas</li>
          </ul>

          <h2 className="text-xl font-bold text-[var(--theme-text-primary)]">Contenido del curso</h2>
          <p>Todo el contenido de Saber Pro está protegido por derechos de autor. No está permitido reproducir o distribuir material sin autorización.</p>

          <h2 className="text-xl font-bold text-[var(--theme-text-primary)]">Pagos y suscripciones</h2>
          <p>Los pagos se procesan de forma segura. Puedes cancelar tu suscripción en cualquier momento desde tu panel de usuario.</p>

          <p className="text-sm text-[var(--theme-text-tertiary)] mt-8">
            Última actualización: {new Date().toLocaleDateString('es-CO')}
          </p>
        </div>
      </div>
    </div>
  );
}
