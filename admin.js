// === 관리자 사이트 기능 ===

// === 전역 상태 ===
let currentTab = 'brand';
let editingCategory = null;
let editingMenuItem = null;
let completedOrders = {}; // {orderId: true/false}

// === 페이지 초기화 ===
document.addEventListener('DOMContentLoaded', function() {
    initializeAdminPage();
});

function initializeAdminPage() {
    loadCompletedOrders();
    loadBrandingData();
    loadCategoryData();
    loadMenuData();
    loadOrderData();
    setupEventListeners();
    
    // 30초마다 주문 데이터 새로고침 (새로운 주문 확인)
    setInterval(() => {
        if (currentTab === 'orders') {
            loadOrderData();
        } else if (currentTab === 'sales') {
            loadSalesData();
        }
    }, 30000);
}

// === 완료된 주문 로드 ===
function loadCompletedOrders() {
    const savedCompleted = localStorage.getItem('completedOrders');
    if (savedCompleted) {
        try {
            completedOrders = JSON.parse(savedCompleted);
        } catch (e) {
            completedOrders = {};
        }
    }
}

// === 탭 관리 ===
function showTab(tabName) {
    // 모든 탭 콘텐츠 숨기기
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // 모든 탭 버튼 비활성화
    const tabButtons = document.querySelectorAll('.nav-tab');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    
    // 선택된 탭 활성화
    const selectedTab = document.getElementById(tabName + 'Tab');
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // 선택된 탭 버튼 활성화
    const selectedButton = document.querySelector(`[onclick="showTab('${tabName}')"]`);
    if (selectedButton) {
        selectedButton.classList.add('active');
    }
    
    currentTab = tabName;
    
    // 탭별 데이터 로드
    switch (tabName) {
        case 'brand':
            loadBrandingData();
            break;
        case 'categories':
            loadCategoryData();
            break;
        case 'menu':
            loadMenuData();
            break;
        case 'orders':
            loadOrderData();
            break;
        case 'sales':
            loadSalesData();
            break;
    }
}

// === 브랜드 설정 ===
function loadBrandingData() {
    const branding = dataManager.getBranding();
    
    // 로고 미리보기 업데이트
    const logoPreview = document.getElementById('logoPreview');
    if (logoPreview && branding.logoUrl) {
        logoPreview.src = branding.logoUrl;
    }
    
    // 소제목 입력 필드 업데이트
    const subtitleEdit = document.getElementById('subtitleEdit');
    if (subtitleEdit) {
        subtitleEdit.value = branding.subtitle;
    }
}

function handleLogoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const logoPreview = document.getElementById('logoPreview');
        const logoUrl = e.target.result;
        
        if (logoPreview) {
            logoPreview.src = logoUrl;
        }
        
        // 데이터 저장
        dataManager.updateBranding({ logoUrl: logoUrl });
        showToast('로고가 업데이트되었습니다.');
    };
    
    reader.readAsDataURL(file);
}

function updateSubtitle() {
    const subtitleEdit = document.getElementById('subtitleEdit');
    if (!subtitleEdit) return;
    
    const subtitle = subtitleEdit.value.trim();
    if (!subtitle) {
        showToast('소제목을 입력해주세요.');
        return;
    }
    
    dataManager.updateBranding({ subtitle: subtitle });
    showToast('소제목이 업데이트되었습니다.');
}

// === 카테고리 관리 ===
function loadCategoryData() {
    const categories = dataManager.getCategories();
    const categoryList = document.getElementById('categoryList');
    
    if (!categoryList) return;
    
    if (categories.length === 0) {
        categoryList.innerHTML = `
            <div class="empty-list">
                <h3>카테고리가 없습니다</h3>
                <p>새 카테고리를 추가해보세요.</p>
            </div>
        `;
        return;
    }
    
    categoryList.innerHTML = '';
    
    categories.forEach(category => {
        const categoryItem = document.createElement('div');
        categoryItem.className = 'category-item';
        categoryItem.innerHTML = `
            <div class="category-info">
                <h3>${category.name}</h3>
                <p>ID: ${category.id}</p>
            </div>
            <div class="category-actions">
                <button class="btn-edit" onclick="editCategory('${category.id}')">수정</button>
                <button class="btn-delete" onclick="deleteCategory('${category.id}')">삭제</button>
            </div>
        `;
        categoryList.appendChild(categoryItem);
    });
    
    // 메뉴 필터 옵션도 업데이트
    updateCategoryFilterOptions();
}

