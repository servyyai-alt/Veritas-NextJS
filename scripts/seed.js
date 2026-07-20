const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

// Read .env.local manually (no dotenv dependency needed)
const envPath = path.join(__dirname, "..", ".env.local");
const envContent = fs.readFileSync(envPath, "utf8");
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eqIdx = trimmed.indexOf("=");
  if (eqIdx === -1) continue;
  const key = trimmed.slice(0, eqIdx).trim();
  const val = trimmed.slice(eqIdx + 1).trim();
  if (!process.env[key]) process.env[key] = val;
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI not found in .env.local");
  process.exit(1);
}

// Inline schemas (no TS, plain Mongoose)
const RoleSchema = new mongoose.Schema({ role: String, desc: String }, { _id: false });
const ProjectSchema = new mongoose.Schema({ pnum: String, title: String, desc: String }, { _id: false });
const QuickStatSchema = new mongoose.Schema({ value: String, label: String }, { _id: false });
const SalarySchema = new mongoose.Schema({ level: String, amount: String }, { _id: false });
const FeeStepSchema = new mongoose.Schema({ stage: String, pct: String, amount: String, title: String, desc: String }, { _id: false });

const ProgrammeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  domainCode: { type: String, required: true },
  tag: { type: String, default: "Programme" },
  sceneClass: { type: String, default: "s-auto" },
  description: String,
  shortDesc: String,
  lead: String,
  overview: String,
  quickStats: [QuickStatSchema],
  skills: [String],
  roles: [RoleSchema],
  projects: [ProjectSchema],
  feeTotal: String,
  feeSteps: [FeeStepSchema],
  salaryBands: [SalarySchema],
  image: String,
  published: { type: Boolean, default: false },
  metaTitle: String,
  metaDesc: String,
}, { timestamps: true });

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, default: "Careers" },
  excerpt: String,
  content: String,
  image: String,
  author: { type: String, default: "Veritas Team" },
  status: {
    type: String,
    enum: ["published", "draft", "coming_soon"],
    default: "draft",
  },
  scheduledAt: Date,
  publishedAt: Date,
  metaTitle: String,
  metaDesc: String,
  relatedSlugs: [String],
}, { timestamps: true });

const Programme = mongoose.models.Programme || mongoose.model("Programme", ProgrammeSchema);
const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);

const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true, default: "Admin" },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, default: "admin" },
}, { timestamps: true });
const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

