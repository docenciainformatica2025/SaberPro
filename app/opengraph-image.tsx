
import { ImageResponse } from 'next/og';
import { BRAND_YEAR, BRAND_NAME_SPACED } from '@/lib/config';

export const runtime = 'edge';
export const alt = `${BRAND_NAME_SPACED} - Simulador Premium`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    fontSize: 60,
                    background: 'linear-gradient(to bottom right, #000000, #1a1a1a)',
                    color: 'white',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'sans-serif',
                    border: '20px solid #D4AF37', // Gold border
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: 'linear-gradient(to bottom right, #D4AF37, #B8860B)',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '50px',
                        fontWeight: 'bold',
                        color: 'black'
                    }}>
                        S
                    </div>
                    <span style={{ fontSize: 70, fontWeight: 900, letterSpacing: '-0.05em' }}>
                        Saber<span style={{ color: '#D4AF37' }}>Pro {BRAND_YEAR}</span>
                    </span>
                </div>
                <div style={{
                    marginTop: 40,
                    fontSize: 30,
                    color: '#E5E4E2', // Silver
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em',
                    fontWeight: 'bold'
                }}>
                    Simulador Oficial de Pruebas
                </div>
                <div style={{
                    position: 'absolute',
                    bottom: 40,
                    fontSize: 20,
                    color: '#666',
                    display: 'flex',
                    alignItems: 'center',
                }}>
                    Desarrollado por Ing. Antonio Rodríguez
                </div>
            </div>
        ),
        { ...size }
    );
}
