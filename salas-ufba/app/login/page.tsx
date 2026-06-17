"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { User, Lock, LogIn, ShieldCheck, Globe } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepConnected, setKeepConnected] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex w-full max-w-4xl min-h-[600px]">

        <div className="flex flex-col justify-between w-1/2 px-12 py-10">
          <div>
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                <Image src="/ufba-logo.png" alt="UFBA" width={28} height={28} className="object-contain" />
              </div>
              <div>
                <p className="font-bold text-indigo-900 text-sm leading-tight">Salas UFBA 2.0</p>
                <p className="text-xs text-gray-400">Instituto de Computação</p>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-1">Acesso Restrito</h1>
            <p className="text-sm text-gray-500 mb-8">
              Identifique-se para gerenciar salas e horários acadêmicos.
            </p>

            <div className="flex flex-col gap-5">
              <div>
                <label className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-1.5 block">
                  E-mail ou SIAPE
                </label>
                <div className="flex items-center gap-2 border border-gray-300 rounded-sm px-3 py-2.5">
                  <User size={15} className="text-gray-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Ex: docente@ufba.br ou 1234567"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="text-sm text-gray-700 placeholder-gray-300 outline-none w-full"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-widest">
                    Senha
                  </label>
                </div>
                <div className="flex items-center gap-2 border border-gray-300 rounded-sm px-3 py-2.5">
                  <Lock size={15} className="text-gray-400 shrink-0" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="text-sm text-gray-700 placeholder-gray-300 outline-none w-full"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={keepConnected}
                  onChange={(e) => setKeepConnected(e.target.checked)}
                  className="w-4 h-4 accent-indigo-900"
                />
                <span className="text-sm text-gray-600">Manter conectado neste dispositivo</span>
              </label>

              <button className="flex items-center justify-center gap-2 w-full bg-[#000666] hover:bg-[#333784] text-white font-bold text-sm py-3.5 rounded-lg transition-colors">
                LOGIN
                <LogIn size={16} />
              </button>
            </div>

            <div className="border-t border-gray-200 mt-6 pt-6 text-center">
              <p className="text-sm text-gray-500">
                Problemas com acesso?{" "}
                <Link href="#" className="text-indigo-600 font-semibold hover:underline">
                  Entre em contato com a STI
                </Link>
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-6">
            <p className="text-xs text-gray-400">© 2026 Universidade Federal da Bahia</p>
            <div className="flex items-center gap-3 text-gray-400">
              <ShieldCheck size={16} />
              <Globe size={16} />
            </div>
          </div>
        </div>

        <div className="relative w-1/2">
          <Image
            src="/ufba-campus.jpg"
            alt="Campus UFBA"
            fill
            className="object-cover"
          />
          <div className="absolute bottom-6 left-6 right-6 bg-white/20 backdrop-blur-md rounded-xl p-5 text-white">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck size={14} />
              <span className="text-xs font-bold uppercase tracking-widest">Sistema Integrado</span>
            </div>
            <h2 className="text-lg font-bold mb-1">Gestão Inteligente de Espaços</h2>
            <p className="text-xs leading-relaxed text-white/80">
              O Salas UFBA 2.0 unifica o agendamento de laboratórios, auditórios e salas de aula,
              garantindo que o Instituto de Computação opere com máxima eficiência acadêmica.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}