// --- Static programme data ---
const PROGRAMMES = [
  { domainCode: "D-01", title: "Railway Engineering", shortDesc: "Signalling, rolling stock and rail systems.", sceneClass: "s-rail" },
  { domainCode: "D-02", title: "Semiconductor Manufacturing", shortDesc: "Fabrication, cleanroom and packaging.", sceneClass: "s-semi" },
  { domainCode: "D-03", title: "Robotics", shortDesc: "Industrial arms, work cells and programming.", sceneClass: "s-robot" },
  { domainCode: "D-04", title: "Mechatronics", shortDesc: "Integrated mechanical–electronic systems.", sceneClass: "s-auto" },
  { domainCode: "D-05", title: "Internet of Things (IoT)", shortDesc: "Sensors, connectivity and edge devices.", sceneClass: "s-iot" },
  { domainCode: "D-06", title: "Industrial Automation", shortDesc: "Control systems and production lines.", sceneClass: "s-auto" },
  { domainCode: "D-07", title: "PLC & SCADA", shortDesc: "Programming, HMI and supervisory control.", sceneClass: "s-auto" },
  { domainCode: "D-08", title: "Embedded Systems", shortDesc: "Firmware, microcontrollers, real-time.", sceneClass: "s-iot" },
  { domainCode: "D-09", title: "AI for Manufacturing", shortDesc: "Vision, optimisation and smart control.", sceneClass: "s-robot" },
  { domainCode: "D-10", title: "Electric Vehicles", shortDesc: "Powertrains, batteries and charging.", sceneClass: "s-ev" },
  { domainCode: "D-11", title: "Industry 4.0", shortDesc: "Connected, data-driven production.", sceneClass: "s-auto" },
  { domainCode: "D-12", title: "Smart Manufacturing", shortDesc: "Digitised, flexible factories.", sceneClass: "s-semi" },
  { domainCode: "D-13", title: "Machine Vision", shortDesc: "Automated inspection and guidance.", sceneClass: "s-iot" },
  { domainCode: "D-14", title: "Industrial Networking", shortDesc: "Protocols and plant connectivity.", sceneClass: "s-iot" },
  { domainCode: "D-15", title: "Digital Twin", shortDesc: "Simulation and virtual commissioning.", sceneClass: "s-auto" },
  { domainCode: "D-16", title: "Industrial Cybersecurity", shortDesc: "Securing connected operations.", sceneClass: "s-robot" },
  { domainCode: "D-17", title: "Renewable Energy Systems", shortDesc: "Solar, wind and energy integration.", sceneClass: "s-ev" },
  { domainCode: "D-18", title: "Predictive Maintenance", shortDesc: "Condition monitoring and analytics.", sceneClass: "s-auto" },
  { domainCode: "D-19", title: "Quality Engineering", shortDesc: "Standards, inspection and control.", sceneClass: "s-semi" },
  { domainCode: "D-20", title: "Manufacturing Excellence", shortDesc: "Lean, Six Sigma and operations.", sceneClass: "s-rail" },
  { domainCode: "D-21", title: "Industrial Data Analytics", shortDesc: "Turning machine data into insight.", sceneClass: "s-iot" },
  { domainCode: "D-22", title: "Advanced Manufacturing", shortDesc: "Additive and next-gen processes.", sceneClass: "s-robot" },
];

