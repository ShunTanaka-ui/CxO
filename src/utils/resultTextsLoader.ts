import Papa from 'papaparse';

export interface EnvironmentPoint {
  title: string;
  description: string;
}

export interface ResultText {
  typePattern: string;
  resultSummary: string;
  classificationSummary: string;
  oneWord: string;
  careerPathSummary: string;
  environment: EnvironmentPoint[];
}

// 診断結果テキストをロードする関数
export const loadResultTexts = async (): Promise<Record<string, ResultText>> => {
  const response = await fetch('/data/result_texts.csv');
  if (!response.ok) {
    console.error('CSVファイルの取得に失敗しました');
    return {};
  }
  const csvText = await response.text();
  const { data } = Papa.parse(csvText, { header: true, skipEmptyLines: true });
  const resultMap: Record<string, ResultText> = {};
  (data as any[]).forEach(row => {
    const env: EnvironmentPoint[] = [
      { title: row.env1Title, description: row.env1Desc },
      { title: row.env2Title, description: row.env2Desc },
      { title: row.env3Title, description: row.env3Desc },
      { title: row.env4Title, description: row.env4Desc }
    ];
    resultMap[row.typePattern] = {
      typePattern: row.typePattern,
      resultSummary: row.resultSummary,
      classificationSummary: row.classificationSummary,
      oneWord: row.oneWord,
      careerPathSummary: row.careerPathSummary,
      environment: env
    };
  });
  return resultMap;
};

export interface StrengthText {
  id: number;
  title: string;
  description: string;
}

export const loadStrengthTexts = async (): Promise<Record<number, StrengthText>> => {
  const res = await fetch('/data/strength_texts.csv');
  if (!res.ok) {
    console.error('強みCSVの取得に失敗しました');
    return {};
  }
  const csvText = await res.text();
  const { data } = Papa.parse(csvText, { header: true, skipEmptyLines: true });
  const map: Record<number, StrengthText> = {};
  (data as any[]).forEach(row => {
    const id = Number(row.id);
    map[id] = { id, title: row.title, description: row.description };
  });
  return map;
}; 