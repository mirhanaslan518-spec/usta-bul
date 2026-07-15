/* ================================================================
   USTABUL — supabase-client.js
   Sprint 9 · Backend Foundation

   Bu dosya Supabase bağlantısını kurar ve gerçek kimlik doğrulama
   (Auth) fonksiyonlarını sağlar. app.js'teki eski doLogin/doRegister
   (düz metin şifre karşılaştırması) bu dosyadaki fonksiyonları
   çağıracak şekilde güncellenecektir.

   DB satırları snake_case (real_name, anon_name, is_admin) gelir;
   app.js'in geri kalanı camelCase (name, anonName, isAdmin) bekliyor.
   mapProfileFromDb() bu dönüşümü tek bir yerde yapar, böylece 3000+
   satırlık app.js'i baştan yazmak gerekmez.
   ================================================================ */

const SUPABASE_URL = 'https://cbspujgflaznmujvmsoh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNic3B1amdmbGF6bm11anZtc29oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM3OTI0NjYsImV4cCI6MjA5OTM2ODQ2Nn0.tG70zjmJf68mpj_gvUykN_9-JMD7lrBUX8ko8RO8Yi4';

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* DB satırını (snake_case) app.js'in beklediği camelCase kullanıcı nesnesine çevirir */
function mapProfileFromDb(row) {
  if (!row) return null;
  return {
    id: row.id,
    email: row.email,
    name: row.real_name,
    anonName: row.anon_name,
    role: row.role,
    city: row.city,
    district: row.district,
    isAdmin: row.is_admin,
    isTrustedWorker: row.is_trusted_worker,
    suspended: row.suspended,
    bio: row.bio || '',
    skills: row.skills || [],
    rating: row.rating || 0,
    ratingCount: row.rating_count || 0,
    jobsDone: row.jobs_done || 0,
    joinedYear: row.created_at ? new Date(row.created_at).getFullYear().toString() : '',
  };
}

/* Rastgele anonim rumuz üretir — app.js'teki genAnon() ile aynı kalıp */
function generateAnonName(role) {
  const n = Math.floor(100000 + Math.random()*900000);
  return (role==='worker' ? 'Satıcı' : 'Kullanıcı') + n;
}

/* ----------------------------------------------------------------
   KAYIT — Supabase Auth'ta hesap açar + profiles tablosuna satır ekler.
   Şifre artık Supabase tarafında güvenli şekilde hash'lenir; istemci
   koduna veya localStorage'a asla düz metin şifre yazılmaz.
   ---------------------------------------------------------------- */
async function sbSignUp({ email, password, name, role, city, district }) {
  const { data, error } = await sb.auth.signUp({ email, password });
  if (error) throw error;
  const userId = data.user?.id;
  if (!userId) throw new Error('Kullanıcı oluşturulamadı (e-posta onayı gerekebilir).');

  const anonName = generateAnonName(role);
  const profileRow = {
    id: userId, email, real_name: name, anon_name: anonName,
    role, city, district, is_admin: false, is_trusted_worker: false, suspended: false,
    ...(role === 'worker' || role === 'both' ? { bio:'', skills:[], rating:0, rating_count:0, jobs_done:0 } : {}),
  };
  const { error: profileError } = await sb.from('profiles').insert(profileRow);
  if (profileError) throw profileError;

  return mapProfileFromDb(profileRow);
}

/* ----------------------------------------------------------------
   GİRİŞ — Supabase Auth ile doğrular, ardından profiles satırını çeker.
   ---------------------------------------------------------------- */
async function sbSignIn({ email, password }) {
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error) throw error; // gerçek kimlik doğrulama hatası (yanlış e-posta/şifre, vb.)

  let profile;
  try {
    profile = await sbFetchOwnProfile(data.user.id);
  } catch (profileErr) {
    // Buraya düşmesinin en olası nedeni: bu hesap Supabase Dashboard'dan
    // (Authentication → Users → Add user) elle oluşturuldu ve app'in kayıt
    // formundan geçmedi — yani auth.users'ta var ama profiles'ta karşılığı
    // yok. Kimlik doğrulaması AŞILDI (şifre doğru), sorun profilde.
    await sb.auth.signOut();
    throw new Error('NO_PROFILE');
  }

  if (profile?.suspended) {
    await sb.auth.signOut();
    throw new Error('SUSPENDED');
  }
  return profile;
}

async function sbSignOut() {
  await sb.auth.signOut();
}

/* Kendi profilini (gerçek ad/e-posta dahil) çeker — RLS bunu sadece
   sahibine veya yöneticiye izin verir. */
async function sbFetchOwnProfile(userId) {
  const { data, error } = await sb.from('profiles').select('*').eq('id', userId).single();
  if (error) throw error;
  return mapProfileFromDb(data);
}

/* Sayfa yenilendiğinde aktif Supabase oturumu varsa geri yükler. */
async function sbRestoreSession() {
  const { data } = await sb.auth.getSession();
  if (!data.session) return null;
  try {
    return await sbFetchOwnProfile(data.session.user.id);
  } catch {
    return null;
  }
}
