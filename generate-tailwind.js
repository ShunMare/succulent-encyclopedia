import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const deviceWidth = 768;
const deviceHeight = 808;

const remBase = 16;

const vhInPixels = deviceHeight * 0.01;
const vwInPixels = deviceWidth * 0.01;

const vhInRem = vhInPixels / remBase;
const vwInRem = vwInPixels / remBase;

function formatNumber(num) {
  return num % 1 === 0 ? num.toString() : num.toFixed(2).replace(/\.?0+$/, "");
}

function generateClampStyle(min, max, step, unit, remFactor) {
  const clampStyle = {};
  for (let i = min; i <= max; i = Math.round((i + step) * 100) / 100) {
    const formattedKey = formatNumber(i);
    const key = `clamp-${formattedKey}${unit}`;
    const value = `clamp(0rem, ${i.toFixed(2).replace(/\.?0+$/, "")}${unit}, ${(
      i * remFactor
    )
      .toFixed(3)
      .replace(/\.?0+$/, "")}rem)`;
    clampStyle[key] = value;
  }
  return clampStyle;
}

function generateSingleMediaQuery(vw, vwInRem, vhInRem) {
  let mediaQueries = "";
  const properties = {
    top: "top",
    bottom: "bottom",
    left: "left",
    right: "right",
    text: "font-size",
    w: "width",
    mt: "margin-top",
    ml: "margin-left",
    leading: "line-height",
    tracking: "letter-spacing",
  };

  const vwFormatted = formatNumber(vw);
  const remValueVW = (vw * vwInRem).toFixed(3);
  const correspondingVH = (remValueVW / vhInRem).toFixed(1);

  Object.entries(properties).forEach(([propClass, propCSS]) => {
    const className = `${propClass}-clamp-${vwFormatted.replace(
      ".",
      "\\."
    )}vw-${correspondingVH.replace(".", "\\.")}vh`;
    const mediaQuery = `
@media (min-width: ${vwFormatted}vw) and (min-height: ${correspondingVH}vh) {
  .${className} {
    ${propCSS}: clamp(0rem, ${correspondingVH}vh, ${remValueVW}rem);
  }
  .-${className} {
    ${propCSS}: calc(clamp(0rem, ${correspondingVH}vh, ${remValueVW}rem) * -1);
  }
}
@media (max-width: ${vwFormatted}vw) and (max-height: ${correspondingVH}vh) {
  .${className} {
    ${propCSS}: clamp(0rem, ${vwFormatted}vw, ${remValueVW}rem);
  }
  .-${className} {
    ${propCSS}: calc(clamp(0rem, ${vwFormatted}vw, ${remValueVW}rem) * -1);
  }
}`;
    mediaQueries += mediaQuery;
  });

  return mediaQueries;
}

function generateMediaQueriesForValues(values, vwInRem, vhInRem) {
  let mediaQueries = "";
  values.forEach((vw) => {
    mediaQueries += generateSingleMediaQuery(vw, vwInRem, vhInRem);
  });
  return mediaQueries;
}

const values = [
  0.3, 0.5, 0.6, 0.7, 0.9, 1, 1.2, 1.3, 1.4, 1.6, 1.8, 2.4, 3, 3.4, 3.6, 4, 4.5,
  5.3, 5.4, 5.5, 5.8, 5.9, 6, 6.8, 6.9, 7, 7.3, 7.5, 8, 8.2, 8.3, 8.5, 8.6, 8.8,
  9.8, 10.2, 11, 12, 12.2, 12.5, 13, 15, 16, 17, 17.7, 18.3, 19.5, 20, 21, 22,
  22.2, 22.5, 25, 27.7, 30.7, 32, 35, 37, 37.5, 37.7, 40, 40.8, 41.5, 42.5,
  43.8, 44.8, 45.5, 46.5, 47, 50, 51.5, 55, 57.2, 64.7, 70, 71.5, 72, 81.5, 84,
  92.3,
];

const vhSpacing = generateClampStyle(0, 200, 0.1, "vh", vhInRem);
const vwSpacing1 = generateClampStyle(2.92, 2.92, 0.1, "vw", vwInRem);
const vwSpacing2 = generateClampStyle(0, 200, 0.1, "vw", vwInRem);
const vwSpacing3 = generateClampStyle(3.33, 3.33, 0.1, "vw", vwInRem);

const spacing = { ...vhSpacing, ...vwSpacing1, ...vwSpacing2, ...vwSpacing3 };

const tailwindConfig = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      spacing: spacing,
      fontSize: spacing,
      letterSpacing: spacing,
      margin: spacing,
      padding: spacing,
      gap: spacing,
      width: spacing,
      height: spacing,
      borderWidth: spacing,
      lineHeight: spacing,
      borderRadius: spacing,
      fontFamily: {
        KleeOneRegular: ["KleeOne Regular"],
        KleeOneSemiBold: ["KleeOne SemiBold"],
      },
      backgroundImage: {
        "dashed-line":
          "repeating-linear-gradient(to right,black,black clamp(0rem, 6vw, 1.612rem),transparent clamp(0rem, 6vw, 1.612rem),transparent clamp(0rem, 10vw, 2.688rem))",
      },
      animation: {
        "slide-in-tl":
          "slide-in-tl 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both",
      },
      keyframes: {
        "slide-in-tl": {
          "0%": {
            transform: "translateY(1000px) translateX(1000px)",
            opacity: "0",
          },
          to: {
            transform: "translateY(0) translateX(0)",
            opacity: "1",
          },
        },
      },
    },
  },
  plugins: [],
};

const configString = `/** @type {import('tailwindcss').Config} */\n\nexport default ${JSON.stringify(
  tailwindConfig,
  null,
  2
)};`;

writeFileSync(join(__dirname, "tailwind.config.mjs"), configString, "utf8");

console.log("tailwind.config.mjs has been generated!");

const mediaQueriesForValues = generateMediaQueriesForValues(
  values,
  vwInRem,
  vhInRem
);
const combinedMediaQueries = mediaQueriesForValues;

writeFileSync(
  join(__dirname, "/src/styles/clamps.css"),
  combinedMediaQueries,
  "utf8"
);

console.log("clamps.css has been generated!");
