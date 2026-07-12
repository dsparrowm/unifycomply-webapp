import type { KybShareCapitalData } from "@/types/kyb";

export const kybShareCapitalData: KybShareCapitalData = {
  sectionStatus: "Active",
  shareholders: [
    {
      id: "shareholder-1",
      name: "Tejumade Olomola",
      type: "individual",
      shares: 60000,
      percentage: 60,
      shareClass: "Ordinary",
    },
    {
      id: "shareholder-2",
      name: "Alimi Ayomikun",
      type: "individual",
      shares: 40000,
      percentage: 40,
      shareClass: "Ordinary",
    },
  ],
};

export function buildKybShareCapitalData(): KybShareCapitalData {
  return kybShareCapitalData;
}
