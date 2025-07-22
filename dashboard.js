// あなたのFirebaseプロジェクトの設定情報
// ここにも必ずあなたのFirebaseプロジェクトの実際の情報をコピー＆ペーストしてください！
const firebaseConfig = {
    apiKey: "AIzaSyBMmpRvHLrXwwyKGi6IH4IH8IQkE3fjH7w",
    authDomain: "ti-kimemo.firebaseapp.com",
    projectId: "ti-kimemo",
    storageBucket: "ti-kimemo.firebasestorage.app",
    messagingSenderId: "190739467226",
    appId: "1:190739467226:web:724ac64061484b92d58ee3",
    measurementId: "G-EY72HHJD1T"
};

// Firebaseアプリの初期化
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// DOM要素の取得
const userInfoElement = document.getElementById('user-info');
const logoutButton = document.getElementById('logout-button');
const addNoteButton = document.getElementById('add-note-button');

// マップオブジェクトをグローバルに保持
let map; 

// マップを初期化する関数
function initializeMap() {
    // 吉岡町の中心座標 (緯度, 経度)
    const yoshiokaCoords = [36.417, 139.020]; 
    const initialZoom = 13; // ズームレベル (数字が大きいほど拡大)

    // 'mapid' divに地図を初期化
    map = L.map('mapid').setView(yoshiokaCoords, initialZoom);

    // OpenStreetMapのタイルレイヤーを追加
    // https://leaflet-extras.github.io/leaflet-providers/preview/index.html で他のプロバイダーも確認できます
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    console.log("Leafletマップが初期化されました。");
}

// ログイン状態の監視
auth.onAuthStateChanged(user => {
    if (user) {
        // ユーザーがログインしている場合
        console.log("ユーザーがログインしています:", user.email || user.displayName);
        userInfoElement.textContent = `ようこそ、${user.email || user.displayName || 'ユーザー'}さん！`;
        
        // ユーザーがログインしている場合のみ地図を初期化
        if (!map) { // 地図がまだ初期化されていなければ
            initializeMap();
        }
        
    } else {
        // ユーザーがログインしていない場合
        console.log("ユーザーはログインしていません。ログインページへリダイレクトします。");
        alert('ログインが必要です。');
        window.location.href = 'index.html'; // ログインページへリダイレクト
    }
});

// ログアウト処理
logoutButton.addEventListener('click', async () => {
    try {
        await auth.signOut();
        alert('ログアウトしました。');
        window.location.href = 'index.html'; // ログインページへリダイレクト
    } catch (error) {
        console.error("ログアウトエラー:", error);
        alert('ログアウト中にエラーが発生しました。');
    }
});

// 新しいメモを追加ボタンの機能（今はダミー）
addNoteButton.addEventListener('click', () => {
    alert('新しいメモを追加する機能はまだ実装されていません。');
    // 将来的にメモ作成フォームなどを表示する
});