function showAddCategoryModal() {
    editingCategory = null;
    document.getElementById('categoryModalTitle').textContent = '카테고리 추가';
    document.getElementById('categoryName').value = '';
    document.getElementById('categoryId').value = '';
    openModal('categoryModal');
}

function editCategory(categoryId) {
    const categories = dataManager.getCategories();
    const category = categories.find(cat => cat.id === categoryId);
    
    if (!category) return;
    
    editingCategory = categoryId;
    document.getElementById('categoryModalTitle').textContent = '카테고리 수정';
    document.getElementById('categoryName').value = category.name;
    document.getElementById('categoryId').value = category.id;
    openModal('categoryModal');
}

function saveCategoryModal() {
    const name = document.getElementById('categoryName').value.trim();
    const id = document.getElementById('categoryId').value.trim();
    
    if (!name || !id) {
        showToast('카테고리 이름과 ID를 입력해주세요.');
        return;
    }
    
    // ID 중복 체크 (수정이 아닌 경우)
    if (!editingCategory) {
        const categories = dataManager.getCategories();
        if (categories.find(cat => cat.id === id)) {
            showToast('이미 존재하는 카테고리 ID입니다.');
            return;
        }
    }
    
    if (editingCategory) {
        // 수정
        dataManager.updateCategory(editingCategory, { name, id });
        showToast('카테고리가 수정되었습니다.');
    } else {
        // 추가
        dataManager.addCategory({ name, id });
        showToast('카테고리가 추가되었습니다.');
    }
    
    closeCategoryModal();
    loadCategoryData();
}

function deleteCategory(categoryId) {
    if (!confirm('이 카테고리와 속한 모든 메뉴를 삭제하시겠습니까?')) {
        return;
    }
    
    dataManager.deleteCategory(categoryId);
    showToast('카테고리가 삭제되었습니다.');
    loadCategoryData();
    loadMenuData(); // 메뉴 데이터도 다시 로드
}

function closeCategoryModal() {
    closeModal('categoryModal');
    editingCategory = null;
}

// === 메뉴 관리 ===
function loadMenuData() {
    const menuItems = dataManager.getMenuItems();
    const menuList = document.getElementById('menuList');
    
    if (!menuList) return;
    
    if (menuItems.length === 0) {
        menuList.innerHTML = `
            <div class="empty-list">
                <h3>메뉴가 없습니다</h3>
                <p>새 메뉴를 추가해보세요.</p>
            </div>
        `;
        return;
    }
    
    const categories = dataManager.getCategories();
    menuList.innerHTML = '';
    
    menuItems.forEach(item => {
        const category = categories.find(cat => cat.id === item.categoryId);
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item-admin';
        menuItem.innerHTML = `
            <img src="${item.imageUrl || getDefaultImage()}" alt="${item.name}" class="menu-thumbnail"
                 onerror="this.src='${getDefaultImage()}'">
            <div class="menu-details">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <p>카테고리: ${category ? category.name : '알 수 없음'}</p>
                <span class="menu-price-badge">${formatPrice(item.price)}</span>
            </div>
            <div class="menu-actions">
                <button class="btn-edit" onclick="editMenuItem('${item.id}')">수정</button>
                <button class="btn-delete" onclick="deleteMenuItem('${item.id}')">삭제</button>
            </div>
        `;
        menuList.appendChild(menuItem);
    });
}

function updateCategoryFilterOptions() {
    const categoryFilter = document.getElementById('categoryFilter');
    const menuCategory = document.getElementById('menuCategory');
    
    if (!categoryFilter && !menuCategory) return;
    
    const categories = dataManager.getCategories();
    
    // 메뉴 필터 업데이트
    if (categoryFilter) {
        const selectedValue = categoryFilter.value;
        categoryFilter.innerHTML = '<option value="">전체 카테고리</option>';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categoryFilter.appendChild(option);
        });
        categoryFilter.value = selectedValue;
    }
    
    // 메뉴 모달의 카테고리 선택 업데이트
    if (menuCategory) {
        const selectedValue = menuCategory.value;
        menuCategory.innerHTML = '';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            menuCategory.appendChild(option);
        });
        menuCategory.value = selectedValue;
    }
}

