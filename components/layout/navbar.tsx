import Link from "next/link";

export function Navbar() {
  return (
    <header className="border-b border-verticall-pale bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-heading text-2xl text-verticall-dark">VertiCall</Link>
        <div className="flex gap-4 text-sm">
          <Link href="/client/dashboard">Client</Link>
          <Link href="/pro/dashboard">Pro</Link>
          <Link href="/admin">Admin</Link>
        </div>
      </nav>
    </header>
  );
}
