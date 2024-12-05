import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.speechProvider.createMany({
    data: [{ name: 'Deepgram' }, { name: 'Play.ai' }],
  });

  const deepgramVoices = [
    {
      name: 'Athena',
      voiceId: 'aura-athena-en',
      providerId: 1,
    },
  ];

  const playaiVoices = [
    {
      name: 'Aurora',
      voiceId: 's3://voice-cloning-zero-shot/5b81dc4c-bf98-469d-96b4-8f09836fb500/aurorasaad/manifest.json',
      providerId: 2,
    },
    {
      name: 'Autumn',
      voiceId: 's3://voice-cloning-zero-shot/ff414883-0e32-4a92-a688-d7875922120d/original/manifest.json',
      providerId: 2,
    },
    {
      name: 'Nova',
      voiceId: 's3://voice-cloning-zero-shot/2a7ddfc5-d16a-423a-9441-5b13290998b8/novasaad/manifest.json',
      providerId: 2,
    },
  ];

  await prisma.speechProviderVoice.createMany({
    data: [...playaiVoices, ...deepgramVoices],
  });

  await prisma.speechProfile.createMany({
    data: [
      { name: 'Autumn', providerId: 2, voiceId: 2, speed: 0.8 },
      { name: 'Nova', providerId: 2, voiceId: 3, speed: 0.8 },
    ],
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
