export default {
  tabs: {
    overview: "Overview",
    vehicles: "Vehicles",
    settings: "Settings",
  },
  screens: {
    overview: {
      title: "Overview",
      list: "List",
      map: "Map",
      bus: "Bus",
      trolleybus: "Trolleybus",
      tram: "Tram",
      noLinesSelected: "No lines selected",
    },
    vehicles: {
      title: "Vehicles",
    },
    settings: {
      title: "Settings",

      theme: "Theme",
      light: "Light",
      dark: "Dark",

      language: "Language",
      en: "English",
      bg: "Bulgarian",

      fetchDelay: "Fetch delay (ms)",
      fetchErrorChance: "Fetch error chance",
      transferRadius: "Transfer radius (m)",
    },
    lineDetails: {
      list: "List",
      map: "Map",
      line: "Line",
      stopDetails: {
        averagePeople: "Average people",
        transferStops: "Transfer stops (within {{distance}}m)",
        sameLine: "same line",
        otherLine: "other line",
        noTransferStops: "No transfer stops found",
      },
    },
  },
  errors: {
    genericListError: "Something went wrong",
    genericListErrorDescription: "Refresh to try again",
  },
} as const;
