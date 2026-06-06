// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedAdmin() {
          console.log('⏳ Starting admin seeding...');

          const plainPassword = '12qa!@QA';
          const hashedPassword = await bcrypt.hash(plainPassword, 10);

          const admin = await prisma.admin.upsert({
                    where: { email: 'mb3089758@gmail.com' },
                    update: {},
                    create: {
                              email: 'mb3089758@gmail.com',
                              password: hashedPassword,
                              name: 'System Commander',
                              role: 'SUPER_ADMIN',
                    },
          });

          console.log(`✅ Admin created successfully with email: ${admin.email}`);
}

seedAdmin()
          .then(() => {
                    console.log('🌱 Seeding finished.');
          })
          .catch((e) => {
                    console.error('❌ Error seeding database:', e);
          })
          .finally(async () => {
                    await prisma.$disconnect();
          });
