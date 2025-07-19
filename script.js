// TODO: ここにご自身のFirebaseプロジェクトの設定情報を貼り付けてください。
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Firebaseアプリの初期化
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// DOM要素の取得
const loginForm = document.getElementById('loginForm');
const googleLoginButton = document.getElementById('googleLogin');
const appleLoginButton = document.getElementById('appleLogin');
// const microsoftLoginButton = document.getElementById('microsoftLogin'); // 削除
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('error-message');

// エラーメッセージを表示する関数
function showErrorMessage(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block'; // エラーメッセージを表示
}

// エラーメッセージを非表示にする関数
function hideErrorMessage() {
    errorMessage.textContent = '';
    errorMessage.style.display = 'none'; // エラーメッセージを非表示
}

// ログイン成功時の処理 (共通化)
function handleLoginSuccess(user) {
    alert(`ログイン成功！ようこそ、${user.email || user.displayName || 'ユーザー'}さん！`);
    // ログイン後のページにリダイレクトするなどの処理をここに追加
    // window.location.href = '/dashboard';
}

// エラー処理 (共通化)
function handleLoginError(error, contextMessage) {
    let message = contextMessage + 'に失敗しました。';
    console.error("認証エラー:", error);
    switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
            message = 'メールアドレスまたはパスワードが間違っています。';
            break;
        case 'auth/invalid-email':
            message = 'メールアドレスの形式が正しくありません。';
            break;
        case 'auth/user-disabled':
            message = 'このアカウントは無効化されています。';
            break;
        case 'auth/popup-closed-by-user':
            message = '認証ポップアップが閉じられました。';
            break;
        case 'auth/cancelled-popup-request':
            message = '既に認証ポップアップが開かれています。';
            break;
        case 'auth/account-exists-with-different-credential':
            message = 'このメールアドレスは他の方法で登録されています。';
            break;
        case 'auth/operation-not-allowed':
            message = 'この認証方法は有効になっていません。Firebaseコンソールで設定を確認してください。';
            break;
        default:
            message = '予期せぬエラーが発生しました。';
            break;
    }
    showErrorMessage(message);
}

// メール/パスワード ログイン処理
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // フォームのデフォルト送信を防止

    hideErrorMessage(); // 前のエラーメッセージを非表示にする

    const email = emailInput.value;
    const password = passwordInput.value;

    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        handleLoginSuccess(userCredential.user);
    } catch (error) {
        handleLoginError(error, 'ログイン');
    }
});

// Googleログイン処理
googleLoginButton.addEventListener('click', async () => {
    hideErrorMessage();
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
        const result = await auth.signInWithPopup(provider);
        handleLoginSuccess(result.user);
    } catch (error) {
        handleLoginError(error, 'Googleログイン');
    }
});

// Appleログイン処理
appleLoginButton.addEventListener('click', async () => {
    hideErrorMessage();
    const provider = new firebase.auth.OAuthProvider('apple.com');
    // 必要に応じてスコープなどを設定
    // provider.addScope('email');
    // provider.addScope('name');
    try {
        const result = await auth.signInWithPopup(provider);
        handleLoginSuccess(result.user);
    } catch (error) {
        handleLoginError(error, 'Appleログイン');
    }
});

// Microsoftログイン処理 (ボタンが削除されたため、イベントリスナーも削除)
// microsoftLoginButton.addEventListener('click', async () => { ... });

// ログイン状態の監視 (オプション: ページ読み込み時にログインしているか確認する場合)
// auth.onAuthStateChanged(user => {
//     if (user) {
//         console.log("ユーザーがログインしています:", user.email || user.displayName);
//         // ログイン済みユーザーをホーム画面にリダイレクトするなど
//         // window.location.href = '/dashboard';
//     } else {
//         console.log("ユーザーはログインしていません。");
//     }
// });