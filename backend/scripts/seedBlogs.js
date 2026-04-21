const mongoose = require("mongoose");
const dns = require("node:dns/promises");
const Blog = require("../src/models/Blog");
const Website = require("../src/models/Website");
const User = require("../src/models/User");
require("dotenv").config();

dns.setServers(["1.1.1.1"]);

const seedBlogs = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for blog seeding...");

    // Find a tenant
    const website = await Website.findOne();
    const user = await User.findOne();

    if (!website || !user) {
      console.log("Tenant or User not found. Run product seeder first.");
      process.exit(1);
    }

    // Clear existing blogs for this tenant (Optional)
    await Blog.deleteMany({ website_id: website._id });

    const dummyBlogs = [
      {
        title: "The Ultimate Guide to Reconditioned Engines: What You Need to Know",
        slug: "ultimate-guide-reconditioned-engines",
        excerpt: "Discover the critical differences between new, used, and reconditioned engines, and why a 'recon' might be your best investment.",
        content: `
          <p>Choosing a reconditioned engine can be a daunting task, but it’s often the most cost-effective way to get your vehicle back on the road without the price tag of a factory-new unit.</p>
          <h3>What is a Reconditioned Engine?</h3>
          <p>Unlike a simple "used" engine, a reconditioned unit has been stripped down, cleaned, and inspected. Worn parts like gaskets, bearings, and rings are replaced with new components. The result is an engine that performs almost as well as a new one.</p>
          <blockquote>"A reconditioned engine isn't just repaired; it's renewed."</blockquote>
          <h3>Benefits of Reconditioning</h3>
          <ul>
            <li><strong>Cost Savings:</strong> Up to 50% cheaper than new engines.</li>
            <li><strong>Sustainability:</strong> Reusing the core block reduces industrial waste.</li>
            <li><strong>Reliability:</strong> Most recon engines come with comprehensive warranties.</li>
          </ul>
        `,
        author: "John Mechanic",
        category: "Maintenance",
        image: "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&q=80&w=1000",
        date: "April 20, 2024",
        website_id: website._id,
        createdBy: user._id
      },
      {
        title: "How to Spot a Failing Turbocharger Before It Destroys Your Engine",
        slug: "spot-failing-turbocharger",
        excerpt: "Don't ignore the whine! Learn the 5 early warning signs of turbo failure and save thousands in repair bills.",
        content: `
          <p>Turbochargers are incredible pieces of engineering, but they operate under extreme heat and pressure. When they fail, it can be catastrophic for the rest of the engine.</p>
          <h3>Early Warning Signs</h3>
          <p>1. <strong>Blue/Grey Smoke:</strong> This indicates oil is leaking into the exhaust system through a failing seal.</p>
          <p>2. <strong>Power Loss:</strong> If your car feels sluggish or won't reach its usual top speed, the turbo might not be spooling correctly.</p>
          <p>3. <strong>Siren-like Noise:</strong> A loud whistling or whining sound is often the first sign of a physical problem with the turbo blades or bearings.</p>
        `,
        author: "Sarah Turbo",
        category: "Repair Guides",
        image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1000",
        date: "April 18, 2024",
        website_id: website._id,
        createdBy: user._id
      },
      {
        title: "Transmission Troubles: Is It Time for a Gearbox Swap?",
        slug: "transmission-troubles-gearbox-swap",
        excerpt: "Grinding gears and slipping clutches? We break down when to repair and when it’s cheaper to replace your transmission.",
        content: `
          <p>Transmission issues are among the most expensive repairs a car owner can face. Understanding whether to fix your current box or buy a reconditioned one is key to saving money.</p>
          <h3>Common Problems</h3>
          <p>If you experience delayed engagement or "slipping" where the RPMs rise but the car doesn't speed up, your clutch packs or torque converter may be failing.</p>
        `,
        author: "Mike Gear",
        category: "Technical",
        image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80&w=1000",
        date: "April 15, 2024",
        website_id: website._id,
        createdBy: user._id
      }
    ];

    await Blog.insertMany(dummyBlogs);
    console.log(`Seeded ${dummyBlogs.length} blog posts!`);

    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedBlogs();
