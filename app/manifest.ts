import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'SaberPro 2026',
        short_name: 'SaberPro',
        description: 'La mejor plataforma de preparación para las pruebas Saber Pro.',
        start_url: '/dashboard',
        display: 'standalone',
        background_color: '#0A0C0F',
        theme_color: '#D4AF37',
        icons: [
            {
                src: '/icon.svg',
                sizes: 'any',
                type: 'image/svg+xml',
            },
        ],
    };
}
