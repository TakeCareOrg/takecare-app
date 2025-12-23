import * as React from "react";
import Svg, {
    Circle,
    ClipPath,
    Defs,
    G,
    LinearGradient,
    Mask,
    Path,
    RadialGradient,
    Rect,
    Stop,
} from "react-native-svg";

import { IconType } from "@app/types/icon";

/* SVGR has dropped some elements not supported by react-native-svg: filter */
export const TestIcon = ({ width = 100, height = 100 }: IconType) => (
    <Svg width={width} height={height} fill="none">
        <G clipPath="url(#a)">
            <Path fill="#52B3F5" d="M-2.5 0H102v97.4H-2.5z" />
            <Path
                fill="url(#b)"
                d="M0 0h104.5v97.4H0z"
                transform="translate(-2.5)"
            />
            <Path
                fill="url(#c)"
                d="M0 0h104.5v97.4H0z"
                transform="translate(-2.5)"
            />
            <Path
                fill="url(#d)"
                d="M0 0h104.5v97.4H0z"
                transform="translate(-2.5)"
            />
            <Path
                fill="url(#e)"
                d="M0 0h104.5v97.4H0z"
                transform="translate(-2.5)"
            />
            <Circle
                cx={46.98}
                cy={46.98}
                r={46.98}
                fill="url(#f)"
                fillOpacity={0.84}
                transform="rotate(152.841 46.98 46.98)"
            />
            <G style={{ mixBlendMode: "overlay" }}>
                <Circle
                    cx={46.98}
                    cy={46.98}
                    r={46.98}
                    fill="url(#g)"
                    fillOpacity={0.2}
                />
            </G>
            <Mask
                id="i"
                width={94}
                height={95}
                x={0}
                y={0}
                maskUnits="userSpaceOnUse"
                style={{
                    maskType: "alpha",
                }}
            >
                <Circle cx={46.98} cy={47.28} r={46.98} fill="url(#h)" />
            </Mask>
            <G mask="url(#i)">
                <Mask
                    id="j"
                    width={94}
                    height={95}
                    x={0}
                    y={0}
                    maskUnits="userSpaceOnUse"
                    style={{
                        maskType: "alpha",
                    }}
                >
                    <Circle cx={46.98} cy={47.28} r={46.98} fill="#C4C4C4" />
                </Mask>
                <G mask="url(#j)">
                    <G strokeLinecap="square" strokeWidth={0.3} opacity={0.8}>
                        <Path
                            stroke="url(#k)"
                            d="m109.185 13.44-124.41 67.663"
                            opacity={0.034}
                        />
                        <Path
                            stroke="url(#l)"
                            d="M102.946 10.996-8.984 83.544"
                            opacity={0.069}
                        />
                        <Path
                            stroke="url(#m)"
                            d="M96.534 8.992-2.571 85.545"
                            opacity={0.103}
                        />
                        <Path
                            stroke="url(#n)"
                            d="M90.02 7.429 3.946 87.104"
                            opacity={0.138}
                        />
                        <Path
                            stroke="url(#o)"
                            d="M83.471 6.303 10.495 88.229"
                            opacity={0.172}
                        />
                        <Path
                            stroke="url(#p)"
                            d="m76.956 5.604-59.944 83.32"
                            opacity={0.207}
                        />
                        <Path
                            stroke="url(#q)"
                            d="M70.537 5.32 23.432 89.204"
                            opacity={0.241}
                        />
                        <Path
                            stroke="url(#r)"
                            d="m64.275 5.436-34.58 83.65"
                            opacity={0.276}
                        />
                        <Path
                            stroke="url(#s)"
                            d="m58.228 5.929-22.486 82.66"
                            opacity={0.31}
                        />
                        <Path
                            stroke="url(#t)"
                            d="m52.449 6.778-10.928 80.96"
                            opacity={0.345}
                        />
                        <Path
                            stroke="url(#u)"
                            d="M46.985 7.955v78.602"
                            opacity={0.379}
                        />
                        <Path
                            stroke="url(#v)"
                            d="m41.88 9.43 10.21 75.648"
                            opacity={0.414}
                        />
                        <Path
                            stroke="url(#w)"
                            d="M37.17 11.175 56.8 83.33"
                            opacity={0.448}
                        />
                        <Path
                            stroke="url(#x)"
                            d="M32.888 13.152 61.081 81.35"
                            opacity={0.483}
                        />
                        <Path
                            stroke="url(#y)"
                            d="m29.06 15.33 35.849 63.84"
                            opacity={0.517}
                        />
                        <Path
                            stroke="url(#z)"
                            d="m25.705 17.67 42.558 59.156"
                            opacity={0.552}
                        />
                        <Path
                            stroke="url(#A)"
                            d="m22.836 20.138 48.295 54.217"
                            opacity={0.586}
                        />
                        <Path
                            stroke="url(#B)"
                            d="m20.462 22.695 53.041 49.099"
                            opacity={0.621}
                        />
                        <Path
                            stroke="url(#C)"
                            d="m18.583 25.307 56.798 43.872"
                            opacity={0.655}
                        />
                        <Path
                            stroke="url(#D)"
                            d="m17.195 27.936 59.572 38.611"
                            opacity={0.69}
                        />
                        <Path
                            stroke="url(#E)"
                            d="m16.287 30.547 61.386 33.386"
                            opacity={0.724}
                        />
                        <Path
                            stroke="url(#F)"
                            d="M15.842 33.107 78.114 61.37"
                            opacity={0.759}
                        />
                        <Path
                            stroke="url(#G)"
                            d="m15.84 35.584 62.273 23.303"
                            opacity={0.793}
                        />
                        <Path
                            stroke="url(#H)"
                            d="m16.253 37.95 61.442 18.57"
                            opacity={0.828}
                        />
                        <Path
                            stroke="url(#I)"
                            d="M17.052 40.175 76.891 54.29"
                            opacity={0.862}
                        />
                        <Path
                            stroke="url(#J)"
                            d="m18.2 42.235 57.537 9.993"
                            opacity={0.897}
                        />
                        <Path
                            stroke="url(#K)"
                            d="m19.66 44.11 54.61 6.24"
                            opacity={0.931}
                        />
                        <Path
                            stroke="url(#L)"
                            d="m21.39 45.78 51.144 2.9"
                            opacity={0.966}
                        />
                        <Path stroke="url(#M)" d="M23.346 47.23h47.225" />
                    </G>
                    <Path
                        stroke="url(#N)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="m-10.4 81.064 114.683-67.663"
                        opacity={0.034}
                    />
                    <Path
                        stroke="url(#O)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="M-4.65 83.509 98.53 10.96"
                        opacity={0.069}
                    />
                    <Path
                        stroke="url(#P)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="M1.26 85.513 92.618 8.96"
                        opacity={0.103}
                    />
                    <Path
                        stroke="url(#Q)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="M7.266 87.076 86.61 7.4"
                        opacity={0.138}
                    />
                    <Path
                        stroke="url(#R)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="m13.302 88.203 67.27-81.926"
                        opacity={0.172}
                    />
                    <Path
                        stroke="url(#S)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="m19.308 88.901 55.256-83.32"
                        opacity={0.207}
                    />
                    <Path
                        stroke="url(#T)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="M25.225 89.186 68.647 5.302"
                        opacity={0.241}
                    />
                    <Path
                        stroke="url(#U)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="M30.997 89.07 62.874 5.42"
                        opacity={0.276}
                    />
                    <Path
                        stroke="url(#V)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="M36.57 88.576 57.3 5.916"
                        opacity={0.31}
                    />
                    <Path
                        stroke="url(#W)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="m41.898 87.728 10.074-80.96"
                        opacity={0.345}
                    />
                    <Path
                        stroke="url(#X)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="M46.935 86.55V7.95"
                        opacity={0.379}
                    />
                    <Path
                        stroke="url(#Y)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="M51.641 85.075 42.23 9.428"
                        opacity={0.414}
                    />
                    <Path
                        stroke="url(#Z)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="M55.983 83.331 37.888 11.175"
                        opacity={0.448}
                    />
                    <Path
                        stroke="url(#aa)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="M59.93 81.353 33.94 13.156"
                        opacity={0.483}
                    />
                    <Path
                        stroke="url(#ab)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="m63.459 79.177-33.046-63.84"
                        opacity={0.517}
                    />
                    <Path
                        stroke="url(#ac)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="M66.552 76.836 27.32 17.68"
                        opacity={0.552}
                    />
                    <Path
                        stroke="url(#ad)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="M69.196 74.368 24.678 20.151"
                        opacity={0.586}
                    />
                    <Path
                        stroke="url(#ae)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="M71.385 71.81 22.49 22.713"
                        opacity={0.621}
                    />
                    <Path
                        stroke="url(#af)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="M73.117 69.2 20.76 25.327"
                        opacity={0.655}
                    />
                    <Path
                        stroke="url(#ag)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="M74.397 66.571 19.483 27.96"
                        opacity={0.69}
                    />
                    <Path
                        stroke="url(#ah)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="M75.234 63.96 18.648 30.574"
                        opacity={0.724}
                    />
                    <Path
                        stroke="url(#ai)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="M75.644 61.4 18.241 33.137"
                        opacity={0.759}
                    />
                    <Path
                        stroke="url(#aj)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="M75.647 58.922 18.243 35.619"
                        opacity={0.793}
                    />
                    <Path
                        stroke="url(#ak)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="m75.266 56.557-56.638-18.57"
                        opacity={0.828}
                    />
                    <Path
                        stroke="url(#al)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="M74.53 54.332 19.37 40.215"
                        opacity={0.862}
                    />
                    <Path
                        stroke="url(#am)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="m73.47 52.27-53.037-9.992"
                        opacity={0.897}
                    />
                    <Path
                        stroke="url(#an)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="m72.125 50.397-50.34-6.242"
                        opacity={0.931}
                    />
                    <Path
                        stroke="url(#ao)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="m70.53 48.727-47.144-2.9"
                        opacity={0.966}
                    />
                    <Path
                        stroke="url(#ap)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="M68.728 47.276H25.196"
                    />
                    <G strokeLinecap="square" strokeWidth={0.3} opacity={0.8}>
                        <Path
                            stroke="url(#aq)"
                            d="M107.363 84.22-13.44 10.31"
                            opacity={0.034}
                        />
                        <Path
                            stroke="url(#ar)"
                            d="m106.361 77.595-118.794-60.66"
                            opacity={0.069}
                        />
                        <Path
                            stroke="url(#as)"
                            d="M104.89 71.04-10.959 23.49"
                            opacity={0.103}
                        />
                        <Path
                            stroke="url(#at)"
                            d="M102.987 64.617-9.051 29.913"
                            opacity={0.138}
                        />
                        <Path
                            stroke="url(#au)"
                            d="M100.688 58.383-6.749 36.147"
                            opacity={0.172}
                        />
                        <Path
                            stroke="url(#av)"
                            d="M98.036 52.39-4.094 42.139"
                            opacity={0.207}
                        />
                        <Path
                            stroke="url(#aw)"
                            d="m95.072 46.69-96.198 1.148"
                            opacity={0.241}
                        />
                        <Path
                            stroke="url(#ax)"
                            d="M91.841 41.325 2.108 53.202"
                            opacity={0.276}
                        />
                        <Path
                            stroke="url(#ay)"
                            d="M88.39 36.335 5.562 58.19"
                            opacity={0.31}
                        />
                        <Path
                            stroke="url(#az)"
                            d="M84.766 31.754 9.189 62.77"
                            opacity={0.345}
                        />
                        <Path
                            stroke="url(#aA)"
                            d="M81.014 27.611 12.943 66.912"
                            opacity={0.379}
                        />
                        <Path
                            stroke="url(#aB)"
                            d="M77.183 23.928 16.777 70.594"
                            opacity={0.414}
                        />
                        <Path
                            stroke="url(#aC)"
                            d="M73.318 20.72 20.644 73.8"
                            opacity={0.448}
                        />
                        <Path
                            stroke="url(#aD)"
                            d="M69.465 18.002 24.5 76.517"
                            opacity={0.483}
                        />
                        <Path
                            stroke="url(#aE)"
                            d="M65.665 15.774 28.302 78.741"
                            opacity={0.517}
                        />
                        <Path
                            stroke="url(#aF)"
                            d="M61.96 14.04 32.01 80.472"
                            opacity={0.552}
                        />
                        <Path
                            stroke="url(#aG)"
                            d="M58.389 12.79 35.583 81.72"
                            opacity={0.586}
                        />
                        <Path
                            stroke="url(#aH)"
                            d="m54.987 12.012-16 70.484"
                            opacity={0.621}
                        />
                        <Path
                            stroke="url(#aI)"
                            d="M51.786 11.69 42.19 82.815"
                            opacity={0.655}
                        />
                        <Path
                            stroke="url(#aJ)"
                            d="m48.815 11.802-3.653 70.897"
                            opacity={0.69}
                        />
                        <Path
                            stroke="url(#aK)"
                            d="m46.1 12.321 1.78 69.855"
                            opacity={0.724}
                        />
                        <Path
                            stroke="url(#aL)"
                            d="m43.66 13.216 6.66 68.06"
                            opacity={0.759}
                        />
                        <Path
                            stroke="url(#aM)"
                            d="m41.514 14.453 10.955 65.582"
                            opacity={0.793}
                        />
                        <Path
                            stroke="url(#aN)"
                            d="M39.673 15.994 54.31 78.49"
                            opacity={0.828}
                        />
                        <Path
                            stroke="url(#aO)"
                            d="m38.145 17.798 17.694 58.88"
                            opacity={0.862}
                        />
                        <Path
                            stroke="url(#aP)"
                            d="m36.935 19.823 20.114 54.824"
                            opacity={0.897}
                        />
                        <Path
                            stroke="url(#aQ)"
                            d="m36.041 22.024 21.9 50.414"
                            opacity={0.931}
                        />
                        <Path
                            stroke="url(#aR)"
                            d="M35.46 24.357 58.52 70.1"
                            opacity={0.966}
                        />
                        <Path
                            stroke="url(#aS)"
                            d="m35.182 26.776 23.612 40.898"
                        />
                    </G>
                    <Path
                        stroke="url(#aT)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="m-10.993 14.469 115.94 65.487"
                        opacity={0.034}
                    />
                    <Path
                        stroke="url(#aU)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="m-10.234 20.67 114.418 53.082"
                        opacity={0.069}
                    />
                    <Path
                        stroke="url(#aV)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="m-9.015 26.792 111.975 40.84"
                        opacity={0.103}
                    />
                    <Path
                        stroke="url(#aW)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="M-7.366 32.773 101.307 61.65"
                        opacity={0.138}
                    />
                    <Path
                        stroke="url(#aX)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="M-5.324 38.565 99.261 55.859"
                        opacity={0.172}
                    />
                    <Path
                        stroke="url(#aY)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="M-2.926 44.115 96.86 50.31"
                        opacity={0.207}
                    />
                    <Path
                        stroke="url(#aZ)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="m-.213 49.382 94.356-4.338"
                        opacity={0.241}
                    />
                    <Path
                        stroke="url(#ba)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="m2.773 54.322 88.381-14.218"
                        opacity={0.276}
                    />
                    <Path
                        stroke="url(#bb)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="m5.987 58.903 81.95-23.378"
                        opacity={0.31}
                    />
                    <Path
                        stroke="url(#bc)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="m9.386 63.093 75.15-31.756"
                        opacity={0.345}
                    />
                    <Path
                        stroke="url(#bd)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="m12.923 66.866 68.072-39.3"
                        opacity={0.379}
                    />
                    <Path
                        stroke="url(#be)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="M16.555 70.204 77.36 24.23"
                        opacity={0.414}
                    />
                    <Path
                        stroke="url(#bf)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="m20.235 73.092 53.442-51.75"
                        opacity={0.448}
                    />
                    <Path
                        stroke="url(#bg)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="m23.922 75.522 46.066-56.606"
                        opacity={0.483}
                    />
                    <Path
                        stroke="url(#bh)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="m27.572 77.49 38.764-60.54"
                        opacity={0.517}
                    />
                    <Path
                        stroke="url(#bi)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="M31.145 78.997 62.76 15.444"
                        opacity={0.552}
                    />
                    <Path
                        stroke="url(#bj)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="M34.604 80.054 59.298 14.39"
                        opacity={0.586}
                    />
                    <Path
                        stroke="url(#bk)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="m37.914 80.67 18.073-66.893"
                        opacity={0.621}
                    />
                    <Path
                        stroke="url(#bl)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="m41.04 80.864 11.818-67.278"
                        opacity={0.655}
                    />
                    <Path
                        stroke="url(#bm)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="m43.957 80.66 5.982-66.864"
                        opacity={0.69}
                    />
                    <Path
                        stroke="url(#bn)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="m46.638 80.078.62-65.698"
                        opacity={0.724}
                    />
                    <Path
                        stroke="url(#bo)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="M49.06 79.153 44.834 15.31"
                        opacity={0.759}
                    />
                    <Path
                        stroke="url(#bp)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="m51.206 77.917-8.52-61.365"
                        opacity={0.793}
                    />
                    <Path
                        stroke="url(#bq)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="M53.064 76.404 40.828 18.07"
                        opacity={0.828}
                    />
                    <Path
                        stroke="url(#br)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="M54.623 74.654 39.27 19.826"
                        opacity={0.862}
                    />
                    <Path
                        stroke="url(#bs)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="M55.879 72.707 38.014 21.779"
                        opacity={0.897}
                    />
                    <Path
                        stroke="url(#bt)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="M56.83 70.603 37.063 23.888"
                        opacity={0.931}
                    />
                    <Path
                        stroke="url(#bu)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="M57.478 68.388 36.418 26.11"
                        opacity={0.966}
                    />
                    <Path
                        stroke="url(#bv)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="m57.833 66.102-21.767-37.7"
                    />
                    <G strokeLinecap="square" strokeWidth={0.3} opacity={0.8}>
                        <Path
                            stroke="url(#bw)"
                            d="m45.156 118.041 3.608-141.574"
                            opacity={0.034}
                        />
                        <Path
                            stroke="url(#bx)"
                            d="M50.393 113.86 43.529-19.348"
                            opacity={0.069}
                        />
                        <Path
                            stroke="url(#by)"
                            d="M55.334 109.31 38.59-14.794"
                            opacity={0.103}
                        />
                        <Path
                            stroke="url(#bz)"
                            d="M59.945 104.449 33.981-9.931"
                            opacity={0.138}
                        />
                        <Path
                            stroke="url(#bA)"
                            d="M64.195 99.342 29.733-4.82"
                            opacity={0.172}
                        />
                        <Path
                            stroke="url(#bB)"
                            d="M68.058 94.049 25.872.476"
                            opacity={0.207}
                        />
                        <Path
                            stroke="url(#bC)"
                            d="M71.513 88.63 22.42 5.896"
                            opacity={0.241}
                        />
                        <Path
                            stroke="url(#bD)"
                            d="M74.544 83.151 19.39 11.378"
                            opacity={0.276}
                        />
                        <Path
                            stroke="url(#bE)"
                            d="M77.14 77.667 16.798 16.863"
                            opacity={0.31}
                        />
                        <Path
                            stroke="url(#bF)"
                            d="M79.294 72.238 14.646 22.295"
                            opacity={0.345}
                        />
                        <Path
                            stroke="url(#bG)"
                            d="M81.007 66.918 12.936 27.617"
                            opacity={0.379}
                        />
                        <Path
                            stroke="url(#bH)"
                            d="m82.281 61.758-70.617-28.98"
                            opacity={0.414}
                        />
                        <Path
                            stroke="url(#bI)"
                            d="M83.126 56.808 10.822 37.729"
                            opacity={0.448}
                        />
                        <Path
                            stroke="url(#bJ)"
                            d="m83.554 52.11-73.157-9.683"
                            opacity={0.483}
                        />
                        <Path
                            stroke="url(#bK)"
                            d="m83.583 47.706-73.212-.874"
                            opacity={0.517}
                        />
                        <Path
                            stroke="url(#bL)"
                            d="m83.233 43.63-72.509 7.28"
                            opacity={0.552}
                        />
                        <Path
                            stroke="url(#bM)"
                            d="m82.53 39.912-71.1 14.715"
                            opacity={0.586}
                        />
                        <Path
                            stroke="url(#bN)"
                            d="M81.503 36.577 12.462 57.963"
                            opacity={0.621}
                        />
                        <Path
                            stroke="url(#bO)"
                            d="M80.18 33.645 13.788 60.895"
                            opacity={0.655}
                        />
                        <Path
                            stroke="url(#bP)"
                            d="M78.599 31.128 15.374 63.413"
                            opacity={0.69}
                        />
                        <Path
                            stroke="url(#bQ)"
                            d="M76.791 29.036 17.185 65.505"
                            opacity={0.724}
                        />
                        <Path
                            stroke="url(#bR)"
                            d="M74.796 27.371 19.185 67.17"
                            opacity={0.759}
                        />
                        <Path
                            stroke="url(#bS)"
                            d="M72.652 26.13 21.334 68.408"
                            opacity={0.793}
                        />
                        <Path
                            stroke="url(#bT)"
                            d="M70.397 25.306 23.594 69.23"
                            opacity={0.828}
                        />
                        <Path
                            stroke="url(#bU)"
                            d="M68.07 24.885 25.927 69.648"
                            opacity={0.862}
                        />
                        <Path
                            stroke="url(#bV)"
                            d="M65.712 24.85 28.29 69.68"
                            opacity={0.897}
                        />
                        <Path
                            stroke="url(#bW)"
                            d="m63.358 25.177-32.71 44.172"
                            opacity={0.931}
                        />
                        <Path
                            stroke="url(#bX)"
                            d="M61.047 25.84 32.964 68.68"
                            opacity={0.966}
                        />
                        <Path
                            stroke="url(#bY)"
                            d="M58.814 26.809 35.202 67.706"
                        />
                    </G>
                    <Path
                        stroke="url(#bZ)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="m46.386-19.334 1.256 133.15"
                        opacity={0.034}
                    />
                    <Path
                        stroke="url(#ca)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="m41.393-15.576 11.24 125.629"
                        opacity={0.069}
                    />
                    <Path
                        stroke="url(#cb)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="m36.702-11.459 20.62 117.393"
                        opacity={0.103}
                    />
                    <Path
                        stroke="url(#cc)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="m32.346-7.041 29.33 108.552"
                        opacity={0.138}
                    />
                    <Path
                        stroke="url(#cd)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="m28.352-2.377 37.315 99.22"
                        opacity={0.172}
                    />
                    <Path
                        stroke="url(#ce)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="m24.744 2.476 44.529 89.513"
                        opacity={0.207}
                    />
                    <Path
                        stroke="url(#cf)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="m21.54 7.458 50.935 79.546"
                        opacity={0.241}
                    />
                    <Path
                        stroke="url(#cg)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="m18.754 12.514 56.504 69.431"
                        opacity={0.276}
                    />
                    <Path
                        stroke="url(#ch)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="m16.394 17.588 61.221 59.281"
                        opacity={0.31}
                    />
                    <Path
                        stroke="url(#ci)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="m14.465 22.626 65.076 49.203"
                        opacity={0.345}
                    />
                    <Path
                        stroke="url(#cj)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="m12.966 27.576 68.072 39.301"
                        opacity={0.379}
                    />
                    <Path
                        stroke="url(#ck)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="M11.891 32.39 82.11 62.064"
                        opacity={0.414}
                    />
                    <Path
                        stroke="url(#cl)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="m11.23 37.022 71.537 20.407"
                        opacity={0.448}
                    />
                    <Path
                        stroke="url(#cm)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="M10.97 41.429 83.025 53.02"
                        opacity={0.483}
                    />
                    <Path
                        stroke="url(#cn)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="m11.09 45.574 71.81 3.301"
                        opacity={0.517}
                    />
                    <Path
                        stroke="url(#co)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="m11.571 49.423 70.846-4.398"
                        opacity={0.552}
                    />
                    <Path
                        stroke="url(#cp)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="m12.386 52.946 69.212-11.445"
                        opacity={0.586}
                    />
                    <Path
                        stroke="url(#cq)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="m13.507 56.121 66.967-17.794"
                        opacity={0.621}
                    />
                    <Path
                        stroke="url(#cr)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="M14.902 58.927 79.075 35.52"
                        opacity={0.655}
                    />
                    <Path
                        stroke="url(#cs)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="m16.538 61.349 60.896-28.251"
                        opacity={0.69}
                    />
                    <Path
                        stroke="url(#ct)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="m18.38 63.38 57.207-32.312"
                        opacity={0.724}
                    />
                    <Path
                        stroke="url(#cu)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="M20.393 65.016 73.57 29.434"
                        opacity={0.759}
                    />
                    <Path
                        stroke="url(#cv)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="M22.538 66.256 71.42 28.194"
                        opacity={0.793}
                    />
                    <Path
                        stroke="url(#cw)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="m24.776 67.108 44.401-39.764"
                        opacity={0.828}
                    />
                    <Path
                        stroke="url(#cx)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="m27.072 67.584 39.805-40.712"
                        opacity={0.862}
                    />
                    <Path
                        stroke="url(#cy)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="m29.386 67.697 35.172-40.935"
                        opacity={0.897}
                    />
                    <Path
                        stroke="url(#cz)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="m31.682 67.469 30.575-40.475"
                        opacity={0.931}
                    />
                    <Path
                        stroke="url(#cA)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="M33.925 66.923 60.01 27.545"
                        opacity={0.966}
                    />
                    <Path
                        stroke="url(#cB)"
                        strokeLinecap="square"
                        strokeWidth={0.3}
                        d="m36.083 66.087 21.766-37.7"
                    />
                    <G filter="url(#cC)">
                        <Path
                            fill="#fff"
                            d="M54.675 8.203C62.93 16.459 41.157 12.324 28.5 24.98 15.844 37.637 12.045 57.24 8.84 54.036c-3.203-3.204-4.688-25.21 7.968-37.866C29.466 3.514 46.42-.053 54.675 8.203Z"
                        />
                    </G>
                    <G filter="url(#cD)">
                        <Path
                            fill="#fff"
                            d="M42.685 86.939c-8.257-8.256 13.517-4.122 26.174-16.778C81.515 57.504 85.314 37.9 88.518 41.106c3.204 3.204 4.689 25.209-7.968 37.865-12.656 12.657-29.61 16.224-37.865 7.968Z"
                        />
                    </G>
                </G>
            </G>
        </G>
        <Defs>
            <LinearGradient
                id="k"
                x1={-16.407}
                x2={62.819}
                y1={80.191}
                y2={-22.374}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="l"
                x1={-10.237}
                x2={55.987}
                y1={82.733}
                y2={-19.44}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="m"
                x1={-3.882}
                x2={50.872}
                y1={84.832}
                y2={-15.842}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="n"
                x1={2.587}
                x2={47.272}
                y1={86.488}
                y2={-11.972}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="o"
                x1={9.098}
                x2={44.954}
                y1={87.706}
                y2={-8.111}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="p"
                x1={15.584}
                x2={43.676}
                y1={88.492}
                y2={-4.455}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="q"
                x1={21.979}
                x2={43.209}
                y1={88.862}
                y2={-1.127}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="r"
                x1={28.224}
                x2={43.339}
                y1={88.83}
                y2={1.799}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="s"
                x1={34.259}
                x2={43.874}
                y1={88.419}
                y2={4.288}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="t"
                x1={40.031}
                x2={44.642}
                y1={87.653}
                y2={6.336}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="u"
                x1={45.493}
                x2={45.493}
                y1={86.557}
                y2={7.955}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="v"
                x1={50.6}
                x2={46.292}
                y1={85.162}
                y2={9.18}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="w"
                x1={55.317}
                x2={46.924}
                y1={83.501}
                y2={10.06}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="x"
                x1={59.611}
                x2={47.288}
                y1={81.605}
                y2={10.652}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="y"
                x1={63.456}
                x2={47.3}
                y1={79.513}
                y2={11.027}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="z"
                x1={66.835}
                x2={46.89}
                y1={77.258}
                y2={11.268}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="A"
                x1={69.733}
                x2={46.004}
                y1={74.878}
                y2={11.468}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="B"
                x1={72.144}
                x2={44.608}
                y1={72.411}
                y2={11.737}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="C"
                x1={74.07}
                x2={42.69}
                y1={69.892}
                y2={12.196}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="D"
                x1={75.514}
                x2={40.268}
                y1={67.359}
                y2={12.98}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="E"
                x1={76.492}
                x2={37.4}
                y1={64.845}
                y2={14.238}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="F"
                x1={77.019}
                x2={34.194}
                y1={62.383}
                y2={16.119}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="G"
                x1={77.12}
                x2={30.823}
                y1={60.002}
                y2={18.763}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="H"
                x1={76.823}
                x2={27.534}
                y1={57.731}
                y2={22.27}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="I"
                x1={76.16}
                x2={24.64}
                y1={55.593}
                y2={26.662}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="J"
                x1={75.166}
                x2={22.5}
                y1={53.607}
                y2={31.835}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="K"
                x1={73.878}
                x2={21.451}
                y1={51.791}
                y2={37.528}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="L"
                x1={72.334}
                x2={21.722}
                y1={50.158}
                y2={43.327}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="M"
                x1={70.571}
                x2={23.346}
                y1={48.722}
                y2={48.722}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="N"
                x1={105.427}
                x2={24.808}
                y1={14.36}
                y2={110.568}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="O"
                x1={99.75}
                x2={31.48}
                y1={11.819}
                y2={108.913}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="P"
                x1={93.902}
                x2={36.809}
                y1={9.718}
                y2={106.486}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="Q"
                x1={87.949}
                x2={40.894}
                y1={8.06}
                y2={103.633}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="R"
                x1={81.955}
                x2={43.885}
                y1={6.839}
                y2={100.618}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="S"
                x1={75.983}
                x2={45.952}
                y1={6.046}
                y2={97.637}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="T"
                x1={70.093}
                x2={47.276}
                y1={5.672}
                y2={94.829}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="U"
                x1={64.341}
                x2={48.028}
                y1={5.696}
                y2={92.279}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="V"
                x1={58.781}
                x2={48.374}
                y1={6.1}
                y2={90.04}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="W"
                x1={53.461}
                x2={48.462}
                y1={6.86}
                y2={88.131}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="X"
                x1={48.428}
                x2={48.428}
                y1={7.949}
                y2={86.551}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="Y"
                x1={43.718}
                x2={48.39}
                y1={9.337}
                y2={85.275}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="Z"
                x1={39.369}
                x2={48.453}
                y1={10.991}
                y2={84.264}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="aa"
                x1={35.408}
                x2={48.707}
                y1={12.88}
                y2={83.468}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="ab"
                x1={31.858}
                x2={49.224}
                y1={14.967}
                y2={82.82}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="ac"
                x1={28.739}
                x2={50.06}
                y1={17.216}
                y2={82.243}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="ad"
                x1={26.061}
                x2={51.255}
                y1={19.59}
                y2={81.651}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="ae"
                x1={23.83}
                x2={52.826}
                y1={22.053}
                y2={80.948}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="af"
                x1={22.046}
                x2={54.766}
                y1={24.569}
                y2={80.027}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="ag"
                x1={20.704}
                x2={57.039}
                y1={27.101}
                y2={78.776}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="ah"
                x1={19.792}
                x2={59.57}
                y1={29.615}
                y2={77.086}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="ai"
                x1={19.294}
                x2={62.246}
                y1={32.08}
                y2={74.853}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="aj"
                x1={19.19}
                x2={64.906}
                y1={34.465}
                y2={72.003}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="ak"
                x1={19.453}
                x2={67.343}
                y1={36.743}
                y2={68.503}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="al"
                x1={20.055}
                x2={69.322}
                y1={38.89}
                y2={64.392}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="am"
                x1={20.965}
                x2={70.602}
                y1={40.883}
                y2={59.799}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="an"
                x1={22.148}
                x2={70.982}
                y1={42.708}
                y2={54.954}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="ao"
                x1={23.571}
                x2={70.351}
                y1={44.345}
                y2={50.166}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="ap"
                x1={25.195}
                x2={68.728}
                y1={45.784}
                y2={45.784}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="aq"
                x1={-13.24}
                x2={115.197}
                y1={8.83}
                y2={26.159}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="ar"
                x1={-12.356}
                x2={109.24}
                y1={15.444}
                y2={21.709}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="as"
                x1={-10.996}
                x2={103.566}
                y1={21.997}
                y2={19.078}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="at"
                x1={-9.197}
                x2={98.415}
                y1={28.427}
                y2={17.896}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="au"
                x1={-6.995}
                x2={93.912}
                y1={34.675}
                y2={17.818}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="av"
                x1={-4.434}
                x2={90.107}
                y1={40.685}
                y2={18.54}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="aw"
                x1={-1.555}
                x2={86.991}
                y1={46.408}
                y2={19.799}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="ax"
                x1={1.593}
                x2={84.522}
                y1={51.801}
                y2={21.375}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="ay"
                x1={4.967}
                x2={82.634}
                y1={56.822}
                y2={23.083}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="az"
                x1={8.517}
                x2={81.246}
                y1={61.437}
                y2={24.772}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="aA"
                x1={12.197}
                x2={80.268}
                y1={65.62}
                y2={26.319}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="aB"
                x1={15.958}
                x2={79.606}
                y1={69.346}
                y2={27.624}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="aC"
                x1={19.756}
                x2={79.16}
                y1={72.599}
                y2={28.61}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="aD"
                x1={23.544}
                x2={78.83}
                y1={75.371}
                y2={29.222}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="aE"
                x1={27.279}
                x2={78.511}
                y1={77.654}
                y2={29.419}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="aF"
                x1={30.921}
                x2={78.098}
                y1={79.452}
                y2={29.184}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="aG"
                x1={34.431}
                x2={77.481}
                y1={80.772}
                y2={28.518}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="aH"
                x1={37.773}
                x2={76.55}
                y1={81.627}
                y2={27.443}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="aI"
                x1={40.917}
                x2={75.194}
                y1={82.036}
                y2={26.012}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="aJ"
                x1={43.833}
                x2={73.304}
                y1={82.02}
                y2={24.306}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="aK"
                x1={46.499}
                x2={70.781}
                y1={81.609}
                y2={22.452}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="aL"
                x1={48.895}
                x2={67.548}
                y1={80.834}
                y2={20.615}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="aM"
                x1={51.008}
                x2={63.573}
                y1={79.732}
                y2={19.019}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="aN"
                x1={52.826}
                x2={58.891}
                y1={78.34}
                y2={17.923}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="aO"
                x1={54.346}
                x2={53.641}
                y1={76.696}
                y2={17.613}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="aP"
                x1={55.569}
                x2={48.092}
                y1={74.843}
                y2={18.346}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="aQ"
                x1={56.498}
                x2={42.636}
                y1={72.819}
                y2={20.284}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="aR"
                x1={57.139}
                x2={37.749}
                y1={70.665}
                y2={23.418}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="aS"
                x1={57.502}
                x2={33.89}
                y1={68.42}
                y2={27.523}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="aT"
                x1={104.688}
                x2={-18.939}
                y1={81.426}
                y2={59.712}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="aU"
                x1={104.051}
                x2={-14.17}
                y1={75.239}
                y2={64.662}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="aV"
                x1={102.946}
                x2={-9.404}
                y1={69.125}
                y2={68.064}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="aW"
                x1={101.406}
                x2={-4.89}
                y1={63.139}
                y2={70.175}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="aX"
                x1={99.467}
                x2={-0.784}
                y1={57.337}
                y2={71.258}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="aY"
                x1={97.166}
                x2={2.831}
                y1={51.77}
                y2={71.558}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="aZ"
                x1={94.546}
                x2={5.925}
                y1={46.481}
                y2={71.3}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="ba"
                x1={91.649}
                x2={8.51}
                y1={41.512}
                y2={70.676}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="bb"
                x1={88.519}
                x2={10.621}
                y1={36.9}
                y2={69.857}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="bc"
                x1={85.201}
                x2={12.318}
                y1={32.673}
                y2={68.979}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="bd"
                x1={81.741}
                x2={13.67}
                y1={28.858}
                y2={68.159}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="be"
                x1={78.185}
                x2={14.756}
                y1={25.474}
                y2={67.488}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="bf"
                x1={74.577}
                x2={15.662}
                y1={22.534}
                y2={67.038}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="bg"
                x1={70.961}
                x2={16.479}
                y1={20.048}
                y2={66.859}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="bh"
                x1={67.379}
                x2={17.299}
                y1={18.018}
                y2={66.983}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="bi"
                x1={63.872}
                x2={18.217}
                y1={16.44}
                y2={67.418}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="bj"
                x1={60.476}
                x2={19.326}
                y1={15.308}
                y2={68.158}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="bk"
                x1={57.227}
                x2={20.721}
                y1={14.607}
                y2={69.166}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="bl"
                x1={54.157}
                x2={22.489}
                y1={14.32}
                y2={70.385}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="bm"
                x1={51.293}
                x2={24.708}
                y1={14.424}
                y2={71.729}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="bn"
                x1={48.66}
                x2={27.438}
                y1={14.891}
                y2={73.076}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="bo"
                x1={46.276}
                x2={30.709}
                y1={15.693}
                y2={74.277}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="bp"
                x1={44.158}
                x2={34.508}
                y1={16.796}
                y2={75.156}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="bq"
                x1={42.317}
                x2={38.757}
                y1={18.162}
                y2={75.516}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="br"
                x1={40.759}
                x2={43.307}
                y1={19.757}
                y2={75.174}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="bs"
                x1={39.487}
                x2={47.924}
                y1={21.542}
                y2={73.987}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="bt"
                x1={38.499}
                x2={52.311}
                y1={23.478}
                y2={71.892}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="bu"
                x1={37.792}
                x2={56.142}
                y1={25.529}
                y2={68.952}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="bv"
                x1={37.359}
                x2={59.125}
                y1={27.655}
                y2={65.355}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="bw"
                x1={50.144}
                x2={99.356}
                y1={-24.1}
                y2={95.795}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="bx"
                x1={44.858}
                x2={100.231}
                y1={-20.027}
                y2={88.412}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="by"
                x1={39.863}
                x2={99.672}
                y1={-15.573}
                y2={82.182}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="bz"
                x1={35.195}
                x2={98.121}
                y1={-10.8}
                y2={77.129}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="bA"
                x1={30.885}
                x2={95.937}
                y1={-5.769}
                y2={73.191}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="bB"
                x1={26.961}
                x2={93.409}
                y1={-0.545}
                y2={70.257}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="bC"
                x1={23.443}
                x2={90.76}
                y1={4.808}
                y2={68.188}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="bD"
                x1={20.348}
                x2={88.161}
                y1={10.232}
                y2={66.838}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="bE"
                x1={17.686}
                x2={85.738}
                y1={15.663}
                y2={66.056}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="bF"
                x1={15.464}
                x2={83.581}
                y1={21.047}
                y2={65.699}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="bG"
                x1={13.682}
                x2={81.753}
                y1={26.324}
                y2={65.625}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="bH"
                x1={12.336}
                x2={80.292}
                y1={31.445}
                y2={65.704}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="bI"
                x1={11.417}
                x2={79.215}
                y1={36.36}
                y2={65.812}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="bJ"
                x1={10.911}
                x2={78.52}
                y1={41.026}
                y2={65.831}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="bK"
                x1={10.801}
                x2={78.189}
                y1={45.403}
                y2={65.654}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="bL"
                x1={11.065}
                x2={78.186}
                y1={49.457}
                y2={65.179}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="bM"
                x1={11.676}
                x2={78.455}
                y1={53.155}
                y2={64.311}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="bN"
                x1={12.607}
                x2={78.92}
                y1={56.478}
                y2={62.967}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="bO"
                x1={13.825}
                x2={79.482}
                y1={59.404}
                y2={61.077}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="bP"
                x1={15.297}
                x2={80.013}
                y1={61.922}
                y2={58.588}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="bQ"
                x1={16.986}
                x2={80.359}
                y1={64.026}
                y2={55.475}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="bR"
                x1={18.855}
                x2={80.332}
                y1={65.714}
                y2={51.758}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="bS"
                x1={20.865}
                x2={79.728}
                y1={66.991}
                y2={47.517}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="bT"
                x1={22.981}
                x2={78.335}
                y1={67.87}
                y2={42.914}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="bU"
                x1={25.164}
                x2={75.979}
                y1={68.365}
                y2={38.213}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="bV"
                x1={27.381}
                x2={72.569}
                y1={68.498}
                y2={33.773}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="bW"
                x1={29.597}
                x2={68.163}
                y1={68.29}
                y2={30.018}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="bX"
                x1={31.783}
                x2={63.006}
                y1={67.768}
                y2={27.353}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="bY"
                x1={33.909}
                x2={57.521}
                y1={66.96}
                y2={26.062}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="bZ"
                x1={46.24}
                x2={3.23}
                y1={114.328}
                y2={-3.594}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="ca"
                x1={51.279}
                x2={1.328}
                y1={110.681}
                y2={3.011}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="cb"
                x1={56.022}
                x2={0.765}
                y1={106.668}
                y2={8.84}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="cc"
                x1={60.435}
                x2={1.193}
                y1={102.341}
                y2={13.804}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="cd"
                x1={64.49}
                x2={2.309}
                y1={97.761}
                y2={17.901}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="ce"
                x1={68.161}
                x2={3.856}
                y1={92.985}
                y2={21.182}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="cf"
                x1={71.431}
                x2={5.627}
                y1={88.071}
                y2={23.733}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="cg"
                x1={74.285}
                x2={7.459}
                y1={83.077}
                y2={25.659}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="ch"
                x1={76.716}
                x2={9.225}
                y1={78.06}
                y2={27.078}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="ci"
                x1={78.717}
                x2={10.834}
                y1={73.074}
                y2={28.108}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="cj"
                x1={80.291}
                x2={12.22}
                y1={68.17}
                y2={28.869}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="ck"
                x1={81.444}
                x2={13.344}
                y1={63.399}
                y2={29.475}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="cl"
                x1={82.186}
                x2={14.187}
                y1={58.804}
                y2={30.034}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="cm"
                x1={82.531}
                x2={14.75}
                y1={54.429}
                y2={30.652}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="cn"
                x1={82.498}
                x2={15.053}
                y1={50.313}
                y2={31.425}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="co"
                x1={82.11}
                x2={15.134}
                y1={46.486}
                y2={32.437}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="cp"
                x1={81.393}
                x2={15.049}
                y1={42.979}
                y2={33.767}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="cq"
                x1={80.376}
                x2={14.873}
                y1={39.816}
                y2={35.48}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="cr"
                x1={79.089}
                x2={14.701}
                y1={37.014}
                y2={37.621}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="cs"
                x1={77.567}
                x2={14.647}
                y1={34.584}
                y2={40.213}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="ct"
                x1={75.845}
                x2={14.845}
                y1={32.538}
                y2={43.252}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="cu"
                x1={73.959}
                x2={15.441}
                y1={30.875}
                y2={46.686}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="cv"
                x1={71.946}
                x2={16.58}
                y1={29.591}
                y2={50.413}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="cw"
                x1={69.842}
                x2={18.392}
                y1={28.68}
                y2={54.274}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="cx"
                x1={67.682}
                x2={20.963}
                y1={28.129}
                y2={58.044}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="cy"
                x1={65.5}
                x2={24.3}
                y1={27.919}
                y2={61.449}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="cz"
                x1={63.329}
                x2={28.306}
                y1={28.032}
                y2={64.2}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="cA"
                x1={61.2}
                x2={32.768}
                y1={28.445}
                y2={66.048}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
                id="cB"
                x1={59.141}
                x2={37.375}
                y1={29.133}
                y2={66.833}
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.443} stopColor="#FCFCFC" />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <RadialGradient
                id="b"
                cx={0}
                cy={0}
                r={1}
                gradientTransform="matrix(-40.546 33.6571 -36.1106 -46.6558 82.346 25.595)"
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#0F80FE" />
                <Stop offset={1} stopColor="#0F80FE" stopOpacity={0} />
            </RadialGradient>
            <RadialGradient
                id="c"
                cx={0}
                cy={0}
                r={1}
                gradientTransform="matrix(-34.5895 -22.6184 24.2672 -39.8017 90.706 78.19)"
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#53B3F5" />
                <Stop offset={1} stopColor="#53B3F5" stopOpacity={0} />
            </RadialGradient>
            <RadialGradient
                id="d"
                cx={0}
                cy={0}
                r={1}
                gradientTransform="matrix(38.1425 26.8391 -28.7956 43.8901 25.184 25.595)"
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#5280F2" />
                <Stop offset={1} stopColor="#5280F2" stopOpacity={0} />
            </RadialGradient>
            <RadialGradient
                id="e"
                cx={0}
                cy={0}
                r={1}
                gradientTransform="matrix(52.3545 -24.6747 26.4733 60.2437 20.796 82.465)"
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#9380FE" />
                <Stop offset={1} stopColor="#9380FE" stopOpacity={0.2} />
            </RadialGradient>
            <RadialGradient
                id="f"
                cx={0}
                cy={0}
                r={1}
                gradientTransform="rotate(87.862 2.541 42.187) scale(67.5613)"
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.357} stopColor="#F71EFE" stopOpacity={0} />
                <Stop offset={0.753} stopColor="#BD83CC" stopOpacity={0.15} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0} />
            </RadialGradient>
            <RadialGradient
                id="g"
                cx={0}
                cy={0}
                r={1}
                gradientTransform="rotate(83.648 2.141 38.351) scale(62.3629)"
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.107} stopColor="#fff" stopOpacity={0} />
                <Stop offset={1} stopColor="#3A5367" />
            </RadialGradient>
            <RadialGradient
                id="h"
                cx={0}
                cy={0}
                r={1}
                gradientTransform="rotate(90 -.15 47.13) scale(46.98)"
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0.196} stopColor="#C4C4C4" stopOpacity={0} />
                <Stop offset={0.267} stopColor="#C4C4C4" />
                <Stop offset={0.776} stopColor="#C4C4C4" />
                <Stop offset={1} stopColor="#C4C4C4" stopOpacity={0} />
            </RadialGradient>
            <ClipPath id="a">
                <Rect width={93.96} height={93.96} fill="#fff" rx={46.98} />
            </ClipPath>
        </Defs>
    </Svg>
);
