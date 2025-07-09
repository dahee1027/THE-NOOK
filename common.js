// === THE NOOK 공통 기능 ===

// === 데이터 관리 ===
class DataManager {
    constructor() {
        this.initializeData();
    }

    // 초기 데이터 설정
    initializeData() {
        // 기본 데이터가 없으면 생성
        if (!localStorage.getItem('nookData')) {
            const defaultData = {
                branding: {
                    logoUrl: '',
                    subtitle: 'coffee and craft'
                },
                categories: [
                    {
                        id: 'espresso',
                        name: '에스프레소'
                    },
                    {
                        id: 'beverages',
                        name: '음료'
                    },
                    {
                        id: 'tea',
                        name: '차'
                    },
                    {
                        id: 'dessert',
                        name: '디저트'
                    }
                ],
                menuItems: [
                    {
                        id: 'americano',
                        categoryId: 'espresso',
                        name: '아메리카노',
                        description: '진하게 추출한 에스프레소에 물을 더한 커피',
                        price: 4000,
                        imageUrl: ''
                    },
                    {
                        id: 'latte',
                        categoryId: 'espresso',
                        name: '카페라떼',
                        description: '부드러운 우유거품과 에스프레소의 조화',
                        price: 4500,
                        imageUrl: ''
                    },
                    {
                        id: 'iced-americano',
                        categoryId: 'beverages',
                        name: '아이스 아메리카노',
                        description: '시원한 얼음과 함께하는 아메리카노',
                        price: 4000,
                        imageUrl: ''
                    },
                    {
                        id: 'green-tea',
                        categoryId: 'tea',
                        name: '녹차',
                        description: '신선하고 깔끔한 맛의 녹차',
                        price: 3500,
                        imageUrl: ''
                    },
                    {
                        id: 'croissant',
                        categoryId: 'dessert',
                        name: '크루아상',
                        description: '바삭하고 고소한 프랑스식 크루아상',
                        price: 3000,
                        imageUrl: ''
                    }
                ],
                orders: []
            };
            this.saveData(defaultData);
        }
    }

    // 데이터 전체 로드
    loadData() {
        const data = localStorage.getItem('nookData');
        return data ? JSON.parse(data) : null;
    }

    // 데이터 전체 저장
    saveData(data) {
        localStorage.setItem('nookData', JSON.stringify(data));
    }

    // 브랜딩 정보 로드
    getBranding() {
        const data = this.loadData();
        return data.branding;
    }

    // 브랜딩 정보 저장
    updateBranding(branding) {
        const data = this.loadData();
        data.branding = { ...data.branding, ...branding };
        this.saveData(data);
    }

    // 카테고리 목록 로드
    getCategories() {
        const data = this.loadData();
        return data.categories;
    }

    // 카테고리 추가
    addCategory(category) {
        const data = this.loadData();
        const newCategory = {
            id: category.id || this.generateId(),
            name: category.name
        };
        data.categories.push(newCategory);
        this.saveData(data);
        return newCategory;
    }

    // 카테고리 수정
    updateCategory(categoryId, updates) {
        const data = this.loadData();
        const categoryIndex = data.categories.findIndex(cat => cat.id === categoryId);
        if (categoryIndex !== -1) {
            data.categories[categoryIndex] = { ...data.categories[categoryIndex], ...updates };
            this.saveData(data);
            return data.categories[categoryIndex];
        }
        return null;
    }

    // 카테고리 삭제
    deleteCategory(categoryId) {
        const data = this.loadData();
        // 카테고리에 속한 메뉴도 함께 삭제
        data.menuItems = data.menuItems.filter(item => item.categoryId !== categoryId);
        data.categories = data.categories.filter(cat => cat.id !== categoryId);
        this.saveData(data);
    }

    // 메뉴 아이템 로드 (카테고리별 필터링 가능)
    getMenuItems(categoryId = null) {
        const data = this.loadData();
        if (categoryId) {
            return data.menuItems.filter(item => item.categoryId === categoryId);
        }
        return data.menuItems;
    }

    // 메뉴 아이템 추가
    addMenuItem(menuItem) {
        const data = this.loadData();
        const newItem = {
            id: menuItem.id || this.generateId(),
            categoryId: menuItem.categoryId,
            name: menuItem.name,
            description: menuItem.description,
            price: parseInt(menuItem.price),
            imageUrl: menuItem.imageUrl || ''
        };
        data.menuItems.push(newItem);
        this.saveData(data);
        return newItem;
    }

    // 메뉴 아이템 수정
    updateMenuItem(itemId, updates) {
        const data = this.loadData();
        const itemIndex = data.menuItems.findIndex(item => item.id === itemId);
        if (itemIndex !== -1) {
            data.menuItems[itemIndex] = { ...data.menuItems[itemIndex], ...updates };
            if (updates.price) {
                data.menuItems[itemIndex].price = parseInt(updates.price);
            }
            this.saveData(data);
            return data.menuItems[itemIndex];
        }
        return null;
    }

    // 메뉴 아이템 삭제
    deleteMenuItem(itemId) {
        const data = this.loadData();
        data.menuItems = data.menuItems.filter(item => item.id !== itemId);
        this.saveData(data);
    }

    // 주문 추가
    addOrder(order) {
        const data = this.loadData();
        const newOrder = {
            id: this.generateId(),
            items: order.items,
            totalAmount: order.totalAmount,
            timestamp: new Date().toISOString(),
            status: 'new'
        };
        data.orders.unshift(newOrder); // 최신 주문이 맨 앞에
        this.saveData(data);
        return newOrder;
    }

    // 주문 내역 로드
    getOrders() {
        const data = this.loadData();
        return data.orders;
    }

    // 주문 삭제
    deleteOrder(orderId) {
        const data = this.loadData();
        data.orders = data.orders.filter(order => order.id !== orderId);
        this.saveData(data);
    }

    // ID 생성기
    generateId() {
        return 'id_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    }
}

// === 유틸리티 함수 ===

// 가격 포맷팅
function formatPrice(price) {
    return '₩' + price.toLocaleString();
}

// 날짜 포맷팅
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// 토스트 메시지 표시
function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    if (toast && toastMessage) {
        toastMessage.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, duration);
    }
}

// 이미지 파일을 Base64로 변환
function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// 이미지 압축 (선택사항)
function compressImage(file, maxWidth = 800, quality = 0.8) {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
            // 비율 유지하며 크기 조정
            const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
            canvas.width = img.width * ratio;
            canvas.height = img.height * ratio;
            
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            canvas.toBlob(resolve, 'image/jpeg', quality);
        };
        
        img.src = URL.createObjectURL(file);
    });
}

// === 모달 관리 ===

// 모달 열기
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

// 모달 닫기
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// 모달 외부 클릭시 닫기
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
        document.body.style.overflow = '';
    }
});

// ESC 키로 모달 닫기
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (modal.style.display === 'block') {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    }
});

// === 전역 데이터 매니저 인스턴스 ===
const dataManager = new DataManager();

// === 초기화 ===
document.addEventListener('DOMContentLoaded', function() {
    console.log('THE NOOK 시스템이 초기화되었습니다.');
}); 