function filterMenuByCategory() {
    const categoryFilter = document.getElementById('categoryFilter');
    if (!categoryFilter) return;
    
    const selectedCategory = categoryFilter.value;
    const menuItems = selectedCategory ? 
        dataManager.getMenuItems(selectedCategory) : 
        dataManager.getMenuItems();
    
    const categories = dataManager.getCategories();
    const menuList = document.getElementById('menuList');
    
    if (menuItems.length === 0) {
        menuList.innerHTML = `
            <div class="empty-list">
                <h3>메뉴가 없습니다</h3>
                <p>이 카테고리에는 메뉴가 없습니다.</p>
            </div>
        `;
        return;
    }
    
    menuList.innerHTML = '';
    
    menuItems.forEach(item => {
        const category = categories.find(cat => cat.id === item.categoryId);
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item-admin';
        menuItem.innerHTML = `
            <img src="${item.imageUrl || getDefaultImage()}" alt="${item.name}" class="menu-thumbnail"
                 onerror="this.src='${getDefaultImage()}'">
            <div class="menu-details">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <p>카테고리: ${category ? category.name : '알 수 없음'}</p>
                <span class="menu-price-badge">${formatPrice(item.price)}</span>
            </div>
            <div class="menu-actions">
                <button class="btn-edit" onclick="editMenuItem('${item.id}')">수정</button>
                <button class="btn-delete" onclick="deleteMenuItem('${item.id}')">삭제</button>
            </div>
        `;
        menuList.appendChild(menuItem);
    });
}

function showAddMenuModal() {
    editingMenuItem = null;
    document.getElementById('menuModalTitle').textContent = '메뉴 추가';
    document.getElementById('menuName').value = '';
    document.getElementById('menuDescription').value = '';
    document.getElementById('menuPrice').value = '';
    document.getElementById('menuImagePreview').style.display = 'none';
    updateCategoryFilterOptions();
    openModal('menuModal');
}

function editMenuItem(itemId) {
    const menuItems = dataManager.getMenuItems();
    const item = menuItems.find(menu => menu.id === itemId);
    
    if (!item) return;
    
    editingMenuItem = itemId;
    document.getElementById('menuModalTitle').textContent = '메뉴 수정';
    document.getElementById('menuName').value = item.name;
    document.getElementById('menuDescription').value = item.description;
    document.getElementById('menuPrice').value = item.price;
    document.getElementById('menuCategory').value = item.categoryId;
    
    const imagePreview = document.getElementById('menuImagePreview');
    if (item.imageUrl) {
        imagePreview.src = item.imageUrl;
        imagePreview.style.display = 'block';
    } else {
        imagePreview.style.display = 'none';
    }
    
    updateCategoryFilterOptions();
    openModal('menuModal');
}

function handleMenuImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const imagePreview = document.getElementById('menuImagePreview');
        imagePreview.src = e.target.result;
        imagePreview.style.display = 'block';
    };
    
    reader.readAsDataURL(file);
}

function saveMenuModal() {
    const name = document.getElementById('menuName').value.trim();
    const description = document.getElementById('menuDescription').value.trim();
    const price = document.getElementById('menuPrice').value.trim();
    const categoryId = document.getElementById('menuCategory').value;
    const imagePreview = document.getElementById('menuImagePreview');
    
    if (!name || !description || !price || !categoryId) {
        showToast('모든 필드를 입력해주세요.');
        return;
    }
    
    if (isNaN(price) || parseInt(price) <= 0) {
        showToast('올바른 가격을 입력해주세요.');
        return;
    }
    
    const menuData = {
        name: name,
        description: description,
        price: parseInt(price),
        categoryId: categoryId,
        imageUrl: imagePreview.style.display === 'block' ? imagePreview.src : ''
    };
    
    if (editingMenuItem) {
        // 수정
        dataManager.updateMenuItem(editingMenuItem, menuData);
        showToast('메뉴가 수정되었습니다.');
    } else {
        // 추가
        dataManager.addMenuItem(menuData);
        showToast('메뉴가 추가되었습니다.');
    }
    
    closeMenuModal();
    loadMenuData();
}

function deleteMenuItem(itemId) {
    if (!confirm('이 메뉴를 삭제하시겠습니까?')) {
        return;
    }
    
    dataManager.deleteMenuItem(itemId);
    showToast('메뉴가 삭제되었습니다.');
    loadMenuData();
}

function closeMenuModal() {
    closeModal('menuModal');
    editingMenuItem = null;
}

function getDefaultImage() {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjZGVlMmU2Ii8+PHRleHQgeD0iNDAiIHk9IjQ1IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IiM2Yzc1N2QiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk1lbnU8L3RleHQ+PC9zdmc+';
}

