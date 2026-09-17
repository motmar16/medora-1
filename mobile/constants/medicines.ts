export interface Medicine {
  id: string;
  name: string;
  dci: string;
  strength: string;
  form: string;
  atc: string;
  status: "temporary" | "permanent" | "resumed" | "available" | "unknown";
  group: string;
  date?: string;
  event?: string;
  note?: string;
  prescriptionType: "PRF" | "PR" | "P6L" | "OTC";
  manufacturer: string;
  indications: string;
  contraindications: string;
}

export const MEDICINES: Medicine[] = [
  {
    id: "amoxi",
    name: "Amoxi Demo",
    dci: "Amoxicilină",
    strength: "500 mg",
    form: "Capsule",
    atc: "J01CA04",
    status: "temporary",
    group: "Antibiotice",
    date: "14 sept. 2026",
    event: "Discontinuitate temporară",
    note: "Deficit de substanță activă anunțat către ANMDMR. Reluare estimată trimestrul IV.",
    prescriptionType: "PRF",
    manufacturer: "Sandoz Pharmaceuticals SRL",
    indications: "Tratamentul infecțiilor bacteriene: otită medie acută, sinuzită, pneumonie comunitară, infecții urinare.",
    contraindications: "Hipersensibilitate la peniciline sau la oricare dintre excipienți. Antecedente de reacții anafilactice severe."
  },
  {
    id: "metfo",
    name: "Metfo Demo",
    dci: "Metformină",
    strength: "850 mg",
    form: "Comprimate filmate",
    atc: "A10BA02",
    status: "permanent",
    group: "Diabet",
    date: "12 sept. 2026",
    event: "Retragere definitivă",
    note: "Decizie comercială a deținătorului de autorizație. Sunt disponibile alternative generice directe.",
    prescriptionType: "PR",
    manufacturer: "Merck KGaA",
    indications: "Tratamentul diabetului zaharat de tip 2, în special la pacienții supraponderali, când regimul dietetic este insuficient.",
    contraindications: "Insuficiență renală severă (eGFR < 30 ml/min), cetoacidoză diabetică, precomă diabetică."
  },
  {
    id: "levo",
    name: "Levo Demo",
    dci: "Levotiroxină",
    strength: "50 μg",
    form: "Comprimate",
    atc: "H03AA01",
    status: "resumed",
    group: "Endocrinologie",
    date: "10 sept. 2026",
    event: "Comercializare reluată",
    note: "Reluare oficială a livrărilor confirmată în depozitele naționale autorizate.",
    prescriptionType: "PR",
    manufacturer: "Berlin-Chemie AG",
    indications: "Tratamentul hipotiroidismului benign, profilaxia recidivei după tiroidectomie, supresie în carcinom tiroidian.",
    contraindications: "Tireotoxicoză netratată, insuficiență corticosuprarenală netratată, infarct miocardic acut recent."
  },
  {
    id: "amoxi2",
    name: "Amoxi B Demo",
    dci: "Amoxicilină",
    strength: "500 mg",
    form: "Capsule",
    atc: "J01CA04",
    status: "available",
    group: "Antibiotice",
    prescriptionType: "PRF",
    manufacturer: "Antibiotice Iași SA",
    indications: "Infecții de tract respirator superior și inferior, erizipel, boala Lyme timpurie.",
    contraindications: "Mononucleoză infecțioasă concomitentă (risc crescut de rash cutanat), alergie la beta-lactamine."
  },
  {
    id: "metfo2",
    name: "Metfo B Demo",
    dci: "Metformină",
    strength: "850 mg",
    form: "Comprimate filmate",
    atc: "A10BA02",
    status: "available",
    group: "Diabet",
    prescriptionType: "PR",
    manufacturer: "Zentiva SA",
    indications: "Diabet zaharat tip 2 în monoterapie sau asociat cu alte antidiabetice orale sau insulină.",
    contraindications: "Afecțiuni acute cu potențial de afectare a funcției renale: deshidratare, infecții severe, șoc."
  },
  {
    id: "rami",
    name: "Rami Demo",
    dci: "Ramipril",
    strength: "5 mg",
    form: "Comprimate",
    atc: "C09AA05",
    status: "available",
    group: "Cardiologie",
    prescriptionType: "PR",
    manufacturer: "Sanofi România SRL",
    indications: "Hipertensiune arterială, prevenție cardiovasculară secundară, tratamentul insuficienței cardiace manifeste.",
    contraindications: "Sarcină în trimestrele 2 și 3, edem angioneurotic ereditar sau idiopatic, stenoză bilaterală de arteră renală."
  },
  {
    id: "atorva",
    name: "Atorva Demo",
    dci: "Atorvastatină",
    strength: "20 mg",
    form: "Comprimate filmate",
    atc: "C10AA05",
    status: "available",
    group: "Cardiologie",
    prescriptionType: "PR",
    manufacturer: "Pfizer România SRL",
    indications: "Hipercolesterolemie primară și dislipidemie mixtă, prevenția evenimentelor cardiovasculare majore.",
    contraindications: "Boală hepatică activă sau creșteri persistente inexplicabile ale transaminazelor serice peste 3x limita superioară."
  },
  {
    id: "panto",
    name: "Panto Demo",
    dci: "Pantoprazol",
    strength: "40 mg",
    form: "Comprimate gastrorezistente",
    atc: "A02BC02",
    status: "available",
    group: "Gastroenterologie",
    prescriptionType: "P6L",
    manufacturer: "Takeda Pharmaceuticals SRL",
    indications: "Esofagită de reflux, ulcer gastric și duodenal, sindrom Zollinger-Ellison.",
    contraindications: "Hipersensibilitate la substanța activă, la benzimidazoli substituiți sau la oricare dintre excipienți."
  }
];

export const CATEGORIES = [
  "Toate",
  "Antibiotice",
  "Cardiologie",
  "Diabet",
  "Endocrinologie",
  "Gastroenterologie"
];
