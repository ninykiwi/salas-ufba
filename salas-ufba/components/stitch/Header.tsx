import { useEffect } from "react";

export default function Header() {
  useEffect(() => {
    function updateDateTime() {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");

      const clockEl = document.getElementById("live-clock");
      const dateEl = document.getElementById("live-date");

      if (clockEl) clockEl.textContent = `${hours}:${minutes}`;

      if (dateEl) {
        const options: Intl.DateTimeFormatOptions = { weekday: "long", day: "numeric", month: "long" };
        const dateStr = now.toLocaleDateString("pt-BR", options);
        dateEl.textContent = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
      }
    }

    updateDateTime();
    const interval = setInterval(updateDateTime, 60000);

    return () => clearInterval(interval); // cleanup ao desmontar
  }, []);

  useEffect(() => {
    const filterBtns = document.querySelectorAll(".bg-secondary-container button");
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterBtns.forEach((b) => {
          b.classList.remove("bg-surface-container-lowest", "shadow-sm", "text-primary");
          b.classList.add("text-secondary");
        });
        btn.classList.add("bg-surface-container-lowest", "shadow-sm", "text-primary");
        btn.classList.remove("text-secondary");
      });
    });
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-surface dark:bg-background border-b border-outline-variant dark:border-outline flex justify-between items-center w-full px-container-padding py-4 h-[100px]">
      <div className="flex items-center gap-4">
        <div className="relative min-w-[180px]">
          <label className="absolute -top-2 left-2 px-1 bg-surface text-[10px] font-label-bold text-secondary uppercase">
            Campus
          </label>
          <select className="w-full bg-transparent border border-outline-variant rounded-lg px-3 py-2 text-body-sm font-body-sm focus:ring-2 focus:ring-primary outline-none appearance-none">
            <option>Federação</option>
            <option>Ondina</option>
            <option>Canela</option>
          </select>
          <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-secondary">
            expand_more
          </span>
        </div>

        <div className="relative min-w-[240px]">
          <label className="absolute -top-2 left-2 px-1 bg-surface text-[10px] font-label-bold text-secondary uppercase">
            Prédio
          </label>
          <select className="w-full bg-transparent border border-outline-variant rounded-lg px-3 py-2 text-body-sm font-body-sm focus:ring-2 focus:ring-primary outline-none appearance-none">
            <option>Instituto de Computação</option>
            <option>PAF I</option>
            <option>PAF II</option>
            <option>Escola Politécnica</option>
          </select>
          <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-secondary">
            expand_more
          </span>
        </div>

        <div className="h-8 w-px bg-outline-variant mx-2"></div>

        <div className="flex gap-4">
          <a className="text-on-primary-fixed-variant dark:text-on-primary-fixed border-b-2 border-primary dark:border-primary-fixed pb-1 font-label-bold" href="#">
            Hoje
          </a>
          <a className="text-secondary dark:text-secondary-fixed hover:text-primary transition-all font-label-bold" href="#">
            Semana
          </a>
          <a className="text-secondary dark:text-secondary-fixed hover:text-primary transition-all font-label-bold" href="#">
            Mês
          </a>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="text-right">
          <div
            className="font-display-lg text-[32px] leading-none font-bold text-primary tracking-tight"
            id="live-clock"
          >
            00:00
          </div>
          <div
            className="font-label-bold text-[10px] text-secondary uppercase tracking-widest mt-1"
            id="live-date"
          >
            Carregando...
          </div>
        </div>

        <div className="flex gap-2">
          <button className="p-2 hover:bg-secondary-container rounded-full transition-colors text-primary focus:ring-2 focus:ring-primary">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="p-2 hover:bg-secondary-container rounded-full transition-colors text-primary focus:ring-2 focus:ring-primary">
            <span className="material-symbols-outlined">schedule</span>
          </button>
        </div>
      </div>
    </header>
  );
}
