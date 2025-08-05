import { Outlet } from 'react-router';
import { SiteFooter } from '~/components/site-footer';
import { SiteHeader } from '~/components/site-header';

function SiteLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1 p-4">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}

export default SiteLayout;
