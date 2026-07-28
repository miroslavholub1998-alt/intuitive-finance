export type NavigationSection = "filtering" | "other" | "case-studies";

export interface NavigationItem {
  title: string;
  slug: string;
}

export interface NavigationGroup {
  id: NavigationSection;
  title: string;
  items: NavigationItem[];
}

export const navigation: NavigationGroup[] = [
  {
    id: "filtering",
    title: "Filtering in Finance",
    items: [
      { title: "Markov Switching Models", slug: "markov-switching-models" },
      { title: "Kalman Filter", slug: "kalman-filter" },
      { title: "Particle Filters", slug: "particle-filters" },
      {
        title: "Fast Fourier Transformation",
        slug: "fast-fourier-transformation"
      },
      { title: "Hodrick–Prescott Filter", slug: "hodrick-prescott-filter" }
    ]
  },
  {
    id: "other",
    title: "Other Topics",
    items: [
      { title: "LSTM", slug: "lstm" },
      {
        title: "Almgren–Chriss Continuous Model",
        slug: "almgren-chriss-continuous-model"
      }
    ]
  },
  {
    id: "case-studies",
    title: "Case Studies",
    items: [
      {
        title: "CVA calculation of IRS with use of HW",
        slug: "cva-irs-hull-white"
      }
    ]
  }
];
