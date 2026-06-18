let activeTab = 'info';
let selectedTags = [];
let globalCalculatedValues = { bsa: 0, crcl: 0, weightUsed: 0 };

// 1. ระบบควบคุมแท็บ
function switchTab(tabId) {
    activeTab = tabId;
    document.getElementById('content-info').classList.add('hidden');
    document.getElementById('content-seq').classList.add('hidden');
    document.getElementById('content-cal').classList.add('hidden');
    
    document.getElementById('tab-info').className = 'py-4 px-2 text-sm text-slate-500 hover:text-blue-600 transition-all';
    document.getElementById('tab-seq').className = 'py-4 px-2 text-sm text-slate-500 hover:text-blue-600 transition-all';
    document.getElementById('tab-cal').className = 'py-4 px-2 text-sm text-slate-500 hover:text-blue-600 transition-all';

    if (tabId === 'info') {
        document.getElementById('content-info').classList.remove('hidden');
        document.getElementById('tab-info').className = 'py-4 px-2 text-sm tab-active transition-all';
    } else if (tabId === 'seq') {
        document.getElementById('content-seq').classList.remove('hidden');
        document.getElementById('tab-seq').className = 'py-4 px-2 text-sm tab-active transition-all';
    } else if (tabId === 'cal') {
        document.getElementById('content-cal').classList.remove('hidden');
        document.getElementById('tab-cal').className = 'py-4 px-2 text-sm tab-active transition-all';
    }
}

// 2. เรนเดอร์ Filters & Cards (Tab 1)
function initFilters() {
    const allTags = new Set();
    chemoDrugsData.forEach(d => d.tags.forEach(t => allTags.add(t)));
    const container = document.getElementById('tag-filters-container');
    container.innerHTML = '';
    
    allTags.forEach(tag => {
        const btn = document.createElement('button');
        btn.innerText = tag;
        btn.className = "px-3 py-1 text-xs rounded-full border border-slate-300 bg-white text-slate-600 hover:bg-slate-100 transition-all";
        btn.onclick = () => toggleTagFilter(tag, btn);
        container.appendChild(btn);
    });
}

function toggleTagFilter(tag, btn) {
    if (selectedTags.includes(tag)) {
        selectedTags = selectedTags.filter(t => t !== tag);
        btn.className = "px-3 py-1 text-xs rounded-full border border-slate-300 bg-white text-slate-600 hover:bg-slate-100 transition-all";
    } else {
        selectedTags.push(tag);
        btn.className = "px-3 py-1 text-xs rounded-full bg-blue-600 text-white border border-blue-600 font-medium transition-all";
    }
    filterDrugs();
}