// --- Static blog data ---
const BLOGS = [
  {
    slug: "degree-no-job",
    category: "Careers",
    title: "Your engineering degree didn't get you a job. Here's why — and what does.",
    excerpt: "The gap between a qualification and a hire, and the practical moves that actually lead to an offer.",
    author: "Veritas Team",
    status: "published",
    publishedAt: new Date("2026-06-15"),
    metaTitle: "Your engineering degree didn't get you a job. Here's why — and what does. — Veritas by IQgrads",
    metaDesc: "Why so many graduates struggle to get hired, and the practical steps that actually lead to a job in advanced industries.",
    relatedSlugs: ["automation-roles-india"],
    content: `<p className="lead">If you finished your engineering degree and the job offers never came, you've probably started to wonder whether the problem is you. It almost certainly isn't. The problem is a gap nobody warned you about — and it's fixable.</p>
<p>Here's the uncomfortable truth most colleges won't tell you: a degree proves you can pass exams. It rarely proves you can do the job. Employers in advanced industries don't hire marks — they hire people who can walk in and be useful. And "useful" means hands-on, specific, demonstrable skill.</p>
<h2>Why the gap exists</h2>
<p>Most engineering education in India is heavy on theory and light on practice. You may have studied control systems without ever programming a real PLC, or learned circuit theory without wiring a working board. That's not your fault — it's how the system is built. But it leaves you in a frustrating catch-22: every job wants experience, and no one will give you the experience.</p>
<h2>What actually closes it</h2>
<p>Three things move you from "unhireable" to "interview-ready", and none of them require another degree:</p>
<ul>
<li><b>Hands-on skill on real equipment.</b> Not simulations — the actual tools and machines an employer uses.</li>
<li><b>Proof you can show.</b> Projects you built, that you can talk through and demonstrate in an interview.</li>
<li><b>The right standard.</b> Learning aligned to a benchmark employers already recognise, so your skills are taken seriously.</li>
</ul>
<blockquote>Your degree gets your CV opened. Demonstrable skill gets you hired.</blockquote>
<h2>Where to start</h2>
<p>Pick one industry that's genuinely hiring — automation, robotics, EV, semiconductors — and go deep, hands-on, fast. Build a small portfolio of real work. Practise explaining it. That combination is what turns a stalled job search around, far more reliably than sending out another hundred applications.</p>`,
  },
  {
    slug: "automation-roles-india",
    category: "Industry",
    title: "Industrial automation in India: the roles companies are actually hiring for",
    excerpt: "A plain-English guide to entry-level automation roles and the skills behind each one.",
    author: "Veritas Team",
    status: "published",
    publishedAt: new Date("2026-06-22"),
    metaTitle: "Industrial automation in India: the roles companies are actually hiring for — Veritas by IQgrads",
    metaDesc: "The real entry-level roles in industrial automation, what each involves, and the skills employers look for.",
    relatedSlugs: ["degree-no-job"],
    content: `<p className="lead">"Industrial automation" sounds like one job. It's actually a family of roles — and knowing which one fits you is the first step to getting hired. Here's a plain-English map.</p>
<p>As Indian factories modernise, they need people who can set up, program and maintain the systems that run production lines. Demand is real and spread across automotive, FMCG, pharma, electronics and energy. These are the entry points worth knowing.</p>
<h2>The core roles</h2>
<h3>Automation Engineer</h3>
<p>The all-rounder. You design, program and commission the control systems that run a line — PLCs, drives, sensors and the logic that ties them together. Strong starting point if you like solving problems end to end.</p>
<h3>PLC Programmer</h3>
<p>You write and maintain the ladder logic that tells machines what to do. Detail-oriented, logical work that's in steady demand wherever production lines run.</p>
<h3>SCADA / HMI Engineer</h3>
<p>You build the screens and supervisory systems operators use to monitor and control a plant. A good fit if you like the software-meets-hardware side.</p>
<h3>Control Systems / Maintenance Technician</h3>
<p>You install, calibrate and troubleshoot equipment on the floor. Hands-on, practical, and often the fastest route into a plant.</p>
<h2>What employers look for</h2>
<ul>
<li>Genuine hands-on familiarity with real controllers and instrumentation — not just theory.</li>
<li>A project or two you can demonstrate.</li>
<li>Electrical safety awareness and the ability to read wiring and process diagrams.</li>
<li>Clear communication — you'll work alongside operators and engineers.</li>
</ul>
<blockquote>You don't need to know everything. You need to be genuinely useful at one role from day one.</blockquote>`,
  },
];

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function seed() {
  console.log("Connecting to MongoDB Atlas…");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected.\n");

  // Seed programmes
  let inserted = 0;
  let skipped = 0;
  for (const p of PROGRAMMES) {
    const slug = slugify(p.title);
    const exists = await Programme.findOne({ slug });
    if (exists) { skipped++; continue; }
    await Programme.create({
      ...p,
      slug,
      published: true,
      description: p.shortDesc,
      lead: p.shortDesc,
    });
    inserted++;
    console.log(`  + ${p.domainCode} ${p.title}`);
  }
  console.log(`\nProgrammes: ${inserted} inserted, ${skipped} already existed.\n`);

  // Seed blogs
  let blogInserted = 0;
  let blogSkipped = 0;
  for (const b of BLOGS) {
    const exists = await Blog.findOne({ slug: b.slug });
    if (exists) { blogSkipped++; continue; }
    await Blog.create(b);
    blogInserted++;
    console.log(`  + ${b.slug}`);
  }
  console.log(`\nBlogs: ${blogInserted} inserted, ${blogSkipped} already existed.\n`);

  // Seed admin
  const adminEmail = process.env.ADMIN_EMAIL || "admin@veritas.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";
  const existingAdmin = await Admin.findOne({ email: adminEmail.toLowerCase() });
  if (existingAdmin) {
    console.log(`Admin (${adminEmail}) already exists — skipped.\n`);
  } else {
    const hashed = await bcrypt.hash(adminPassword, 12);
    await Admin.create({
      name: "Admin",
      email: adminEmail.toLowerCase(),
      password: hashed,
      role: "admin",
    });
    console.log(`Admin seeded: ${adminEmail} / ${adminPassword}\n`);
  }

  await mongoose.disconnect();
  console.log("Done. Disconnected.");
}

seed().catch((err) => { console.error(err); process.exit(1); });
