function Footer() {
  return (
    <footer className="mt-16 border-t">
      <div className="text-muted-foreground mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-6 text-xs">
        <span>© {new Date().getFullYear()} saydn-chat</span>
        <div className="flex items-center gap-4">
          <a href="/chat" className="hover:underline">
            Open app
          </a>
          <a href="mailto:hello@saydn.chat" className="hover:underline">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
