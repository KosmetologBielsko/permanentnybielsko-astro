import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import OpenAI from "openai";

const KNOWLEDGE_DIR = path.resolve(process.cwd(), "assistant-knowledge");
const VECTOR_STORE_NAME = "permanentnybielsko_pmu_knowledge_base";

const allowedExtensions = new Set([".md", ".txt", ".json"]);

function requireEnv(name) {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new Error(`Brakuje zmiennej środowiskowej: ${name}`);
  }
  return value;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getKnowledgeFiles() {
  if (!fs.existsSync(KNOWLEDGE_DIR)) {
    throw new Error(`Nie znaleziono folderu: ${KNOWLEDGE_DIR}`);
  }

  return fs
    .readdirSync(KNOWLEDGE_DIR)
    .filter((fileName) => allowedExtensions.has(path.extname(fileName).toLowerCase()))
    .map((fileName) => path.join(KNOWLEDGE_DIR, fileName));
}

async function waitForVectorFile(openai, vectorStoreId, vectorStoreFileId, label) {
  const maxAttempts = 40;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const file = await openai.vectorStores.files.retrieve(
      vectorStoreId,
      vectorStoreFileId
    );

    if (file.status === "completed") {
      console.log(`✅ Przetworzono: ${label}`);
      return;
    }

    if (file.status === "failed" || file.status === "cancelled") {
      throw new Error(`Nie udało się przetworzyć pliku ${label}. Status: ${file.status}`);
    }

    console.log(`⏳ Czekam na przetworzenie: ${label} (${file.status})`);
    await sleep(3000);
  }

  throw new Error(`Przekroczono czas oczekiwania na plik: ${label}`);
}

async function main() {
  requireEnv("OPENAI_API_KEY");

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const files = getKnowledgeFiles();

  if (files.length === 0) {
    throw new Error(
      "Folder assistant-knowledge jest pusty. Najpierw wklej tam pliki .md/.json z bazy wiedzy."
    );
  }

  console.log("Tworzę Vector Store...");
  const vectorStore = await openai.vectorStores.create({
    name: VECTOR_STORE_NAME,
  });

  console.log(`✅ Vector Store ID: ${vectorStore.id}`);
  console.log("");

  for (const filePath of files) {
    const fileName = path.basename(filePath);

    console.log(`Wgrywam plik: ${fileName}`);

    const uploadedFile = await openai.files.create({
      file: fs.createReadStream(filePath),
      purpose: "assistants",
    });

    const vectorStoreFile = await openai.vectorStores.files.create(
      vectorStore.id,
      {
        file_id: uploadedFile.id,
      }
    );

    await waitForVectorFile(
      openai,
      vectorStore.id,
      vectorStoreFile.id,
      fileName
    );
  }

  console.log("");
  console.log("========================================");
  console.log("GOTOWE ✅");
  console.log("Skopiuj ten identyfikator do Vercel i lokalnego .env:");
  console.log("");
  console.log(`OPENAI_VECTOR_STORE_ID=${vectorStore.id}`);
  console.log("");
  console.log("========================================");
}

main().catch((error) => {
  console.error("");
  console.error("BŁĄD ❌");
  console.error(error);
  process.exit(1);
});
