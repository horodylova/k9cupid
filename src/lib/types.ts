export interface QuizOption {
  id: string;
  label: string;
  imageSrc?: string;
}

export interface QuizQuestion {
  id: string;
  type: "single_choice" | "multiple_choice";
  title: string;
  options: QuizOption[];
  description?: string;
}

export interface QuizScaleQuestion {
  id: string;
  type: "scale";
  title: string;
  description?: string;
  scaleLabels: {
    value: number;
    label: string;
  }[];
}
