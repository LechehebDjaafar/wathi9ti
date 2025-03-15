// انتظر حتى يتم تحميل المستند بالكامل
document.addEventListener('DOMContentLoaded', function() {
    // الحصول على عناصر التبويب
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // إضافة مستمع حدث لكل زر تبويب
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // إزالة الفئة النشطة من جميع الأزرار
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // إضافة الفئة النشطة للزر الذي تم النقر عليه
            this.classList.add('active');
            
            // إخفاء جميع محتويات التبويب
            tabContents.forEach(content => content.classList.remove('active'));
            
            // إظهار المحتوى المرتبط بالزر الذي تم النقر عليه
            const targetId = this.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });
    
    // الحصول على جميع أزرار التحميل
    const downloadButtons = document.querySelectorAll('.download-btn');
    const downloadNotification = document.getElementById('download-notification');
    
    // إضافة مستمع حدث لكل زر تحميل
    downloadButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // إظهار إشعار التحميل
            downloadNotification.style.display = 'block';
            
            // إخفاء الإشعار بعد 3 ثوانٍ
            setTimeout(function() {
                // إضافة فئة التلاشي
                downloadNotification.style.animation = 'slideOut 0.5s ease-out forwards';
                
                // إعادة تعيين الإشعار بعد انتهاء التلاشي
                setTimeout(function() {
                    downloadNotification.style.display = 'none';
                    downloadNotification.style.animation = '';
                }, 500);
            }, 3000);
        });
    });
    
    // وظيفة البحث
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-btn');
    const formCards = document.querySelectorAll('.form-card');
    
    // البحث عند النقر على زر البحث
    searchButton.addEventListener('click', performSearch);
    
    // البحث عند الضغط على Enter في حقل البحث
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // تنفيذ البحث
    function performSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        
        if (searchTerm === '') {
            // إظهار جميع البطاقات إذا كان حقل البحث فارغًا
            formCards.forEach(card => {
                card.style.display = 'block';
            });
            return;
        }
        
        // البحث في كل بطاقة
        formCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.display = 'block';
                
                // تحويل التبويب إلى التبويب الذي يحتوي على البطاقة المطابقة
                const tabContent = card.closest('.tab-content');
                if (!tabContent.classList.contains('active')) {
                    const tabId = tabContent.id;
                    const tabButton = document.querySelector(`[data-target="${tabId}"]`);
                    tabButton.click();
                }
                
                // تمييز النص المطابق (اختياري)
                highlightText(card, searchTerm);
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    // تمييز النص المطابق (وظيفة إضافية)
    function highlightText(card, searchTerm) {
        const title = card.querySelector('h3');
        const description = card.querySelector('p');
        
        // استعادة النص الأصلي أولاً (إذا كان قد تم تمييزه مسبقًا)
        title.innerHTML = title.textContent;
        description.innerHTML = description.textContent;
        
        // تمييز النص المطابق
        if (title.textContent.toLowerCase().includes(searchTerm)) {
            title.innerHTML = title.textContent.replace(
                new RegExp(searchTerm, 'gi'),
                match => `<span style="background-color: #fef08a;">${match}</span>`
            );
        }
        
        if (description.textContent.toLowerCase().includes(searchTerm)) {
            description.innerHTML = description.textContent.replace(
                new RegExp(searchTerm, 'gi'),
                match => `<span style="background-color: #fef08a;">${match}</span>`
            );
        }
    }
    
    // إعادة تعيين البحث عند مسح حقل البحث
    searchInput.addEventListener('input', function() {
        if (this.value.trim() === '') {
            formCards.forEach(card => {
                card.style.display = 'block';
                
                // إزالة التمييز
                const title = card.querySelector('h3');
                const description = card.querySelector('p');
                title.innerHTML = title.textContent;
                description.innerHTML = description.textContent;
            });
        }
    });
    
    // التنقل اللاسلكي (للنسخة المحمولة)
    const menuItems = document.querySelectorAll('nav ul li a');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            menuItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // إضافة التحقق من اتصال الإنترنت
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    function updateOnlineStatus(event) {
        const status = navigator.onLine ? 'online' : 'offline';
        if (status === 'offline') {
            const offlineNotification = document.createElement('div');
            offlineNotification.className = 'success-notification';
            offlineNotification.style.display = 'block';
            offlineNotification.style.backgroundColor = '#ef4444';
            
            offlineNotification.innerHTML = `
                <div class="notification-content">
                    <i class="fas fa-wifi"></i>
                    <p>أنت غير متصل بالإنترنت. بعض الوظائف قد لا تعمل بشكل صحيح.</p>
                </div>
            `;
            
            document.body.appendChild(offlineNotification);
            
            setTimeout(() => {
                offlineNotification.style.animation = 'slideOut 0.5s ease-out forwards';
                setTimeout(() => {
                    document.body.removeChild(offlineNotification);
                }, 500);
            }, 5000);
        }
    }
    
    // تحسين تجربة المستخدم باستخدام تأثيرات التمرير
    const scrollElements = document.querySelectorAll('.form-card, .instruction-card');
    
    // دالة للتحقق من وجود العنصر في مجال الرؤية
    const elementInView = (el) => {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0
        );
    };
    
    // تطبيق فئة التلاشي عند التمرير
    const displayScrollElement = (element) => {
        element.classList.add('scrolled');
    };
    
    // دالة لفحص جميع العناصر
    const checkScrollElements = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el)) {
                displayScrollElement(el);
            }
        });
    };
    
    // إضافة فئة CSS إلى كل العناصر
    scrollElements.forEach((el) => {
        el.classList.add('fade-in');
        el.style.opacity = "0";
        el.style.transition = "opacity 0.5s ease-in-out";
    });
    
    // دالة للتحكم في تردد حدث التمرير
    const throttle = (fn, delay) => {
        let last = 0;
        return function() {
            const now = new Date().getTime();
            if (now - last < delay) return;
            last = now;
            fn();
        };
    };
    
    // مستمع لحدث التمرير مع التحكم بالتردد
    window.addEventListener('scroll', throttle(() => {
        scrollElements.forEach((el) => {
            if (elementInView(el)) {
                el.style.opacity = "1";
            }
        });
    }, 250));
    
    // تشغيل الفحص الأولي بعد تحميل الصفحة
    window.addEventListener('load', checkScrollElements);
});