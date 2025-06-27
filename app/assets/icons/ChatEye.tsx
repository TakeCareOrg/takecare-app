import React, { useEffect } from "react";

import { IconType } from "@dtypes/icon";

import Animated, {
    Easing,
    useAnimatedProps,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated";
import Svg, {
    Circle,
    ClipPath,
    Defs,
    Ellipse,
    G,
    LinearGradient,
    Mask,
    Path,
    RadialGradient,
    Rect,
    Stop,
} from "react-native-svg";

export function ChatEye({ height = 67, width = 67 }: IconType) {
    return (
        <Svg width={width} height={height} viewBox="0 0 67 67" fill="none">
            <G clipPath="url(#clip0_5762_5026)">
                <G clipPath="url(#clip1_5762_5026)">
                    <Path
                        transform="translate(-1.148 .6)"
                        fill="#fff"
                        d="M0 0H73.0769V68.1119H0z"
                    />
                    <G filter="url(#filter0_f_5762_5026)">
                        <Circle
                            cx={51.1596}
                            cy={26.1952}
                            r={43.1469}
                            fill="#00E5FF"
                        />
                    </G>
                    <G filter="url(#filter1_f_5762_5026)">
                        <Circle
                            cx={28.4317}
                            cy={66.5445}
                            r={40.3497}
                            fill="#9B7FFF"
                        />
                    </G>
                    <G filter="url(#filter2_f_5762_5026)">
                        <Ellipse
                            cx={-16.9178}
                            cy={4.55141}
                            rx={41.5734}
                            ry={42.8322}
                            fill="#7F9FFF"
                        />
                    </G>
                    <G filter="url(#filter3_f_5762_5026)">
                        <Ellipse
                            cx={66.614}
                            cy={52.1039}
                            rx={26.2937}
                            ry={31.3636}
                            fill="#fff"
                        />
                    </G>
                    <G filter="url(#filter4_f_5762_5026)">
                        <Ellipse
                            cx={98.9214}
                            cy={20.7057}
                            rx={19.3706}
                            ry={42.8322}
                            fill="#7F9FFF"
                        />
                    </G>
                </G>
                <Circle
                    cx={33.4527}
                    cy={33.4536}
                    r={32.8531}
                    transform="rotate(152.841 33.453 33.454)"
                    fill="url(#paint0_radial_5762_5026)"
                    fillOpacity={0.84}
                />
                <Circle
                    cx={33.4528}
                    cy={33.4532}
                    r={32.8531}
                    fill="url(#paint1_radial_5762_5026)"
                    fillOpacity={0.2}
                />
                <Mask
                    id="a"
                    style={{
                        maskType: "alpha",
                    }}
                    maskUnits="userSpaceOnUse"
                    x={0}
                    y={0}
                    width={67}
                    height={67}
                >
                    <Circle
                        cx={33.4528}
                        cy={33.6637}
                        r={32.8531}
                        fill="url(#paint2_radial_5762_5026)"
                    />
                </Mask>
                <G mask="url(#a)">
                    <Mask
                        id="b"
                        style={{
                            maskType: "alpha",
                        }}
                        maskUnits="userSpaceOnUse"
                        x={0}
                        y={0}
                        width={67}
                        height={67}
                    >
                        <Circle
                            cx={33.4528}
                            cy={33.6637}
                            r={32.8531}
                            fill="#C4C4C4"
                        />
                    </Mask>
                    <G mask="url(#b)">
                        <G
                            opacity={0.8}
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        >
                            <Path
                                opacity={0.0344828}
                                d="M76.952 10l-87 47.317"
                                stroke="url(#paint3_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.0689655}
                                d="M72.589 8.29L-5.684 59.025"
                                stroke="url(#paint4_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.103448}
                                d="M68.106 6.89L-1.198 60.421"
                                stroke="url(#paint5_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.137931}
                                d="M63.55 5.796L3.358 61.513"
                                stroke="url(#paint6_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.172414}
                                d="M58.97 5.008L7.94 62.3"
                                stroke="url(#paint7_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.206897}
                                d="M54.414 4.52L12.495 62.785"
                                stroke="url(#paint8_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.241379}
                                d="M49.926 4.321l-32.94 58.66"
                                stroke="url(#paint9_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.275862}
                                d="M45.547 4.402L21.364 62.898"
                                stroke="url(#paint10_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.310345}
                                d="M41.318 4.747L25.593 62.551"
                                stroke="url(#paint11_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.344828}
                                d="M37.277 5.34l-7.642 56.616"
                                stroke="url(#paint12_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.37931}
                                d="M33.456 6.164V61.13"
                                stroke="url(#paint13_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.413793}
                                d="M29.886 7.196l7.14 52.9"
                                stroke="url(#paint14_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.448276}
                                d="M26.593 8.416L40.32 58.875"
                                stroke="url(#paint15_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.482759}
                                d="M23.598 9.798l19.715 47.69"
                                stroke="url(#paint16_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.517241}
                                d="M20.92 11.321l25.07 44.644"
                                stroke="url(#paint17_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.551724}
                                d="M18.574 12.958l29.761 41.367"
                                stroke="url(#paint18_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.586207}
                                d="M16.568 14.684L50.34 52.598"
                                stroke="url(#paint19_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.62069}
                                d="M14.908 16.472L52 50.807"
                                stroke="url(#paint20_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.655172}
                                d="M13.595 18.298l39.718 30.68"
                                stroke="url(#paint21_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.689655}
                                d="M12.624 20.136l41.659 27.002"
                                stroke="url(#paint22_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.724138}
                                d="M11.988 21.962L54.916 45.31"
                                stroke="url(#paint23_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.758621}
                                d="M11.678 23.752l43.547 19.764"
                                stroke="url(#paint24_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.793103}
                                d="M11.676 25.485L55.223 41.78"
                                stroke="url(#paint25_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.827586}
                                d="M11.965 27.139L54.93 40.125"
                                stroke="url(#paint26_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.862069}
                                d="M12.523 28.695l41.846 9.872"
                                stroke="url(#paint27_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.896552}
                                d="M13.327 30.136l40.235 6.988"
                                stroke="url(#paint28_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.931035}
                                d="M14.348 31.447l38.188 4.364"
                                stroke="url(#paint29_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.965517}
                                d="M15.558 32.615l35.764 2.028"
                                stroke="url(#paint30_linear_5762_5026)"
                            />
                            <Path
                                d="M16.925 33.628h33.024"
                                stroke="url(#paint31_linear_5762_5026)"
                            />
                        </G>
                        <Path
                            opacity={0.0344828}
                            d="M-6.674 57.29L73.524 9.973"
                            stroke="url(#paint32_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.0689655}
                            d="M-2.652 58.999L69.5 8.266"
                            stroke="url(#paint33_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.103448}
                            d="M1.48 60.4L65.366 6.867"
                            stroke="url(#paint34_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.137931}
                            d="M5.68 61.494L61.167 5.776"
                            stroke="url(#paint35_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.172414}
                            d="M9.901 62.282L56.944 4.99"
                            stroke="url(#paint36_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.206897}
                            d="M14.102 62.77l38.64-58.265"
                            stroke="url(#paint37_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.241379}
                            d="M18.24 62.969l30.364-58.66"
                            stroke="url(#paint38_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.275862}
                            d="M22.275 62.888L44.567 4.392"
                            stroke="url(#paint39_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.310345}
                            d="M26.174 62.543L40.669 4.739"
                            stroke="url(#paint40_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.344828}
                            d="M29.898 61.95l7.045-56.615"
                            stroke="url(#paint41_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.37931}
                            d="M33.42 61.127V6.16"
                            stroke="url(#paint42_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.413793}
                            d="M36.712 60.094l-6.582-52.9"
                            stroke="url(#paint43_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.448276}
                            d="M39.748 58.875L27.094 8.415"
                            stroke="url(#paint44_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.482759}
                            d="M42.508 57.492L24.334 9.802"
                            stroke="url(#paint45_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.517241}
                            d="M44.977 55.97l-23.11-44.644"
                            stroke="url(#paint46_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.551724}
                            d="M47.139 54.333L19.704 12.966"
                            stroke="url(#paint47_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.586207}
                            d="M48.988 52.607L17.857 14.693"
                            stroke="url(#paint48_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.62069}
                            d="M50.519 50.819L16.327 16.484"
                            stroke="url(#paint49_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.655172}
                            d="M51.73 48.993l-36.613-30.68"
                            stroke="url(#paint50_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.689655}
                            d="M52.625 47.155L14.224 20.153"
                            stroke="url(#paint51_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.724138}
                            d="M53.21 45.329L13.64 21.982"
                            stroke="url(#paint52_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.758621}
                            d="M53.497 43.539L13.355 23.775"
                            stroke="url(#paint53_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.793103}
                            d="M53.499 41.806L13.357 25.51"
                            stroke="url(#paint54_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.827586}
                            d="M53.232 40.152L13.626 27.166"
                            stroke="url(#paint55_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.862069}
                            d="M52.718 38.596l-38.574-9.872"
                            stroke="url(#paint56_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.896552}
                            d="M51.977 37.155L14.89 30.167"
                            stroke="url(#paint57_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.931035}
                            d="M51.036 35.844l-35.202-4.365"
                            stroke="url(#paint58_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.965517}
                            d="M49.922 34.676l-32.968-2.028"
                            stroke="url(#paint59_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            d="M48.66 33.662H18.218"
                            stroke="url(#paint60_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <G
                            opacity={0.8}
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        >
                            <Path
                                opacity={0.0344828}
                                d="M75.68 59.496L-8.798 7.809"
                                stroke="url(#paint61_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.0689655}
                                d="M74.978 54.862l-83.073-42.42"
                                stroke="url(#paint62_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.103448}
                                d="M73.95 50.279L-7.065 17.027"
                                stroke="url(#paint63_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.137931}
                                d="M72.62 45.787l-78.35-24.27"
                                stroke="url(#paint64_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.172414}
                                d="M71.012 41.427L-4.12 25.877"
                                stroke="url(#paint65_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.206897}
                                d="M69.156 37.237l-71.419-7.17"
                                stroke="url(#paint66_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.241379}
                                d="M67.084 33.25l-67.271.803"
                                stroke="url(#paint67_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.275862}
                                d="M64.825 29.498l-62.75 8.306"
                                stroke="url(#paint68_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.310345}
                                d="M62.411 26.01L4.49 41.292"
                                stroke="url(#paint69_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.344828}
                                d="M59.877 22.806L7.027 44.495"
                                stroke="url(#paint70_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.37931}
                                d="M57.253 19.908L9.65 47.391"
                                stroke="url(#paint71_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.413793}
                                d="M54.574 17.332L12.332 49.966"
                                stroke="url(#paint72_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.448276}
                                d="M51.871 15.09L15.036 52.207"
                                stroke="url(#paint73_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.482759}
                                d="M49.177 13.188l-31.444 40.92"
                                stroke="url(#paint74_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.517241}
                                d="M46.52 11.631L20.392 55.664"
                                stroke="url(#paint75_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.551724}
                                d="M43.929 10.418L22.984 56.876"
                                stroke="url(#paint76_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.586207}
                                d="M41.432 9.543L25.483 57.748"
                                stroke="url(#paint77_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.62069}
                                d="M39.053 9L27.864 58.29"
                                stroke="url(#paint78_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.655172}
                                d="M36.815 8.775l-6.711 49.737"
                                stroke="url(#paint79_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.689655}
                                d="M34.737 8.853l-2.554 49.578"
                                stroke="url(#paint80_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.724138}
                                d="M32.838 9.216l1.245 48.85"
                                stroke="url(#paint81_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.758621}
                                d="M31.132 9.842l4.658 47.595"
                                stroke="url(#paint82_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.793103}
                                d="M29.63 10.707l7.662 45.861"
                                stroke="url(#paint83_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.827586}
                                d="M28.343 11.785L38.58 55.487"
                                stroke="url(#paint84_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.862069}
                                d="M27.275 13.046L39.65 54.221"
                                stroke="url(#paint85_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.896552}
                                d="M26.429 14.462l14.066 38.339"
                                stroke="url(#paint86_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.931035}
                                d="M25.804 16.002l15.314 35.254"
                                stroke="url(#paint87_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.965517}
                                d="M25.398 17.633L41.523 49.62"
                                stroke="url(#paint88_linear_5762_5026)"
                            />
                            <Path
                                d="M25.203 19.325l16.512 28.6"
                                stroke="url(#paint89_linear_5762_5026)"
                            />
                        </G>
                        <Path
                            opacity={0.0344828}
                            d="M-7.088 10.718L73.99 56.513"
                            stroke="url(#paint90_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.0689655}
                            d="M-6.558 15.055l80.013 37.12"
                            stroke="url(#paint91_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.103448}
                            d="M-5.704 19.335L72.6 47.895"
                            stroke="url(#paint92_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.137931}
                            d="M-4.552 23.519l75.996 20.193"
                            stroke="url(#paint93_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.172414}
                            d="M-3.123 27.568l73.136 12.095"
                            stroke="url(#paint94_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.206897}
                            d="M-1.446 31.45l69.78 4.33"
                            stroke="url(#paint95_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.241379}
                            d="M.45 35.132L66.434 32.1"
                            stroke="url(#paint96_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.275862}
                            d="M2.538 38.588l61.806-9.943"
                            stroke="url(#paint97_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.310345}
                            d="M4.786 41.791l57.308-16.348"
                            stroke="url(#paint98_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.344828}
                            d="M7.163 44.72l52.552-22.206"
                            stroke="url(#paint99_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.37931}
                            d="M9.637 47.36l47.602-27.484"
                            stroke="url(#paint100_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.413793}
                            d="M12.176 49.693l42.521-32.15"
                            stroke="url(#paint101_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.448276}
                            d="M14.75 51.713l37.372-36.188"
                            stroke="url(#paint102_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.482759}
                            d="M17.328 53.412l32.215-39.585"
                            stroke="url(#paint103_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.517241}
                            d="M19.88 54.788L46.99 12.453"
                            stroke="url(#paint104_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.551724}
                            d="M22.38 55.843L44.488 11.4"
                            stroke="url(#paint105_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.586207}
                            d="M24.798 56.581l17.269-45.918"
                            stroke="url(#paint106_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.62069}
                            d="M27.112 57.013l12.64-46.778"
                            stroke="url(#paint107_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.655172}
                            d="M29.3 57.148l8.263-47.047"
                            stroke="url(#paint108_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.689655}
                            d="M31.339 57.004l4.183-46.757"
                            stroke="url(#paint109_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.724138}
                            d="M33.213 56.599l.433-45.943"
                            stroke="url(#paint110_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.758621}
                            d="M34.907 55.952l-2.955-44.646"
                            stroke="url(#paint111_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.793103}
                            d="M36.408 55.087L30.45 12.174"
                            stroke="url(#paint112_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.827586}
                            d="M37.707 54.03L29.15 13.235"
                            stroke="url(#paint113_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.862069}
                            d="M38.798 52.805L28.06 14.464"
                            stroke="url(#paint114_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.896552}
                            d="M39.675 51.444L27.182 15.83"
                            stroke="url(#paint115_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.931035}
                            d="M40.34 49.973L26.518 17.305"
                            stroke="url(#paint116_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.965517}
                            d="M40.794 48.423L26.066 18.858"
                            stroke="url(#paint117_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            d="M41.042 46.825L25.821 20.46"
                            stroke="url(#paint118_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <G
                            opacity={0.8}
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        >
                            <Path
                                opacity={0.0344828}
                                d="M32.178 83.147L34.7-15.856"
                                stroke="url(#paint119_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.0689655}
                                d="M35.84 80.224l-4.8-93.153"
                                stroke="url(#paint120_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.103448}
                                d="M39.295 77.041L27.585-9.745"
                                stroke="url(#paint121_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.137931}
                                d="M42.52 73.643L24.363-6.344"
                                stroke="url(#paint122_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.172414}
                                d="M45.491 70.07L21.392-2.77"
                                stroke="url(#paint123_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.206897}
                                d="M48.192 66.37L18.692.933"
                                stroke="url(#paint124_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.241379}
                                d="M50.61 62.581L16.278 4.724"
                                stroke="url(#paint125_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.275862}
                                d="M52.728 58.748L14.16 8.559"
                                stroke="url(#paint126_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.310345}
                                d="M54.544 54.914l-42.197-42.52"
                                stroke="url(#paint127_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.344828}
                                d="M56.05 51.117L10.843 16.192"
                                stroke="url(#paint128_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.37931}
                                d="M57.248 47.397L9.646 19.913"
                                stroke="url(#paint129_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.413793}
                                d="M58.14 43.789L8.757 23.522"
                                stroke="url(#paint130_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.448276}
                                d="M58.73 40.327L8.169 26.985"
                                stroke="url(#paint131_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.482759}
                                d="M59.03 37.042L7.87 30.271"
                                stroke="url(#paint132_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.517241}
                                d="M59.05 33.962L7.853 33.35"
                                stroke="url(#paint133_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.551724}
                                d="M58.806 31.112L8.1 36.202"
                                stroke="url(#paint134_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.586207}
                                d="M58.313 28.512l-49.72 10.29"
                                stroke="url(#paint135_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.62069}
                                d="M57.595 26.18L9.315 41.135"
                                stroke="url(#paint136_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.655172}
                                d="M56.67 24.129L10.243 43.186"
                                stroke="url(#paint137_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.689655}
                                d="M55.563 22.369L11.35 44.945"
                                stroke="url(#paint138_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.724138}
                                d="M54.3 20.906L12.617 46.408"
                                stroke="url(#paint139_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.758621}
                                d="M52.905 19.741L14.016 47.572"
                                stroke="url(#paint140_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.793103}
                                d="M51.405 18.874L15.52 48.439"
                                stroke="url(#paint141_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.827586}
                                d="M49.83 18.297L17.1 49.014"
                                stroke="url(#paint142_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.862069}
                                d="M48.201 18.003L18.73 49.306"
                                stroke="url(#paint143_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.896552}
                                d="M46.552 17.978l-26.17 31.35"
                                stroke="url(#paint144_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.931035}
                                d="M44.906 18.207l-22.874 30.89"
                                stroke="url(#paint145_linear_5762_5026)"
                            />
                            <Path
                                opacity={0.965517}
                                d="M43.29 18.67L23.652 48.63"
                                stroke="url(#paint146_linear_5762_5026)"
                            />
                            <Path
                                d="M41.728 19.348l-16.512 28.6"
                                stroke="url(#paint147_linear_5762_5026)"
                            />
                        </G>
                        <Path
                            opacity={0.0344828}
                            d="M33.037-12.92l.879 93.113"
                            stroke="url(#paint148_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.0689655}
                            d="M29.546-10.291l7.86 87.852"
                            stroke="url(#paint149_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.103448}
                            d="M26.266-7.413L40.684 74.68"
                            stroke="url(#paint150_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.137931}
                            d="M23.22-4.323l20.51 75.91"
                            stroke="url(#paint151_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.172414}
                            d="M20.426-1.061L46.52 68.324"
                            stroke="url(#paint152_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.206897}
                            d="M17.903 2.332l31.14 62.597"
                            stroke="url(#paint153_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.241379}
                            d="M15.662 5.816l35.619 55.627"
                            stroke="url(#paint154_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.275862}
                            d="M13.714 9.352l39.513 48.554"
                            stroke="url(#paint155_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.310345}
                            d="M12.065 12.9l42.811 41.456"
                            stroke="url(#paint156_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.344828}
                            d="M10.715 16.423l45.508 34.408"
                            stroke="url(#paint157_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.37931}
                            d="M9.667 19.885l47.602 27.483"
                            stroke="url(#paint158_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.413793}
                            d="M8.915 23.252l49.104 20.75"
                            stroke="url(#paint159_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.448276}
                            d="M8.453 26.49L58.48 40.761"
                            stroke="url(#paint160_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.482759}
                            d="M8.27 29.572L58.66 37.68"
                            stroke="url(#paint161_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.517241}
                            d="M8.355 32.47l50.217 2.31"
                            stroke="url(#paint162_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.551724}
                            d="M8.691 35.162l49.543-3.075"
                            stroke="url(#paint163_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.586207}
                            d="M9.26 37.627l48.401-8.004"
                            stroke="url(#paint164_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.62069}
                            d="M10.045 39.846l46.83-12.443"
                            stroke="url(#paint165_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.655172}
                            d="M11.02 41.808l44.877-16.367"
                            stroke="url(#paint166_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.689655}
                            d="M12.164 43.502L54.75 23.746"
                            stroke="url(#paint167_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.724138}
                            d="M13.453 44.922l40.005-22.596"
                            stroke="url(#paint168_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.758621}
                            d="M14.86 46.066l37.187-24.882"
                            stroke="url(#paint169_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.793103}
                            d="M16.36 46.934l34.184-26.617"
                            stroke="url(#paint170_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.827586}
                            d="M17.926 47.53l31.05-27.807"
                            stroke="url(#paint171_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.862069}
                            d="M19.531 47.862l27.836-28.47"
                            stroke="url(#paint172_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.896552}
                            d="M21.148 47.941l24.597-28.626"
                            stroke="url(#paint173_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.931035}
                            d="M22.755 47.782l21.38-28.304"
                            stroke="url(#paint174_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            opacity={0.965517}
                            d="M24.324 47.4l18.24-27.537"
                            stroke="url(#paint175_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <Path
                            d="M25.832 46.815l15.221-26.363"
                            stroke="url(#paint176_linear_5762_5026)"
                            strokeWidth={0.20979}
                            strokeLinecap="square"
                        />
                        <G filter="url(#filter5_f_5762_5026)">
                            <Path
                                d="M38.833 6.337C44.607 12.11 29.38 9.219 20.53 18.07 11.678 26.92 9.021 40.628 6.781 38.388c-2.24-2.24-3.279-17.629 5.572-26.48 8.85-8.85 20.706-11.345 26.48-5.571z"
                                fill="#fff"
                            />
                        </G>
                        <G filter="url(#filter6_f_5762_5026)">
                            <Path
                                d="M30.45 61.398c-5.774-5.774 9.452-2.883 18.303-11.733 8.85-8.851 11.507-22.559 13.747-20.319 2.24 2.241 3.28 17.63-5.572 26.48-8.85 8.85-20.705 11.345-26.479 5.572z"
                                fill="#fff"
                            />
                        </G>
                    </G>
                </G>
            </G>
            <Defs>
                <RadialGradient
                    id="paint0_radial_5762_5026"
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="rotate(87.862 1.765 30.112) scale(47.2457)"
                >
                    <Stop
                        offset={0.356548}
                        stopColor="#F71EFE"
                        stopOpacity={0}
                    />
                    <Stop
                        offset={0.753497}
                        stopColor="#BD83CC"
                        stopOpacity={0.15}
                    />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </RadialGradient>
                <RadialGradient
                    id="paint1_radial_5762_5026"
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="rotate(83.648 1.462 27.454) scale(43.6104)"
                >
                    <Stop offset={0.106603} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#3A5367" />
                </RadialGradient>
                <RadialGradient
                    id="paint2_radial_5762_5026"
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="rotate(90 -.105 33.558) scale(32.8531)"
                >
                    <Stop
                        offset={0.195852}
                        stopColor="#C4C4C4"
                        stopOpacity={0}
                    />
                    <Stop offset={0.267419} stopColor="#C4C4C4" />
                    <Stop offset={0.775733} stopColor="#C4C4C4" />
                    <Stop offset={1} stopColor="#C4C4C4" stopOpacity={0} />
                </RadialGradient>
                <LinearGradient
                    id="paint3_linear_5762_5026"
                    x1={-11.2295}
                    y1={56.4045}
                    x2={44.1734}
                    y2={-15.3197}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint4_linear_5762_5026"
                    x1={-6.9363}
                    y1={58.2118}
                    x2={39.3743}
                    y2={-13.2378}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint5_linear_5762_5026"
                    x1={-2.50955}
                    y1={59.7094}
                    x2={35.7795}
                    y2={-10.6919}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint6_linear_5762_5026"
                    x1={1.99902}
                    y1={60.8964}
                    x2={33.2476}
                    y2={-7.9566}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint7_linear_5762_5026"
                    x1={6.54069}
                    y1={61.7761}
                    x2={31.6148}
                    y2={-5.22866}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint8_linear_5762_5026"
                    x1={11.0669}
                    y1={62.3536}
                    x2={30.7119}
                    y2={-2.64424}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint9_linear_5762_5026"
                    x1={15.5329}
                    y1={62.6386}
                    x2={30.3784}
                    y2={-0.29014}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint10_linear_5762_5026"
                    x1={19.8938}
                    y1={62.6431}
                    x2={30.4637}
                    y2={1.78231}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint11_linear_5762_5026"
                    x1={24.1103}
                    y1={62.3815}
                    x2={30.8342}
                    y2={3.54886}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint12_linear_5762_5026"
                    x1={28.1453}
                    y1={61.8712}
                    x2={31.37}
                    y2={5.00583}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint13_linear_5762_5026"
                    x1={31.9635}
                    y1={61.1301}
                    x2={31.9635}
                    y2={6.16357}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint14_linear_5762_5026"
                    x1={35.5361}
                    y1={60.1803}
                    x2={32.523}
                    y2={7.04625}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint15_linear_5762_5026"
                    x1={38.837}
                    y1={59.0441}
                    x2={32.9675}
                    y2={7.68698}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint16_linear_5762_5026"
                    x1={41.8425}
                    y1={57.7443}
                    x2={33.2252}
                    y2={8.12629}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint17_linear_5762_5026"
                    x1={44.5375}
                    y1={56.3073}
                    x2={33.2393}
                    y2={8.41525}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint18_linear_5762_5026"
                    x1={46.9067}
                    y1={54.7572}
                    x2={32.9592}
                    y2={8.61027}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint19_linear_5762_5026"
                    x1={48.9427}
                    y1={53.1207}
                    x2={32.3491}
                    y2={8.77823}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint20_linear_5762_5026"
                    x1={50.6409}
                    y1={51.4236}
                    x2={31.3847}
                    y2={8.99441}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint21_linear_5762_5026"
                    x1={52.002}
                    y1={49.6912}
                    x2={30.0583}
                    y2={9.34381}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint22_linear_5762_5026"
                    x1={53.0303}
                    y1={47.9494}
                    x2={28.3826}
                    y2={9.92217}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint23_linear_5762_5026"
                    x1={53.7344}
                    y1={46.2216}
                    x2={26.3978}
                    y2={10.8319}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint24_linear_5762_5026"
                    x1={54.1293}
                    y1={44.5298}
                    x2={24.182}
                    y2={12.1777}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint25_linear_5762_5026"
                    x1={54.2305}
                    y1={42.8954}
                    x2={21.8552}
                    y2={14.057}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint26_linear_5762_5026"
                    x1={54.0591}
                    y1={41.3363}
                    x2={19.5909}
                    y2={16.5386}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint27_linear_5762_5026"
                    x1={53.638}
                    y1={39.8679}
                    x2={17.6101}
                    y2={19.6366}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint28_linear_5762_5026"
                    x1={52.9918}
                    y1={38.5028}
                    x2={16.1624}
                    y2={23.2774}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint29_linear_5762_5026"
                    x1={52.1443}
                    y1={37.2514}
                    x2={15.4818}
                    y2={27.2776}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint30_linear_5762_5026"
                    x1={51.1222}
                    y1={36.1219}
                    x2={15.7291}
                    y2={31.3445}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint31_linear_5762_5026"
                    x1={49.949}
                    y1={35.1209}
                    x2={16.9248}
                    y2={35.1209}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint32_linear_5762_5026"
                    x1={74.6683}
                    y1={10.9318}
                    x2={18.2916}
                    y2={78.2101}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint33_linear_5762_5026"
                    x1={70.7214}
                    y1={9.12441}
                    x2={22.9802}
                    y2={77.0221}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint34_linear_5762_5026"
                    x1={66.6511}
                    y1={7.62543}
                    x2={26.726}
                    y2={75.2952}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint35_linear_5762_5026"
                    x1={62.5052}
                    y1={6.43555}
                    x2={29.5999}
                    y2={73.27}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint36_linear_5762_5026"
                    x1={58.3264}
                    y1={5.55227}
                    x2={31.7038}
                    y2={71.1325}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint37_linear_5762_5026"
                    x1={54.1608}
                    y1={4.96967}
                    x2={33.1604}
                    y2={69.0195}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint38_linear_5762_5026"
                    x1={50.05}
                    y1={4.67875}
                    x2={34.094}
                    y2={67.0263}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint39_linear_5762_5026"
                    x1={46.0339}
                    y1={4.66788}
                    x2={34.6265}
                    y2={65.2152}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint40_linear_5762_5026"
                    x1={42.1507}
                    y1={4.92269}
                    x2={34.8731}
                    y2={63.6215}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint41_linear_5762_5026"
                    x1={38.4325}
                    y1={5.42651}
                    x2={34.9364}
                    y2={62.2596}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint42_linear_5762_5026"
                    x1={34.9134}
                    y1={6.1599}
                    x2={34.9134}
                    y2={61.1265}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint43_linear_5762_5026"
                    x1={31.6194}
                    y1={7.10264}
                    x2={34.8862}
                    y2={60.2065}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint44_linear_5762_5026"
                    x1={28.5754}
                    y1={8.23229}
                    x2={34.9283}
                    y2={59.4726}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint45_linear_5762_5026"
                    x1={25.8006}
                    y1={9.52525}
                    x2={35.1007}
                    y2={58.8877}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint46_linear_5762_5026"
                    x1={23.3133}
                    y1={10.9564}
                    x2={35.4566}
                    y2={58.4061}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint47_linear_5762_5026"
                    x1={21.1227}
                    y1={12.5006}
                    x2={36.0325}
                    y2={57.9745}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint48_linear_5762_5026"
                    x1={19.2396}
                    y1={14.132}
                    x2={36.8579}
                    y2={57.5318}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint49_linear_5762_5026"
                    x1={17.6659}
                    y1={15.825}
                    x2={37.943}
                    y2={57.0103}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint50_linear_5762_5026"
                    x1={16.402}
                    y1={17.5545}
                    x2={39.2833}
                    y2={56.3364}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint51_linear_5762_5026"
                    x1={15.4444}
                    y1={19.2949}
                    x2={40.8534}
                    y2={55.4318}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint52_linear_5762_5026"
                    x1={14.784}
                    y1={21.0232}
                    x2={42.6011}
                    y2={54.2193}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint53_linear_5762_5026"
                    x1={14.4082}
                    y1={22.7175}
                    x2={44.4446}
                    y2={52.6289}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint54_linear_5762_5026"
                    x1={14.3036}
                    y1={24.3561}
                    x2={46.2727}
                    y2={50.6063}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint55_linear_5762_5026"
                    x1={14.4508}
                    y1={25.922}
                    x2={47.9403}
                    y2={48.1317}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint56_linear_5762_5026"
                    x1={14.8303}
                    y1={27.3985}
                    x2={49.2824}
                    y2={45.2323}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint57_linear_5762_5026"
                    x1={15.42}
                    y1={28.7724}
                    x2={50.1311}
                    y2={42.0001}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint58_linear_5762_5026"
                    x1={16.1966}
                    y1={30.0316}
                    x2={50.3461}
                    y2={38.5954}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint59_linear_5762_5026"
                    x1={17.1382}
                    y1={31.1666}
                    x2={49.852}
                    y2={35.2371}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint60_linear_5762_5026"
                    x1={18.218}
                    y1={32.1696}
                    x2={48.6602}
                    y2={32.1696}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint61_linear_5762_5026"
                    x1={-8.59856}
                    y1={6.3303}
                    x2={81.2179}
                    y2={18.4486}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint62_linear_5762_5026"
                    x1={-8.01816}
                    y1={10.9521}
                    x2={77.0143}
                    y2={15.3335}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint63_linear_5762_5026"
                    x1={-7.102}
                    y1={15.5345}
                    x2={73.0119}
                    y2={13.4932}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint64_linear_5762_5026"
                    x1={-5.87471}
                    y1={20.0323}
                    x2={69.3781}
                    y2={12.6679}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint65_linear_5762_5026"
                    x1={-4.36561}
                    y1={24.4054}
                    x2={66.1992}
                    y2={12.6179}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint66_linear_5762_5026"
                    x1={-2.6031}
                    y1={28.6141}
                    x2={63.5092}
                    y2={13.1282}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint67_linear_5762_5026"
                    x1={-0.616782}
                    y1={32.624}
                    x2={61.3039}
                    y2={14.0162}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint68_linear_5762_5026"
                    x1={1.56025}
                    y1={36.4029}
                    x2={59.5522}
                    y2={15.1263}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint69_linear_5762_5026"
                    x1={3.89422}
                    y1={39.9239}
                    x2={58.2067}
                    y2={16.3306}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint70_linear_5762_5026"
                    x1={6.35424}
                    y1={43.1623}
                    x2={57.2134}
                    y2={17.5222}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint71_linear_5762_5026"
                    x1={8.90423}
                    y1={46.0989}
                    x2={56.5067}
                    y2={18.6157}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint72_linear_5762_5026"
                    x1={11.5135}
                    y1={48.7181}
                    x2={56.0224}
                    y2={19.5417}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint73_linear_5762_5026"
                    x1={14.1476}
                    y1={51.0079}
                    x2={55.6894}
                    y2={20.2462}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint74_linear_5762_5026"
                    x1={16.7767}
                    y1={52.962}
                    x2={55.4386}
                    y2={20.6901}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint75_linear_5762_5026"
                    x1={19.3688}
                    y1={54.5769}
                    x2={55.1954}
                    y2={20.8464}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint76_linear_5762_5026"
                    x1={21.8958}
                    y1={55.8542}
                    x2={54.8865}
                    y2={20.7019}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint77_linear_5762_5026"
                    x1={24.3313}
                    y1={56.799}
                    x2={54.4362}
                    y2={20.2573}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint78_linear_5762_5026"
                    x1={26.6503}
                    y1={57.4212}
                    x2={53.7669}
                    y2={19.5302}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint79_linear_5762_5026"
                    x1={28.8306}
                    y1={57.7333}
                    x2={52.8007}
                    y2={18.5558}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint80_linear_5762_5026"
                    x1={30.8535}
                    y1={57.7524}
                    x2={51.4622}
                    y2={17.3933}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint81_linear_5762_5026"
                    x1={32.7019}
                    y1={57.4991}
                    x2={49.682}
                    y2={16.13}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint82_linear_5762_5026"
                    x1={34.3639}
                    y1={56.9951}
                    x2={47.408}
                    y2={14.8839}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint83_linear_5762_5026"
                    x1={35.8302}
                    y1={56.2658}
                    x2={44.6174}
                    y2={13.8088}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint84_linear_5762_5026"
                    x1={37.0944}
                    y1={55.3381}
                    x2={41.3357}
                    y2={13.089}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint85_linear_5762_5026"
                    x1={38.1565}
                    y1={54.2392}
                    x2={37.6634}
                    y2={12.9224}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint86_linear_5762_5026"
                    x1={39.015}
                    y1={52.9965}
                    x2={33.7858}
                    y2={13.4886}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint87_linear_5762_5026"
                    x1={39.6751}
                    y1={51.6371}
                    x2={29.9814}
                    y2={14.8996}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint88_linear_5762_5026"
                    x1={40.1425}
                    y1={50.1867}
                    x2={26.5832}
                    y2={17.1467}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint89_linear_5762_5026"
                    x1={40.4227}
                    y1={48.6708}
                    x2={23.9106}
                    y2={20.071}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint90_linear_5762_5026"
                    x1={73.7306}
                    y1={57.983}
                    x2={-12.7225}
                    y2={42.7985}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint91_linear_5762_5026"
                    x1={73.3219}
                    y1={53.6614}
                    x2={-9.34981}
                    y2={46.2652}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint92_linear_5762_5026"
                    x1={72.5857}
                    y1={49.3874}
                    x2={-5.98065}
                    y2={48.6461}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint93_linear_5762_5026"
                    x1={71.5422}
                    y1={45.201}
                    x2={-2.79079}
                    y2={50.1214}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint94_linear_5762_5026"
                    x1={70.2186}
                    y1={41.1409}
                    x2={0.113154}
                    y2={50.8752}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint95_linear_5762_5026"
                    x1={68.6403}
                    y1={37.2416}
                    x2={2.67138}
                    y2={51.0796}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint96_linear_5762_5026"
                    x1={66.8362}
                    y1={33.5362}
                    x2={4.86363}
                    y2={50.8917}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint97_linear_5762_5026"
                    x1={64.8376}
                    y1={30.0532}
                    x2={6.69842}
                    y2={50.4478}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint98_linear_5762_5026"
                    x1={62.6752}
                    y1={26.8172}
                    x2={8.20172}
                    y2={49.8641}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint99_linear_5762_5026"
                    x1={60.3807}
                    y1={23.8499}
                    x2={9.41366}
                    y2={49.2386}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint100_linear_5762_5026"
                    x1={57.9854}
                    y1={21.1686}
                    x2={10.383}
                    y2={48.6519}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint101_linear_5762_5026"
                    x1={55.5216}
                    y1={18.7873}
                    x2={11.1657}
                    y2={48.1684}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint102_linear_5762_5026"
                    x1={53.0216}
                    y1={16.7158}
                    x2={11.8226}
                    y2={47.8376}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint103_linear_5762_5026"
                    x1={50.5151}
                    y1={14.9593}
                    x2={12.416}
                    y2={47.6947}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint104_linear_5762_5026"
                    x1={48.0319}
                    y1={13.52}
                    x2={13.011}
                    y2={47.7613}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint105_linear_5762_5026"
                    x1={45.5998}
                    y1={12.396}
                    x2={13.6732}
                    y2={48.0453}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint106_linear_5762_5026"
                    x1={43.2442}
                    y1={11.5802}
                    x2={14.468}
                    y2={48.538}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint107_linear_5762_5026"
                    x1={40.9915}
                    y1={11.0645}
                    x2={15.4626}
                    y2={49.2177}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint108_linear_5762_5026"
                    x1={38.8628}
                    y1={10.8346}
                    x2={16.7173}
                    y2={50.0413}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint109_linear_5762_5026"
                    x1={36.8759}
                    y1={10.8751}
                    x2={18.285}
                    y2={50.9484}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint110_linear_5762_5026"
                    x1={35.0485}
                    y1={11.1672}
                    x2={20.2084}
                    y2={51.8555}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint111_linear_5762_5026"
                    x1={33.3944}
                    y1={11.6891}
                    x2={22.5085}
                    y2={52.6571}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint112_linear_5762_5026"
                    x1={31.9222}
                    y1={12.4179}
                    x2={25.1735}
                    y2={53.2291}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint113_linear_5762_5026"
                    x1={30.6397}
                    y1={13.3285}
                    x2={28.1502}
                    y2={53.4361}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint114_linear_5762_5026"
                    x1={29.5512}
                    y1={14.3951}
                    x2={31.3327}
                    y2={53.1484}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint115_linear_5762_5026"
                    x1={28.6554}
                    y1={15.5929}
                    x2={34.5555}
                    y2={52.2674}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint116_linear_5762_5026"
                    x1={27.9535}
                    y1={16.8951}
                    x2={37.6118}
                    y2={50.7514}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint117_linear_5762_5026"
                    x1={27.4411}
                    y1={18.2773}
                    x2={40.2729}
                    y2={48.6435}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint118_linear_5762_5026"
                    x1={27.1135}
                    y1={19.7148}
                    x2={42.3345}
                    y2={46.0785}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint119_linear_5762_5026"
                    x1={36.0811}
                    y1={-16.4223}
                    x2={70.4946}
                    y2={67.4201}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint120_linear_5762_5026"
                    x1={32.3693}
                    y1={-13.6078}
                    x2={71.0912}
                    y2={62.2231}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint121_linear_5762_5026"
                    x1={28.8587}
                    y1={-10.5235}
                    x2={70.6835}
                    y2={57.8365}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint122_linear_5762_5026"
                    x1={25.5765}
                    y1={-7.21223}
                    x2={69.5806}
                    y2={54.2764}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint123_linear_5762_5026"
                    x1={22.5439}
                    y1={-3.71879}
                    x2={68.0346}
                    y2={51.4984}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint124_linear_5762_5026"
                    x1={19.7802}
                    y1={-0.0876597}
                    x2={66.2475}
                    y2={49.4243}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint125_linear_5762_5026"
                    x1={17.3016}
                    y1={3.63723}
                    x2={64.3767}
                    y2={47.9582}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint126_linear_5762_5026"
                    x1={15.1167}
                    y1={7.41168}
                    x2={62.5387}
                    y2={46.9959}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint127_linear_5762_5026"
                    x1={13.2351}
                    y1={11.1942}
                    x2={60.8237}
                    y2={46.4336}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint128_linear_5762_5026"
                    x1={11.6601}
                    y1={14.9435}
                    x2={59.2946}
                    y2={46.1687}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint129_linear_5762_5026"
                    x1={10.3919}
                    y1={18.6206}
                    x2={57.9943}
                    y2={46.1039}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint130_linear_5762_5026"
                    x1={9.42859}
                    y1={22.1897}
                    x2={56.9505}
                    y2={46.1473}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint131_linear_5762_5026"
                    x1={8.76276}
                    y1={25.6162}
                    x2={56.1741}
                    y2={46.2116}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint132_linear_5762_5026"
                    x1={8.38442}
                    y1={28.8695}
                    x2={55.6636}
                    y2={46.2157}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint133_linear_5762_5026"
                    x1={8.28248}
                    y1={31.9215}
                    x2={55.4073}
                    y2={46.083}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint134_linear_5762_5026"
                    x1={8.44024}
                    y1={34.7489}
                    x2={55.3784}
                    y2={45.7435}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint135_linear_5762_5026"
                    x1={8.83882}
                    y1={37.3301}
                    x2={55.5373}
                    y2={45.1309}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint136_linear_5762_5026"
                    x1={9.45956}
                    y1={39.6494}
                    x2={55.8324}
                    y2={44.1876}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint137_linear_5762_5026"
                    x1={10.2798}
                    y1={41.6939}
                    x2={56.1935}
                    y2={42.8638}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint138_linear_5762_5026"
                    x1={11.2735}
                    y1={43.4549}
                    x2={56.5298}
                    y2={41.123}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint139_linear_5762_5026"
                    x1={12.4177}
                    y1={44.9294}
                    x2={56.7344}
                    y2={38.95}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint140_linear_5762_5026"
                    x1={13.6857}
                    y1={46.1167}
                    x2={56.6772}
                    y2={36.3576}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint141_linear_5762_5026"
                    x1={15.05}
                    y1={47.0222}
                    x2={56.2124}
                    y2={33.4036}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint142_linear_5762_5026"
                    x1={16.4865}
                    y1={47.6532}
                    x2={55.196}
                    y2={30.2017}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint143_linear_5762_5026"
                    x1={17.9677}
                    y1={48.0226}
                    x2={53.5025}
                    y2={26.9372}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint144_linear_5762_5026"
                    x1={19.4734}
                    y1={48.1451}
                    x2={51.0736}
                    y2={23.8626}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint145_linear_5762_5026"
                    x1={20.981}
                    y1={48.0376}
                    x2={47.9497}
                    y2={21.2738}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint146_linear_5762_5026"
                    x1={22.4704}
                    y1={47.7172}
                    x2={44.3044}
                    y2={19.4545}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint147_linear_5762_5026"
                    x1={23.9239}
                    y1={47.2017}
                    x2={40.436}
                    y2={18.6019}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint148_linear_5762_5026"
                    x1={32.5135}
                    y1={80.704}
                    x2={2.43707}
                    y2={-1.75878}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint149_linear_5762_5026"
                    x1={36.0517}
                    y1={78.1893}
                    x2={1.12115}
                    y2={2.89538}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint150_linear_5762_5026"
                    x1={39.3847}
                    y1={75.4143}
                    x2={0.743545}
                    y2={7.00325}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint151_linear_5762_5026"
                    x1={42.4892}
                    y1={72.4178}
                    x2={1.06145}
                    y2={10.5037}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint152_linear_5762_5026"
                    x1={45.3424}
                    y1={69.241}
                    x2={1.85956}
                    y2={13.395}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint153_linear_5762_5026"
                    x1={47.9307}
                    y1={65.9248}
                    x2={2.96216}
                    y2={15.713}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint154_linear_5762_5026"
                    x1={50.2374}
                    y1={62.5098}
                    x2={4.22081}
                    y2={17.5178}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint155_linear_5762_5026"
                    x1={52.2549}
                    y1={59.0377}
                    x2={5.52304}
                    y2={18.885}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint156_linear_5762_5026"
                    x1={53.9767}
                    y1={55.5469}
                    x2={6.78076}
                    y2={19.8949}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint157_linear_5762_5026"
                    x1={55.3983}
                    y1={52.0757}
                    x2={7.92748}
                    y2={20.6314}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint158_linear_5762_5026"
                    x1={56.5232}
                    y1={48.6611}
                    x2={8.92074}
                    y2={21.1778}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint159_linear_5762_5026"
                    x1={57.3533}
                    y1={45.3371}
                    x2={9.73064}
                    y2={21.6142}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint160_linear_5762_5026"
                    x1={57.8973}
                    y1={42.1358}
                    x2={10.3455}
                    y2={22.0174}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint161_linear_5762_5026"
                    x1={58.1647}
                    y1={39.0869}
                    x2={10.7655}
                    y2={22.4598}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint162_linear_5762_5026"
                    x1={58.1698}
                    y1={36.2164}
                    x2={11.0055}
                    y2={23.008}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint163_linear_5762_5026"
                    x1={57.9273}
                    y1={33.5478}
                    x2={11.0909}
                    y2={23.7231}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint164_linear_5762_5026"
                    x1={57.4558}
                    y1={31.1011}
                    x2={11.0613}
                    y2={24.6591}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint165_linear_5762_5026"
                    x1={56.7768}
                    y1={28.8919}
                    x2={10.9708}
                    y2={25.8597}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint166_linear_5762_5026"
                    x1={55.911}
                    y1={26.9329}
                    x2={10.8842}
                    y2={27.3578}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint167_linear_5762_5026"
                    x1={54.8817}
                    y1={25.233}
                    x2={10.8818}
                    y2={29.1695}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint168_linear_5762_5026"
                    x1={53.7157}
                    y1={23.7964}
                    x2={11.0585}
                    y2={31.2886}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint169_linear_5762_5026"
                    x1={52.4364}
                    y1={22.6245}
                    x2={11.5141}
                    y2={33.6811}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint170_linear_5762_5026"
                    x1={51.0688}
                    y1={21.7141}
                    x2={12.3509}
                    y2={36.2751}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint171_linear_5762_5026"
                    x1={49.64}
                    y1={21.0589}
                    x2={13.6611}
                    y2={38.9568}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint172_linear_5762_5026"
                    x1={48.172}
                    y1={20.6489}
                    x2={15.5015}
                    y2={41.5684}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint173_linear_5762_5026"
                    x1={46.6866}
                    y1={20.4728}
                    x2={17.8755}
                    y2={43.9197}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint174_linear_5762_5026"
                    x1={45.2081}
                    y1={20.5159}
                    x2={20.7169}
                    y2={45.8083}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint175_linear_5762_5026"
                    x1={43.7551}
                    y1={20.763}
                    x2={23.873}
                    y2={47.0588}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient
                    id="paint176_linear_5762_5026"
                    x1={42.3457}
                    y1={21.198}
                    x2={27.1246}
                    y2={47.5617}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset={0.442708} stopColor="#FCFCFC" />
                    <Stop offset={0.5} stopColor="#fff" stopOpacity={0} />
                    <Stop offset={1} stopColor="#fff" stopOpacity={0} />
                </LinearGradient>
                <ClipPath id="clip0_5762_5026">
                    <Rect
                        x={0.599609}
                        y={0.600098}
                        width={65.7063}
                        height={65.7063}
                        rx={32.8531}
                        fill="#fff"
                    />
                </ClipPath>
                <ClipPath id="clip1_5762_5026">
                    <Path
                        fill="#fff"
                        transform="translate(-1.148 .6)"
                        d="M0 0H73.0769V68.1119H0z"
                    />
                </ClipPath>
            </Defs>
        </Svg>
    );
}
