import vehicles from "./vehicles.json";
import publicTransportData from "./public-transport-data.json";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

//TODO maybe add delay/error chance to settings?
const simulateCall = async ({
  delay = 750,
  errorMessage: message,
  errorChance = 0.2,
}: {
  errorMessage: string;
  errorChance?: number;
  delay?: number;
}) => {
  await sleep(delay);
  if (Math.random() < errorChance) throw new Error(message);
};

const PAGE_SIZE = 20;

export const getVehicles = async ({
  pageParam = 0,
}: {
  pageParam?: number;
}) => {
  await simulateCall({ errorMessage: "Failed to fetch vehicles data" });

  const start = pageParam * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const paginated = vehicles.slice(start, end);

  const hasMore = end < vehicles.length;

  return {
    data: paginated,
    nextPage: hasMore ? pageParam + 1 : undefined,
  };
};

export const getPublicTransportData = async () => {
  await simulateCall({ errorMessage: "Failed to fetch public transport data" });

  return publicTransportData;
};
