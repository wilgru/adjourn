/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      title: ["Plantagenet Cherokee"],
      sans: ["Helvetica Neue"],
      // body: [""],
    },
    extend: {
      keyframes: {
        overlayShow: {
          from: { opacity: "0" },
          to: { opacity: "0.25" },
        },
        contentShow: {
          from: {
            opacity: "0",
            transform: "translate(-50%, -48%) scale(0.96)",
          },
          to: { opacity: "1", transform: "translate(-50%, -50%) scale(1)" },
        },
        slideDownAndFade: {
          from: { opacity: "0", transform: "translateY(-2px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideLeftAndFade: {
          from: { opacity: "0", transform: "translateX(2px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        slideUpAndFade: {
          from: { opacity: "0", transform: "translateY(2px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideRightAndFade: {
          from: { opacity: "0", transform: "translateX(-2px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        overlayShow: "overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        contentShow: "contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideDownAndFade:
          "slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideLeftAndFade:
          "slideLeftAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideUpAndFade: "slideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideRightAndFade:
          "slideRightAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
  safelist: [
    // hover textPill
    "hover:text-orange-500",
    "hover:text-red-500",
    "hover:text-yellow-500",
    "hover:text-lime-500",
    "hover:text-green-500",
    "hover:text-blue-500",
    "hover:text-cyan-500",
    "hover:text-purple-500",
    "hover:text-pink-500",
    "hover:text-amber-700",
    "hover:text-gray-500",

    // hover backgroundPill
    "hover:bg-orange-100",
    "hover:bg-red-100",
    "hover:bg-yellow-100",
    "hover:bg-lime-100",
    "hover:bg-green-100",
    "hover:bg-blue-100",
    "hover:bg-cyan-100",
    "hover:bg-purple-100",
    "hover:bg-pink-100",
    "hover:bg-amber-200",
    "hover:bg-gray-200",

    // data on textPill
    "data-[state=on]:text-orange-400",
    "data-[state=on]:text-red-400",
    "data-[state=on]:text-yellow-400",
    "data-[state=on]:text-lime-400",
    "data-[state=on]:text-green-400",
    "data-[state=on]:text-blue-400",
    "data-[state=on]:text-cyan-400",
    "data-[state=on]:text-purple-400",
    "data-[state=on]:text-pink-400",
    "data-[state=on]:text-amber-600",
    "data-[state=on]:text-gray-400",

    // data highlighted textPill
    "data-[highlighted]:text-orange-500",
    "data-[highlighted]:text-red-500",
    "data-[highlighted]:text-yellow-500",
    "data-[highlighted]:text-lime-500",
    "data-[highlighted]:text-green-500",
    "data-[highlighted]:text-blue-500",
    "data-[highlighted]:text-cyan-500",
    "data-[highlighted]:text-purple-500",
    "data-[highlighted]:text-pink-500",
    "data-[highlighted]:text-amber-700",
    "data-[highlighted]:text-gray-500",

    // data highlighted backgroundPill
    "data-[highlighted]:bg-orange-100",
    "data-[highlighted]:bg-red-100",
    "data-[highlighted]:bg-yellow-100",
    "data-[highlighted]:bg-lime-100",
    "data-[highlighted]:bg-green-100",
    "data-[highlighted]:bg-blue-100",
    "data-[highlighted]:bg-cyan-100",
    "data-[highlighted]:bg-purple-100",
    "data-[highlighted]:bg-pink-100",
    "data-[highlighted]:bg-amber-200",
    "data-[highlighted]:bg-gray-200",

    // data on backgroundPill
    "data-[state=on]:bg-orange-100",
    "data-[state=on]:bg-red-100",
    "data-[state=on]:bg-yellow-100",
    "data-[state=on]:bg-lime-100",
    "data-[state=on]:bg-green-100",
    "data-[state=on]:bg-blue-100",
    "data-[state=on]:bg-cyan-100",
    "data-[state=on]:bg-purple-100",
    "data-[state=on]:bg-pink-100",
    "data-[state=on]:bg-amber-200",
    "data-[state=on]:bg-gray-200",

    // data on textPill
    "data-[state=on]:text-orange-500",
    "data-[state=on]:text-red-500",
    "data-[state=on]:text-yellow-500",
    "data-[state=on]:text-lime-500",
    "data-[state=on]:text-green-500",
    "data-[state=on]:text-blue-500",
    "data-[state=on]:text-cyan-500",
    "data-[state=on]:text-purple-500",
    "data-[state=on]:text-pink-500",
    "data-[state=on]:text-amber-700",
    "data-[state=on]:text-gray-500",
  ],
};
