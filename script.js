// =========================================================================
// 📂 [목차 데이터 편집 섹션] 
// 현장이 바뀔 때 아래 siteData의 이름과 이미지 경로만 적어주시면 위에서 아래로 자동 나열됩니다.
// =========================================================================
const siteData = {
    /* > 1. 사업개요 */
    summary: {
        title: "사업안내",
        subItems: [
            { name: "사업개요", images: ["images/s1.jpg"] },
            { name: "시공사", images: ["images/s2.jpg"] },
            { name: "프리미엄", images: ["images/s3.jpg"] }
        ]
    },
    /* > 2. 단지배치도 */
    layout: {
        title: "단지안내",
        subItems: [
            { name: "단지 배치도", images: ["images/d1.jpg"] },
            { name: "동·호수 배치도", images: ["images/d2.jpg"] },
            { name: "커뮤니티 시설", images: ["images/d3.jpg"] },
            { name: "엘레베이터", images: ["images/d4.jpg"] },
            { name: "주차 배치도", images: ["images/d5.jpg"] }
        ]
    },
    /* > 3. 입지환경 */
    location: {
        title: "입지환경",
        subItems: [
            { name: "입지환경", images: ["images/e1.jpg"] },
            { name: "주변 시세 비교", images: ["images/e2.jpg"] }
        ]
    },
    /* > 4. 상품안내 */
    units: {
        title: "타입안내",
        subItems: [
            { name: "59A 타입", images: ["images/59a.jpg"] },
            { name: "59B 타입", images: ["images/59b.jpg"] },
            { name: "84 타입", images: ["images/84.jpg"] },
            {  name: "44 오피스텔", images: ["images/44.jpg"] }
        ]
    },
    /* > 5. 분양안내 */
    price: {
        title: "분양안내",
        subItems: [
            { name: "아파트 분양가", images: ["images/b1.png"] },
            { name: "오피스텔 분양가", images: ["images/b2.jpg"] },
            { name: "특별 혜택 분석", images: ["images/b3.jpg"] }
        ]
    },
    /* > 6. 오피스텔 */
    officetel: {
        title: "계약안내",
        subItems: [
            { name: "납부계좌", images: ["images/g1.jpg"] },
        ]
    }
};

let currentMain = Object.keys(siteData)[0] || 'summary';
let currentSubIndex = 0;
let currentImageIndex = 0;

// 메인 콘텐츠 이미지 렌더링
function renderContent() {
    const display = document.getElementById('contentDisplayArea');
    
    if (!siteData[currentMain]) {
        currentMain = Object.keys(siteData)[0];
    }
    const currentCategory = siteData[currentMain];
    
    if (!currentCategory || !currentCategory.subItems || currentCategory.subItems.length === 0) {
        display.innerHTML = `<div class="text-white text-sm">등록된 세부 항목이 없습니다.</div>`;
        return;
    }

    if (currentSubIndex >= currentCategory.subItems.length) {
        currentSubIndex = 0;
    }

    const currentSub = currentCategory.subItems[currentSubIndex];
    
    document.getElementById('currentCategoryBadge').innerText = currentCategory.title;
    document.getElementById('currentContentTitle').innerText = currentSub.name;

    const imageList = currentSub.images && currentSub.images.length > 0 
        ? currentSub.images 
        : [`https://placehold.co/1920x1080/0d1b3e/ffffff?text=${encodeURIComponent(currentSub.name)}+JPG+이미지`];

    if (currentImageIndex >= imageList.length) currentImageIndex = 0;

    const currentImgSrc = imageList[currentImageIndex];
    const fallbackSrc = `https://placehold.co/1920x1080/0d1b3e/ffffff?text=${encodeURIComponent(currentSub.name)}+[${currentImgSrc}]+파일+필요`;

    let paginationHtml = '';
    if (imageList.length > 1) {
        paginationHtml = `
        <div class="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur-md text-white px-4 py-1.5 rounded-full flex items-center gap-3 text-xs z-10 shadow-lg">
            <button onclick="changeImgPage(-1)" class="hover:text-emerald-400 transition-colors ${currentImageIndex === 0 ? 'opacity-30 cursor-not-allowed' : ''}"><i class="fa-solid fa-chevron-left"></i></button>
            <span><strong>${currentImageIndex + 1}</strong> / ${imageList.length}</span>
            <button onclick="changeImgPage(1)" class="hover:text-emerald-400 transition-colors ${currentImageIndex === imageList.length - 1 ? 'opacity-30 cursor-not-allowed' : ''}"><i class="fa-solid fa-chevron-right"></i></button>
        </div>
        `;
    }

    display.innerHTML = `
        <div class="relative w-full h-full flex items-center justify-center overflow-hidden rounded-2xl bg-slate-900 shadow-2xl border border-slate-300 group">
            <img src="${currentImgSrc}" 
                 alt="${currentSub.name}" 
                 onerror="this.onerror=null; this.src='${fallbackSrc}';"
                 class="max-w-full max-h-full object-contain mx-auto shadow-md transition-all duration-300">
            ${paginationHtml}
        </div>
    `;
}

