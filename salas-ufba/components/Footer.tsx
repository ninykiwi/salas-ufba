export function Footer() {
  return (
    <footer className="mt-12 py-8 border-t border-[var(--outline-variant)]">
      <div className="flex flex-col md:flex-row justify-between items-center opacity-60">
        <p className="font-label-md text-label-md text-[var(--on-surface)]">
          © {new Date().getFullYear()} Salas UFBA 2.0 • Sistema de Gestão de Espaços Acadêmicos
        </p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <button className="hover:text-[var(--primary)] transition-colors" aria-label="Ajuda">
            <span className="material-symbols-outlined text-xl">help</span>
          </button>
          <button className="hover:text-[var(--primary)] transition-colors" aria-label="Configurações">
            <span className="material-symbols-outlined text-xl">settings</span>
          </button>
        </div>
      </div>
    </footer>
  );
}