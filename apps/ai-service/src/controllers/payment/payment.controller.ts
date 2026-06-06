import { Request, Response } from "express";
import { verifyAndProcessWebhook, generateCheckoutSession } from "../../services/payment.service.js";
import { prisma } from "@aireelgen/database";


// ⚡ Endpoint: GET /api/v1/payments/packages
export const getCreditPackages = async (req: Request, res: Response) => {
          try {
                    const packages = await prisma.creditPackage.findMany({
                              orderBy: { priceUSD: 'asc' } // Saste se mehenga sort karega (Starter -> Pro -> Agency)
                    });
                    res.status(200).json({ success: true, data: packages });
          } catch (error: any) {
                    console.error("Fetch Packages Error:", error);
                    res.status(500).json({ success: false, message: error.message });
          }
};

// ⚡ Endpoint: POST /api/v1/payments/webhook
export const handleStripeWebhook = async (req: Request, res: Response) => {
          const sig = req.headers['stripe-signature'] as string;

          try {
                    await verifyAndProcessWebhook(req.body, sig);
                    res.status(200).json({ received: true });
          } catch (err: any) {
                    console.error(`Webhook Error: ${err.message}`);
                    res.status(400).send(`Webhook Error: ${err.message}`);
          }
};

// ⚡ Endpoint: POST /api/v1/payments/create-checkout
export const createCheckout = async (req: Request, res: Response) => {
          try {
                    const { userId, planId } = req.body;

                    if (!userId || !planId) {
                              return res.status(400).json({ success: false, message: "User ID and Plan ID are required." });
                    }

                    const url = await generateCheckoutSession(userId, planId);
                    res.status(200).json({ success: true, url });
          } catch (error: any) {
                    console.error("Checkout Error:", error);
                    res.status(500).json({ success: false, message: error.message });
          }
};