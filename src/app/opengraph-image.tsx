import { ImageResponse } from 'next/og';

export const alt = "Book.uz — O'zbekistondagi onlayn kitob do'koni";
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
    return new ImageResponse(
        <div
            style={{
                alignItems: 'center',
                background: 'linear-gradient(135deg, #071b33 0%, #005cb9 58%, #ff8a00 100%)',
                color: 'white',
                display: 'flex',
                height: '100%',
                justifyContent: 'center',
                padding: '72px',
                width: '100%'
            }}>
            <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '1000px' }}>
                <div style={{ color: '#ffad42', display: 'flex', fontSize: 30, fontWeight: 700 }}>
                    O‘ZBEKISTONDAGI ONLAYN KITOB DO‘KONI
                </div>
                <div style={{ display: 'flex', fontSize: 116, fontWeight: 900, letterSpacing: '-5px' }}>Book.uz</div>
                <div style={{ display: 'flex', fontSize: 40, lineHeight: 1.35, marginTop: 12 }}>
                    Sevimli kitoblaringizni qulay narxda toping
                </div>
                <div style={{ display: 'flex', fontSize: 25, marginTop: 42, opacity: 0.9 }}>
                    Keng tanlov • Tez yetkazib berish • Qulay to‘lov
                </div>
            </div>
        </div>,
        size
    );
}
