export function AppFooter() {
  return (
    <footer className="border-t">
      <div className="px-6 py-2 flex items-center justify-between">
        <p className="text-xs text-muted-foreground container mx-auto">
          KapeNatin PH &copy; {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
