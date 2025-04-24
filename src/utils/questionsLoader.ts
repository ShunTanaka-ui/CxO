import Papa from 'papaparse';

export interface Question {
  id: number;
  text: string;
  isManagementQuestion?: boolean;
  personalityAxis?: 1 | 2 | 3 | 4;
  personalityType?: 'A' | 'B';
  isOpposite?: boolean;
}

// 質問データをCSVから読み込む関数
export const loadQuestions = async (): Promise<Question[]> => {
  try {
    const response = await fetch('/data/questions.csv');
    if (!response.ok) {
      console.error('質問データCSVの取得に失敗しました');
      return [];
    }
    
    const csvText = await response.text();
    const { data } = Papa.parse(csvText, { header: true, skipEmptyLines: true });
    
    return (data as any[]).map(row => {
      // CSVから読み込んだデータを適切な型に変換
      const question: Question = {
        id: parseInt(row.id, 10),
        text: row.text
      };
      
      // 経営質問かどうか
      if (row.isManagementQuestion === 'true') {
        question.isManagementQuestion = true;
      }
      
      // パーソナリティ軸
      if (row.personalityAxis) {
        question.personalityAxis = parseInt(row.personalityAxis, 10) as 1 | 2 | 3 | 4;
      }
      
      // パーソナリティタイプ
      if (row.personalityType === 'A' || row.personalityType === 'B') {
        question.personalityType = row.personalityType as 'A' | 'B';
      }
      
      // 逆転項目かどうか
      if (row.isOpposite === 'true') {
        question.isOpposite = true;
      }
      
      return question;
    });
  } catch (error) {
    console.error('質問データの読み込み中にエラーが発生しました', error);
    return [];
  }
}; 