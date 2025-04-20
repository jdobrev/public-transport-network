import { LocaleKeysMap } from "./useTypedTranslation";

export default {
  tabs: {
    overview: "Общ преглед",
    vehicles: "Превозни средства",
    settings: "Настройки",
  },
  screens: {
    overview: {
      title: "Общ преглед",
      list: "Списък",
      map: "Карта",
      bus: "Автобус",
      trolleybus: "Тролейбус",
      tram: "Трамвай",
      noLinesSelected: "Няма избрани линии",
    },
    vehicles: {
      title: "Превозни средства",
    },
    settings: {
      title: "Настройки",

      theme: "Тема",
      light: "Светла",
      dark: "Тъмна",

      language: "Език",
      en: "Английски",
      bg: "Български",

      fetchDelay: "Забавяне при заявка (мс)",
      fetchErrorChance: "Шанс за грешка при заявка",
      transferRadius: "Радиус на прекачване (м)",
    },
    lineDetails: {
      list: "Списък",
      map: "Карта",
      line: "Линия",
      stopDetails: {
        averagePeople: "Среден брой хора",
        transferStops: "Прекачащи спирки (в рамките на {{distance}}м)",
        sameLine: "същата линия",
        otherLine: "друга линия",
        noTransferStops: "Не са намерени прекачащи спирки",
      },
    },
  },
  errors: {
    genericListError: "Нещо се обърка",
    genericListErrorDescription: "Опитайте отново",
  },
} satisfies LocaleKeysMap;
