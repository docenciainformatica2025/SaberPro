# Manual de Identidad de Marca - SaberPro

> **Versión 2.0** - Actualizado 2025 (Edición Gold Premium)
> **Aplicación:** Simulador Premium de Pruebas de Estado

---

## 1. Esencia de la Marca

### 1.1 Misión
Proporcionar a los estudiantes universitarios de Colombia una herramienta de preparación de "clase mundial", combinando tecnología avanzada (IA) con una estética premium que inspire excelencia y profesionalismo desde el primer clic.

### 1.2 Visión
Ser la plataforma líder indiscutible en preparación para pruebas de estado en Latinoamérica, reconocida no solo por su efectividad pedagógica sino por su experiencia de usuario superior.

### 1.3 Valores
- **Victoria:** "El estudiante no quiere seguridad, quiere ganar." (Oro/Negro).
- **Elite:** Diseño minimalista y sofisticado.
- **Atemporalidad:** Estética oscura metálica que perdura.

---

## 2. Identidad Visual (Refinamiento Gold)

### 2.1 El Monograma "S" Geométrico
El isotipo no es una letra común; es un monograma geométrico con cortes diagonales (45°) que sugieren "progreso" y "ascenso".

- **Construcción:** SVG plano sobre fondo negro (`#0A0C0F`).
- **Efecto Premium:** El brillo dorado **NO** está en el SVG base. Se genera mediante CSS (`bg-gradient-to-br`) en el contenedor para lograr un efecto metálico vivo en pantalla.
- **Activos Maestros:**
    - **[Favicon / Icono Base](./assets/icon.svg)** (Uso general y metadatos).
    - **Componente React:** `<Logo />` (Responsable de renderizar sombras y gradientes dinámicos).

### 2.2 Tipografía de Marca
- **Fuente:** Geist Sans (Bold / Black).
- **Tratamiento:** "Tracking amplio" (`tracking-[0.2em]`) en textos auxiliares ("PRO") para denotar lujo y elegancia corporativa.

### 2.2 Paleta de Colores "Metallic Premium"

Nuestra paleta se aleja de los colores planos tradicionales de la educación (azules y rojos básicos) para abrazar una estética oscura, metálica y sofisticada.

#### Colores Primarios
| Nombre | Valor RGB | Hex (aprox) | Uso |
| :--- | :--- | :--- | :--- |
| **Metal Gold** | `212, 175, 55` | `#D4AF37` | Color de acento principal. Botones CTA, Badges, "Pro". |
| **Metal Black** | `10, 12, 15` | `#0A0C0F` | Fondos principales. Profundidad absoluta. |
| **Metal Dark** | `25, 30, 35` | `#191E23` | Fondos de tarjetas y secciones secundarias. |

#### Colores Secundarios
| Nombre | Valor RGB | Hex (aprox) | Uso |
| :--- | :--- | :--- | :--- |
| **Metal Silver** | `229, 228, 226`| `#E5E4E2` | Texto principal, bordes sutiles, iconos inactivos. |
| **Metal Blue** | `70, 130, 180` | `#4682B4` | Acentos de información, analíticas, gráficas. |
| **Metal Copper** | `184, 115, 51` | `#B87333` | Alertas no críticas, estados intermedios. |

### 2.3 Tipografía

Utilizamos la familia tipográfica **Geist** por su modernidad, legibilidad en pantallas y carácter técnico pero humano.

- **Geist Sans:** Para títulos, cuerpos de texto e interfaz general.
- **Geist Mono:** Para datos numéricos, códigos, o elementos técnicos específicos.

**Jerarquía:**
- **H1 (Hero):** 5xl - 7xl, Font Black, Tracking Tighter.
- **H2 (Secciones):** 4xl - 6xl, Font Bold.
- **Cuerpo:** Base / Largue, Font Medium, colores Metal Silver.
- **Microcopy (Legales/Footer):** XS / XXS, Uppercase, Tracking Widest.

---

## 3. UI & Sistema de Diseño

### 3.1 Botones
El botón no es solo un control, es una invitación a la acción.

- **Botón Premium (Primario):**
  - Fondo: Gradiente Oro (Metal Gold -> Yellow-600).
  - Texto: Negro (Black).
  - Estilo: Texto en mayúsculas, tracking amplio (`tracking-widest`), font Black.
  - Efecto: `shadow-[0_0_20px_rgba(212,175,55,0.3)]` (Resplandor dorado).

- **Botón Ghost (Secundario):**
  - Fondo: Transparente.
  - Texto: Metal Silver -> Hover White.
  - Estilo: Minimalista, sutil.

### 3.2 Tarjetas (Glassmorphism)
Las tarjetas flotan sobre el fondo oscuro.
- **Fondo:** `bg-white/[0.02]` (extremadamente sutil).
- **Borde:** `border-white/5` (casi imperceptible).
- **Efecto:** `backdrop-blur` si es necesario solapamiento.

### 3.3 Iconografía
Usamos **Lucide React** con trazos finos (`stroke-width={1.5}` o `2`) para mantener la elegancia.
- Los iconos suelen ir encapsulados en cuadrados con esquinas redondeadas (`rounded-xl`) y fondos tenues.

---

## 4. Tono de Voz y Comunicación

### 4.1 Personalidad
- **Empoderadora:** "Domina tu futuro", "Entrena como un profesional".
- **Directa:** Sin rodeos pedagógicos innecesarios. Vamos al grano.
- **Exclusiva:** Hacemos sentir al usuario parte de un club selecto de alto rendimiento.

### 4.2 Reglas de Escritura
- Usar la segunda persona ("Tú", "Tu perfil") para conectar.
- Evitar jerga académica aburrida. Reemplazar "Evaluación" por "Entrenamiento" o "Reto".
- **Call to Action (CTA):** Siempre verbos de poder en imperativo ("Comenzar", "Acceder", "Potenciar").

---

## 5. Aplicación Legal y Créditos

### 5.1 Copyright Dinámico
Todos los pies de página deben usar el año actual dinámicamente.
> *© [Año Actual] Saber Pro Suite. Todos los derechos reservados.*

### 5.2 Firma del Desarrollador
Reconocimiento sutil pero visible en Landing y Footer.
> *Desarrollado por Ing. Antonio Rodríguez*

### 5.3 Contacto
Canal único y oficial de soporte:
> *✉️ docenciainformatica2025@gmail.com*
