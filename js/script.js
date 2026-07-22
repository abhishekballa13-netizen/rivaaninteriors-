const CONTACT_PHONE = "919821313487";
const WHATSAPP_NUMBER = CONTACT_PHONE;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Data Content
const wcuContent = { 
    1: { icon: "fa-solid fa-compass-drafting", title: "Design That Looks Good & Works", desc: "We prioritize functionality alongside aesthetics. We analyze your lifestyle, movement patterns, and storage needs to create a layout that flows effortlessly.", sub: "Functionality First" }, 
    2: { icon: "fa-solid fa-gem", title: "Minimal, Luxury, Timeless", desc: "We believe true luxury lies in simplicity. Our 'Calm Luxury' philosophy uses clean lines, neutral palettes, and high-quality textures to create spaces that feel expansive and serene.", sub: "Aesthetic Philosophy" }, 
    3: { icon: "fa-solid fa-file-invoice-dollar", title: "Transparent Budgeting", desc: "No hidden costs, no last-minute shocks. We provide a detailed Bill of Quantities (BOQ) before starting the project.", sub: "Financial Integrity" }, 
    4: { icon: "fa-solid fa-helmet-safety", title: "End-to-End Execution", desc: "Sit back and relax. We handle everything – design, material procurement, civil work, carpentry, electricals, and final styling.", sub: "Turnkey Service" }, 
    5: { icon: "fa-solid fa-layer-group", title: "Smart Use of Materials", desc: "Luxury doesn't always mean the most expensive material; it means the *right* material. We guide you to choose durable, easy-to-maintain finishes.", sub: "Material Selection" }, 
    6: { icon: "fa-solid fa-clock", title: "On-Time Delivery", desc: "We value your time. We use strict project management schedules (Gantt charts) to track progress weekly.", sub: "Project Management" } 
};

// Global Functions for HTML onClick events
function openWCUPage(id) { 
    const data = wcuContent[id]; 
    if (data) { 
        document.getElementById('wcu-display-icon').className = data.icon; 
        document.getElementById('wcu-display-sub').innerText = data.sub; 
        document.getElementById('wcu-display-title').innerText = data.title; 
        document.getElementById('wcu-display-desc').innerText = data.desc; 
        switchTab('wcu-page'); 
        document.getElementById('wcu-page').scrollTop = 0; 
    } 
}

function openProjectPage(title, loc, type, year, style, desc, imgSrc) { 
    document.getElementById('pv-title').innerText = title; 
    document.getElementById('pv-sub').innerText = type; 
    document.getElementById('pv-loc').innerText = loc; 
    document.getElementById('pv-year').innerText = year; 
    document.getElementById('pv-type').innerText = type; 
    document.getElementById('pv-style').innerText = style; 
    document.getElementById('pv-desc').innerText = desc; 
    document.getElementById('pv-hero-img').src = imgSrc; 
    document.getElementById('pv-gal-1').src = imgSrc; 
    document.getElementById('pv-gal-2').src = imgSrc; 
    switchTab('project-view'); 
    document.getElementById('project-view').scrollTop = 0; 
}

// Animation Initialization

function initImageAnimations() { 
    const targets = document.querySelectorAll('.teaser-img, .about-img-wrap img, .p-img, .service-bg img, .furn-visual img, .pv-hero img, .wcu-card');
    targets.forEach(img => { 
        img.style.opacity = '1';
        img.style.transform = 'none';
    }); 
}

function showResultModal(price, title) { 
    document.getElementById('modal-price-text').innerText = price + "*"; 
    document.getElementById('modal-title-text').innerText = title; 
    const modal = document.getElementById('result-modal');
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    const closeButton = modal.querySelector('.close-modal');
    if (closeButton) closeButton.focus();
}

function closeResultModal() { 
    const modal = document.getElementById('result-modal');
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
}

document.getElementById('result-modal').addEventListener('click', function(e) { 
    if(e.target === this) closeResultModal(); 
});