function filterDrugs() {
    const q = document.getElementById('search-drug').value.toLowerCase();
    const grid = document.getElementById('drug-grid');
    grid.innerHTML = '';

    const filtered = chemoDrugsData.filter(drug => {
        const matchesSearch = drug.genericName.toLowerCase().includes(q) || drug.brandName.toLowerCase().includes(q);
        const matchesTags = selectedTags.every(t => drug.tags.includes(t));
        return matchesSearch && matchesTags;
    });

    filtered.forEach(d => {
        const card = document.createElement('div');
        card.className = "bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between";
        
        let tagsHtml = d.tags.map(t => {
            let cls = "bg-slate-100 text-slate-700 text-[11px] px-2 py-0.5 rounded";
            if(t.includes('Vesicant')) cls = "tag-vesicant text-[11px] px-2 py-0.5 rounded font-medium";
            if(t.includes('แสง')) cls = "tag-light text-[11px] px-2 py-0.5 rounded font-medium";
            if(t.includes('filter')) cls = "tag-filter text-[11px] px-2 py-0.5 rounded font-medium";
            if(t.includes('เขย่า')) cls = "tag-shake text-[11px] px-2 py-0.5 rounded font-medium";
            return `<span class="${cls}">${t}</span>`;
        }).join('');

        card.innerHTML = `
            <div>
                <div class="flex justify-between items-start mb-2">
                    <div>
                        <h4 class="text-base font-bold text-blue-900">${d.genericName}</h4>
                        <p class="text-xs text-slate-400 italic">Brand: ${d.brandName}</p>
                    </div>
                    <div class="flex flex-wrap gap-1 justify-end max-w-[60%]">${tagsHtml}</div>
                </div>
                <div class="text-xs space-y-1.5 border-t pt-2 text-slate-600">
                    <div><span class="font-semibold text-slate-800">💧 สารน้ำที่ใช้ได้:</span> ${d.fluids}</div>
                    <div><span class="font-semibold text-slate-800">🧪 ความคงตัวหลัง Recon:</span> ${d.stabilityRecon}</div>
                    <div><span class="font-semibold text-slate-800">⏳ ความคงตัวหลัง Dilute:</span> ${d.stabilityDilute}</div>
                    <div><span class="font-semibold text-slate-800">⚠️ Max Conc:</span> ${d.maxConc}</div>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// 3. เรนเดอร์ Sequencing (Tab 2)
function filterSequences() {
    const q = document.getElementById('search-seq').value.toLowerCase();
    const container = document.getElementById('seq-list');
    container.innerHTML = '';

    const filtered = regimenSequencesData.filter(r => {
        return r.regimenName.toLowerCase().includes(q) || r.sequenceSteps.some(s => s.drug.toLowerCase().includes(q));
    });

    filtered.forEach(r => {
        const div = document.createElement('div');
        div.className = "bg-white p-4 rounded-xl shadow-sm border border-slate-200";
        
        let stepsHtml = r.sequenceSteps.map(s => `
            <div class="flex items-start gap-3 p-2 bg-slate-50 rounded-lg border-l-4 border-blue-600">
                <span class="bg-blue-900 text-white font-bold text-xs w-5 h-5 flex items-center justify-center rounded-full mt-0.5 shrink-0">${s.step}</span>
                <div>
                    <span class="font-bold text-sm text-slate-800">${s.drug}</span>
                    <p class="text-xs text-slate-600 mt-0.5">${s.detail}</p>
                </div>
            </div>
        `).join('<div class="h-2 w-0.5 bg-slate-300 ml-4"></div>');

        div.innerHTML = `
            <h4 class="text-sm font-bold text-blue-900 mb-3 flex items-center gap-2">📋 สูตร: ${r.regimenName}</h4>
            <div class="space-y-0">${stepsHtml}</div>
        `;
        container.appendChild(div);
    });
}

// 4. ระบบคำนวณทางคลินิก (Tab 3: ChemoCal)
function calculateAll() {
    const gender = document.getElementById('cal-gender').value;
    const age = parseFloat(document.getElementById('cal-age').value) || 0;
    const ht = parseFloat(document.getElementById('cal-height').value) || 0;
    const tbw = parseFloat(document.getElementById('cal-tbw').value) || 0;
    const scr = parseFloat(document.getElementById('cal-scr').value) || 0;

    if (!ht || !tbw) return;

    // คำนวณ BSA (Mosteller)
    const bsa = Math.sqrt((ht * tbw) / 3600);
    globalCalculatedValues.bsa = bsa;
    document.getElementById('res-bsa').innerText = bsa.toFixed(2) + " m²";

    // คำนวณ IBW
    let ibw = 0;
    const htInches = ht / 2.54;
    const inchesOver5Feet = Math.max(0, htInches - 60);
    if (gender === 'male') {
        ibw = 50 + (2.3 * inchesOver5Feet);
    } else {
        ibw = 45.5 + (2.3 * inchesOver5Feet);
    }
    document.getElementById('res-ibw').innerText = ibw.toFixed(1) + " kg";

    // คำนวณ ABW (Adjusted Body Weight)
    const abw = ibw + 0.4 * (tbw - ibw);
    document.getElementById('res-abw').innerText = abw.toFixed(1) + " kg";

    // เกณฑ์การเลือกน้ำหนักตัวทางคลินิก
    let selectedWt = tbw;
    if (tbw > ibw * 1.3) {
        selectedWt = abw; // อ้วนมากใช้ Adjusted weight
    } else if (tbw < ibw) {
        selectedWt = tbw; // ผอมกว่ามาตรฐานใช้น้ำหนักจริง
    } else {
        selectedWt = ibw; // อยู่ในเกณฑ์ปกติใช้ Ideal weight
    }
    globalCalculatedValues.weightUsed = selectedWt;
    document.getElementById('res-selected-wt').innerText = selectedWt.toFixed(1) + " kg";

    // คำนวณ CrCl (Cockcroft-Gault) โดยใช้ weight ที่เลือกรวมถึงสมการทางคลินิก
    if (age && scr) {
        let crcl = ((140 - age) * selectedWt) / (72 * scr);
        if (gender === 'female') crcl *= 0.85;
        
        globalCalculatedValues.crcl = crcl;
        document.getElementById('res-crcl').innerText = crcl.toFixed(1) + " mL/min";
    }

    // วิ่งตัวตรวจสอบโดสซ้ำกรณีเปลี่ยนข้อมูลคนไข้กลางคัน
    checkBsaDose();
    checkWtDose();
    checkAucDose();
}

// ฟังก์ชันเช็คช่วงสารสำคัญวิกฤต (Variance Verification ±10%)
function verifyRange(calculated, ordered) {
    if (!calculated || !ordered) return null;
    const diffPercent = ((ordered - calculated) / calculated) * 100;
    const inRange = Math.abs(diffPercent) <= 10;
    const minRange = calculated * 0.9;
    const maxRange = calculated * 1.1;
    return { diffPercent, inRange, minRange, maxRange };
}

function checkBsaDose() {
    const std = parseFloat(document.getElementById('bsa-std').value) || 0;
    const ordered = parseFloat(document.getElementById('bsa-ordered').value) || 0;
    const calculatedRatioBox = document.getElementById('bsa-calculated-ratio');
    const alertBox = document.getElementById('bsa-alert');

    if (!std || !ordered || !globalCalculatedValues.bsa) {
        alertBox.classList.add('hidden');
        return;
    }

    const expectedDose = std * globalCalculatedValues.bsa;
    const actualRatio = ordered / globalCalculatedValues.bsa;
    calculatedRatioBox.innerText = actualRatio.toFixed(2) + " mg/m²";

    const check = verifyRange(expectedDose, ordered);
    alertBox.classList.remove('hidden');

    if (check.inRange) {
        alertBox.className = "p-3 rounded-lg text-xs font-medium bg-green-100 text-green-800 border border-green-300";
        alertBox.innerHTML = `✅ ขนาดยาอยู่ในเกณฑ์ปลอดภัย (ต่างกัน ${check.diffPercent.toFixed(1)}%) <br> ช่วงแนะนำ (±10%): ${check.minRange.toFixed(1)} - ${check.maxRange.toFixed(1)} mg`;
    } else {
        alertBox.className = "p-3 rounded-lg text-xs font-medium bg-red-100 text-red-800 border border-red-300";
        alertBox.innerHTML = `⚠️ แจ้งเตือน: โดสคลาดเคลื่อนนอกช่วงปลอดภัย! (ต่างกัน ${check.diffPercent.toFixed(1)}%) <br> ขนาดยาที่ควรจะเป็นคือ: <b>${expectedDose.toFixed(1)} mg</b> <br> ช่วงเซฟตี้ที่ยอมรับได้ (±10%): <b>${check.minRange.toFixed(1)} - ${check.maxRange.toFixed(1)} mg</b>`;
    }
}

function checkWtDose() {
    const std = parseFloat(document.getElementById('wt-std').value) || 0;
    const ordered = parseFloat(document.getElementById('wt-ordered').value) || 0;
    const calculatedRatioBox = document.getElementById('wt-calculated-ratio');
    const alertBox = document.getElementById('wt-alert');

    if (!std || !ordered || !globalCalculatedValues.weightUsed) {
        alertBox.classList.add('hidden');
        return;
    }

    const expectedDose = std * globalCalculatedValues.weightUsed;
    const actualRatio = ordered / globalCalculatedValues.weightUsed;
    calculatedRatioBox.innerText = actualRatio.toFixed(2) + " mg/kg";

    const check = verifyRange(expectedDose, ordered);
    alertBox.classList.remove('hidden');

    if (check.inRange) {
        alertBox.className = "p-3 rounded-lg text-xs font-medium bg-green-100 text-green-800 border border-green-300";
        alertBox.innerHTML = `✅ ขนาดยาอยู่ในเกณฑ์ปลอดภัย (ต่างกัน ${check.diffPercent.toFixed(1)}%) <br> ช่วงแนะนำ (±10%): ${check.minRange.toFixed(1)} - ${check.maxRange.toFixed(1)} mg`;
    } else {
        alertBox.className = "p-3 rounded-lg text-xs font-medium bg-red-100 text-red-800 border border-red-300";
        alertBox.innerHTML = `⚠️ แจ้งเตือน: โดสคลาดเคลื่อนเกินพิกัดความปลอดภัย! (ต่างกัน ${check.diffPercent.toFixed(1)}%) <br> ขนาดยาที่ควรจะเป็นคือ: <b>${expectedDose.toFixed(1)} mg</b> <br> ช่วงเซฟตี้ที่ยอมรับได้ (±10%): <b>${check.minRange.toFixed(1)} - ${check.maxRange.toFixed(1)} mg</b>`;
    }
}

function checkAucDose() {
    const targetAuc = parseFloat(document.getElementById('auc-std').value) || 0;
    const ordered = parseFloat(document.getElementById('auc-ordered').value) || 0;
    const calculatedRatioBox = document.getElementById('auc-calculated-ratio');
    const alertBox = document.getElementById('auc-alert');

    if (!targetAuc || !ordered || !globalCalculatedValues.crcl) {
        alertBox.classList.add('hidden');
        return;
    }

    // ทำการ Cap ค่า GFR (CrCl) ไม่เกิน 125 mL/min ตามคำแนะนำความปลอดภัยมาตรฐาน
    const cappedCrCl = Math.min(125, globalCalculatedValues.crcl);
    
    // สูตรดั้งเดิม Calvert Formula: Dose = AUC × (GFR + 25)
    const expectedDose = targetAuc * (cappedCrCl + 25);
    const actualAuc = ordered / (cappedCrCl + 25);
    calculatedRatioBox.innerText = actualAuc.toFixed(2) + " AUC";

    const check = verifyRange(expectedDose, ordered);
    alertBox.classList.remove('hidden');

    if (check.inRange) {
        alertBox.className = "p-3 rounded-lg text-xs font-medium bg-green-100 text-green-800 border border-green-300";
        alertBox.innerHTML = `✅ ค่าคำนวณผ่านเกณฑ์ Calvert (ต่างกัน ${check.diffPercent.toFixed(1)}%) <br> ช่วงแนะนำ (±10%): ${check.minRange.toFixed(1)} - ${check.maxRange.toFixed(1)} mg (ใช้ GFR ปลั๊กอินที่ ${cappedCrCl.toFixed(1)} mL/min)`;
    } else {
        alertBox.className = "p-3 rounded-lg text-xs font-medium bg-red-100 text-red-800 border border-red-300";
        alertBox.innerHTML = `⚠️ แจ้งเตือน: คลาดเคลื่อนวิกฤต! (ต่างกัน ${check.diffPercent.toFixed(1)}%) <br> ขนาดยาที่ถูกต้องตาม Calvert: <b>${expectedDose.toFixed(1)} mg</b> <br> ช่วงเซฟตี้ที่ยอมรับได้ (±10%): <b>${check.minRange.toFixed(1)} - ${check.maxRange.toFixed(1)} mg</b>`;
    }
}

// สั่งงานเมื่อโหลดหน้าเว็บสำเร็จ
window.onload = () => {
    initFilters();
    filterDrugs();
    filterSequences();
};
