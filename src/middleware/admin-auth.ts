import { User } from 'firebase/auth';

const ADMIN_EMAILS = ['nhan1545a@gmail.com'];

export function isAdmin(user: User | null): boolean {
  if (!user || !user.email) {
    return false;
  }
  return ADMIN_EMAILS.includes(user.email.toLowerCase());
}

export function checkAdminAccess(user: User | null): { isAdmin: boolean; error?: string } {
  if (!user) {
    return { isAdmin: false, error: 'Vui lòng đăng nhập' };
  }
  
  if (!isAdmin(user)) {
    return { isAdmin: false, error: 'Bạn không có quyền truy cập trang này' };
  }
  
  return { isAdmin: true };
}
