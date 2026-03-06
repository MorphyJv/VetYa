import React from 'react';

interface LogoProps {
    className?: string;
    size?: number;
}

const Logo: React.FC<LogoProps> = ({ className, size = 48 }) => {
    return (
        <svg
            viewBox="0 0 400 320"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            width={size}
            height={(size * 3.2) / 4}
        >
            {/* Heart - Left Part (Original Celeste #6EC9E8) */}
            <path
                d="M200 240L100 140C80 120 70 100 70 80C70 47 97 20 130 20C155 20 175 35 190 55L200 65"
                stroke="#6EC9E8"
                strokeWidth="32"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Heart - Right Part (Original Dark Blue #1D3B5A) */}
            <path
                d="M200 240L300 140C320 120 330 100 330 80C330 47 303 20 270 20C245 20 225 35 210 55L200 65"
                stroke="#1D3B5A"
                strokeWidth="32"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Paw Print */}
            <g>
                {/* Main pad (Dark Blue) */}
                <path d="M200 135C215 135 225 145 225 160C225 175 215 185 200 185C185 185 175 175 175 160C175 145 185 135 200 135Z" fill="#1D3B5A" />
                {/* Toes (Outer Celeste, Inner Dark Blue) */}
                <circle cx="170" cy="140" r="12" fill="#6EC9E8" />
                <circle cx="190" cy="115" r="12" fill="#1D3B5A" />
                <circle cx="215" cy="115" r="12" fill="#1D3B5A" />
                <circle cx="235" cy="140" r="12" fill="#6EC9E8" />
            </g>

            {/* Leaf (Green #8FBD44) */}
            <path
                d="M175 225C175 225 185 240 200 235C200 235 215 220 205 205C195 195 175 205 175 225Z"
                fill="#8FBD44"
            />
            <path d="M175 225C175 225 190 220 205 205" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />

            {/* Typography - VetYa (Uniform Dark Blue #1D3B5A) */}
            <text
                x="200"
                y="265"
                textAnchor="middle"
                fill="#1D3B5A"
                style={{ fontSize: '72px', fontWeight: '800', fontFamily: 'Inter, system-ui, sans-serif' }}
            >
                VetYa
            </text>

            {/* Slogan (Grey #64748b) */}
            <text
                x="200"
                y="300"
                textAnchor="middle"
                fill="#64748b"
                style={{ fontSize: '18px', fontWeight: '500', fontFamily: 'Inter, system-ui, sans-serif' }}
            >
                Tecnología que cuida sus huellas.
            </text>
        </svg>
    );
};

export default Logo;
