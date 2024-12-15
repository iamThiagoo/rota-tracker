import Link from "next/link";
import Navbar from "../navbar/navbar";

export function Header() {
  return (
    <header className="flex items-center justify-between my-10">
        <h1 className="text-white text-3xl font-black">
            <Link href="/new-route" className="hover:opacity-80">
                🚚 RotaTracker
            </Link>
        </h1>
        <Navbar />
    </header>
  );
}

export default Header;