// === 주문 내역 관리 ===
function loadOrderData() {
    const orders = dataManager.getOrders();
    const ordersList = document.getElementById('ordersList');
    
    if (!ordersList) return;
    
    if (orders.length === 0) {
        ordersList.innerHTML = `
            <div class="empty-list">
                <h3>주문 내역이 없습니다</h3>
                <p>아직 접수된 주문이 없습니다.</p>
            </div>
        `;
        return;
    }
    
    ordersList.innerHTML = '';
    
    orders.forEach(order => {
        const orderItem = document.createElement('div');
        const orderCompleted = completedOrders[order.id] || false;
        orderItem.className = `order-item-admin ${orderCompleted ? 'completed' : ''}`;
        
        const itemsList = order.items.map(item => {
            const tempText = item.temperature ? `(${item.temperature.toUpperCase()})` : '';
            return `${item.name} ${tempText} × ${item.quantity} (${formatPrice(item.total)})`;
        }).join('<br>');
        
        const isCompleted = completedOrders[order.id] || false;
        const statusClass = isCompleted ? 'completed' : 'pending';
        const statusText = isCompleted ? '완료' : '대기중';
        
        orderItem.innerHTML = `
            <div class="order-header">
                <span class="order-id">주문 #${order.id.slice(-6)}</span>
                <span class="order-status ${statusClass}">${statusText}</span>
                <span class="order-time">${formatDate(order.timestamp)}</span>
            </div>
            <div class="order-details">
                <p>${itemsList}</p>
            </div>
            <div class="order-footer">
                <div class="order-total-admin">
                    총 ${formatPrice(order.totalAmount)}
                </div>
                <div class="order-actions">
                    <button class="btn-complete ${isCompleted ? 'completed' : ''}" 
                            onclick="toggleOrderComplete('${order.id}')"
                            ${isCompleted ? 'disabled' : ''}>
                        ${isCompleted ? '완료됨' : '완료'}
                    </button>
                    <button class="btn-delete-order" onclick="deleteOrder('${order.id}')">
                        삭제
                    </button>
                </div>
            </div>
        `;
        
        ordersList.appendChild(orderItem);
    });
}

// === 주문 완료 토글 ===
function toggleOrderComplete(orderId) {
    const isCompleted = completedOrders[orderId] || false;
    
    if (!isCompleted) {
        completedOrders[orderId] = true;
        
        // localStorage에 저장
        localStorage.setItem('completedOrders', JSON.stringify(completedOrders));
        
        // UI 업데이트
        loadOrderData();
        
        // 매출 데이터도 업데이트 (현재 매출 탭이 활성화되어 있다면)
        if (currentTab === 'sales') {
            loadSalesData();
        }
        
        showToast('주문이 완료로 표시되었습니다.');
    }
}

// === 주문 삭제 ===
function deleteOrder(orderId) {
    if (!confirm('이 주문을 삭제하시겠습니까?')) {
        return;
    }
    
    // 주문 삭제
    dataManager.deleteOrder(orderId);
    
    // 완료된 주문 목록에서도 제거
    if (completedOrders[orderId]) {
        delete completedOrders[orderId];
        localStorage.setItem('completedOrders', JSON.stringify(completedOrders));
    }
    
    // UI 업데이트
    loadOrderData();
    
    // 매출 데이터도 업데이트 (현재 매출 탭이 활성화되어 있다면)
    if (currentTab === 'sales') {
        loadSalesData();
    }
    
    showToast('주문이 삭제되었습니다.');
}

// === 매출 관리 ===
function loadSalesData() {
    updateSalesStats();
    showSalesFilter('daily');
}

function updateSalesStats() {
    const orders = dataManager.getOrders();
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const thisMonth = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0');
    
    let todaySales = 0;
    let monthSales = 0;
    let totalSales = 0;
    let totalOrders = orders.length;
    
    orders.forEach(order => {
        const orderDate = new Date(order.timestamp);
        const orderDateStr = orderDate.toISOString().split('T')[0];
        const orderMonth = orderDate.getFullYear() + '-' + String(orderDate.getMonth() + 1).padStart(2, '0');
        
        totalSales += order.totalAmount;
        
        if (orderDateStr === todayStr) {
            todaySales += order.totalAmount;
        }
        
        if (orderMonth === thisMonth) {
            monthSales += order.totalAmount;
        }
    });
    
    // 통계 업데이트
    document.getElementById('todaySales').textContent = formatPrice(todaySales);
    document.getElementById('monthSales').textContent = formatPrice(monthSales);
    document.getElementById('totalSales').textContent = formatPrice(totalSales);
    document.getElementById('totalOrders').textContent = totalOrders.toLocaleString() + '건';
}

