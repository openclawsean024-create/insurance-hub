import type { InsuranceType } from './types';

// 6 種理賠 SOP 預載資料
export const CLAIM_SOPS: Record<string, { title: string; stages: Array<{ stage: string; days: string; items: string[] }> }> = {
  hospital: {
    title: '住院理賠 SOP',
    stages: [
      { stage: 'T+0', days: '出院當天', items: ['電話通報保險公司客服', '確認保單號碼 + 要保人 ID', '索取「理賠申請書」'] },
      { stage: 'T+3', days: '3 日內', items: ['準備診斷書', '準備醫療費用收據正本', '準備住院明細表'] },
      { stage: 'T+7', days: '7 日內', items: ['填寫理賠申請書 + 簽名', '紙本送件或線上上傳', '保留所有副本'] },
      { stage: 'T+14~30', days: '14-30 日', items: ['等待保險公司審核', '匯款帳戶確認入帳', '收到理賠金後通知完成'] },
    ],
  },
  surgery: {
    title: '手術理賠 SOP',
    stages: [
      { stage: 'T+0', days: '手術當天', items: ['電話通報保險公司', '索取理賠申請書', '確認手術名稱（ICD-10）'] },
      { stage: 'T+3', days: '3 日內', items: ['診斷書（含手術記錄）', '手術費用收據', '醫師證明手術必要性'] },
      { stage: 'T+7', days: '7 日內', items: ['填妥理賠申請書', '送件至保險公司', '副本留存'] },
      { stage: 'T+14~30', days: '14-30 日', items: ['審核（手術必要性）', '理賠金匯入', '通知完成'] },
    ],
  },
  cancer: {
    title: '癌症理賠 SOP',
    stages: [
      { stage: 'T+0', days: '確診當天', items: ['電話通報保險公司重大疾病', '索取重大疾病理賠申請書', '確認病理切片報告'] },
      { stage: 'T+7', days: '7 日內', items: ['病理切片報告', '癌症分期診斷書', '醫師治療計畫書'] },
      { stage: 'T+14', days: '14 日內', items: ['填寫重大疾病申請書', '送件 + 副本留存', '副本送保險公司'] },
      { stage: 'T+30~45', days: '30-45 日', items: ['保險公司審核', '癌症一次金匯入', '後續化療/標靶理賠分次申請'] },
    ],
  },
  disability: {
    title: '失能理賠 SOP',
    stages: [
      { stage: 'T+0', days: '失能事實發生', items: ['電話通報保險公司', '索取失能理賠申請書', '保留所有就醫記錄'] },
      { stage: 'T+30', days: '30 日內', items: ['失能診斷書（由專業醫師評估）', '失能等級鑑定報告', '失能前後工作能力證明'] },
      { stage: 'T+60', days: '60 日內', items: ['填寫失能理賠申請書', '送件 + 副本留存', '副本送保險公司'] },
      { stage: 'T+90', days: '90 日內', items: ['保險公司審核（含複檢可能）', '失能等級認定', '理賠金分次/月給付'] },
    ],
  },
  death: {
    title: '身故理賠 SOP',
    stages: [
      { stage: 'T+0', days: '事發當天', items: ['報警 + 取得死亡證明書', '電話通報保險公司', '通知所有要保人/受益人'] },
      { stage: 'T+7', days: '7 日內', items: ['死亡證明書正本', '戶籍謄本（除戶）', '保險單正本'] },
      { stage: 'T+30', days: '30 日內', items: ['受益人身分證明', '填寫身故理賠申請書', '送件 + 副本留存'] },
      { stage: 'T+60~90', days: '60-90 日', items: ['保險公司審核', '理賠金匯入受益人帳戶', '稅務申報'] },
    ],
  },
  accident: {
    title: '意外險理賠 SOP',
    stages: [
      { stage: 'T+0', days: '意外發生 24h 內', items: ['報警（110）取得報案證明', '就醫並保留所有收據', '電話通報保險公司'] },
      { stage: 'T+3', days: '3 日內', items: ['診斷書（含意外事故描述）', '醫療費用收據', '意外事故證明文件'] },
      { stage: 'T+7', days: '7 日內', items: ['填寫意外險理賠申請書', '送件 + 副本留存', '副本送保險公司'] },
      { stage: 'T+14~30', days: '14-30 日', items: ['保險公司審核', '意外險金匯入', '通知完成'] },
    ],
  },
};

export const INSURANCE_TYPE_TO_SOP: Partial<Record<InsuranceType, keyof typeof CLAIM_SOPS>> = {
  life: 'death',
  medical: 'hospital',
  accident: 'accident',
  cancer: 'cancer',
  hospital: 'hospital',
  disability: 'disability',
  travel: 'accident',
};