function setActiveNav(tabId) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
    });
    const activeLink = document.querySelector(`.nav-link[data-tab="${tabId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
        activeLink.setAttribute('aria-current', 'page');
    }
}

const siteHeader = document.querySelector('header');
const rootStyle = document.documentElement.style;
const glowState = {
    x: window.innerWidth * 0.5,
    y: window.innerHeight * 0.34,
    offsetX: 0,
    offsetY: 0,
    rafId: null
};
const scrollUiState = {
    rafId: null
};

function commitGlowPosition() {
    glowState.rafId = null;
    rootStyle.setProperty('--mouse-x', `${glowState.x}px`);
    rootStyle.setProperty('--mouse-y', `${glowState.y}px`);
    rootStyle.setProperty('--mouse-offset-x', `${glowState.offsetX}px`);
    rootStyle.setProperty('--mouse-offset-y', `${glowState.offsetY}px`);
}

function scheduleGlowPosition(x, y) {
    glowState.x = x;
    glowState.y = y;
    if (glowState.rafId !== null) return;
    glowState.rafId = requestAnimationFrame(commitGlowPosition);
}

function updateGlowFromScroll() {
    const activeSection = document.querySelector('.tab-section.active-tab');
    const scrollTop = activeSection ? activeSection.scrollTop : window.scrollY;
    const viewportWidth = window.innerWidth;
    const driftX = Math.sin(scrollTop / 180) * Math.max(10, viewportWidth * 0.012);
    const driftY = Math.min(72, scrollTop * 0.08);
    glowState.offsetX = driftX;
    glowState.offsetY = driftY;
    if (glowState.rafId !== null) return;
    glowState.rafId = requestAnimationFrame(commitGlowPosition);
}

function initGlowTracking() {
    if (prefersReducedMotion) {
        return;
    }

    commitGlowPosition();
    updateGlowFromScroll();

    window.addEventListener('pointermove', (event) => {
        if (event.pointerType === 'touch') return;
        scheduleGlowPosition(event.clientX, event.clientY);
    }, { passive: true });

    window.addEventListener('pointerleave', () => {
        scheduleGlowPosition(window.innerWidth * 0.52, window.innerHeight * 0.33);
    }, { passive: true });

    const scheduleScrollUiUpdate = () => {
        if (scrollUiState.rafId !== null) return;
        scrollUiState.rafId = requestAnimationFrame(() => {
            scrollUiState.rafId = null;
            updateGlowFromScroll();
            syncHeaderOnScroll();
        });
    };

    window.addEventListener('scroll', scheduleScrollUiUpdate, { passive: true });

    document.querySelectorAll('.tab-section').forEach((section) => {
        section.addEventListener('scroll', scheduleScrollUiUpdate, { passive: true });
    });
}

function syncHeaderOnScroll() {
    if (!siteHeader) return;
    const activeSection = document.querySelector('.tab-section.active-tab');
    const scrollTop = activeSection ? activeSection.scrollTop : window.scrollY;
    siteHeader.classList.toggle('scrolled', scrollTop > 16);
}

function updateStickyInquiry(tabId = currentTab) {
    const sticky = document.getElementById('stickyInquiry');
    if (!sticky) return;
    const hiddenTabs = ['calculator', 'contact', 'furniture'];
    const shouldShow = !hiddenTabs.includes(tabId);
    sticky.classList.toggle('active', shouldShow);
}

function enhanceKeyboardAccessibility() {
    const clickableElements = document.querySelectorAll('[onclick]');
    clickableElements.forEach((element) => {
        if (element.dataset.a11yBound === "true") return;

        const tag = element.tagName.toLowerCase();
        const isNativeInteractive = ['a', 'button', 'input', 'select', 'textarea', 'summary'].includes(tag);
        if (!isNativeInteractive) {
            element.setAttribute('tabindex', '0');
            if (!element.getAttribute('role')) element.setAttribute('role', 'button');
            element.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    element.click();
                }
            });
        }
        element.dataset.a11yBound = "true";
    });
}

// Calculator Logic - Interior Estimator
const INTERIOR_ESTIMATOR_DATA = {
    properties: [
        { id: '1 BHK', bedrooms: 1, icon: 'fa-solid fa-house', sub: 'Compact home' },
        { id: '2 BHK', bedrooms: 2, icon: 'fa-solid fa-building-user', sub: 'Popular family layout' },
        { id: '3 BHK', bedrooms: 3, icon: 'fa-solid fa-house-chimney', sub: 'Bigger planning space' },
        { id: '4 BHK', bedrooms: 4, icon: 'fa-solid fa-city', sub: 'Large family residence' },
        { id: 'Villa', bedrooms: 4, icon: 'fa-solid fa-mountain-city', sub: 'Flexible bedroom count' }
    ],
    living: [
        { id: 'sofa', label: 'Sofa', price: 45000 },
        { id: 'sofaBed', label: 'Sofa Cum Bed', price: 65000 },
        { id: 'dining', label: 'Dining Table (4 Chairs)', price: 45000 },
        { id: 'shoeRack', label: 'Shoe Rack', price: 24000 },
        { id: 'tvStorage', label: 'TV Unit (Storage Only)', price: 25000 }
    ],
    bedroom: [
        { id: 'bedTv', label: 'TV Unit', price: 22000 },
        { id: 'queenBed', label: 'Queen Bed with Headboard', price: 74000 },
        { id: 'wardrobe', label: 'Wardrobe', price: 82000 },
        { id: 'study', label: 'Study Table', price: 18000 },
        { id: 'dressing', label: 'Dressing Table', price: 20000 },
        { id: 'sideTable', label: 'Side Table', price: 7500 }
    ],
    kitchen: {
        Laminate: { 'SS Trolley': 195000, Tandem: 205000 },
        Acrylic: { 'SS Trolley': 245000, Tandem: 255000 },
        PU: { 'SS Trolley': 315000, Tandem: 325000 }
    },
    bathroom: [
        { id: 'toiletStorage', label: 'Toilet Storage', price: 26000 },
        { id: 'vanity', label: 'Vanity', price: 15000 }
    ],
    balcony: [
        { id: 'pvcCeiling', label: 'PVC Ceiling', price: 18000 },
        { id: 'woodStorage', label: 'Wooden Storage', price: 30000 }
    ]
};

const INTERIOR_ESTIMATOR_STEPS = [
    'property',
    'ply',
    'living',
    'bedrooms',
    'kitchen',
    'bathroom',
    'balcony',
    'summary'
];

const INTERIOR_ESTIMATOR_META = {
    property: {
        kicker: 'Step 1 of 8',
        title: 'Select Property Type',
        desc: 'Choose the home configuration first. The bedroom sections will adjust automatically.'
    },
    ply: {
        kicker: 'Step 2 of 8',
        title: 'Select Ply Type',
        desc: 'Choose the ply type that best fits your project requirements.'
    },
    living: {
        kicker: 'Step 3 of 8',
        title: 'Living Room Requirements',
        desc: 'Pick any combination of living room items. Every selection updates the estimate instantly.'
    },
    bedrooms: {
        kicker: 'Step 4 of 8',
        title: 'Bedroom Requirements',
        desc: 'Each bedroom is independent, so you can choose different items for Bedroom 1, Bedroom 2, and so on.'
    },
    kitchen: {
        kicker: 'Step 5 of 8',
        title: 'Kitchen Finish',
        desc: 'Select the finish first, then the shutter hardware. Kitchen prices also follow the ply multiplier.'
    },
    bathroom: {
        kicker: 'Step 6 of 8',
        title: 'Bathroom Additions',
        desc: 'Choose one or more bathroom storage additions.'
    },
    balcony: {
        kicker: 'Step 7 of 8',
        title: 'Balcony Additions',
        desc: 'Add balcony finish or storage items if required.'
    },
    summary: {
        kicker: 'Step 8 of 8',
        title: 'Estimated Cost & Lead Form',
        desc: 'Review the live estimate, then fill the form to receive the detailed quote.'
    }
};

const interiorEstimatorState = {
    propertyType: null,
    villaBedrooms: 4,
    plyType: null,
    living: new Set(),
    bedrooms: {},
    kitchenFinish: null,
    kitchenHardware: new Set(),
    bathroom: new Set(),
    balcony: new Set(),
    currentStep: 0,
    lead: {
        name: '',
        mobile: '',
        email: '',
        city: ''
    }
};
const interiorEstimatorRenderState = {
    rafId: null
};

const moneyFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
});

function formatMoney(value) {
    return moneyFormatter.format(Math.round(value || 0));
}

function formatMoneyOnwards(value) {
    return `${formatMoney(value)} onwards`;
}

function escapeHtml(value) {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function getPropertyDefinition(propertyType) {
    return INTERIOR_ESTIMATOR_DATA.properties.find((entry) => entry.id === propertyType) || null;
}

function getBedroomCount() {
    const definition = getPropertyDefinition(interiorEstimatorState.propertyType);
    if (!definition) return 0;
    return definition.id === 'Villa' ? interiorEstimatorState.villaBedrooms : definition.bedrooms;
}

function getPlyMultiplier() {
    return interiorEstimatorState.plyType === 'Marine Ply' ? 1.2 : 1;
}

function getBedroomBucket(index) {
    if (!interiorEstimatorState.bedrooms[index]) {
        interiorEstimatorState.bedrooms[index] = new Set();
    }
    return interiorEstimatorState.bedrooms[index];
}

function resetDependentSelections() {
    interiorEstimatorState.living = new Set();
    interiorEstimatorState.bedrooms = {};
    interiorEstimatorState.kitchenFinish = null;
    interiorEstimatorState.kitchenHardware = new Set();
    interiorEstimatorState.bathroom = new Set();
    interiorEstimatorState.balcony = new Set();
}

function resetInteriorEstimator() {
    interiorEstimatorState.propertyType = null;
    interiorEstimatorState.villaBedrooms = 4;
    interiorEstimatorState.plyType = null;
    resetDependentSelections();
    interiorEstimatorState.currentStep = 0;
    scheduleInteriorEstimatorRender();
}

function selectPropertyType(propertyType) {
    if (interiorEstimatorState.propertyType !== propertyType) {
        resetDependentSelections();
    }
    interiorEstimatorState.propertyType = propertyType;
    if (propertyType === 'Villa' && interiorEstimatorState.villaBedrooms < 4) {
        interiorEstimatorState.villaBedrooms = 4;
    }
    scheduleInteriorEstimatorRender();
}

function adjustVillaBedrooms(delta) {
    interiorEstimatorState.villaBedrooms = Math.max(4, Math.min(8, interiorEstimatorState.villaBedrooms + delta));
    scheduleInteriorEstimatorRender();
}

function selectPlyType(plyType) {
    interiorEstimatorState.plyType = plyType;
    scheduleInteriorEstimatorRender();
}

function toggleEstimatorItem(section, itemId, bedroomIndex = null) {
    let bucket;
    if (section === 'bedroom') {
        bucket = getBedroomBucket(bedroomIndex);
    } else {
        bucket = interiorEstimatorState[section];
    }

    if (bucket.has(itemId)) {
        bucket.delete(itemId);
    } else {
        bucket.add(itemId);
    }

    scheduleInteriorEstimatorRender();
}

function toggleLivingItem(itemId) {
    toggleEstimatorItem('living', itemId);
}

function toggleBedroomItem(bedroomIndex, itemId) {
    toggleEstimatorItem('bedroom', itemId, bedroomIndex);
}

function toggleBathroomItem(itemId) {
    toggleEstimatorItem('bathroom', itemId);
}

function toggleBalconyItem(itemId) {
    toggleEstimatorItem('balcony', itemId);
}

function selectKitchenFinish(finish) {
    interiorEstimatorState.kitchenFinish = finish;
    interiorEstimatorState.kitchenHardware = new Set();
    scheduleInteriorEstimatorRender();
}

function selectKitchenHardware(hardware) {
    if (!(interiorEstimatorState.kitchenHardware instanceof Set)) {
        interiorEstimatorState.kitchenHardware = new Set();
    }
    if (interiorEstimatorState.kitchenHardware.has(hardware)) {
        interiorEstimatorState.kitchenHardware.delete(hardware);
    } else {
        interiorEstimatorState.kitchenHardware.add(hardware);
    }
    scheduleInteriorEstimatorRender();
}

function updateLeadField(field, value) {
    interiorEstimatorState.lead[field] = value;
}

function getEstimatorBreakdown() {
    const multiplier = getPlyMultiplier();
    const sections = [];
    let total = 0;

    const addSection = (title, items) => {
        if (!items.length) return;
        const pricedItems = items.map((item) => ({
            label: item.label,
            price: Math.round(item.price * multiplier)
        }));
        total += pricedItems.reduce((sum, item) => sum + item.price, 0);
        sections.push({ title, items: pricedItems });
    };

    addSection('Living Room', INTERIOR_ESTIMATOR_DATA.living.filter((item) => interiorEstimatorState.living.has(item.id)));

    const bedroomCount = getBedroomCount();
    for (let bedroomIndex = 1; bedroomIndex <= bedroomCount; bedroomIndex += 1) {
        const bedroomBucket = interiorEstimatorState.bedrooms[bedroomIndex] || new Set();
        const selectedBedroomItems = INTERIOR_ESTIMATOR_DATA.bedroom.filter((item) => bedroomBucket.has(item.id));
        if (!selectedBedroomItems.length) continue;
        const pricedItems = selectedBedroomItems.map((item) => ({
            label: item.label,
            price: Math.round(item.price * multiplier)
        }));
        total += pricedItems.reduce((sum, item) => sum + item.price, 0);
        sections.push({ title: `Bedroom ${bedroomIndex}`, items: pricedItems });
    }

    if (interiorEstimatorState.kitchenFinish && interiorEstimatorState.kitchenHardware instanceof Set && interiorEstimatorState.kitchenHardware.size) {
        const hardwareItems = Array.from(interiorEstimatorState.kitchenHardware)
            .filter((hardware) => INTERIOR_ESTIMATOR_DATA.kitchen[interiorEstimatorState.kitchenFinish][hardware]);
        if (hardwareItems.length) {
            const pricedItems = hardwareItems.map((hardware) => ({
                label: `${interiorEstimatorState.kitchenFinish} Finish + ${hardware}`,
                price: Math.round(INTERIOR_ESTIMATOR_DATA.kitchen[interiorEstimatorState.kitchenFinish][hardware] * multiplier)
            }));
            total += pricedItems.reduce((sum, item) => sum + item.price, 0);
            sections.push({ title: 'Kitchen', items: pricedItems });
        }
    }

    addSection('Bathroom', INTERIOR_ESTIMATOR_DATA.bathroom.filter((item) => interiorEstimatorState.bathroom.has(item.id)));
    addSection('Balcony', INTERIOR_ESTIMATOR_DATA.balcony.filter((item) => interiorEstimatorState.balcony.has(item.id)));

    return { sections, total, multiplier };
}

function renderEstimatorProgress() {
    const fill = document.getElementById('calcProgressFill');
    const steps = document.getElementById('calcProgressSteps');
    if (!fill || !steps) return;

    const currentStep = interiorEstimatorState.currentStep;
    const stepCount = INTERIOR_ESTIMATOR_STEPS.length;
    const progress = stepCount > 1 ? (currentStep / (stepCount - 1)) * 100 : 0;
    fill.style.width = `${progress}%`;
    steps.innerHTML = INTERIOR_ESTIMATOR_STEPS.map((stepId, index) => {
        const meta = INTERIOR_ESTIMATOR_META[stepId];
        const isActive = index === currentStep;
        const isComplete = index < currentStep;
        const stepNumber = String(index + 1).padStart(2, '0');
        return `
            <span class="calc-progress-step ${isActive ? 'active' : ''} ${isComplete ? 'complete' : ''}">
                <span class="calc-progress-index">${stepNumber}</span>
                <span class="calc-progress-text">${meta.title}</span>
            </span>
        `;
    }).join('');
}

function renderEstimatorSummary() {
    const summary = getEstimatorBreakdown();
    const totalEl = document.getElementById('calcSummaryTotal');
    const metaEl = document.getElementById('calcSummaryMeta');
    const breakdownEl = document.getElementById('calcSummaryBreakdown');
    if (!totalEl || !metaEl || !breakdownEl) return;

    totalEl.textContent = formatMoneyOnwards(summary.total);
    const bedroomCount = getBedroomCount() || (interiorEstimatorState.propertyType === 'Villa' ? interiorEstimatorState.villaBedrooms : 0);
    const propertySelected = Boolean(interiorEstimatorState.propertyType);
    const plySelected = Boolean(interiorEstimatorState.plyType);
    metaEl.innerHTML = `
        <div class="calc-summary-chip ${propertySelected ? 'complete' : ''}"><span>Property Type</span><strong>${interiorEstimatorState.propertyType || 'Not selected'}</strong></div>
        <div class="calc-summary-chip ${plySelected ? 'complete' : ''}"><span>Selected Ply</span><strong>${interiorEstimatorState.plyType || 'Not selected'}</strong></div>
        <div class="calc-summary-chip ${bedroomCount ? 'complete' : ''}"><span>Bedrooms</span><strong>${bedroomCount || '0'}</strong></div>
    `;

    breakdownEl.innerHTML = summary.sections.length ? summary.sections.map((section) => `
        <div class="calc-break-group">
            <h5>${section.title}</h5>
            <div class="calc-break-items">
                ${section.items.map((item) => `<div class="calc-break-item"><span>✓ ${item.label}</span><strong>${formatMoneyOnwards(item.price)}</strong></div>`).join('')}
            </div>
        </div>
    `).join('') : '<p class="calc-empty">Choose your property type, ply, and room selections to see the live estimate.</p>';
}

function renderEstimatorStepContent() {
    const contentEl = document.getElementById('calcStepContent');
    const nextBtn = document.getElementById('calcNextBtn');
    const prevBtn = document.getElementById('calcPrevBtn');
    const stepId = INTERIOR_ESTIMATOR_STEPS[interiorEstimatorState.currentStep];
    const meta = INTERIOR_ESTIMATOR_META[stepId];
    const propertyCount = getBedroomCount();
    if (!contentEl || !meta || !nextBtn || !prevBtn) return;

    const cardMarkup = (items, selectedIds, clickHandler, extraClass = '') => `
        <div class="calc-card-grid ${extraClass}">
            ${items.map((item) => {
                const isSelected = Array.isArray(selectedIds)
                    ? selectedIds.includes(item.id)
                    : selectedIds instanceof Set
                        ? selectedIds.has(item.id)
                        : false;
                const cardTitle = item.label || item.title || item.id;
                const cardSub = item.sub || (typeof item.price === 'number' ? formatMoneyOnwards(item.price) : '') || (item.bedrooms ? `${item.bedrooms} Bedrooms` : '');
                return `
                    <button type="button" class="calc-card-choice ${isSelected ? 'selected' : ''}" onclick="${clickHandler}('${item.id}')">
                        <span class="calc-card-icon"><i class="${item.icon || 'fa-solid fa-circle-dot'}"></i></span>
                        <span class="calc-card-title">${cardTitle}</span>
                        <span class="calc-card-sub">${cardSub}</span>
                    </button>
                `;
            }).join('')}
        </div>
    `;

    if (stepId === 'property') {
        contentEl.innerHTML = `
            ${cardMarkup(INTERIOR_ESTIMATOR_DATA.properties, interiorEstimatorState.propertyType ? [interiorEstimatorState.propertyType] : [], 'selectPropertyType')}
            ${interiorEstimatorState.propertyType === 'Villa' ? `
                <div class="calc-villa-stepper">
                    <span>Villa bedroom count</span>
                    <div class="calc-villa-controls">
                        <button type="button" onclick="adjustVillaBedrooms(-1)">-</button>
                        <strong>${interiorEstimatorState.villaBedrooms}</strong>
                        <button type="button" onclick="adjustVillaBedrooms(1)">+</button>
                    </div>
                </div>
            ` : ''}
        `;
    } else if (stepId === 'ply') {
        contentEl.innerHTML = `
            ${cardMarkup([
                { id: 'Commercial Ply', label: 'Base commercial pricing', icon: 'fa-solid fa-layer-group' },
                { id: 'Marine Ply', label: 'Marine Ply', icon: 'fa-solid fa-water', sub: '20% higher on every item' }
            ], interiorEstimatorState.plyType ? [interiorEstimatorState.plyType] : [], 'selectPlyType')}
            <p class="calc-legend">Select the ply type that best suits your home.</p>
        `;
    } else if (stepId === 'living') {
        contentEl.innerHTML = `
            <div class="calc-room-group">
                <div class="calc-room-header"><i class="fa-solid fa-couch"></i><h4>Living Room</h4></div>
                ${cardMarkup(INTERIOR_ESTIMATOR_DATA.living, Array.from(interiorEstimatorState.living), 'toggleLivingItem')}
            </div>
        `;
    } else if (stepId === 'bedrooms') {
        const sections = [];
        for (let bedroomIndex = 1; bedroomIndex <= propertyCount; bedroomIndex += 1) {
            const bedroomBucket = interiorEstimatorState.bedrooms[bedroomIndex] || new Set();
            sections.push(`
                <div class="calc-room-group">
                    <div class="calc-room-header"><i class="fa-solid fa-bed"></i><h4>Bedroom ${bedroomIndex}</h4></div>
                    <div class="calc-card-grid">
                        ${INTERIOR_ESTIMATOR_DATA.bedroom.map((item) => `
                            <button type="button" class="calc-card-choice ${bedroomBucket.has(item.id) ? 'selected' : ''}" onclick="toggleBedroomItem(${bedroomIndex}, '${item.id}')">
                                <span class="calc-card-icon"><i class="fa-solid fa-check"></i></span>
                                <span class="calc-card-title">${item.label}</span>
                                <span class="calc-card-sub">${formatMoneyOnwards(item.price)}</span>
                            </button>
                        `).join('')}
                    </div>
                </div>
            `);
        }
        contentEl.innerHTML = sections.join('');
    } else if (stepId === 'kitchen') {
        const finishes = Object.keys(INTERIOR_ESTIMATOR_DATA.kitchen);
        contentEl.innerHTML = `
            <div class="calc-room-group">
                <div class="calc-room-header"><i class="fa-solid fa-kitchen-set"></i><h4>Kitchen Finish</h4></div>
                ${cardMarkup(finishes.map((finish) => ({ id: finish, label: `${finish} finish`, icon: 'fa-solid fa-paint-roller', sub: 'Select surface finish' })), interiorEstimatorState.kitchenFinish ? [interiorEstimatorState.kitchenFinish] : [], 'selectKitchenFinish')}
            </div>
            ${interiorEstimatorState.kitchenFinish ? `
                <div class="calc-room-group">
                    <div class="calc-room-header"><i class="fa-solid fa-boxes-stacked"></i><h4>Hardware</h4></div>
                ${cardMarkup(Object.keys(INTERIOR_ESTIMATOR_DATA.kitchen[interiorEstimatorState.kitchenFinish]).map((hardware) => ({ id: hardware, label: `${hardware}`, icon: 'fa-solid fa-sliders', sub: formatMoneyOnwards(INTERIOR_ESTIMATOR_DATA.kitchen[interiorEstimatorState.kitchenFinish][hardware]) })), interiorEstimatorState.kitchenHardware, 'selectKitchenHardware')}
                </div>
            ` : '<p class="calc-legend">Select a kitchen finish first to unlock hardware pricing.</p>'}
        `;
    } else if (stepId === 'bathroom') {
        contentEl.innerHTML = `
            <div class="calc-room-group">
                <div class="calc-room-header"><i class="fa-solid fa-bath"></i><h4>Bathroom</h4></div>
                ${cardMarkup(INTERIOR_ESTIMATOR_DATA.bathroom, Array.from(interiorEstimatorState.bathroom), 'toggleBathroomItem')}
            </div>
        `;
    } else if (stepId === 'balcony') {
        contentEl.innerHTML = `
            <div class="calc-room-group">
                <div class="calc-room-header"><i class="fa-solid fa-seedling"></i><h4>Balcony</h4></div>
                ${cardMarkup(INTERIOR_ESTIMATOR_DATA.balcony, Array.from(interiorEstimatorState.balcony), 'toggleBalconyItem')}
            </div>
        `;
    } else if (stepId === 'summary') {
        const lead = interiorEstimatorState.lead;
        contentEl.innerHTML = `
            <div class="calc-lead-card">
                <h4>Fill your details to receive the detailed estimate</h4>
                <div class="calc-form-grid">
                    <label class="calc-form-field">
                        <span>Name</span>
                        <input id="calcLeadName" type="text" value="${escapeHtml(lead.name)}" oninput="updateLeadField('name', this.value)" placeholder="Your name" />
                    </label>
                    <label class="calc-form-field">
                        <span>Mobile Number</span>
                        <input id="calcLeadMobile" type="tel" value="${escapeHtml(lead.mobile)}" oninput="updateLeadField('mobile', this.value)" placeholder="10-digit mobile number" />
                    </label>
                    <label class="calc-form-field">
                        <span>Email</span>
                        <input id="calcLeadEmail" type="email" value="${escapeHtml(lead.email)}" oninput="updateLeadField('email', this.value)" placeholder="you@example.com" />
                    </label>
                    <label class="calc-form-field">
                        <span>City</span>
                        <input id="calcLeadCity" type="text" value="${escapeHtml(lead.city)}" oninput="updateLeadField('city', this.value)" placeholder="Your city" />
                    </label>
                </div>
                <div class="calc-form-actions">
                    <button type="button" class="btn hover-target" onclick="submitEstimatorLead('estimate')">Get Detailed Estimate</button>
                    <button type="button" class="btn btn-whatsapp hover-target" onclick="submitEstimatorLead('consultation')">Request Free Consultation</button>
                </div>
            </div>
        `;
    }

    const isSummary = stepId === 'summary';
    prevBtn.disabled = interiorEstimatorState.currentStep === 0;
    prevBtn.style.opacity = interiorEstimatorState.currentStep === 0 ? '0.45' : '1';
    prevBtn.style.pointerEvents = interiorEstimatorState.currentStep === 0 ? 'none' : 'auto';
    nextBtn.style.display = isSummary ? 'none' : 'inline-flex';

    if (!isSummary) {
        const requireProperty = stepId === 'property' && !interiorEstimatorState.propertyType;
        const requirePly = stepId === 'ply' && !interiorEstimatorState.plyType;
        const requireKitchen = stepId === 'kitchen' && (!interiorEstimatorState.kitchenFinish || !(interiorEstimatorState.kitchenHardware instanceof Set) || interiorEstimatorState.kitchenHardware.size === 0);
        nextBtn.disabled = requireProperty || requirePly || requireKitchen;
        nextBtn.style.opacity = nextBtn.disabled ? '0.45' : '1';
        nextBtn.style.pointerEvents = nextBtn.disabled ? 'none' : 'auto';
        nextBtn.textContent = interiorEstimatorState.currentStep === INTERIOR_ESTIMATOR_STEPS.length - 2 ? 'Review Estimate' : 'Continue';
    }

    if (!prefersReducedMotion && typeof gsap !== 'undefined') {
        gsap.fromTo(contentEl, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' });
    }
}

function renderInteriorEstimatorNow() {
    const stepId = INTERIOR_ESTIMATOR_STEPS[interiorEstimatorState.currentStep];
    const meta = INTERIOR_ESTIMATOR_META[stepId];
    const kickerEl = document.getElementById('calcStepKicker');
    const titleEl = document.getElementById('calcStepTitle');
    const descEl = document.getElementById('calcStepDesc');
    if (kickerEl) kickerEl.textContent = meta.kicker;
    if (titleEl) titleEl.textContent = meta.title;
    if (descEl) descEl.textContent = meta.desc;
    renderEstimatorProgress();
    renderEstimatorStepContent();
    renderEstimatorSummary();
}

function scheduleInteriorEstimatorRender() {
    if (interiorEstimatorRenderState.rafId !== null) return;
    interiorEstimatorRenderState.rafId = requestAnimationFrame(() => {
        interiorEstimatorRenderState.rafId = null;
        renderInteriorEstimatorNow();
    });
}

function renderInteriorEstimator() {
    scheduleInteriorEstimatorRender();
}

function nextCalcStep() {
    if (interiorEstimatorState.currentStep >= INTERIOR_ESTIMATOR_STEPS.length - 1) return;
    interiorEstimatorState.currentStep += 1;
    scheduleInteriorEstimatorRender();
}

function prevCalcStep() {
    if (interiorEstimatorState.currentStep <= 0) return;
    interiorEstimatorState.currentStep -= 1;
    scheduleInteriorEstimatorRender();
}

function submitEstimatorLead(action) {
    const name = (interiorEstimatorState.lead.name || '').trim();
    const mobile = (interiorEstimatorState.lead.mobile || '').trim();
    const email = (interiorEstimatorState.lead.email || '').trim();
    const city = (interiorEstimatorState.lead.city || '').trim();
    if (!name || !mobile || !email || !city) {
        alert('Please fill in your name, mobile number, email, and city.');
        return;
    }

    const summary = getEstimatorBreakdown();
    const lines = [];
    lines.push(action === 'estimate' ? 'Hello, I want a detailed estimate.' : 'Hello, I want a free consultation.');
    lines.push('');
    lines.push('*Lead Details*');
    lines.push(`Name: ${name}`);
    lines.push(`Mobile: ${mobile}`);
    lines.push(`Email: ${email}`);
    lines.push(`City: ${city}`);
    lines.push('');
    lines.push('*Project Details*');
    lines.push(`Property Type: ${interiorEstimatorState.propertyType || 'Not selected'}`);
    lines.push(`Selected Ply: ${interiorEstimatorState.plyType || 'Not selected'}`);
    lines.push('');
    lines.push('*Estimate Breakdown*');
    summary.sections.forEach((section) => {
        lines.push(section.title);
        section.items.forEach((item) => {
            lines.push(`- ${item.label}: ${formatMoneyOnwards(item.price)}`);
        });
    });
    lines.push('');
    lines.push(`*Estimated Total:* ${formatMoneyOnwards(summary.total)}`);

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=` + encodeURIComponent(lines.join('\n'));
    window.open(url, '_blank', 'noopener');
}

