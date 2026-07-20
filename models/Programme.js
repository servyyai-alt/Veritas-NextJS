import mongoose from "mongoose";

const RoleSchema = new mongoose.Schema({ role: String, desc: String }, { _id: false });
const ProjectSchema = new mongoose.Schema({ pnum: String, title: String, desc: String }, { _id: false });
const QuickStatSchema = new mongoose.Schema({ value: String, label: String }, { _id: false });
const SalarySchema = new mongoose.Schema({ level: String, amount: String }, { _id: false });
const FeeStepSchema = new mongoose.Schema({ stage: String, pct: String, amount: String, title: String, desc: String }, { _id: false });

const ProgrammeSchema = new mongoose.Schema(
  {
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
    hiringIndustries: [String],
    image: String,
    published: { type: Boolean, default: false },
    metaTitle: String,
    metaDesc: String,
  },
  { timestamps: true }
);

export default mongoose.models.Programme || mongoose.model("Programme", ProgrammeSchema);
