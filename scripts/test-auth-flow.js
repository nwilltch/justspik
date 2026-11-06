const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3025';
const TEST_EMAIL = `test_${Date.now()}@justspik.test`;
const TEST_PASSWORD = 'SecretPassword123!';
const TEST_NAME = 'Test User';
const DB_PATH = path.join(__dirname, '..', 'src', 'data', 'users.json');

async function runAuthTests() {
  console.log('--- DÉMARRAGE DU TEST D’AUTHENTIFICATION JUSTSPIK ---');
  console.log(`Email de test : ${TEST_EMAIL}\n`);

  let sessionCookie = '';

  // 1. TEST SIGNUP
  console.log('1. Test Inscription (POST /api/auth/signup)...');
  const signupRes = await fetch(`${BASE_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: TEST_EMAIL, password: TEST_PASSWORD, name: TEST_NAME }),
  });
  const signupData = await signupRes.json();
  console.log('   Status:', signupRes.status);
  console.log('   Réponse:', signupData);
  if (!signupData.success || !signupData.needVerification) {
    throw new Error('Échec étape Signup');
  }
  console.log('   -> Inscription OK, code envoyé !\n');

  // 2. RÉCUPÉRATION DU CODE OTP DEPUIS LA BASE
  const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  const foundCodeEntry = db.codes.find(
    (c) => c.email.toLowerCase() === TEST_EMAIL.toLowerCase() && c.type === 'signup'
  );
  if (!foundCodeEntry) {
    throw new Error('Code OTP introuvable dans users.json');
  }
  const otpCode = foundCodeEntry.code;
  console.log(`2. Code OTP détecté dans la base : ${otpCode}\n`);

  // 3. TEST VÉRIFICATION DU CODE
  console.log('3. Test Validation du code (POST /api/auth/verify-code)...');
  const verifyRes = await fetch(`${BASE_URL}/api/auth/verify-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: TEST_EMAIL, code: otpCode }),
  });
  const setCookieHeader = verifyRes.headers.get('set-cookie');
  const verifyData = await verifyRes.json();
  console.log('   Status:', verifyRes.status);
  console.log('   Réponse:', verifyData);
  if (!verifyData.success || !verifyData.user) {
    throw new Error('Échec validation du code OTP');
  }
  if (!setCookieHeader) {
    throw new Error('Aucun cookie de session reçu lors de la validation');
  }
  sessionCookie = setCookieHeader.split(';')[0];
  console.log(`   Session Cookie obtenu : ${sessionCookie}`);
  console.log('   -> Compte validé & connecté avec succès !\n');

  // 4. TEST RÉCUPÉRATION DU PROFIL UTILISATEUR CONNECTÉ
  console.log('4. Test Profil connecté (GET /api/auth/me)...');
  const meRes = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: { Cookie: sessionCookie },
  });
  const meData = await meRes.json();
  console.log('   Status:', meRes.status);
  console.log('   Réponse:', meData);
  if (!meData.user || meData.user.email !== TEST_EMAIL) {
    throw new Error('Échec récupération session active /api/auth/me');
  }
  console.log(`   -> Utilisateur reconnu : ${meData.user.name} (${meData.user.email})\n`);

  // 5. TEST DÉCONNEXION
  console.log('5. Test Déconnexion (POST /api/auth/logout)...');
  const logoutRes = await fetch(`${BASE_URL}/api/auth/logout`, { method: 'POST' });
  const logoutData = await logoutRes.json();
  console.log('   Status:', logoutRes.status);
  console.log('   Réponse:', logoutData);
  console.log('   -> Déconnexion OK\n');

  // 6. TEST CONNEXION NORMALE (LOGIN)
  console.log('6. Test Connexion standard (POST /api/auth/login)...');
  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: TEST_EMAIL, password: TEST_PASSWORD }),
  });
  const loginData = await loginRes.json();
  const loginCookie = loginRes.headers.get('set-cookie')?.split(';')[0];
  console.log('   Status:', loginRes.status);
  console.log('   Réponse:', loginData);
  if (!loginData.success || !loginCookie) {
    throw new Error('Échec connexion standard');
  }
  console.log('   -> Re-connexion par mot de passe réussie !\n');

  // 7. TEST MOT DE PASSE OUBLIÉ ET RÉINITIALISATION
  console.log('7. Test Mot de passe oublié (POST /api/auth/forgot-password)...');
  const forgotRes = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: TEST_EMAIL }),
  });
  const forgotData = await forgotRes.json();
  console.log('   Status:', forgotRes.status);
  console.log('   Réponse:', forgotData);

  const dbAfterForgot = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  const resetCodeEntry = dbAfterForgot.codes.find(
    (c) => c.email.toLowerCase() === TEST_EMAIL.toLowerCase() && c.type === 'reset-password'
  );
  if (!resetCodeEntry) {
    throw new Error('Code de reset introuvable');
  }
  console.log(`   Code de réinitialisation reçu : ${resetCodeEntry.code}`);

  const NEW_PASSWORD = 'NewSuperPassword2026!';
  console.log('   Test validation nouveau mot de passe (POST /api/auth/reset-password)...');
  const resetRes = await fetch(`${BASE_URL}/api/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: TEST_EMAIL,
      code: resetCodeEntry.code,
      newPassword: NEW_PASSWORD,
    }),
  });
  const resetData = await resetRes.json();
  console.log('   Status:', resetRes.status);
  console.log('   Réponse:', resetData);
  if (!resetData.success) {
    throw new Error('Échec réinitialisation mot de passe');
  }
  console.log('   -> Mot de passe mis à jour et session renouvelée avec succès !\n');

  // NETTOYAGE DE L'UTILISATEUR DE TEST
  const cleanDb = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  cleanDb.users = cleanDb.users.filter((u) => u.email !== TEST_EMAIL);
  cleanDb.codes = cleanDb.codes.filter((c) => c.email !== TEST_EMAIL);
  fs.writeFileSync(DB_PATH, JSON.stringify(cleanDb, null, 2), 'utf8');
  console.log('Nettoyage du compte de test effectué.');

  console.log('\n======================================================');
  console.log('🎉 TOUS LES TESTS D’AUTHENTIFICATION SONT 100% VALIDES !');
  console.log('======================================================');
}

runAuthTests().catch((err) => {
  console.error('\n❌ ERREUR LORS DES TESTS :', err);
  process.exit(1);
});
