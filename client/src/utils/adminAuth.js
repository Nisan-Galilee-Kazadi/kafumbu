const ADMIN_AUTH_KEY = 'ksc-admin-auth';

export const DEMO_ADMIN = {
  email: 'admin@kafumbu-smartcity.cd',
  password: 'Admin@123',
  name: 'Admin Kafumbu',
  role: 'Super Admin',
};

export function isAdminAuthenticated() {
  return localStorage.getItem(ADMIN_AUTH_KEY) === 'true' && Boolean(localStorage.getItem('adminToken'));
}

export function loginAdmin(email, password) {
  const ok = email === DEMO_ADMIN.email && password === DEMO_ADMIN.password;
  if (ok) {
    localStorage.setItem(ADMIN_AUTH_KEY, 'true');
    localStorage.setItem('ksc-admin-name', DEMO_ADMIN.name);
  }
  return ok;
}

export function logoutAdmin() {
  localStorage.removeItem(ADMIN_AUTH_KEY);
  localStorage.removeItem('ksc-admin-name');
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
}

export function setAdminSession(user) {
  localStorage.setItem(ADMIN_AUTH_KEY, 'true');
  localStorage.setItem('ksc-admin-name', user?.name || DEMO_ADMIN.name);
}

export function getAdminName() {
  const apiUser = JSON.parse(localStorage.getItem('adminUser') || 'null');
  return apiUser?.name || localStorage.getItem('ksc-admin-name') || DEMO_ADMIN.name;
}
