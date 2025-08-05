export function AppFooter() {
  return (
    <footer className="border-t">
      <div className="p-4 h-14 flex items-center justify-between">
        <p className="text-xs text-muted-foreground text-center container mx-auto">
          Kape Natin PH &copy; {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
