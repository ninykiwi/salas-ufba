import * as path from 'path';
import * as dotenv from 'dotenv';

// Executado a partir de services/auth-service (cwd), aponta pro .env da raiz do projeto
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

import { PrismaClient, Role } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

// Mesma regex de src/common/validators/is-strong-password.validator.ts
const STRONG_PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#.\-_])[A-Za-z\d@$!%*?&#.\-_]{8,}$/;

function parseArgs(argv: string[]): Record<string, string> {
  const args: Record<string, string> = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith('--')) {
      args[arg.slice(2)] = argv[i + 1];
      i++;
    }
  }
  return args;
}

async function main() {
  const { name, email, password } = parseArgs(process.argv.slice(2));

  if (!name || !email || !password) {
    console.error(
      'Uso: npx ts-node scripts/create-superadmin.ts --name "Nome" --email "email@ufba.br" --password "SenhaForte123!"',
    );
    process.exit(1);
  }

  if (!STRONG_PASSWORD_REGEX.test(password)) {
    console.error(
      'A senha não atende aos requisitos de complexidade: mínimo de 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial.',
    );
    process.exit(1);
  }

  if (!process.env.DATABASE_URL) {
    console.error(
      'DATABASE_URL não definida — verifique o .env na raiz do projeto.',
    );
    process.exit(1);
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      console.error(`Já existe um usuário cadastrado com o e-mail ${email}.`);
      process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: Role.SUPERADMIN,
      },
    });

    console.log(`SUPERADMIN criado com sucesso: ${user.email} (id: ${user.id})`);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((error) => {
  console.error('Erro ao criar SUPERADMIN:', error);
  process.exit(1);
});