function showSalesFilter(filterType) {
    // 필터 버튼 활성화 상태 업데이트
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeButton = document.querySelector(`[onclick="showSalesFilter('${filterType}')"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
    
    // 콘텐츠 표시/숨기기
    const salesContents = document.querySelectorAll('.sales-content');
    salesContents.forEach(content => {
        content.classList.remove('active');
    });
    
    const activeContent = document.getElementById(filterType + 'Sales');
    if (activeContent) {
        activeContent.classList.add('active');
    }
    
    // 데이터 로드
    switch (filterType) {
        case 'daily':
            loadDailySales();
            break;
        case 'monthly':
            loadMonthlySales();
            break;
        case 'menu':
            loadMenuSales();
            break;
    }
}

function loadDailySales() {
    const orders = dataManager.getOrders();
    const dailySales = {};
    
    orders.forEach(order => {
        const orderDate = new Date(order.timestamp);
        const dateStr = orderDate.toISOString().split('T')[0];
        
        if (!dailySales[dateStr]) {
            dailySales[dateStr] = {
                date: dateStr,
                amount: 0,
                count: 0
            };
        }
        
        dailySales[dateStr].amount += order.totalAmount;
        dailySales[dateStr].count += 1;
    });
    
    // 날짜별로 정렬 (최신순)
    const sortedDates = Object.keys(dailySales).sort((a, b) => new Date(b) - new Date(a));
    
    const dailySalesList = document.getElementById('dailySalesList');
    if (!dailySalesList) return;
    
    if (sortedDates.length === 0) {
        dailySalesList.innerHTML = `
            <div class="empty-list">
                <h3>매출 데이터가 없습니다</h3>
                <p>아직 주문이 없습니다.</p>
            </div>
        `;
        return;
    }
    
    dailySalesList.innerHTML = '';
    
    sortedDates.forEach(dateStr => {
        const data = dailySales[dateStr];
        const salesItem = document.createElement('div');
        salesItem.className = 'sales-item';
        
        const date = new Date(dateStr);
        const formattedDate = date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'short'
        });
        
        const isToday = dateStr === new Date().toISOString().split('T')[0];
        if (isToday) {
            salesItem.style.backgroundColor = '#e8f5e8';
            salesItem.style.borderColor = '#c3e6cb';
        }
        
        salesItem.innerHTML = `
            <div class="sales-item-info">
                <div class="sales-item-date">${formattedDate}${isToday ? ' (오늘)' : ''}</div>
                <div class="sales-item-details">주문 ${data.count}건 • 평균 ${formatPrice(Math.round(data.amount / data.count))}</div>
            </div>
            <div class="sales-item-amount">${formatPrice(data.amount)}</div>
        `;
        
        dailySalesList.appendChild(salesItem);
    });
}

function loadMonthlySales() {
    const orders = dataManager.getOrders();
    const monthlySales = {};
    
    orders.forEach(order => {
        const orderDate = new Date(order.timestamp);
        const monthKey = orderDate.getFullYear() + '-' + String(orderDate.getMonth() + 1).padStart(2, '0');
        
        if (!monthlySales[monthKey]) {
            monthlySales[monthKey] = {
                month: monthKey,
                amount: 0,
                count: 0
            };
        }
        
        monthlySales[monthKey].amount += order.totalAmount;
        monthlySales[monthKey].count += 1;
    });
    
    // 월별로 정렬 (최신순)
    const sortedMonths = Object.keys(monthlySales).sort((a, b) => new Date(b) - new Date(a));
    
    const monthlySalesList = document.getElementById('monthlySalesList');
    if (!monthlySalesList) return;
    
    if (sortedMonths.length === 0) {
        monthlySalesList.innerHTML = `
            <div class="empty-list">
                <h3>매출 데이터가 없습니다</h3>
                <p>아직 주문이 없습니다.</p>
            </div>
        `;
        return;
    }
    
    monthlySalesList.innerHTML = '';
    
    sortedMonths.forEach(monthKey => {
        const data = monthlySales[monthKey];
        const salesItem = document.createElement('div');
        salesItem.className = 'sales-item';
        
        const [year, month] = monthKey.split('-');
        const formattedMonth = new Date(year, month - 1).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long'
        });
        
        const today = new Date();
        const thisMonth = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0');
        const isThisMonth = monthKey === thisMonth;
        
        if (isThisMonth) {
            salesItem.style.backgroundColor = '#e8f5e8';
            salesItem.style.borderColor = '#c3e6cb';
        }
        
        salesItem.innerHTML = `
            <div class="sales-item-info">
                <div class="sales-item-date">${formattedMonth}${isThisMonth ? ' (이번 달)' : ''}</div>
                <div class="sales-item-details">주문 ${data.count}건 • 평균 ${formatPrice(Math.round(data.amount / data.count))}</div>
            </div>
            <div class="sales-item-amount">${formatPrice(data.amount)}</div>
        `;
        
        monthlySalesList.appendChild(salesItem);
    });
}

function loadMenuSales() {
    const orders = dataManager.getOrders();
    const menuSales = {};
    const allMenuItems = dataManager.getMenuItems();
    
    // 메뉴별 판매량 계산
    orders.forEach(order => {
        order.items.forEach(item => {
            if (!menuSales[item.id]) {
                menuSales[item.id] = {
                    id: item.id,
                    name: item.name,
                    quantity: 0,
                    amount: 0
                };
            }
            
            menuSales[item.id].quantity += item.quantity;
            menuSales[item.id].amount += item.total;
        });
    });
    
    // 판매량 순으로 정렬
    const sortedItems = Object.values(menuSales).sort((a, b) => b.quantity - a.quantity);
    
    const menuSalesList = document.getElementById('menuSalesList');
    if (!menuSalesList) return;
    
    if (sortedItems.length === 0) {
        menuSalesList.innerHTML = `
            <div class="empty-list">
                <h3>판매 데이터가 없습니다</h3>
                <p>아직 판매된 메뉴가 없습니다.</p>
            </div>
        `;
        return;
    }
    
    menuSalesList.innerHTML = '';
    
    sortedItems.forEach((item, index) => {
        const menuItem = allMenuItems.find(menu => menu.id === item.id);
        const category = menuItem ? dataManager.getCategories().find(cat => cat.id === menuItem.categoryId) : null;
        
        const salesItem = document.createElement('div');
        salesItem.className = 'menu-sales-item';
        
        // 1위부터 3위까지 하이라이트
        if (index === 0) {
            salesItem.style.backgroundColor = '#fff3cd';
            salesItem.style.borderColor = '#f0ad4e';
        } else if (index === 1) {
            salesItem.style.backgroundColor = '#f8f9fa';
            salesItem.style.borderColor = '#dee2e6';
        } else if (index === 2) {
            salesItem.style.backgroundColor = '#f1f8ff';
            salesItem.style.borderColor = '#b8daff';
        }
        
        const rank = index + 1;
        const rankText = rank <= 3 ? `🏆 ${rank}위` : `${rank}위`;
        
        salesItem.innerHTML = `
            <div class="menu-sales-info">
                <h4>${rankText} ${item.name}</h4>
                <p>카테고리: ${category ? category.name : '알 수 없음'}</p>
            </div>
            <div class="menu-sales-quantity">${item.quantity}잔</div>
            <div class="menu-sales-amount">${formatPrice(item.amount)}</div>
        `;
        
        menuSalesList.appendChild(salesItem);
    });
}

// === 유틸리티 함수 ===
function showToast(message, duration = 3000) {
    // 기존 토스트 제거
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // 토스트 생성
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    // 스타일 적용
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #333;
        color: white;
        padding: 12px 20px;
        border-radius: 4px;
        z-index: 1000;
        font-size: 14px;
        max-width: 300px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    // 자동 제거
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }
    }, duration);
}

function openCustomerSite() {
    window.open('index.html', '_blank');
}

function logout() {
    if (confirm('관리자 페이지에서 로그아웃하시겠습니까?')) {
        window.location.href = 'index.html';
    }
}

// === 이벤트 리스너 설정 ===
function setupEventListeners() {
    // 숫자만 입력 허용 (가격 필드)
    const priceInput = document.getElementById('menuPrice');
    if (priceInput) {
        priceInput.addEventListener('input', function(event) {
            event.target.value = event.target.value.replace(/[^0-9]/g, '');
        });
    }
    
    // 카테고리 ID 필드는 영문/숫자/하이픈만 허용
    const categoryIdInput = document.getElementById('categoryId');
    if (categoryIdInput) {
        categoryIdInput.addEventListener('input', function(event) {
            event.target.value = event.target.value.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase();
        });
    }
} 