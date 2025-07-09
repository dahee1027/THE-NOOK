// === 고객용 사이트 기능 ===

// === 전역 상태 ===
let currentCategory = null;
let cart = {}; // {itemId: quantity}
let tempQuantity = {}; // {itemId: quantity} - 임시 수량 (ADD 버튼 누르기 전)
let temperatureOptions = {}; // {itemId: 'hot' | 'ice'}
let currentOrder = [];

// === 페이지 초기화 ===
document.addEventListener('DOMContentLoaded', function() {
    initializeCustomerPage();
});

function initializeCustomerPage() {
    loadBranding();
    loadCategories();
    setupEventListeners();
    
    // 첫 번째 카테고리로 시작
    const categories = dataManager.getCategories();
    if (categories.length > 0) {
        selectCategory(categories[0].id);
    }
    
    updateOrderButton();
}

// === 브랜딩 로드 ===
function loadBranding() {
    const branding = dataManager.getBranding();
    
    // 로고 업데이트
    const logoImage = document.getElementById('logo-image');
    if (logoImage && branding.logoUrl) {
        logoImage.src = branding.logoUrl;
        logoImage.style.display = 'block';
    }
    
    // 소제목 업데이트
    const subtitle = document.getElementById('subtitle');
    if (subtitle) {
        subtitle.textContent = branding.subtitle;
    }
}

// === 카테고리 로드 ===
function loadCategories() {
    const categories = dataManager.getCategories();
    const tabContainer = document.getElementById('categoryTabs');
    
    if (!tabContainer) return;
    
    tabContainer.innerHTML = '';
    
    categories.forEach(category => {
        const tab = document.createElement('button');
        tab.className = 'category-tab';
        tab.textContent = category.name;
        tab.onclick = () => selectCategory(category.id);
        tabContainer.appendChild(tab);
    });
}

