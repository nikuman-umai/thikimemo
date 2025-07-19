// あなたのFirebaseプロジェクトの設定情報 (index.htmlのscript.jsと同じものをコピー)
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
const signupForm = document.getElementById('signupForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const errorMessage = document.getElementById('error-message');

// エラーメッセージを表示する関数
function showErrorMessage(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

// エラーメッセージを非表示にする関数
function hideErrorMessage() {
    errorMessage.textContent = '';
    errorMessage.style.display = 'none';
}

// 新規登録処理
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    hideErrorMessage(); // 前のエラーメッセージを非表示にする

    const email = emailInput.value;
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // パスワードのバリデーション
    if (password.length < 6) {
        showErrorMessage('パスワードは6文字以上で入力してください。');
        return;
    }
    if (password !== confirmPassword) {
        showErrorMessage('パスワードと確認用パスワードが一致しません。');
        return;
    }

    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        alert('新規登録が完了しました！自動的にログインしました。');
        // 登録後、ユーザーをダッシュボードなどのページにリダイレクト
        // 例: window.location.href = '/dashboard.html';
        console.log('新規登録成功:', userCredential.user);
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
        showErrorMessage(message);
    }
});