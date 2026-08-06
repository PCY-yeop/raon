const siteData = {
    summary: {
        title: "사업안내",
        subItems: [
            { name: "사업개요", images: ["images/s1.jpg"] },
            { name: "시공사", images: ["images/s2.jpg"] },
            { name: "프리미엄", images: ["images/s3.jpg"] }
        ]
    },
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
    location: {
        title: "입지환경",
        subItems: [
            { name: "입지환경", images: ["images/e1.jpg"] },
            { name: "주변 시세 비교", images: ["images/e2.jpg"] }
        ]
    },
    units: {
        title: "타입안내",
        subItems: [
            { name: "59A 타입", images: ["images/59a.jpg"] },
            { name: "59B 타입", images: ["images/59b.jpg"] },
            { name: "84 타입", images: ["images/84.jpg"] },
            { name: "44 오피스텔", images: ["images/44.jpg"] }
        ]
    },
    price: {
        title: "분양안내",
        subItems: [
            { name: "아파트 분양가", images: ["images/b1.png"] },
            { name: "오피스텔 분양가", images: ["images/b2.jpg"] },
            { name: "특별 혜택 분석", images: ["images/b3.jpg"] }
        ]
    },
    officetel: {
        title: "계약안내",
        subItems: [
            { name: "납부계좌", images: ["images/g1.jpg"] }
        ]
    }
};

let currentMain = Object.keys(siteData)[0] || 'summary';
let currentSubIndex = 0;
let currentImageIndex = 0;

let touchState = {
    scale: 1,
    startDist: 0,
    posX: 0,
    posY: 0,
    startX: 0,
    startY: 0,
    isDragging: false,
    lastTapTime: 0
};

function resetImgTransform() {
    touchState = { scale: 1, startDist: 0, posX: 0, posY: 0, startX: 0, startY: 0, isDragging: false, lastTapTime: 0 };
    applyImgTransform();
}

function applyImgTransform() {
    const imgEl = document.querySelector('#contentDisplayArea img');
    if (imgEl) {
        imgEl.style.transform = `translate(${touchState.posX}px, ${touchState.posY}px) scale(${touchState.scale})`;
        imgEl.style.transition = touchState.isDragging ? 'none' : 'transform 0.15s ease-out';
    }
}

function initImageTouchEvents() {
    const displayArea = document.getElementById('contentDisplayArea');
    if (!displayArea) return;

    displayArea.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
            touchState.startDist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
        } else if (e.touches.length === 1) {
            const now = Date.now();
            if (now - touchState.lastTapTime < 300) {
                touchState.scale = touchState.scale > 1.2 ? 1 : 2.5;
                if (touchState.scale === 1) {
                    touchState.posX = 0;
                    touchState.posY = 0;
                }
                applyImgTransform();
            }
            touchState.lastTapTime = now;
            touchState.startX = e.touches[0].clientX - touchState.posX;
            touchState.startY = e.touches[0].clientY - touchState.posY;
            touchState.isDragging = true;
        }
    }, { passive: false });

    displayArea.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2 && touchState.startDist > 0) {
            e.preventDefault();
            const currentDist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            const factor = currentDist / touchState.startDist;
            let newScale = touchState.scale * factor;
            touchState.scale = Math.min(Math.max(newScale, 1), 4);
            touchState.startDist = currentDist;
            if (touchState.scale === 1) {
                touchState.posX = 0;
                touchState.posY = 0;
            }
            applyImgTransform();
        } else if (e.touches.length === 1 && touchState.scale > 1 && touchState.isDragging) {
            e.preventDefault();
            touchState.posX = e.touches[0].clientX - touchState.startX;
            touchState.posY = e.touches[0].clientY - touchState.startY;
            applyImgTransform();
        }
    }, { passive: false });

    displayArea.addEventListener('touchend', (e) => {
        touchState.isDragging = false;
        if (e.touches.length < 2) touchState.startDist = 0;
    });
}

function getActiveImageUrl() {
    const currentCategory = siteData[currentMain];
    if (!currentCategory || !currentCategory.subItems || currentCategory.subItems.length === 0) return null;
    const currentSub = currentCategory.subItems[currentSubIndex] || currentCategory.subItems[0];
    const imageList = currentSub.images && currentSub.images.length > 0 ? currentSub.images : null;
    if (imageList) {
        return imageList[currentImageIndex] || imageList[0];
    }
    return `https://placehold.co/1920x1080/0d1b3e/ffffff?text=${encodeURIComponent(currentSub.name)}+JPG+이미지`;
}

