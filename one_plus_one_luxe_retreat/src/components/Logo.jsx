import React from "react";
import settings from "../settings/settings";

const { colors } = settings.theme;

const Logo = ({ size = 160, className = "" }) => {
  const id = React.useId().replace(/:/g, "");

  const styleId = `logo-styles-${id}`;

  return (
    <>
      <style>{`
        #${styleId} .od  { stroke-dasharray:560; stroke-dashoffset:560; animation: ${id}_draw 1.4s cubic-bezier(0.4,0,0.2,1) 0s forwards; }
        #${styleId} .id  { stroke-dasharray:380; stroke-dashoffset:380; animation: ${id}_draw 1.1s cubic-bezier(0.4,0,0.2,1) 0.4s forwards; }
        #${styleId} .bld { stroke-dasharray:420; stroke-dashoffset:420; animation: ${id}_draw 0.9s cubic-bezier(0.4,0,0.2,1) 0.9s forwards; }
        #${styleId} .rl  { stroke-dasharray:140; stroke-dashoffset:140; animation: ${id}_draw 0.6s ease 1.5s forwards; }
        #${styleId} .cn  { stroke-dasharray:320; stroke-dashoffset:320; animation: ${id}_draw 0.8s cubic-bezier(0.4,0,0.2,1) 1.7s forwards; }
        #${styleId} .tr  { stroke-dasharray:220; stroke-dashoffset:220; animation: ${id}_draw 0.7s ease 2.2s forwards; }

        #${styleId} .fd0 { opacity:0; animation: ${id}_fade 0.6s ease 1.2s forwards; }
        #${styleId} .fd1 { opacity:0; animation: ${id}_fade 0.5s ease 1.8s forwards; }
        #${styleId} .fd2 { opacity:0; animation: ${id}_fade 0.5s ease 2.0s forwards; }
        #${styleId} .fd3 { opacity:0; animation: ${id}_fade 0.5s ease 2.4s forwards; }

        #${styleId} .lf  {
          opacity: 0;
          transform-box: fill-box;
          transform-origin: 50% 100%;
          animation: ${id}_bloom 0.55s cubic-bezier(0.34,1.4,0.64,1) var(--d, 2.5s) forwards;
        }

        #${styleId} .dp      { r: 0; animation: ${id}_pop 0.45s cubic-bezier(0.34,1.6,0.64,1) var(--d, 1.6s) forwards; }
        #${styleId} .dp-top  { r: 0; animation: ${id}_pop 0.45s cubic-bezier(0.34,1.6,0.64,1) 1.6s forwards, ${id}_pulse 2.4s ease-in-out 2.2s infinite; }

        #${styleId} .sway { animation: ${id}_sway 4s ease-in-out 3s infinite; transform-origin: 80px 57px; }

        @keyframes ${id}_draw  { to { stroke-dashoffset: 0; } }
        @keyframes ${id}_fade  { to { opacity: 1; } }
        @keyframes ${id}_bloom {
          from { opacity: 0; transform: scale(0.2) rotate(-15deg); }
          to   { opacity: 1; transform: scale(1)   rotate(0deg);   }
        }
        @keyframes ${id}_pop   { to { r: 4; } }
        @keyframes ${id}_pulse {
          0%,100% { opacity: 1; r: 4; }
          50%     { opacity: 0.5; r: 5.5; }
        }
        @keyframes ${id}_sway  {
          0%,100% { transform: rotate(0deg); }
          30%     { transform: rotate(1.2deg); }
          70%     { transform: rotate(-1deg); }
        }

        @media (prefers-reduced-motion: reduce) {
          #${styleId} .od, #${styleId} .id, #${styleId} .bld,
          #${styleId} .rl, #${styleId} .cn, #${styleId} .tr {
            stroke-dashoffset: 0;
            animation: none;
          }
          #${styleId} .fd0, #${styleId} .fd1,
          #${styleId} .fd2, #${styleId} .fd3,
          #${styleId} .lf  { opacity: 1; animation: none; }
          #${styleId} .dp, #${styleId} .dp-top { r: 4; animation: none; }
          #${styleId} .sway { animation: none; }
        }
      `}</style>

      <svg
        id={styleId}
        viewBox="0 0 160 160"
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        aria-label="The Copper House logo"
        role="img"
        className={className}
        style={{ display: "block", flexShrink: 0 }}
      >
        {/* ── OUTER DIAMOND (copper) ── */}
        <polygon
          className="od"
          points="80,10 150,80 80,150 10,80"
          fill="none"
          stroke={colors.copper}
          strokeWidth="2.5"
        />

        {/* ── INNER DIAMOND (muted) ── */}
        <polygon
          className="id"
          points="80,34 126,80 80,126 34,80"
          fill="none"
          stroke={colors.muted}
          strokeWidth="0.8"
          opacity="0.35"
        />

        {/* ── BOTTOM WASH (surface2) ── */}
        <polygon
          className="fd1"
          points="80,150 10,80 150,80"
          fill={colors.surface2}
          opacity="0.55"
        />

        {/* ── BUILDING ── */}
        <line
          className="bld"
          x1="46"
          y1="108"
          x2="114"
          y2="108"
          stroke={colors.sand}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          className="bld"
          x1="46"
          y1="108"
          x2="46"
          y2="80"
          stroke={colors.sand}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          className="bld"
          x1="114"
          y1="108"
          x2="114"
          y2="80"
          stroke={colors.sand}
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* terrace slab */}
        <line
          className="bld"
          x1="40"
          y1="80"
          x2="120"
          y2="80"
          stroke={colors.cream}
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* door */}
        <rect
          className="fd2"
          x="73"
          y="90"
          width="14"
          height="18"
          fill={colors.surface}
          stroke={colors.copper}
          strokeWidth="1.5"
        />
        {/* door handle */}
        <circle
          className="fd3"
          cx="84"
          cy="100"
          r="1.2"
          fill={colors.copperLight}
        />

        {/* window left */}
        <rect
          className="fd2"
          x="52"
          y="88"
          width="12"
          height="10"
          fill={colors.surface2}
          stroke={colors.copperLight}
          strokeWidth="1"
        />
        <line
          className="fd3"
          x1="58"
          y1="88"
          x2="58"
          y2="98"
          stroke={colors.copperLight}
          strokeWidth="0.6"
          opacity="0.5"
        />
        <line
          className="fd3"
          x1="52"
          y1="93"
          x2="64"
          y2="93"
          stroke={colors.copperLight}
          strokeWidth="0.6"
          opacity="0.5"
        />

        {/* window right */}
        <rect
          className="fd2"
          x="96"
          y="88"
          width="12"
          height="10"
          fill={colors.surface2}
          stroke={colors.copperLight}
          strokeWidth="1"
        />
        <line
          className="fd3"
          x1="102"
          y1="88"
          x2="102"
          y2="98"
          stroke={colors.copperLight}
          strokeWidth="0.6"
          opacity="0.5"
        />
        <line
          className="fd3"
          x1="96"
          y1="93"
          x2="108"
          y2="93"
          stroke={colors.copperLight}
          strokeWidth="0.6"
          opacity="0.5"
        />

        {/* ── RAILING (copper) ── */}
        <line
          className="rl"
          x1="40"
          y1="72"
          x2="120"
          y2="72"
          stroke={colors.copper}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <line
          className="rl"
          x1="50"
          y1="72"
          x2="50"
          y2="80"
          stroke={colors.copper}
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <line
          className="rl"
          x1="63"
          y1="72"
          x2="63"
          y2="80"
          stroke={colors.copper}
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <line
          className="rl"
          x1="80"
          y1="72"
          x2="80"
          y2="80"
          stroke={colors.copper}
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <line
          className="rl"
          x1="97"
          y1="72"
          x2="97"
          y2="80"
          stroke={colors.copper}
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <line
          className="rl"
          x1="110"
          y1="72"
          x2="110"
          y2="80"
          stroke={colors.copper}
          strokeWidth="1.2"
          strokeLinecap="round"
        />

        {/* ── CANOPY (sways after draw-in) ── */}
        <g className="sway">
          <line
            className="cn"
            x1="58"
            y1="72"
            x2="58"
            y2="57"
            stroke={colors.sand}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line
            className="cn"
            x1="102"
            y1="72"
            x2="102"
            y2="57"
            stroke={colors.sand}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line
            className="cn"
            x1="50"
            y1="57"
            x2="110"
            y2="57"
            stroke={colors.cream}
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* fabric fill */}
          <rect
            className="fd1"
            x="50"
            y="50"
            width="60"
            height="8"
            fill={colors.surface}
            rx="1"
          />
          <rect
            className="fd1"
            x="50"
            y="50"
            width="60"
            height="8"
            fill={colors.copper}
            opacity="0.3"
            rx="1"
          />
          {/* top ridge */}
          <line
            className="cn"
            x1="50"
            y1="50"
            x2="110"
            y2="50"
            stroke={colors.copper}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* drape lines */}
          <line
            className="cn"
            x1="63"
            y1="50"
            x2="63"
            y2="57"
            stroke={colors.muted}
            strokeWidth="0.9"
            strokeLinecap="round"
          />
          <line
            className="cn"
            x1="80"
            y1="50"
            x2="80"
            y2="57"
            stroke={colors.muted}
            strokeWidth="0.9"
            strokeLinecap="round"
          />
          <line
            className="cn"
            x1="97"
            y1="50"
            x2="97"
            y2="57"
            stroke={colors.muted}
            strokeWidth="0.9"
            strokeLinecap="round"
          />
        </g>

        {/* ── LEFT TREE ── */}
        <line
          className="tr"
          x1="50"
          y1="80"
          x2="50"
          y2="67"
          stroke={colors.muted}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          className="tr"
          x1="50"
          y1="73"
          x2="46"
          y2="69"
          stroke={colors.muted}
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.6"
        />
        <line
          className="tr"
          x1="50"
          y1="73"
          x2="54"
          y2="69"
          stroke={colors.muted}
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.6"
        />
        <path
          className="lf"
          style={{ "--d": "2.4s" }}
          d="M50,67 C46,61 44,55 50,52 C56,55 54,61 50,67Z"
          fill={colors.muted}
        />
        <path
          className="lf"
          style={{ "--d": "2.55s" }}
          d="M48,65 C42,61 39,55 43,51 C47,50 49,56 48,65Z"
          fill={colors.copper}
          opacity="0.75"
        />
        <path
          className="lf"
          style={{ "--d": "2.55s" }}
          d="M52,65 C58,61 61,55 57,51 C53,50 51,56 52,65Z"
          fill={colors.copper}
          opacity="0.75"
        />
        <path
          className="lf"
          style={{ "--d": "2.7s" }}
          d="M50,53 C48,49 47,45 50,43 C53,45 52,49 50,53Z"
          fill={colors.copperLight}
          opacity="0.9"
        />
        <path
          className="lf"
          style={{ "--d": "2.8s" }}
          d="M44,60 C41,57 40,53 43,52 C45,53 45,57 44,60Z"
          fill={colors.sand}
          opacity="0.5"
        />
        <path
          className="lf"
          style={{ "--d": "2.8s" }}
          d="M56,60 C59,57 60,53 57,52 C55,53 55,57 56,60Z"
          fill={colors.sand}
          opacity="0.5"
        />

        {/* ── RIGHT TREE ── */}
        <line
          className="tr"
          x1="110"
          y1="80"
          x2="110"
          y2="67"
          stroke={colors.muted}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          className="tr"
          x1="110"
          y1="73"
          x2="106"
          y2="69"
          stroke={colors.muted}
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.6"
        />
        <line
          className="tr"
          x1="110"
          y1="73"
          x2="114"
          y2="69"
          stroke={colors.muted}
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.6"
        />
        <path
          className="lf"
          style={{ "--d": "2.45s" }}
          d="M110,67 C106,61 104,55 110,52 C116,55 114,61 110,67Z"
          fill={colors.muted}
        />
        <path
          className="lf"
          style={{ "--d": "2.6s" }}
          d="M108,65 C102,61 99,55 103,51 C107,50 109,56 108,65Z"
          fill={colors.copper}
          opacity="0.75"
        />
        <path
          className="lf"
          style={{ "--d": "2.6s" }}
          d="M112,65 C118,61 121,55 117,51 C113,50 111,56 112,65Z"
          fill={colors.copper}
          opacity="0.75"
        />
        <path
          className="lf"
          style={{ "--d": "2.75s" }}
          d="M110,53 C108,49 107,45 110,43 C113,45 112,49 110,53Z"
          fill={colors.copperLight}
          opacity="0.9"
        />
        <path
          className="lf"
          style={{ "--d": "2.85s" }}
          d="M104,60 C101,57 100,53 103,52 C105,53 105,57 104,60Z"
          fill={colors.sand}
          opacity="0.5"
        />
        <path
          className="lf"
          style={{ "--d": "2.85s" }}
          d="M116,60 C119,57 120,53 117,52 C115,53 115,57 116,60Z"
          fill={colors.sand}
          opacity="0.5"
        />

        {/* ── ANCHOR DOTS ── */}
        <circle className="dp-top" cx="80" cy="10" fill={colors.copper} />
        <circle
          className="dp"
          style={{ "--d": "1.7s" }}
          cx="150"
          cy="80"
          fill={colors.copperLight}
          opacity="0.7"
        />
        <circle
          className="dp"
          style={{ "--d": "1.7s" }}
          cx="10"
          cy="80"
          fill={colors.copperLight}
          opacity="0.7"
        />
        <circle
          className="dp"
          style={{ "--d": "1.8s" }}
          cx="80"
          cy="150"
          fill={colors.muted}
          opacity="0.5"
        />
      </svg>
    </>
  );
};

export default Logo;