// === 카테고리 선택 ===
function selectCategory(categoryId) {
    currentCategory = categoryId;
    
    // 탭 활성화 상태 업데이트
    const tabs = document.querySelectorAll('.category-tab');
    tabs.forEach((tab, index) => {
        const categories = dataManager.getCategories();
        if (categories[index] && categories[index].id === categoryId) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    loadMenuItems(categoryId);
}

// === 메뉴 아이템 로드 ===
function loadMenuItems(categoryId) {
    const menuItems = dataManager.getMenuItems(categoryId);
    const menuList = document.getElementById('menuList');
    
    if (!menuList) return;
    
    if (menuItems.length === 0) {
        menuList.innerHTML = `
            <div class="empty-state">
                <h3>메뉴가 없습니다</h3>
                <p>이 카테고리에는 아직 메뉴가 등록되지 않았습니다.</p>
            </div>
        `;
        return;
    }
    
    menuList.innerHTML = '';
    
    menuItems.forEach(item => {
        const menuCard = createMenuCard(item);
        menuList.appendChild(menuCard);
    });
}

// === 메뉴 카드 생성 ===
function createMenuCard(item) {
    const card = document.createElement('div');
    card.className = 'menu-card';
    card.setAttribute('data-item-id', item.id);
    
    const cartQuantity = cart[item.id] || 0;
    const currentTempQuantity = tempQuantity[item.id] || 0;
    const selectedTemp = getSelectedTemperature(item.id);
    const isTemperatureSelected = selectedTemp !== null;
    
    card.innerHTML = `
        <img src="${item.imageUrl || getDefaultImage()}" alt="${item.name}" class="menu-image" 
             onerror="this.src='${getDefaultImage()}'">
        <div class="menu-info">
            <h3 class="menu-name">${item.name}</h3>
            <p class="menu-description">${item.description}</p>
            <div class="temperature-options">
                <button class="temp-option ${selectedTemp === 'hot' ? 'active' : ''}" 
                        onclick="selectTemperature('${item.id}', 'hot')">HOT</button>
                <button class="temp-option ${selectedTemp === 'ice' ? 'active' : ''}" 
                        onclick="selectTemperature('${item.id}', 'ice')">ICE</button>
            </div>
            <div class="menu-footer">
                <span class="menu-price">${formatPrice(item.price)}</span>
                <div class="quantity-control ${!isTemperatureSelected ? 'disabled' : ''}">
                    <button class="quantity-btn" onclick="decreaseQuantity('${item.id}')" 
                            ${!isTemperatureSelected || currentTempQuantity <= 0 ? 'disabled' : ''}>-</button>
                    <span class="quantity-display">${currentTempQuantity}</span>
                    <button class="quantity-btn" onclick="increaseQuantity('${item.id}')"
                            ${!isTemperatureSelected ? 'disabled' : ''}>+</button>
                </div>
            </div>
            <div class="add-to-cart">
                <button class="add-btn" onclick="addToCart('${item.id}')" 
                        ${!isTemperatureSelected || currentTempQuantity <= 0 ? 'disabled' : ''}>
                    ADD ${cartQuantity > 0 ? `(${cartQuantity})` : ''}
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// === 기본 이미지 URL ===
function getDefaultImage() {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjEwMCIgeT0iMTEwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk1lbnUgSW1hZ2U8L3RleHQ+PC9zdmc+';
}

// === 온도 옵션 관리 ===
function selectTemperature(itemId, temperature) {
    temperatureOptions[itemId] = temperature;
    
    // UI 업데이트
    const card = document.querySelector(`[data-item-id="${itemId}"]`);
    if (card) {
        const tempButtons = card.querySelectorAll('.temp-option');
        tempButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.textContent === temperature.toUpperCase()) {
                btn.classList.add('active');
            }
        });
        
        // 수량 조절 버튼 활성화
        const quantityControl = card.querySelector('.quantity-control');
        const plusButton = card.querySelector('.quantity-btn:last-child');
        
        quantityControl.classList.remove('disabled');
        plusButton.disabled = false;
        
        const currentTempQuantity = tempQuantity[itemId] || 0;
        const minusButton = card.querySelector('.quantity-btn:first-child');
        minusButton.disabled = currentTempQuantity <= 0;
        
        // ADD 버튼 활성화
        const addButton = card.querySelector('.add-btn');
        if (addButton) {
            addButton.disabled = currentTempQuantity <= 0;
        }
    }
}

function getSelectedTemperature(itemId) {
    return temperatureOptions[itemId] || null;
}

// === 수량 조절 ===
function increaseQuantity(itemId) {
    // 온도가 선택되었는지 확인
    if (!getSelectedTemperature(itemId)) {
        showToast('온도를 먼저 선택해주세요.');
        return;
    }
    
    tempQuantity[itemId] = (tempQuantity[itemId] || 0) + 1;
    updateMenuCard(itemId);
}

function decreaseQuantity(itemId) {
    // 온도가 선택되었는지 확인
    if (!getSelectedTemperature(itemId)) {
        showToast('온도를 먼저 선택해주세요.');
        return;
    }
    
    if (tempQuantity[itemId] && tempQuantity[itemId] > 0) {
        tempQuantity[itemId]--;
        if (tempQuantity[itemId] === 0) {
            delete tempQuantity[itemId];
        }
        updateMenuCard(itemId);
    }
}

// === 장바구니 추가 ===
function addToCart(itemId) {
    const currentTempQuantity = tempQuantity[itemId] || 0;
    if (currentTempQuantity <= 0) {
        showToast('수량을 선택해주세요.');
        return;
    }
    
    const temperature = getSelectedTemperature(itemId);
    if (!temperature) {
        showToast('온도를 선택해주세요.');
        return;
    }
    
    // 장바구니에 추가
    cart[itemId] = (cart[itemId] || 0) + currentTempQuantity;
    
    // 임시 수량 초기화
    delete tempQuantity[itemId];
    
    // UI 업데이트
    updateMenuCard(itemId);
    updateOrderButton();
    
    showToast(`${currentTempQuantity}잔이 장바구니에 추가되었습니다.`);
}

// === 메뉴 카드 업데이트 ===
function updateMenuCard(itemId) {
    const card = document.querySelector(`[data-item-id="${itemId}"]`);
    if (!card) return;
    
    const cartQuantity = cart[itemId] || 0;
    const currentTempQuantity = tempQuantity[itemId] || 0;
    const selectedTemp = getSelectedTemperature(itemId);
    const isTemperatureSelected = selectedTemp !== null;
    
    // 수량 표시 업데이트
    const quantityDisplay = card.querySelector('.quantity-display');
    if (quantityDisplay) {
        quantityDisplay.textContent = currentTempQuantity;
    }
    
    // 버튼 상태 업데이트
    const minusButton = card.querySelector('.quantity-btn:first-child');
    const plusButton = card.querySelector('.quantity-btn:last-child');
    const addButton = card.querySelector('.add-btn');
    
    if (minusButton) {
        minusButton.disabled = !isTemperatureSelected || currentTempQuantity <= 0;
    }
    if (plusButton) {
        plusButton.disabled = !isTemperatureSelected;
    }
    if (addButton) {
        addButton.disabled = !isTemperatureSelected || currentTempQuantity <= 0;
        addButton.textContent = `ADD ${cartQuantity > 0 ? `(${cartQuantity})` : ''}`;
    }
    
    // 수량 조절 영역 활성화 상태 업데이트
    const quantityControl = card.querySelector('.quantity-control');
    if (quantityControl) {
        if (isTemperatureSelected) {
            quantityControl.classList.remove('disabled');
        } else {
            quantityControl.classList.add('disabled');
        }
    }
}

// === 주문 버튼 업데이트 ===
function updateOrderButton() {
    const orderButton = document.getElementById('orderButton');
    const totalAmount = document.getElementById('totalAmount');
    
    if (!orderButton || !totalAmount) return;
    
    const total = calculateTotal();
    const itemCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
    
    if (itemCount === 0) {
        orderButton.disabled = true;
        orderButton.querySelector('span').textContent = '메뉴를 선택해주세요';
        totalAmount.textContent = formatPrice(0);
    } else {
        orderButton.disabled = false;
        orderButton.querySelector('span').textContent = `주문하기 (${itemCount}개)`;
        totalAmount.textContent = formatPrice(total);
    }
}

// === 총액 계산 ===
function calculateTotal() {
    let total = 0;
    const allMenuItems = dataManager.getMenuItems();
    
    for (const [itemId, quantity] of Object.entries(cart)) {
        const item = allMenuItems.find(item => item.id === itemId);
        if (item) {
            total += item.price * quantity;
        }
    }
    
    return total;
}

// === 주문 확인 모달 ===
function showOrderModal() {
    if (Object.keys(cart).length === 0) {
        showToast('주문할 메뉴를 선택해주세요.');
        return;
    }
    
    populateOrderModal();
    openModal('orderModal');
}

function closeOrderModal() {
    closeModal('orderModal');
}

function populateOrderModal() {
    const orderItems = document.getElementById('orderItems');
    const modalTotalAmount = document.getElementById('modalTotalAmount');
    
    if (!orderItems || !modalTotalAmount) return;
    
    orderItems.innerHTML = '';
    const allMenuItems = dataManager.getMenuItems();
    let total = 0;
    
    for (const [itemId, quantity] of Object.entries(cart)) {
        const item = allMenuItems.find(item => item.id === itemId);
        if (!item) continue;
        
        const itemTotal = item.price * quantity;
        total += itemTotal;
        
        const temperature = getSelectedTemperature(itemId);
        const tempText = temperature ? (temperature === 'ice' ? 'ICE' : 'HOT') : 'HOT';
        
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.innerHTML = `
            <div class="order-item-info">
                <h4>${item.name} (${tempText})</h4>
                <div class="order-item-details">${quantity}개 × ${formatPrice(item.price)}</div>
            </div>
            <div class="order-item-price">${formatPrice(itemTotal)}</div>
        `;
        
        orderItems.appendChild(orderItem);
    }
    
    modalTotalAmount.textContent = formatPrice(total);
}

// === 주문 전송 ===
function submitOrder() {
    const orderItems = [];
    const allMenuItems = dataManager.getMenuItems();
    
    for (const [itemId, quantity] of Object.entries(cart)) {
        const item = allMenuItems.find(item => item.id === itemId);
        if (item) {
            const temperature = getSelectedTemperature(itemId) || 'hot';
            orderItems.push({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: quantity,
                temperature: temperature,
                total: item.price * quantity
            });
        }
    }
    
    const order = {
        items: orderItems,
        totalAmount: calculateTotal()
    };
    
    try {
        dataManager.addOrder(order);
        
            // 주문 완료 처리
    cart = {};
    tempQuantity = {};
    temperatureOptions = {};
    updateOrderButton();
    loadMenuItems(currentCategory); // 메뉴 카드 수량 리셋
    closeOrderModal();
        
        showToast('주문이 접수되었습니다! 감사합니다.', 4000);
        
        // 점주 알림 (실제 서비스에서는 서버로 전송)
        console.log('새 주문 접수:', order);
        
    } catch (error) {
        console.error('주문 처리 중 오류:', error);
        showToast('주문 처리 중 오류가 발생했습니다.');
    }
}

// === 관리자 로그인 ===
function showAdminLogin() {
    document.getElementById('adminPassword').value = '';
    document.getElementById('passwordError').style.display = 'none';
    openModal('adminLoginModal');
}

function closeAdminLogin() {
    closeModal('adminLoginModal');
}

function checkAdminPassword() {
    const password = document.getElementById('adminPassword').value;
    const errorMessage = document.getElementById('passwordError');
    
    if (password === '1027') {
        closeAdminLogin();
        // 관리자 페이지로 이동
        window.location.href = 'admin.html';
    } else {
        errorMessage.textContent = '비밀번호가 올바르지 않습니다.';
        errorMessage.style.display = 'block';
        document.getElementById('adminPassword').value = '';
    }
}

// === 이벤트 리스너 설정 ===
function setupEventListeners() {
    // 관리자 비밀번호 입력 시 엔터키 처리
    const adminPassword = document.getElementById('adminPassword');
    if (adminPassword) {
        adminPassword.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                checkAdminPassword();
            }
        });
        
        // 숫자만 입력 허용
        adminPassword.addEventListener('input', function(event) {
            event.target.value = event.target.value.replace(/[^0-9]/g, '');
        });
    }
}

// === 데이터 새로고침 (관리자 페이지에서 변경된 경우) ===
function refreshData() {
    loadBranding();
    loadCategories();
    if (currentCategory) {
        selectCategory(currentCategory);
    }
} 