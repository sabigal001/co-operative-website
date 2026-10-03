// Multi-service subdomain & route resolver
// Handles:
// - mosunmolacoop.com (Public Landing Page)
// - members.mosunmolacoop.com (Member Portal PWA)
// - admin.mosunmolacoop.com (Role-Based Admin Console)
// With fallback query parameters (?app=members / ?app=admin) for local development

export type AppService = 'landing' | 'members' | 'admin';

export function resolveCurrentService(): AppService {
  if (typeof window === 'undefined') return 'landing';

  const hostname = window.location.hostname.toLowerCase();
  const searchParams = new URLSearchParams(window.location.search);
  const path = window.location.pathname.toLowerCase();

  // 1. Check production / staging subdomain
  if (hostname.startsWith('members.') || hostname.startsWith('member.')) {
    return 'members';
  }
  if (hostname.startsWith('admin.') || hostname.startsWith('admins.')) {
    return 'admin';
  }

  // 2. Check query parameter fallback (e.g. ?app=members or ?app=admin or ?portal=member)
  const appParam = searchParams.get('app') || searchParams.get('portal');
  if (appParam === 'members' || appParam === 'member') {
    return 'members';
  }
  if (appParam === 'admin') {
    return 'admin';
  }

  // 3. Check pathname fallback (e.g. /members, /admin)
  if (path.startsWith('/members')) {
    return 'members';
  }
  if (path.startsWith('/admin')) {
    return 'admin';
  }

  return 'landing';
}

export function getServiceUrl(service: AppService): string {
  if (typeof window === 'undefined') return '/';

  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  if (isLocalhost) {
    if (service === 'landing') return '/';
    return `/?app=${service}`;
  }

  // Production subdomain links
  const protocol = window.location.protocol;
  const rootDomain = 'mosunmolacoop.ng'; // or configured domain

  if (service === 'members') {
    return `${protocol}//members.${rootDomain}`;
  }
  if (service === 'admin') {
    return `${protocol}//admin.${rootDomain}`;
  }
  return `${protocol}//${rootDomain}`;
}

export function navigateToService(service: AppService): void {
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  if (isLocalhost) {
    const url = new URL(window.location.href);
    if (service === 'landing') {
      url.searchParams.delete('app');
      url.searchParams.delete('portal');
      url.pathname = '/';
    } else {
      url.searchParams.set('app', service);
      url.searchParams.delete('portal');
    }
    window.location.href = url.toString();
  } else {
    window.location.href = getServiceUrl(service);
  }
}