// Calculator Logic - Furniture
let selectedFurnType = null; let selectedFurnMat = null; let selectedFurnTier = null;
const furnitureData = { 
    'sofa': { base: 65000, img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1200', materials: ['Velvet', 'Linen Blend', 'Genuine Leather', 'Bouclé Fabric'] }, 
    'bed': { base: 95000, img: 'https://images.unsplash.com/photo-1505693416388-334343ce6206?q=80&w=1200', materials: ['Teak Wood', 'Fabric Upholstery', 'Leather Headboard', 'Cane Weave'] }, 
    'dining': { base: 55000, img: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=1200', materials: ['Solid Wood', 'Italian Marble', 'Tempered Glass', 'Onyx Stone'] }, 
    'console': { base: 30000, img: 'https://images.unsplash.com/photo-1594242664539-72f3e82b7c61?q=80&w=1200', materials: ['Brass Inlay', 'Matte Duco', 'Veneer Finish', 'Mirror Cladding'] }, 
    'wardrobe': { base: 120000, img: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=1200', materials: ['Laminate', 'Acrylic', 'Back-painted Glass', 'PU Polish'] } 
};
const tierMultipliers = { 'standard': 1.0, 'premium': 1.5, 'luxe': 2.2 };

function selectFurnitureType(el, type) { 
    let options = document.getElementById('furn-type-options').children; 
    for(let opt of options) opt.classList.remove('selected'); 
    el.classList.add('selected'); 
    selectedFurnType = type; 
    selectedFurnMat = null; 
    const imgDisplay = document.getElementById('furn-img-display'); 
    if (prefersReducedMotion) {
        imgDisplay.src = furnitureData[type].img;
    } else {
        gsap.to(imgDisplay, { opacity: 0, scale: 1.2, duration: 0.3, onComplete: () => { imgDisplay.src = furnitureData[type].img; gsap.to(imgDisplay, { opacity: 1, scale: 1, duration: 0.5 }); }});
    }
    renderMaterials(type); 
}

function renderMaterials(type) { 
    const container = document.getElementById('dynamic-furn-materials'); 
    container.innerHTML = ''; 
    const mats = furnitureData[type].materials; 
    mats.forEach(mat => { 
        const div = document.createElement('div'); 
        div.className = 'calc-option hover-target'; 
        div.innerText = mat; 
        div.onclick = function() { selectFurnitureMat(this, mat); }; 
        container.appendChild(div); 
    }); 
    if (!prefersReducedMotion) {
        gsap.from(container.children, { y: 10, opacity: 0, stagger: 0.1, duration: 0.4 });
    }
    enhanceKeyboardAccessibility();
}

function selectFurnitureMat(el, mat) { 
    let options = document.getElementById('dynamic-furn-materials').children; 
    for(let opt of options) opt.classList.remove('selected'); 
    el.classList.add('selected'); 
    selectedFurnMat = mat; 
}

function selectFurnitureTier(el, tier) { 
    let options = document.getElementById('furn-tier-options').children; 
    for(let opt of options) opt.classList.remove('selected'); 
    el.classList.add('selected'); 
    selectedFurnTier = tier; 
}

function calculateFurniturePrice() {
    if(!selectedFurnType) { alert("Please select an Item Type."); return; }
    if(!selectedFurnMat) { alert("Please select a Material."); return; }
    if(!selectedFurnTier) { alert("Please select a Finish Tier."); return; }
    let base = furnitureData[selectedFurnType].base; let multiplier = tierMultipliers[selectedFurnTier];
    let materialVariance = 0; if(selectedFurnMat.includes('Leather') || selectedFurnMat.includes('Marble') || selectedFurnMat.includes('Onyx') || selectedFurnMat.includes('PU')) { materialVariance = 15000; }
    let finalPrice = (base + materialVariance) * multiplier; let formatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 3 });
    
    let msg = `Hello, I am interested in a Furniture Piece.\n\n*Furniture Inquiry*\nItem: ${selectedFurnType}\nMaterial: ${selectedFurnMat}\nFinish: ${selectedFurnTier}\n\n*Est. Cost:* ${formatter.format(finalPrice)} onwards`;
    let url = `https://wa.me/${WHATSAPP_NUMBER}?text=` + encodeURIComponent(msg);
    document.getElementById('modal-whatsapp-btn').href = url;

    showResultModal(`${formatter.format(finalPrice)} onwards`, "ESTIMATED ITEM COST");
}

// Custom cursor disabled for smoother performance.
initGlowTracking();
renderInteriorEstimator();

// Preloader & Intro Animation
if (typeof gsap !== 'undefined') gsap.set("body", { visibility: "visible" }); 
if (prefersReducedMotion || typeof gsap === 'undefined') {
    if (typeof gsap !== 'undefined') {
        gsap.set(".preloader", { display: "none" });
        gsap.set("body", { opacity: 1 });
        gsap.set(".hero-title span", { yPercent: 0, opacity: 1 });
        gsap.set(".hero-sub", { y: 0, opacity: 1 });
    }
    initImageAnimations();
} else {
    const tl = gsap.timeline();
    tl.to(".loader-line", { width: "100%", duration: 1.2, ease: "power2.inOut" })
      .to(".loader-text", { y: -50, opacity: 0, duration: 0.5 })
      .to(".preloader", { yPercent: -100, duration: 1, ease: "expo.inOut" })
      .to("body", { opacity: 1, duration: 0.1 }, "-=1")
      .fromTo(".hero-title span", { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out" }, "-=0.6")
      .fromTo(".hero-sub", { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power2.out" }, "-=0.45")
      .call(() => { initImageAnimations(); });
}

// Tab Switching & Navigation
let currentTab = 'home'; let isAnimating = false;
function switchTab(tabId, updateHistory = true) { 
    if (currentTab === tabId || isAnimating) return; 
    const nextSection = document.getElementById(tabId); 
    if(!nextSection) return; 
    isAnimating = true; 
    if (updateHistory) { history.pushState(null, null, `#${tabId}`); } 
    const currentSection = document.getElementById(currentTab); 
    setActiveNav(tabId);

    if (prefersReducedMotion) {
        currentSection.classList.remove('active-tab');
        currentSection.style.visibility = "hidden";
        currentSection.scrollTop = 0;
        nextSection.classList.add('active-tab');
        nextSection.style.opacity = "1";
        nextSection.style.visibility = "visible";
        currentTab = tabId;
        isAnimating = false;
        updateStickyInquiry(tabId);
        syncHeaderOnScroll();
        return;
    }

    if (typeof gsap === 'undefined') {
        currentSection.classList.remove('active-tab');
        currentSection.style.visibility = "hidden";
        currentSection.scrollTop = 0;
        nextSection.classList.add('active-tab');
        nextSection.style.opacity = "1";
        nextSection.style.visibility = "visible";
        currentTab = tabId;
        isAnimating = false;
        updateStickyInquiry(tabId);
        syncHeaderOnScroll();
        return;
    }

    gsap.to(currentSection, { opacity: 0, y: 16, duration: 0.4, ease: "power2.inOut", onComplete: () => { 
        currentSection.classList.remove('active-tab'); 
        currentSection.style.visibility = "hidden"; 
        currentSection.scrollTop = 0; 
        nextSection.classList.add('active-tab'); 
        gsap.set(nextSection, { opacity: 0, y: 20, visibility: "visible" }); 
        gsap.to(nextSection, { opacity: 1, y: 0, duration: 0.48, ease: "power2.out", onComplete: () => { 
            currentTab = tabId; 
            isAnimating = false; 
            updateStickyInquiry(tabId);
            syncHeaderOnScroll();
        } }); 
    } }); 
}

const mobileMenu = document.getElementById('mobileMenu'); 
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');

function setMobileMenuState(isOpen) {
    mobileMenu.classList.toggle('open', isOpen);
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
    if (mobileMenuToggle) {
        mobileMenuToggle.setAttribute('aria-expanded', String(isOpen));
        mobileMenuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    }
}

function toggleMobileMenu() { setMobileMenuState(!mobileMenu.classList.contains('open')); } 
function mobileLinkClick(tabId) { toggleMobileMenu(); switchTab(tabId); }

window.addEventListener('popstate', (event) => { 
    const hash = window.location.hash.substring(1); 
    if (hash) { switchTab(hash, false); } else { switchTab('home', false); } 
});

window.addEventListener('load', () => { 
    const hash = window.location.hash.substring(1); 
    if (hash && document.getElementById(hash)) { 
        document.querySelectorAll('.tab-section').forEach(sec => { 
            sec.classList.remove('active-tab'); 
            sec.style.opacity = '0'; 
            sec.style.visibility = 'hidden'; 
        }); 
        const targetSection = document.getElementById(hash); 
        targetSection.classList.add('active-tab'); 
        targetSection.style.opacity = '1'; 
        targetSection.style.visibility = 'visible'; 
        currentTab = hash; 
        setActiveNav(hash); 
    } 
    enhanceKeyboardAccessibility();
    setMobileMenuState(false);
    const resultModal = document.getElementById('result-modal');
    if (resultModal) {
        resultModal.setAttribute('role', 'dialog');
        resultModal.setAttribute('aria-modal', 'true');
        resultModal.setAttribute('aria-hidden', 'true');
    }
    updateStickyInquiry(currentTab);
    document.querySelectorAll('.tab-section').forEach((section) => {
        section.addEventListener('scroll', syncHeaderOnScroll, { passive: true });
    });
    window.addEventListener('scroll', syncHeaderOnScroll, { passive: true });
    syncHeaderOnScroll();
});

document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    const resultModal = document.getElementById('result-modal');
    if (resultModal && resultModal.classList.contains('active')) closeResultModal();
    if (mobileMenu && mobileMenu.classList.contains('open')) setMobileMenuState(false);
});
