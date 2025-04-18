import vehicles from "./vehicles.json";
import publicTransportData from "./public-transport-data.json";
import { store } from "@/store/store";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const simulateCall = async ({
  errorMessage: message,
}: {
  errorMessage: string;
}) => {
  const state = store.getState();

  let delay = 250;
  let errorChance = 0.2;

  const fetchDelayFromStore = state?.settings?.fetchDelay
    ? parseInt(state.settings.fetchDelay)
    : null;
  const errorChanceFromStore = state?.settings?.errorChance
    ? parseFloat(state.settings.errorChance)
    : null;

  if (
    fetchDelayFromStore !== null &&
    !isNaN(fetchDelayFromStore) &&
    fetchDelayFromStore >= 0 &&
    fetchDelayFromStore <= 20000
  ) {
    delay = fetchDelayFromStore;
  }

  if (
    errorChanceFromStore !== null &&
    !isNaN(errorChanceFromStore) &&
    errorChanceFromStore >= 0 &&
    errorChanceFromStore <= 1
  ) {
    errorChance = errorChanceFromStore;
  }

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

export const getLineData = async (lineId: string) => {
  await simulateCall({ errorMessage: "Failed to fetch line data" });

  const lineData = publicTransportData.find((line) => line.line === lineId);

  if (!lineData) {
    throw new Error(`Line with id ${lineId} not found`);
  }

  return lineData;
};
