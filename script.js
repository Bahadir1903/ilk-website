// --- FIREBASE KÜTÜPHANELERİ (CDN) ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// --- SENİN FIREBASE AYARLARIN ---
  const firebaseConfig = {
    apiKey: "AIzaSyCPmPnN6B8GDb4MlvjdvzkosjF7QEkgQug",
    authDomain: "mebarstudyo.firebaseapp.com",
    projectId: "mebarstudyo",
    storageBucket: "mebarstudyo.firebasestorage.app",
    messagingSenderId: "64137578522",
    appId: "1:64137578522:web:2196fa44befbf1e74069a3",
    measurementId: "G-29BJC17H6L"
  };

// Firebase'i Başlat
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// GLOBAL FONKSİYONLAR (HTML'den erişilebilsin diye window'a atıyoruz)
window.systemLogin = null; 
window.userLogout = null;

document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // 1. GİRİŞ SİSTEMİ (FIREBASE AUTH)
    // ==========================================
    const loginFormArea = document.getElementById('login-form-area');
    const dashboardArea = document.getElementById('dashboard-area');
    const statusText = document.getElementById('status-text');
    const led = document.getElementById('status-led');
    const welcomeTitle = document.getElementById('welcome-title');

    // -- OTURUM DURUMUNU DİNLE (Sayfa yenilenince hatırlar) --
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // Kullanıcı Zaten Giriş Yapmışsa
            showDashboard(user.email);
        } else {
            // Çıkış Yapılmışsa
            showLogin();
        }
    });

    // -- GİRİŞ FONKSİYONU --
    window.systemLogin = async function() {
        const emailEl = document.getElementById('login-user'); // Buraya E-Mail girilmeli
        const passEl = document.getElementById('login-pass');

        if (!emailEl || !passEl) return;

        const email = emailEl.value.trim();
        const pass = passEl.value;

        // Misafir Girişi (Firebase'e sormadan lokal geçer)
        if (email.toLowerCase() === "misafir") {
            showDashboard("Misafir");
            return;
        }

        // Admin Girişi (Firebase Kontrolü)
        try {
            statusText.innerText = "KONTROL EDİLİYOR...";
            led.className = "led-yellow"; // Sarı ışık
            
            const userCredential = await signInWithEmailAndPassword(auth, email, pass);
            // Başarılı olursa onAuthStateChanged tetiklenir ve dashboard açılır.
            
        } catch (error) {
            console.error("Giriş Hatası:", error.code, error.message);
            alert("❌ GİRİŞ BAŞARISIZ!\nFirebase Hatası: " + error.code);
            led.className = "led-red";
            statusText.innerText = "HATA";
        }
    };

    // -- ÇIKIŞ FONKSİYONU --
    window.userLogout = async function() {
        try {
            await signOut(auth);
            location.reload(); // Sayfayı yenile
        } catch (error) {
            console.error("Çıkış hatası", error);
        }
    };

    // -- ARAYÜZ DEĞİŞTİRİCİLER --
    function showDashboard(username) {
        if(loginFormArea) loginFormArea.style.display = 'none';
        if(dashboardArea) dashboardArea.classList.remove('hidden');
        
        if(led) led.className = "led-green";
        if(statusText) {
            statusText.innerText = "ONLINE";
            statusText.style.color = "#00ff00";
        }
        
        // Kullanıcı adını göster (E-mail'in @ işaretinden öncesini al)
        const displayName = username.includes('@') ? username.split('@')[0].toUpperCase() : username.toUpperCase();
        if(welcomeTitle) welcomeTitle.innerHTML = `Hoş Geldin, <span style='color:#00ff00'>${displayName}</span>`;
        
        // Eğer giriş yapan Admin ise logout butonu ekleyelim (Opsiyonel)
        // Burada dashboard içine bir çıkış butonu ekleyebilirsin
    }

    function showLogin() {
        if(loginFormArea) loginFormArea.style.display = 'block';
        if(dashboardArea) dashboardArea.classList.add('hidden');
        if(led) led.className = "led-red";
        if(statusText) {
            statusText.innerText = "OFFLINE";
            statusText.style.color = "red";
        }
    }

    // ==========================================
    // 2. YILDIZ EFEKTLERİ
    // ==========================================
    const starContainer = document.getElementById("star-container");
    if (starContainer) {
        for (let i = 0; i < 50; i++) {
            const star = document.createElement("div");
            star.classList.add("star");
            star.style.left = Math.random() * 100 + "%";
            star.style.top = Math.random() * 100 + "%";
            const size = Math.random() * 2 + 1;
            star.style.width = size + "px";
            star.style.height = size + "px";
            star.style.animationDelay = Math.random() * 5 + "s";
            starContainer.appendChild(star);
        }
        setInterval(() => {
            const s = document.createElement("div");
            s.className = "shooting-star";
            s.style.top = Math.random() * (window.innerHeight/2) + "px";
            s.style.left = window.innerWidth + "px";
            starContainer.appendChild(s);
            setTimeout(() => s.remove(), 2000);
        }, 3000);
    }

    // ==========================================
    // 3. HESAPLAMA MODÜLÜ YÖNETİMİ
    // ==========================================
    window.switchModule = function(modulName) {
        document.querySelectorAll('.panel').forEach(p => {
            p.classList.remove('active-panel');
            p.style.display = 'none';
        });
        const targetPanel = document.getElementById('panel-' + modulName);
        if (targetPanel) {
            targetPanel.classList.add('active-panel');
            targetPanel.style.display = 'flex';
        }
        if (event) {
            document.querySelectorAll('.module-item').forEach(item => item.classList.remove('active-item'));
            let clickedItem = event.target.closest('li');
            if (clickedItem) clickedItem.classList.add('active-item');
        }
    };

    // --- OHM HESAPLAMA ---
    window.calculateOhm = function() {
        const vInput = document.getElementById('inp-voltage');
        const rInput = document.getElementById('inp-resistance');
        if (!vInput || !rInput) return;
        const V = parseFloat(vInput.value);
        const R = parseFloat(rInput.value);
        const resBox = document.getElementById('ohm-result');
        const beam = document.getElementById('electron-path');
        if (V && R) {
            const I = (V / R).toFixed(2);
            resBox.innerText = I;
            if (beam) {
                beam.classList.add('energy-active');
                let speed = 1 / (I * 0.5);
                if (speed > 2) speed = 2; if (speed < 0.2) speed = 0.2;
                beam.style.animationDuration = speed + "s";
            }
        } else {
            alert("Lütfen değerleri girin!");
            if (beam) beam.classList.remove('energy-active');
        }
    };

    // --- MUKAVEMET HESAPLAMA ---
    window.calcMuk = function(type) {
        let res = 0; let text = "";
        const getVal = (id) => { const el = document.getElementById(id); return el ? parseFloat(el.value) : NaN; };
        switch (type) {
            case 1: 
                const F1 = getVal('muk-1-f'); const A1 = getVal('muk-1-a');
                if (F1 && A1) { res = F1 / A1; text = "σ = " + res.toFixed(2) + " MPa"; }
                break;
            case 2:
                const L = getVal('muk-2-l'); const eps = getVal('muk-2-eps');
                if (L && eps) { res = L * eps; text = "ΔL = " + res.toFixed(4) + " mm"; }
                break;
            case 3:
                const V = getVal('muk-3-v'); const A3 = getVal('muk-3-a');
                if (V && A3) { res = V / A3; text = "τ = " + res.toFixed(2) + " MPa"; }
                break;
            case 4:
                const sig = getVal('muk-4-sig'); const ep4 = getVal('muk-4-eps');
                if (sig && ep4) { res = sig / ep4; text = "E = " + res.toFixed(2) + " MPa"; }
                break;
            case 5:
                const akma = getVal('muk-5-akma'); const emn = getVal('muk-5-emniyet');
                if (akma && emn) {
                    res = akma / emn; text = "n = " + res.toFixed(2);
                    const box = document.getElementById('res-muk-5');
                    if (box) { box.style.color = res < 1 ? "red" : "#0f0"; }
                }
                break;
        }
        if (text !== "") { const resDiv = document.getElementById('res-muk-' + type); if (resDiv) resDiv.innerText = text; }
        else { if (!isNaN(type)) alert("Lütfen geçerli sayılar girin!"); }
    };

    // ==========================================
    // 4. MÜHENDİSLİK MODÜLÜ v3.0 (VERİTABANI)
    // ==========================================
    const materialDB = [
        { cat: "ÇELİKLER", items: [
            { name: "Yapı Çeliği (S235)", yield: 235, E: 210, color: "#555" },
            { name: "Yapı Çeliği (S275)", yield: 275, E: 210, color: "#666" },
            { name: "Yapı Çeliği (S355)", yield: 355, E: 210, color: "#444" },
            { name: "Paslanmaz Çelik (304)", yield: 215, E: 193, color: "#ccc" },
            { name: "Takım Çeliği (D2)", yield: 1600, E: 210, color: "#333" }
        ]},
        { cat: "ALÜMİNYUM", items: [
            { name: "Alüminyum (1100-O)", yield: 35, E: 69, color: "#eee" },
            { name: "Alüminyum (6061-T6)", yield: 276, E: 69, color: "#e0e0e0" },
            { name: "Alüminyum (7075-T6)", yield: 503, E: 71, color: "#dcdcdc" }
        ]},
        { cat: "DİĞER", items: [
            { name: "Bakır (Saf)", yield: 70, E: 117, color: "#b87333" },
            { name: "Titanyum (Ti-6Al-4V)", yield: 880, E: 114, color: "#666" },
            { name: "Karbon Fiber", yield: 1600, E: 230, color: "#111" }
        ]}
    ];

    let selectedMat = null;

    function renderMaterialList() {
        const listDom = document.getElementById('material-list-dom');
        if (!listDom) return;
        listDom.innerHTML = "";
        materialDB.forEach(category => {
            let catHeader = document.createElement('div');
            catHeader.innerText = category.cat;
            catHeader.style.cssText = "padding:8px 15px; font-size:0.75rem; color:#00f2ff; background:#050505; border-bottom:1px solid #222;";
            listDom.appendChild(catHeader);
            category.items.forEach(mat => {
                let item = document.createElement('div');
                item.className = "mat-row";
                item.innerHTML = `
                    <div class="mat-item-content">
                        <span class="mat-color-indicator" style="background:${mat.color}"></span>
                        <span class="mat-name">${mat.name}</span>
                    </div>
                    <span class="mat-val">${mat.yield} MPa</span>
                `;
                item.onclick = () => selectMaterialUI(mat, item);
                listDom.appendChild(item);
            });
        });
    }

    function selectMaterialUI(mat, element) {
        selectedMat = mat;
        document.querySelectorAll('.mat-row').forEach(el => el.classList.remove('selected'));
        element.classList.add('selected');
        const faces = document.querySelectorAll('.face');
        faces.forEach(f => f.style.background = mat.color);
        document.getElementById('bar-label').innerText = mat.name + " Yüklendi";
        const testBar = document.getElementById('test-bar');
        testBar.classList.remove('bar-bending');
        testBar.classList.add('rotating');
        document.getElementById('analysis-report').classList.add('hidden');
    }

    // Tab Yönetimi
    window.switchLabTab = function(tabName) {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active-tab'));
        event.currentTarget.classList.add('active-tab');
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active-content'));
        document.getElementById('tab-content-' + tabName).classList.add('active-content');
    };

    // Kuvvet Ekleme
    let fCounter = 0;
    window.addForceInput = function() {
        const list = document.getElementById('force-list');
        const id = fCounter++;
        const div = document.createElement('div');
        div.className = 'force-card';
        div.id = 'force-card-' + id;
        div.innerHTML = `
            <span style="color:#aaa; font-size:0.8rem;">F${id + 1}</span>
            <input type="number" class="force-val" placeholder="N" value="1000" oninput="updateVisuals()">
            <button class="del-btn" onclick="removeForce(${id})">×</button>
        `;
        list.appendChild(div);
        updateVisuals();
    };

    window.removeForce = function(id) {
        const card = document.getElementById('force-card-' + id);
        if (card) {
            card.style.opacity = '0';
            card.style.transform = 'translateX(50px)';
            setTimeout(() => { card.remove(); updateVisuals(); }, 200);
        }
    };

    window.updateVisuals = function() {
        let total = 0;
        const inputs = document.querySelectorAll('.force-val');
        const bar = document.getElementById('test-bar');
        document.querySelectorAll('.force-arrow').forEach(el => el.remove());
        inputs.forEach((input, index) => {
            const val = parseFloat(input.value);
            if (!isNaN(val) && val > 0) {
                total += val;
                const arrow = document.createElement('div');
                arrow.className = 'force-arrow force-arrow-anim';
                let h = Math.min(val / 50, 80); if (h < 20) h = 20;
                arrow.style.height = h + 'px'; arrow.style.top = (-h) + 'px';
                let leftPos = 50; if (inputs.length > 1) { leftPos = 20 + (index * (60 / (inputs.length - 1))); }
                arrow.style.left = leftPos + '%'; bar.appendChild(arrow);
            }
        });
        document.getElementById('total-load-disp').innerText = total;
        return total;
    };

    // --- ANALİZ MOTORU ---
    window.analyzeMaterial = function() {
        if (!selectedMat) { alert("Lütfen 'MATERYALLER' sekmesinden bir malzeme seçin!"); switchLabTab('materials'); return; }
        const F_total = window.updateVisuals(); 
        const A = parseFloat(document.getElementById('mat-area').value);
        const L = parseFloat(document.getElementById('mat-len').value);
        if (F_total > 0 && A && L) {
            const stress = F_total / A;
            const E_MPa = selectedMat.E * 1000;
            const def = (F_total * L) / (A * E_MPa);
            document.getElementById('analysis-report').classList.remove('hidden');
            document.getElementById('res-stress').innerText = stress.toFixed(2) + " MPa";
            document.getElementById('res-def').innerText = def.toFixed(3) + " mm";
            const limit = selectedMat.yield;
            const ratio = (stress / limit) * 100;
            const barFill = document.getElementById('load-bar');
            const status = document.getElementById('res-status');
            const testBar = document.getElementById('test-bar');
            barFill.style.width = Math.min(ratio, 100) + "%";
            if (stress < limit) {
                status.innerText = "✅ GÜVENLİ"; status.style.color = "#0f0"; barFill.style.background = "#0f0";
                testBar.classList.remove('bar-bending'); testBar.classList.add('rotating');
            } else {
                status.innerText = "❌ KRİTİK / KIRILMA"; status.style.color = "#ff0055"; barFill.style.background = "#ff0055";
                testBar.classList.remove('rotating'); testBar.classList.add('bar-bending');
            }
            addLogToHistory(selectedMat.name, F_total, stress, selectedMat.yield, def);
        } else { alert("Lütfen 'KUVVETLER' sekmesinden yük ekleyin ve Alan/Uzunluk girin."); }
    };

    // LOG SİSTEMİ
    function addLogToHistory(matName, force, stress, limit, deformation) {
        const listDom = document.getElementById('log-list-dom');
        if (!listDom) return;
        if (listDom.innerText.includes("Henüz kayıt yok")) listDom.innerHTML = "";
        const isSafe = stress < limit;
        const ratio = Math.min((stress / limit) * 100, 100);
        let statusColor = isSafe ? "#0f0" : "#ff0055";
        let icon = isSafe ? "✅" : "💥";
        if (isSafe && ratio > 50) { statusColor = "#ffeb3b"; icon = "⚠️"; }
        const now = new Date();
        const timeStr = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');
        const div = document.createElement('div');
        div.className = "log-item";
        div.innerHTML = `
            <div style="flex:1;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; border-bottom:1px solid #333; padding-bottom:4px;">
                    <span style="color:#fff; font-weight:bold; font-size:0.85rem;">${matName}</span>
                    <span style="color:#666; font-size:0.7rem; font-family:monospace;">${timeStr}</span>
                </div>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:5px; font-size:0.75rem; color:#aaa;">
                    <span>Yük: <b style="color:#fff">${force} N</b></span>
                    <span>Gerilme: <b style="color:${statusColor}">${stress.toFixed(1)}</b></span>
                    <span>Uzama: <b style="color:#00f2ff">${deformation.toFixed(3)}</b></span>
                </div>
                <div style="width:100%; height:3px; background:#222; margin-top:6px; border-radius:2px; overflow:hidden;">
                    <div style="width:${ratio}%; height:100%; background:${statusColor}; transition: width 0.5s;"></div>
                </div>
            </div>
            <div style="margin-left:10px;">${icon}</div>
        `;
        div.style.animation = "fadeIn 0.4s ease";
        listDom.insertBefore(div, listDom.firstChild);
    }

    window.clearLogs = function() {
        const list = document.getElementById('log-list-dom');
        if(list) {
            list.innerHTML = ''; 
            const emptyMsg = document.createElement('div');
            emptyMsg.style.cssText = "color:#555; text-align:center; padding:20px; font-size:0.8rem;";
            emptyMsg.innerText = "Geçmiş temizlendi.";
            list.appendChild(emptyMsg);
        }
    };
    // --- GEÇMİŞE KAYDETME FONKSİYONU ---
    function logResultToHistory(materialName, stress, status, isSafe) {
        const list = document.getElementById('log-list-dom');
        if(!list) return;
        
        // "Henüz kayıt yok" yazısını sil
        if(list.children.length === 1 && list.children[0].innerText.includes("yok")) {
            list.innerHTML = "";
        }

        const item = document.createElement('div');
        item.style.borderBottom = "1px solid #222";
        item.style.padding = "8px";
        item.style.fontSize = "0.8rem";
        item.innerHTML = `
            <div style="color:#fff; font-weight:bold;">${materialName}</div>
            <div style="display:flex; justify-content:space-between; margin-top:4px;">
                <span>${stress} MPa</span>
                <span style="color:${isSafe ? '#0f0' : '#f00'}">${status}</span>
            </div>
        `;
        
        // En başa ekle
        list.insertBefore(item, list.firstChild);
    }

    // analyzeMaterial fonksiyonunun sonuna bunu ekle:
    // logResultToHistory(selectedMat.name, stress.toFixed(2), (stress < limit ? "GÜVENLİ" : "İFLAS"), (stress < limit));

    renderMaterialList();
});