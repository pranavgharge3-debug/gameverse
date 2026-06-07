import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-dark-bg text-white font-sans selection:bg-purple-primary/30">
      <Navbar />
      {/* Content wrapper with top padding to account for fixed Navbar */}
      <div className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <main className="w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
