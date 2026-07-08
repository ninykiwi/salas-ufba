export default function Footer() {
  return (
    <footer className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-white">
      <div className="flex items-center gap-3">
        <img src="/ufba-logo.png" alt="UFBA" width={32} height={32} className="object-contain" />

        <div>
          <p className="text-xs font-bold text-gray-800">UFBA</p>
          <p className="text-xs text-gray-400">UNIVERSIDADE FEDERAL DA BAHIA</p>
        </div>
      </div>

      <p className="text-xs text-gray-400">
        © 2026 Salas UFBA 2.0 • Sistema de Gestão de Espaços Acadêmicos
      </p>
    </footer>
  );
}