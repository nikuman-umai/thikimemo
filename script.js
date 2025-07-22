// あなたのFirebaseプロジェクトの設定情報
const firebaseConfig = {
    apiKey: "AIzaSyBMmpRvHLrXwwyKGi6IH4IH8IQkE3fjH7w",
    authDomain: "ti-kimemo.firebaseapp.com",
    projectId: "ti-kimemo",
    storageBucket: "ti-kimemo.firebasestorage.app",
    messagingSenderId: "190739467226",
    appId: "1:190739467226:web:724ac64061484b92d58ee3",
    measurementId: "G-EY72HHJD1T" // measurementIdはAuthenticationには直接影響しませんが、含めておきます
};

// Firebaseアプリの初期化
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// DOM要素の取得
const loginForm = document.getElementById('loginForm');
const googleLoginButton = document.getElementById('googleLogin');
const appleLoginButton = document.getElementById('appleLogin');
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
    console.log("ログインユーザー:", user); // デバッグ用にユーザー情報を出力

    // ユーザーがメールアドレスとパスワードでログインしており、かつメールが未確認の場合
    // ソーシャルログイン（Google, Apple）ではemailVerifiedは通常trueになるため、メール/パスワードユーザーに限定
    if (user.providerData.some(p => p.providerId === 'password') && user.email && !user.emailVerified) {
        if (confirm('メールアドレスの確認が完了していません。確認メールを再送しますか？')) {
            user.sendEmailVerification()
                .then(() => {
                    alert('確認メールを送信しました。メールをご確認ください。');
                })
                .catch((error) => {
                    console.error("確認メールの送信に失敗しました:", error);
                    alert('確認メールの送信に失敗しました。後でもう一度お試しください。');
                });
        } else {
            // ユーザーが再送を拒否した場合の処理（例：未確認であることを表示し続ける）
            alert('メールアドレスの確認が完了していません。サービスの一部機能が制限される場合があります。');
        }
    }
    // ログイン後のページにリダイレクトするなどの処理をここに追加
    // 例: window.location.href = '/dashboard.html';
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

// ログイン状態の監視 (オプション: ページ読み込み時にログインしているか確認する場合)
// auth.onAuthStateChanged(user => {
//     if (user) {
//         console.log("ユーザーがログインしています:", user.email || user.displayName);
// ログイン済みユーザーをホーム画面にリダイレクトするなど
window.location.href = '/dashboard';
   　 } else {
         console.log("ユーザーはログインしていません。");
      }
// });
