import { Badge } from "@/components/ui/Badge";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--theme-bg-base)] p-8 md:p-16">
      <div className="max-w-3xl mx-auto">
        <Badge variant="outline" className="mb-6">Política de Privacidad</Badge>
        <h1 className="text-4xl font-bold text-[var(--theme-text-primary)] mb-8">Política de Privacidad</h1>
        
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-[var(--theme-text-secondary)]">
          <p>En Saber Pro, valoramos tu privacidad. Esta política describe cómo recopilamos, usamos y protegemos tu información personal.</p>
          
          <h2 className="text-xl font-bold text-[var(--theme-text-primary)]">Información que recopilamos</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Información de cuenta (email, nombre)</li>
            <li>Datos de progreso académico</li>
            <li>Información de pago (procesada de forma segura)</li>
          </ul>

          <h2 className="text-xl font-bold text-[var(--theme-text-primary)]">Cómo usamos tu información</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Personalizar tu experiencia de estudio</li>
            <li>Mejorar nuestros servicios</li>
            <li>Enviar actualizaciones importantes</li>
          </ul>

          <p className="text-sm text-[var(--theme-text-tertiary)] mt-8">
            Última actualización: {new Date().toLocaleDateString('es-CO')}
          </p>
        </div>
      </div>
    </div>
  );
}
