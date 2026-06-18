// ข้อมูลแท็บที่ 1: ข้อมูลยาเดี่ยว
const chemoDrugsData = [
    {
        id: "c1",
        genericName: "Doxorubicin",
        brandName: "Adriamycin",
        tags: ["Vesicant", "ซองกันแสง"],
        fluids: "NS, D5W",
        stabilityRecon: "ความคงตัว 24 ชั่วโมงที่อุณหภูมิห้อง, 48 ชั่วโมงในตู้เย็น",
        stabilityDilute: "ความคงตัวในสารน้ำ 48 ชั่วโมงที่อุณหภูมิห้องและตู้เย็น",
        maxConc: "2 mg/mL"
    },
    {
        id: "c2",
        genericName: "Paclitaxel",
        brandName: "Taxol",
        tags: ["ใช้ set 0.22 mc filter", "ห้ามเขย่า"],
        fluids: "NS, D5W",
        stabilityRecon: "ไม่ต้อง Recon (เป็น Solution)",
        stabilityDilute: "24 ชั่วโมงที่อุณหภูมิห้อง (ไม่แนะนำให้แช่ตู้เย็นเพราะอาจตกตะกอน)",
        maxConc: "1.2 mg/mL"
    },
    {
        id: "c3",
        genericName: "Carboplatin",
        brandName: "Paraplatin",
        tags: [],
        fluids: "D5W, NS",
        stabilityRecon: "8 ชั่วโมงที่อุณหภูมิห้อง",
        stabilityDilute: "24 ชั่วโมงที่อุณหภูมิห้อง, 7 วันในตู้เย็น",
        maxConc: "4 mg/mL"
    }
];

// ข้อมูลแท็บที่ 2: Sequencing ลำดับการให้ยาในสูตรต่าง ๆ
const regimenSequencesData = [
    {
        regimenName: "AC (Breast Cancer)",
        sequenceSteps: [
            { step: 1, drug: "Doxorubicin", detail: "ให้เป็นตัวแรก IV push หรือ Short infusion (Vesicant risk)" },
            { step: 2, drug: "Cyclophosphamide", detail: "ให้ตามหลัง Doxorubicin IV infusion ใน 30-60 นาที" }
        ]
    },
    {
        regimenName: "Paclitaxel + Carboplatin (Ovarian/Lung)",
        sequenceSteps: [
            { step: 1, drug: "Paclitaxel", detail: "ต้องให้ก่อน Carboplatin เสมอ เพื่อป้องกันการเกิด Myelosuppression ที่รุนแรงขึ้น" },
            { step: 2, drug: "Carboplatin", detail: "ให้หลังจากการระบาย Paclitaxel เสร็จสิ้นแล้ว" }
        ]
    }
];
