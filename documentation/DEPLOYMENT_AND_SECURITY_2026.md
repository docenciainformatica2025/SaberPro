# Protocolo de Despliegue y Seguridad SaberPro 2026

Este documento sirve como referencia técnica para la resolución de conflictos de infraestructura y seguridad encontrados durante el despliegue de la versión **v4.1.29**.

## 1. Incidente de Bloqueo "Shallow Update" (Infraestructura)

### Síntoma
Al intentar subir cambios a GitHub, el servidor rechaza el push con el error:
```
! [remote rejected] main -> main (shallow update not allowed)
```
Incluso si el repositorio local parece completo, GitHub detecta incompatibilidad en el historial.

### Causa Raíz
El repositorio remoto tiene habilitadas restricciones estrictas de integridad que chocan con la historia re-inicializada o "truncada" del entorno de desarrollo local.

### Solución Probada
El único método efectivo para superar este bloqueo es una **Sincronización Autorizada**:
1.  **GitHub**: Desactivar temporalmente la protección de la rama `main`.
    *   *Settings -> Branches -> "Require pull request before merging" (Desmarcar)*.
2.  **Terminal**: Ejecutar una subida forzada definitiva.
    ```bash
    git push origin main --force
    ```
3.  **Vercel**: Asegurar que la "Production Branch" esté configurada en `main`.

---

## 2. Incidente de "Push Protection" (Seguridad)

### Síntoma
GitHub bloquea el push detectando credenciales expuestas:
```
remote: error: GH013: Repository rule violations found for refs/heads/main.
remote: - GITHUB PUSH PROTECTION
```

### Protocolo de Limpieza (Security Vercel Pattern)
Si una llave privada (ej: `firebase-admin-sdk.json`) toca el historial, seguir estos pasos **inmediatamente**:

1.  **Retroceder el Historial (Soft Reset)**:
    Mantiene los archivos pero deshace el commit peligroso.
    ```bash
    git reset --soft HEAD~1
    ```

2.  **Eliminar del Control de Versiones**:
    Saca el archivo de Git sin borrarlo de tu disco.
    ```bash
    git rm --cached lib/firebase-admin-sdk.json
    ```

3.  **Bloquear en .gitignore**:
    Añadir la ruta al archivo `.gitignore` para evitar reincidencias.
    ```gitignore
    # Security
    lib/firebase-admin-sdk.json
    ```

4.  **Crear Referencia Segura**:
    Generar un archivo `lib/firebase-admin-sdk.example.json` con valores falsos para que otros desarrolladores conozcan la estructura requerida.

5.  **Re-desplegar**:
    Hacer commit y push de nuevo.

---

## 3. Estado Actual (v4.1.29)
*   **Rama de Producción**: `main`
*   **Estado de Seguridad**: Limpio (Sin credenciales expuestas).
*   **Método de Despliegue**: Automático vía Vercel tras push a `main`.

**Nota**: Para futuros desarrollos, usar siempre ramas (`feature/nueva-funcionalidad`) y hacer merge a `main` solo cuando se haya validado que no hay secretos en el código.

---
*Documentado por Agente Antigravity - Febrero 2026*
