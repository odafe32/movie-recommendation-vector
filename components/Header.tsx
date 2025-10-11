import SearchInput from "./SearchInput";

function Header() {
  return (
    <header className="p-6 pb-0 flex flex-col items-center sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-200 dark:border-zinc-800/50 transition-colors duration-300">
      <SearchInput />
    </header>
  );
}

export default Header;
