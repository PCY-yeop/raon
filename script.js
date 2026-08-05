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

// =========================================================================
// ✨ PWA 정식 제어 로직 (수정 완료)
// =========================================================================
let deferredPrompt = null;

function initPWA() {
    // 1. 서비스 워커 물리 파일(sw.js) 등록 실행
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('서비스 워커 등록 성공!'))
            .catch(err => console.log('서비스 워커 등록 실패:', err));
    }

    // 2. 이미 앱으로 설치되어 단독 모드(Standalone)로 구동 중인지 체크
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (isStandalone) {
        const installBtn = document.getElementById('pwaInstallBtn');
        if (installBtn) {
            installBtn.classList.remove('hidden');
            installBtn.classList.remove('animate-bounce');
            installBtn.className = "bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-slate-300";
            installBtn.innerHTML = `<i class="fa-solid fa-circle-check text-emerald-500"></i><span>전용 앱 모드</span>`;
            installBtn.onclick = null; // 클릭 비활성화
        }
        return;
    }

    // 3. 브라우저 점 3개 메뉴에 설치 권한이 충족되었을 때 발생하는 이벤트
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault(); // 기본 팝업 방지 (우리가 제어하기 위함)
        deferredPrompt = e;
        // 설치 가능한 상태가 되면 화면 내 수동 다운로드 버튼도 보이게 함
        const installBtn = document.getElementById('pwaInstallBtn');
        if (installBtn) installBtn.classList.remove('hidden');
    });

    // 4. 아이폰(Safari) 등 자동 설치 팝업을 지원하지 않는 기기 대응 (모달 띄우기용 버튼 활성화)
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) {
        const installBtn = document.getElementById('pwaInstallBtn');
        if (installBtn) installBtn.classList.remove('hidden');
    }
}

// 앱 다운로드 버튼 클릭 시 동작
function installPWAApp() {
    if (deferredPrompt) {
        // 안드로이드 등 네이티브 프롬프트가 지원되는 기기
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(() => { deferredPrompt = null; });
    } else {
        // 아이폰 또는 윈도우 데스크탑 등 프롬프트 미지원 기기는 안내 모달창 표시
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
