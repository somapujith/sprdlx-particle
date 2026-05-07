/** Paths that activate Liquid Chrome (`data-motif="chrome"`). Home (`/`) is excluded. */
export function isChromeMotifPath(pathname: string): boolean {
  return (
    pathname === '/about' ||
    pathname === '/projects' ||
    pathname === '/contact' ||
    pathname.startsWith('/projects/')
  );
}
