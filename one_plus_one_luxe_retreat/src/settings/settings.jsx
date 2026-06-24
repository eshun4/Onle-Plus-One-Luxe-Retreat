const settings = {
  theme: {
    name: "Ash & Copper",

    colors: {
      black: "#0e0c0a",
      surface: "#1a1612",
      surface2: "#252018",
      copper: "#b07848",
      copperLight: "#c99060",
      sand: "#dcc4a8",
      cream: "#f8f3ee",
      muted: "#7a6a58",
    },

    typography: {
      fontFamily: {
        display: "'Bebas Neue', sans-serif",
        body: "'Instrument Sans', sans-serif",
      },
      fontWeights: {
        light: 300,
        regular: 400,
        medium: 500,
      },
      fontSizes: {
        xs: "0.68rem",
        sm: "0.78rem",
        base: "0.95rem",
        lg: "1.1rem",
        xl: "1.8rem",
        "2xl": "2.5rem",
        "3xl": "4rem",
        hero: "clamp(4rem, 7vw, 7rem)",
      },
      letterSpacing: {
        tight: "0.03em",
        normal: "0.08em",
        wide: "0.15em",
        wider: "0.2em",
      },
      lineHeights: {
        tight: 0.92,
        normal: 1.6,
        relaxed: 1.85,
      },
    },

    spacing: {
      sectionPadding: "6rem 5rem",
      cardPadding: "1.75rem 2rem",
      formPadding: "2.5rem",
    },

    borders: {
      rule: "1px solid #b07848",
      ruleLight: "1px solid #7a6a58",
    },

    borderRadius: {
      none: "0",
    },

    transitions: {
      default: "0.2s ease",
      slow: "0.4s ease",
    },

    googleFonts:
      "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Instrument+Sans:wght@300;400;500&display=swap",
  },

  screens: {
    breakpoints: {
      small: {
        name: "small",
        min: 0,
        max: 767,
      },
      medium: {
        name: "medium",
        min: 768,
        max: 1023,
      },
      large: {
        name: "large",
        min: 1024,
        max: null,
      },
    },

    mediaQueries: {
      small: "(max-width: 767px)",
      medium: "(min-width: 768px) and (max-width: 1023px)",
      large: "(min-width: 1024px)",
      mediumUp: "(min-width: 768px)",
      largeUp: "(min-width: 1024px)",
    },

    layout: {
      small: {
        pageMaxWidth: "100%",
        pagePaddingX: "1rem",
        sectionPaddingY: "3.5rem",
        sectionPaddingX: "1rem",
        gridColumns2: "1fr",
        gridColumns3: "1fr",
        gridColumns4: "1fr",
        gridGap: "1rem",
      },

      medium: {
        pageMaxWidth: "100%",
        pagePaddingX: "1.5rem",
        sectionPaddingY: "5rem",
        sectionPaddingX: "1.5rem",
        gridColumns2: "repeat(2, minmax(0, 1fr))",
        gridColumns3: "repeat(2, minmax(0, 1fr))",
        gridColumns4: "repeat(2, minmax(0, 1fr))",
        gridGap: "1.5rem",
      },

      large: {
        pageMaxWidth: "1280px",
        pagePaddingX: "2rem",
        sectionPaddingY: "6.5rem",
        sectionPaddingX: "2rem",
        gridColumns2: "repeat(2, minmax(0, 1fr))",
        gridColumns3: "repeat(3, minmax(0, 1fr))",
        gridColumns4: "repeat(4, minmax(0, 1fr))",
        gridGap: "2rem",
      },
    },

    elements: {
      small: {
        navHeight: "4rem",
        buttonHeight: "2.875rem",
        inputHeight: "2.875rem",
        cardPadding: "1rem",
        mediaHeightSmall: "12rem",
        mediaHeightMedium: "16rem",
        mediaHeightLarge: "22rem",
      },

      medium: {
        navHeight: "4.5rem",
        buttonHeight: "3rem",
        inputHeight: "3rem",
        cardPadding: "1.25rem",
        mediaHeightSmall: "14rem",
        mediaHeightMedium: "20rem",
        mediaHeightLarge: "28rem",
      },

      large: {
        navHeight: "5rem",
        buttonHeight: "3.125rem",
        inputHeight: "3.125rem",
        cardPadding: "1.5rem",
        mediaHeightSmall: "16rem",
        mediaHeightMedium: "24rem",
        mediaHeightLarge: "34rem",
      },
    },
  },

  navigation: {
    smoothScroll: {
      enabled: true,
      step: 200,
      speed: 800,
      disableOnTouch: true,
      respectReducedMotion: true,
    },
  },

  home: {
    slider: {
      autoPlayDelay: 4200,
      transitionMs: 900,
      wheelThrottle: 1200,
      swipeThreshold: 40,
    },
  },
};

export default settings;