function changeImgPage(dir) {
    const currentCategory = siteData[currentMain];
    if (!currentCategory || !currentCategory.subItems[currentSubIndex]) return;
    const imageList = currentCategory.subItems[currentSubIndex].images;
    if (!imageList) return;
    const newIndex = currentImageIndex + dir;
    if (newIndex >= 0 && newIndex < imageList.length) {
        currentImageIndex = newIndex;
        renderContent();
    }
}

function switchMainTab(key, subIndex = 0) {
    currentMain = key;
    currentSubIndex = subIndex;
    currentImageIndex = 0;
    initNav();
}

function switchSubTab(index) {
    currentSubIndex = index;
    currentImageIndex = 0;
    renderSecondaryNav();
}

function goToFirstPage() {
    const keys = Object.keys(siteData);
    if (keys.length > 0) {
        switchMainTab(keys[0], 0);
    }
}

// 1차 목차 자동 나열
function initNav() {
    const primaryNav = document.getElementById('primaryNav');
    primaryNav.innerHTML = '';

    const keys = Object.keys(siteData);
    if (keys.length === 0) return;

    if (!siteData[currentMain]) {
        currentMain = keys[0];
    }

    keys.forEach(key => {
        const item = siteData[key];
        const isActive = key === currentMain;
        
        const btn = document.createElement('button');
        btn.className = `w-full py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer shadow-sm text-center flex-shrink-0 ${
            isActive 
            ? 'raon-accent text-white shadow-md scale-102' 
            : 'bg-white text-slate-800 hover:bg-slate-100 hover:text-slate-900'
        }`;
        btn.onclick = () => switchMainTab(key, 0);
        btn.innerHTML = `<span>${item.title}</span>`;
        primaryNav.appendChild(btn);
    });

    renderSecondaryNav();
}

// 2차 세부목차 자동 나열
function renderSecondaryNav() {
    const secondaryNav = document.getElementById('secondaryNav');
    const subTitle = document.getElementById('subCategoryTitle');
    secondaryNav.innerHTML = '';

    const currentObj = siteData[currentMain];
    if (!currentObj) return;

    subTitle.innerText = currentObj.title;

    if (currentObj.subItems && currentObj.subItems.length > 0) {
        currentObj.subItems.forEach((sub, index) => {
            const isActive = index === currentSubIndex;
            const btn = document.createElement('button');
            btn.className = `w-full py-2.5 px-3 rounded-lg text-xs font-semibold text-left transition-all cursor-pointer flex items-center justify-between flex-shrink-0 ${
                isActive 
                ? 'raon-main text-white shadow-md font-bold' 
                : 'bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 border border-slate-200'
            }`;
            btn.onclick = () => switchSubTab(index);
            btn.innerHTML = `<span>${sub.name}</span>`;
            secondaryNav.appendChild(btn);
        });
    }

    renderContent();
}

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log(`Error attempting full-screen: ${err.message}`);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

// PWA 자동 제어 로직
let deferredPrompt = null;

function initPWA() {
    const manifestData = {
        name: "숭의역 라온프라이빗 스카이브 브리핑북",
        short_name: "라온스카이브",
        start_url: "./",
        display: "standalone",
        orientation: "landscape",
        background_color: "#0d1b3e",
        theme_color: "#0d1b3e",
        icons: [
            { src: "https://placehold.co/192x192/0d1b3e/ffffff?text=RAON+APP", sizes: "192x192", type: "image/png" },
            { src: "https://placehold.co/512x512/0d1b3e/ffffff?text=RAON+APP", sizes: "512x512", type: "image/png" }
        ]
    };
    const manifestBlob = new Blob([JSON.stringify(manifestData)], { type: 'application/json' });
    const manifestLink = document.createElement('link');
    manifestLink.rel = 'manifest';
    manifestLink.href = URL.createObjectURL(manifestBlob);
    document.head.appendChild(manifestLink);

    if ('serviceWorker' in navigator) {
        const swCode = `
            self.addEventListener('install', (e) => self.skipWaiting());
            self.addEventListener('activate', (e) => e.waitUntil(clients.claim()));
            self.addEventListener('fetch', (e) => {});
        `;
        const swBlob = new Blob([swCode], { type: 'application/javascript' });
        navigator.serviceWorker.register(URL.createObjectURL(swBlob))
            .catch(err => console.log('SW error:', err));
    }

    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (isStandalone) {
        const installBtn = document.getElementById('pwaInstallBtn');
        if (installBtn) {
            installBtn.classList.remove('hidden');
            installBtn.classList.remove('animate-bounce');
            installBtn.className = "bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-slate-300";
            installBtn.innerHTML = `<i class="fa-solid fa-circle-check text-emerald-500"></i><span>전용 앱 모드</span>`;
            installBtn.onclick = null;
        }
        return;
    }

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        const installBtn = document.getElementById('pwaInstallBtn');
        if (installBtn) installBtn.classList.remove('hidden');
    });

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) {
        const installBtn = document.getElementById('pwaInstallBtn');
        if (installBtn) installBtn.classList.remove('hidden');
    }
}

function installPWAApp() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(() => { deferredPrompt = null; });
    } else {
        const modal = document.getElementById('pwaInstallModal');
        if (modal) modal.classList.remove('hidden');
    }
}

function closePWAModal() {
    const modal = document.getElementById('pwaInstallModal');
    if (modal) modal.classList.add('hidden');
}

window.onload = function() {
    initNav();
    initPWA();
};