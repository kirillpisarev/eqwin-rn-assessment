export type Horse = {
  id: string;
  name: string;
  sharePriceCents: number;
  sharesLeft: number;
  saleEndsAt: string; // ISO date
};

export type RootStackParamList = {
  HorseList: undefined;
  BuyShares: { horse: Horse };
};