function renderContent() {
    resetImgTransform();
    const display = document.getElementById('contentDisplayArea');
    if (!display) return;
    
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
    
    const badgeEl = document.getElementById('currentCategoryBadge');
    const titleEl = document.getElementById('currentContentTitle');
    if (badgeEl) badgeEl.innerText = currentCategory.title;
    if (titleEl) titleEl.innerText = currentSub.name;

    const imageList = currentSub.images && currentSub.images.length > 0 
        ? currentSub.images 
        : [`https://placehold.co/1920x1080/0d1b3e/ffffff?text=${encodeURIComponent(currentSub.name)}+JPG+이미지`];

    if (currentImageIndex >= imageList.length) currentImageIndex = 0;

    const currentImgSrc = imageList[currentImageIndex];
    const fallbackSrc = `https://placehold.co/1920x1080/0d1b3e/ffffff?text=${encodeURIComponent(currentSub.name)}+[${currentImgSrc}]+파일+필요`;

    let paginationHtml = '';
    if (imageList.length > 1) {
        paginationHtml = `
        <div class="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white px-4 py-1.5 rounded-full flex items-center gap-3 text-xs z-10 shadow-lg select-none pointer-events-auto">
            <button onclick="changeImgPage(-1)" class="hover:text-emerald-400 p-1 ${currentImageIndex === 0 ? 'opacity-30 cursor-not-allowed' : ''}"><i class="fa-solid fa-chevron-left"></i></button>
            <span><strong>${currentImageIndex + 1}</strong> / ${imageList.length}</span>
            <button onclick="changeImgPage(1)" class="hover:text-emerald-400 p-1 ${currentImageIndex === imageList.length - 1 ? 'opacity-30 cursor-not-allowed' : ''}"><i class="fa-solid fa-chevron-right"></i></button>
        </div>
        `;
    }

    display.innerHTML = `
        <div class="relative w-full h-full flex items-center justify-center overflow-hidden rounded-xl md:rounded-2xl bg-slate-900 shadow-xl border border-slate-300 transform-gpu">
            <img src="${currentImgSrc}" 
                 alt="${currentSub.name}" 
                 onerror="this.onerror=null; this.src='${fallbackSrc}';"
                 decoding="async"
                 fetchpriority="high"
                 class="max-w-full max-h-full object-contain mx-auto shadow-md transition-transform duration-150 transform-gpu origin-center"
                 loading="eager">
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

function initNav() {
    const primaryNavDesktop = document.getElementById('primaryNavDesktop');
    const primaryNavMobile = document.getElementById('primaryNavMobile');
    
    if (primaryNavDesktop) primaryNavDesktop.innerHTML = '';
    if (primaryNavMobile) primaryNavMobile.innerHTML = '';

    const keys = Object.keys(siteData);
    if (keys.length === 0) return;

    if (!siteData[currentMain]) currentMain = keys[0];

    keys.forEach(key => {
        const item = siteData[key];
        const isActive = key === currentMain;
        
        // 1차 메인목차 (클릭 시 어두운 포레스트 그린 #1b4d24)
        if (primaryNavDesktop) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = `w-full py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer shadow-sm text-center flex-shrink-0 touch-manipulation ${
                isActive ? 'bg-[#1b4d24] raon-accent text-white shadow-md' : 'bg-white text-slate-800 hover:bg-slate-100'
            }`;
            btn.onclick = () => switchMainTab(key, 0);
            btn.innerHTML = `<span>${item.title}</span>`;
            primaryNavDesktop.appendChild(btn);
        }

        if (primaryNavMobile) {
            const btnM = document.createElement('button');
            btnM.type = 'button';
            btnM.className = `py-1.5 px-3 rounded-lg text-[14px] font-bold whitespace-nowrap flex-shrink-0 touch-manipulation ${
                isActive ? 'bg-[#1b4d24] raon-accent text-white shadow' : 'bg-white/10 text-slate-200'
            }`;
            btnM.onclick = () => switchMainTab(key, 0);
            btnM.innerHTML = `<span>${item.title}</span>`;
            primaryNavMobile.appendChild(btnM);
        }
    });

    renderSecondaryNav();
}

function renderSecondaryNav() {
    const secondaryNavDesktop = document.getElementById('secondaryNavDesktop');
    const secondaryNavMobile = document.getElementById('secondaryNavMobile');
    const subTitle = document.getElementById('subCategoryTitle');

    if (secondaryNavDesktop) secondaryNavDesktop.innerHTML = '';
    if (secondaryNavMobile) secondaryNavMobile.innerHTML = '';

    const currentObj = siteData[currentMain];
    if (!currentObj) return;

    if (subTitle) subTitle.innerText = currentObj.title;

    if (currentObj.subItems && currentObj.subItems.length > 0) {
        currentObj.subItems.forEach((sub, index) => {
            const isActive = index === currentSubIndex;

            if (secondaryNavDesktop) {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = `w-full py-2.5 px-3 rounded-lg text-xs font-semibold text-left transition-all cursor-pointer flex items-center justify-between flex-shrink-0 touch-manipulation ${
                    isActive ? 'raon-main text-white shadow-md font-bold' : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                }`;
                btn.onclick = () => switchSubTab(index);
                btn.innerHTML = `<span>${sub.name}</span>`;
                secondaryNavDesktop.appendChild(btn);
            }

            if (secondaryNavMobile) {
                const btnM = document.createElement('button');
                btnM.type = 'button';
                btnM.className = `py-1 px-2.5 rounded-md text-[12px] font-semibold whitespace-nowrap flex-shrink-0 touch-manipulation ${
                    isActive ? 'bg-slate-900 text-white font-bold' : 'bg-slate-100 text-slate-700 border border-slate-300'
                }`;
                btnM.onclick = () => switchSubTab(index);
                btnM.innerHTML = `<span>${sub.name}</span>`;
                secondaryNavMobile.appendChild(btnM);
            }
        });
    }

    renderContent();
}

function openZoomModal() {
    const modal = document.getElementById('imageZoomModal');
    const zoomedImg = document.getElementById('zoomedImage');
    const currentUrl = getActiveImageUrl();

    if (modal && zoomedImg && currentUrl) {
        zoomedImg.src = currentUrl;
        zoomedImg.decoding = 'async';
        modal.classList.remove('hidden');
    }
}

function closeZoomModal() {
    const modal = document.getElementById('imageZoomModal');
    if (modal) modal.classList.add('hidden');
}

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log(`Fullscreen error: ${err.message}`);
        });
    } else {
        if (document.exitFullscreen) document.exitFullscreen();
    }
}

let deferredPrompt = null;

function initPWA() {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    const btnD = document.getElementById('pwaInstallBtnDesktop');
    const btnM = document.getElementById('pwaInstallBtnMobile');

    if (isStandalone) {
        [btnD, btnM].forEach(btn => {
            if (btn) {
                btn.classList.remove('hidden');
                btn.className = "bg-slate-100 text-slate-700 text-xs font-bold px-2 py-1 rounded flex items-center gap-1 border border-slate-300";
                btn.innerHTML = `<i class="fa-solid fa-circle-check text-emerald-500"></i><span>앱 모드</span>`;
                btn.onclick = null;
            }
        });
        return;
    }

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        if (btnD) btnD.classList.remove('hidden');
        if (btnM) btnM.classList.remove('hidden');
    });

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) {
        if (btnD) btnD.classList.remove('hidden');
        if (btnM) btnM.classList.remove('hidden');
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

// 퍼센트(%) 로딩 진행률 표시 기능을 포함한 이미지 프리로더
function preloadAllImagesWithProgress() {
    const imageUrls = [];
    Object.values(siteData).forEach(category => {
        if (category.subItems) {
            category.subItems.forEach(sub => {
                if (sub.images && Array.isArray(sub.images)) imageUrls.push(...sub.images);
            });
        }
    });

    const percentEl = document.getElementById('loadingPercent');
    const progressBar = document.getElementById('loadingProgressBar');
    const statusText = document.getElementById('loadingStatusText');
    const loadingScreen = document.getElementById('loadingScreen');

    if (imageUrls.length === 0) {
        hideLoadingScreen();
        return;
    }

    let loadedCount = 0;
    const totalCount = imageUrls.length;

    function updateProgress() {
        loadedCount++;
        const percent = Math.min(Math.round((loadedCount / totalCount) * 100), 100);
        
        if (percentEl) percentEl.innerText = `${percent}%`;
        if (progressBar) progressBar.style.width = `${percent}%`;

        if (loadedCount >= totalCount) {
            if (statusText) statusText.innerHTML = `<i class="fa-solid fa-circle-check"></i> 로딩 완료!`;
            setTimeout(hideLoadingScreen, 400);
        }
    }

    function hideLoadingScreen() {
        if (loadingScreen) {
            loadingScreen.classList.add('opacity-0', 'pointer-events-none');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }

    // 최대 3.5초 안전 타임아웃 보장
    const timeoutTimer = setTimeout(() => {
        if (percentEl) percentEl.innerText = `100%`;
        if (progressBar) progressBar.style.width = `100%`;
        hideLoadingScreen();
    }, 3500);

    let index = 0;
    function loadNext() {
        if (index >= totalCount) return;
        const img = new Image();
        img.decoding = 'async';
        img.onload = () => { updateProgress(); };
        img.onerror = () => { updateProgress(); };
        img.src = imageUrls[index];
        index++;
        setTimeout(loadNext, 60);
    }

    loadNext();
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeZoomModal();
});

document.addEventListener('DOMContentLoaded', function() {
    initNav();
    initPWA();
    initImageTouchEvents();
    preloadAllImagesWithProgress();
});