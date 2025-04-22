import Papa from 'papaparse';

// 診断結果テキストデータの型定義
export interface ResultText {
  id: string;
  typePattern: string;
  title: string;
  subtitle: string;
  description: string;
  environmentTitle: string;
  environmentDescription: string;
  imageUrl: string;
}

let resultTexts: ResultText[] = [];
let isLoaded = false;

/**
 * CSVファイルから結果テキストを読み込む
 * @returns {Promise<ResultText[]>} 結果テキストの配列
 */
export const loadResultTexts = async (): Promise<ResultText[]> => {
  if (isLoaded) {
    return resultTexts;
  }

  try {
    // CSVファイルのパス
    const csvFilePath = '/data/result_texts.csv';
    
    // CSVファイルを取得
    const response = await fetch(csvFilePath);
    if (!response.ok) {
      throw new Error(`CSVファイルの取得に失敗しました: ${response.statusText}`);
    }
    
    const csvText = await response.text();
    
    // CSVをパース
    const rows = csvText.split('\n');
    const headers = rows[0].split(',');
    
    resultTexts = [];
    
    // ヘッダー行をスキップして2行目から処理
    for (let i = 1; i < rows.length; i++) {
      if (!rows[i].trim()) continue; // 空行はスキップ
      
      const values = parseCSVRow(rows[i]);
      
      if (values.length >= headers.length) {
        const resultText: ResultText = {
          id: values[0],
          typePattern: values[1],
          title: values[2],
          subtitle: values[3],
          description: values[4],
          environmentTitle: values[5],
          environmentDescription: values[6],
          imageUrl: values[7] || '', // imageUrlが空の場合は空文字を設定
        };
        resultTexts.push(resultText);
      }
    }
    
    isLoaded = true;
    return resultTexts;
  } catch (error) {
    console.error('結果テキストの読み込みに失敗しました:', error);
    return [];
  }
};

// CSVの行を適切にパースする関数（カンマ内のカンマをサポート）
const parseCSVRow = (row: string): string[] => {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    
    if (char === '"') {
      // クォーテーションの開始/終了
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      // カンマがクォーテーション外にある場合は新しい値の区切り
      values.push(current);
      current = '';
    } else {
      // それ以外の文字は現在の値に追加
      current += char;
    }
  }
  
  // 最後の値を追加
  values.push(current);
  
  // クォーテーションを除去
  return values.map(value => value.replace(/^"|"$/g, ''));
};

/**
 * タイプパターンに対応する診断結果テキストを取得する
 * @param typePattern タイプパターン（例：AAAA, ABBA）
 */
export const getResultTextByPattern = (typePattern: string): ResultText | null => {
  const result = resultTexts.find(text => text.typePattern === typePattern);
  
  if (!result) {
    console.warn(`No result text found for pattern: ${typePattern}`);
    return null;
  }
  
  return result;
};

/**
 * 診断結果テキストから活躍できる環境のポイントを生成する
 * @param resultText 診断結果テキスト
 */
export const getEnvironmentPointsFromResultText = (resultText: ResultText | null): string[] => {
  if (!resultText || !resultText.environmentDescription) {
    return [];
  }
  
  // 環境の説明文を「・」で分割して配列に変換
  return resultText.environmentDescription
    .split('・')
    .map(point => point.trim())
    .filter(point => point.length > 0);
};

// タイプパターンに基づいて結果テキストを取得する関数
export const getResultTextByTypePattern = (resultTexts: ResultText[], typePattern: string): ResultText | undefined => {
  // 完全一致のテキストを探す
  const exactMatch = resultTexts.find(text => text.typePattern === typePattern);
  if (exactMatch) {
    return exactMatch;
  }
  
  // 完全一致がない場合はデフォルトのテキストを返す
  return resultTexts.find(text => text.typePattern === 'DEFAULT');
}; 