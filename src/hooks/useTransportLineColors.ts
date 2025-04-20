const busColors = ["#80BFFF", "#1A8CFF", "#004899"];

const trolleybusColors = ["#99E699", "#32CE32", "#228000"];

const tramColors = ["#FF8099", "#FF1A47", "#B3283F"];

export const getTransportColor = (transportType: string, index: number) => {
  switch (transportType) {
    case "A":
      return getBusColor(index);
    case "TB":
      return getTrolleybusColor(index);
    case "TM":
      return getTramColor(index);
    default:
      return "#000000";
  }
};

export const getBusColor = (index: number) =>
  busColors[index % busColors.length];
export const getTrolleybusColor = (index: number) =>
  trolleybusColors[index % trolleybusColors.length];
export const getTramColor = (index: number) =>
  tramColors[index % tramColors.length];
