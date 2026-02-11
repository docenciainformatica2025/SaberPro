
# ☁️ Cloudflare Turnstile: Configuración de Producción

Hemos integrado **Turnstile** en modo de prueba (Sandbox). Para activar la protección real contra bots, sigue estos pasos:

1.  **Obtener Llaves:**
    *   Ve a [Cloudflare Dashboard](https://dash.cloudflare.com/) > Turnstile.
    *   Haz clic en el botón azul **"Add widget"**.
    *   **Domain:** `saber-pro-one.vercel.app` (y `localhost` para pruebas).
    *   Copia tu **Site Key**.

2.  **Activar en el Código:**
    *   Abre `app/register/page.tsx`.
    *   Busca la línea: `sitekey="1x00000000000000000000AA"`.
    *   Reemplázala con tu **Site Key** real.

¡Eso es todo! Ahora tu formulario de registro tiene seguridad de nivel militar (la misma que usa Apple y Discord) sin molestar a los usuarios con "semáforos".
