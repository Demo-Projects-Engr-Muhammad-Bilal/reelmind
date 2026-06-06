// apps/web/src/lib/dummyData.ts

export const DUMMY_USER = {
          // Isko true ya false kar ke check karna, Navbar automatically change ho jayega!
          isLoggedIn: false,

          name: "Bilal Khalid",
          email: "bilal@aireelgen.com",
          credits: 150,
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bilal",
          role: "pro" // 'free', 'pro', 'agency'
};


// apps/web/src/lib/dummyData.ts (Append this at the bottom)

export const PRICING_DATA = {
          costPerReel: 0.10,
          currency: "$",
          billingType: "Pay-As-You-Go"
};

export const VISUALIZER_DATA = {
          heights: [40, 75, 30, 90, 55, 80, 25, 65, 45, 85, 35, 60],
          durations: [1.2, 1.5, 1.1, 1.8, 1.4, 1.7, 1.3, 1.6, 1.9, 1.25, 1.55, 1.45]
};



// apps/web/src/lib/dummyData.ts (Append this at the bottom)

export const PRICING_PLANS = [
          {
                    id: "starter",
                    name: "Starter",
                    price: 10,
                    credits: 100,
                    features: ["Standard Render Priority", "Full API Access", "Community Support"],
                    isPopular: false,
                    buttonText: "Select Plan"
          },
          {
                    id: "creator",
                    name: "Creator",
                    price: 25,
                    credits: 300,
                    features: ["High Render Priority", "Custom Font Uploads", "Early Feature Access", "Email Support"],
                    isPopular: true,
                    buttonText: "Scale Up Now"
          },
          {
                    id: "agency",
                    name: "Agency",
                    price: 100,
                    credits: 1500,
                    features: ["Ultra-High Priority", "Whitelabel Options", "Dedicated Solutions Engineer"],
                    isPopular: false,
                    buttonText: "Contact Sales"
          }
];