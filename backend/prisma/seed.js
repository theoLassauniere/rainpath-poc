const fs = require('node:fs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const SEED_FILE = process.env.SEED_FILE || '/seed/example-workflow.json';

async function main() {
  const count = await prisma.workflow.count();
  if (count > 0) {
    console.log(`Seed ignore : ${count} workflow(s) deja present(s).`);
    return;
  }
  if (!fs.existsSync(SEED_FILE)) {
    console.log(`Seed ignore : fichier ${SEED_FILE} introuvable.`);
    return;
  }

  const wf = JSON.parse(fs.readFileSync(SEED_FILE, 'utf-8'));
  await prisma.workflow.create({
    data: {
      name: wf.name,
      description: wf.description ?? null,
      status: wf.status ?? 'DRAFT',
      nodes: JSON.stringify(wf.nodes ?? []),
      edges: JSON.stringify(wf.edges ?? []),
    },
  });
  console.log(`Workflow d'exemple "${wf.name}" insere.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
