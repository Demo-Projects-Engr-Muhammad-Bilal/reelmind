import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
          apiVersion: '2026-05-27.dahlia', 
});


export const verifyAndProcessWebhook = async (rawBody: Buffer | string, signature: string) => {
          const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;
          const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);

          if (event.type === 'checkout.session.completed') {
                    const session = event.data.object as Stripe.Checkout.Session;
                    const userId = session.metadata?.userId;
                    const creditsToAward = parseInt(session.metadata?.credits || '0', 10);

                    if (userId && creditsToAward) {
                              await prisma.user.update({
                                        where: { id: userId },
                                        data: { credits: { increment: creditsToAward } }
                              });
                              console.log(`✅ Success: Added ${creditsToAward} credits to User ${userId}`);
                    }
          }
          return true;
};


export const generateCheckoutSession = async (userId: string, planId: string) => {

          // 🔍 Database Lookup: Frontend ne jo planId bheja hai usay DB mein dhoondo
          const selectedPlan = await prisma.creditPackage.findUnique({
                    where: { planId: planId }
          });

          // Agar plan ghalat hai ya DB mein nahi hai tou request reject kar do
          if (!selectedPlan) {
                    throw new Error("Invalid plan selected or plan does not exist.");
          }

          const session = await stripe.checkout.sessions.create({
                    payment_method_types: ['card'],
                    mode: 'payment',
                    line_items: [{
                              price_data: {
                                        currency: 'usd',
                                        product_data: {
                                                  name: selectedPlan.name,
                                                  description: `${selectedPlan.credits} ReelMind Credits for AI Video Generation.`,
                                        },
                                        // ⚡ DB se price la kar cents mein convert karna zaroori hai
                                        unit_amount: Math.round(selectedPlan.priceUSD * 100),
                              },
                              quantity: 1,
                    }],
                    metadata: {
                              userId: userId,
                              credits: selectedPlan.credits.toString(),
                    },
                    success_url: `${process.env.FRONTEND_URL}/dashboard?payment=success`,
                    cancel_url: `${process.env.FRONTEND_URL}/pricing?payment=cancelled`,
          });

          return session.url;
};