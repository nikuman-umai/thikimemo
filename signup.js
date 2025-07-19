// あなたのFirebaseプロジェクトの設定情報
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
const db = firebase.firestore(); // Firestoreの初期化

// DOM要素の取得
const signupForm = document.getElementById('signupForm');
const verifyCodeForm = document.getElementById('verifyCodeForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const verificationCodeInput = document.getElementById('verificationCode');
const resendCodeBtn = document.getElementById('resendCodeBtn');
const errorMessage = document.getElementById('error-message');
const infoMessage = document.getElementById('info-message');

let currentUserId = null; // 現在登録中のユーザーIDを保持

// メッセージ表示関数
function showMessage(element, message, type = 'error') {
    element.textContent = message;
    element.style.color = type === 'error' ? '#e74c3c' : '#3498db';
    element.style.display = 'block';
}

function hideMessage(element) {
    element.textContent = '';
    element.style.display = 'none';
}

// 新規登録処理
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    hideMessage(errorMessage);
    hideMessage(infoMessage);

    const email = emailInput.value;
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (password.length < 6) {
        showMessage(errorMessage, 'パスワードは6文字以上で入力してください。');
        return;
    }
    if (password !== confirmPassword) {
        showMessage(errorMessage, 'パスワードと確認用パスワードが一致しません。');
        return;
    }

    try {
        // Firebase Authenticationでユーザーを仮作成
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        currentUserId = userCredential.user.uid; // ユーザーIDを保存

        // ★★★ Firebase Functionsの関数を呼び出して確認コードを送信する ★★★
        // ここではまだFunctionsがデプロイされていないため、ダミーの処理を記述
        // 実際には、FunctionsのURLにPOSTリクエストを送る形になります
        // 例: const response = await fetch('YOUR_FUNCTIONS_URL/sendVerificationCode', { ... });

        // Functionsがデプロイされるまでの仮の表示
        showMessage(infoMessage, 'アカウントを作成しました。確認コードを送信中...', 'info');

        // フォームの切り替え
        signupForm.style.display = 'none';
        verifyCodeForm.style.display = 'block';
        showMessage(infoMessage, '登録したメールアドレスに6桁の確認コードを送信しました。', 'info');

    } catch (error) {
        let message = '新規登録に失敗しました。';
        console.error("認証エラー:", error);
        switch (error.code) {
            case 'auth/email-already-in-use':
                message = 'このメールアドレスは既に登録されています。';
                break;
            case 'auth/invalid-email':
                message = 'メールアドレスの形式が正しくありません。';
                break;
            case 'auth/weak-password':
                message = 'パスワードが弱すぎます。より強力なパスワードを設定してください。';
                break;
            default:
                message = '予期せぬエラーが発生しました。';
                break;
        }
        showMessage(errorMessage, message);
    }
});

// 確認コード検証処理
verifyCodeForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    hideMessage(errorMessage);
    hideMessage(infoMessage);

    const enteredCode = verificationCodeInput.value;

    if (!currentUserId) {
        showMessage(errorMessage, 'ユーザー情報が見つかりません。再度登録してください。');
        return;
    }
    if (enteredCode.length !== 6) {
        showMessage(errorMessage, '確認コードは6桁で入力してください。');
        return;
    }

    try {
        // ★★★ Firebase Functionsの関数を呼び出して確認コードを検証する ★★★
        // ここではまだFunctionsがデプロイされていないため、ダミーの処理を記述
        // 実際には、FunctionsのURLにPOSTリクエストを送る形になります
        // 例: const response = await fetch('YOUR_FUNCTIONS_URL/verifyCode', { ... });

        // Functionsがデプロイされるまでの仮の表示
        showMessage(infoMessage, '確認コードを検証中...', 'info');

        // ここにFunctionsからの応答を待つ実際のコードが入ります
        // 例: const data = await response.json();
        // if (data.success) { ... } else { ... }

        // 仮に成功したと仮定
        alert('メールアドレスの確認が完了しました！ログインできます。');
        // ログインページへリダイレクト
        window.location.href = 'index.html';

    } catch (error) {
        console.error("コード検証エラー:", error);
        showMessage(errorMessage, '確認コードの検証に失敗しました。コードが間違っているか、有効期限が切れています。');
    }
});

// コード再送処理
resendCodeBtn.addEventListener('click', async () => {
    hideMessage(errorMessage);
    hideMessage(infoMessage);

    if (!currentUserId || !emailInput.value) {
        showMessage(errorMessage, '再送するにはメールアドレスが必要です。');
        return;
    }

    try {
        // ★★★ Firebase Functionsの関数を呼び出して確認コードを再送する ★★★
        // 例: await fetch('YOUR_FUNCTIONS_URL/sendVerificationCode', { ... });
        showMessage(infoMessage, '確認コードを再送しました。メールをご確認ください。', 'info');
    } catch (error) {
        console.error("コード再送エラー:", error);
        showMessage(errorMessage, '確認コードの再送に失敗しました。');
    }
});