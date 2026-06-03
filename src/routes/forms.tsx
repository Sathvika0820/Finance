import { createFileRoute, Outlet } from '@tanstack/react-router';
import { BottomNav } from '@/components/BottomNav';

export const Route = createFileRoute('/forms')({
  component: FormsLayout,
});

function FormsLayout() {
  return (
    <div className="min-h-screen bg-background pb-32">
      <Outlet />
      <BottomNav />
    </div>
  );
}
