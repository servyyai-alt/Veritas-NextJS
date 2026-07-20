const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

const envPath = path.resolve(__dirname, "../.env.local");
const envRaw = fs.readFileSync(envPath, "utf8");
for (const line of envRaw.split("\n")) {
  const m = line.match(/^([A-Z_]+)=(.+)/);
  if (m) process.env[m[1]] = m[2].trim();
}
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error("No MONGODB_URI in .env.local"); process.exit(1); }

const ProgrammeSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const AdminSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const Programme = mongoose.models.Programme || mongoose.model("Programme", ProgrammeSchema);
const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

const FULL_PROGRAMMES = [
  // ──────────────────────────────────────────────
  // D-01 Railway Engineering
  // ──────────────────────────────────────────────
  {
    title: "Railway Engineering",
    slug: "railway-engineering",
    domainCode: "D-01",
    tag: "Programme",
    sceneClass: "s-rail",
    shortDesc: "Signalling, rolling stock and rail systems.",
    lead: "India's rail network is one of the largest in the world and is being rapidly modernised. This programme builds the skills to work with signalling systems, rolling stock maintenance, track infrastructure and safety-critical rail electronics.",
    overview: "Railway engineering spans signalling and telecommunication systems, traction and rolling stock, track geometry and maintenance, and safety-critical SCADA and interlocking. With dedicated freight corridors, metro expansions and high-speed rail projects underway across India, the demand for skilled rail engineers is at an all-time high. This programme gives you the practical foundation to enter the rail industry with confidence.",
    quickStats: [
      { value: "5–6 mo", label: "Duration" },
      { value: "Graduate", label: "Entry level" },
      { value: "On-campus", label: "Format" },
      { value: "Pearson", label: "Standard" },
    ],
    skills: [
      "Railway signalling principles",
      "Point and interlocking circuits",
      "Rolling stock mechanical systems",
      "Traction motor and power electronics",
      "Track geometry and maintenance",
      "SCADA for rail networks",
      "Railway safety and standards",
      "Axle counter and track circuit diagnostics",
    ],
    roles: [
      { role: "Signalling Technician", desc: "Installs, tests and maintains signalling equipment including point machines, track circuits and colour light signals." },
      { role: "Rolling Stock Technician", desc: "Performs mechanical and electrical maintenance on coaches, locomotives and EMU rakes." },
      { role: "Rail Infrastructure Engineer", desc: "Monitors track geometry, oversees tamping and ballast work, and manages asset health." },
      { role: "Telecom / SCADA Operator", desc: "Manages fibre-optic and radio communication networks across rail corridors and monitors power distribution SCADA." },
    ],
    projects: [
      { pnum: "PRJ-01", title: "Interlocking Logic Simulation", desc: "Build a simulated interlocking panel with point and signal logic for a six-station section using relay logic and truth tables." },
      { pnum: "PRJ-02", title: "Track Circuit Fault Diagnosis", desc: "Set up an axle counter bench and diagnose common fault scenarios — short circuits, broken rails and insulation failures." },
      { pnum: "PRJ-03", title: "Traction Motor Test Bench", desc: "Assemble and test a small DC traction motor drive, measuring torque curves, armature current and thermal behaviour under load." },
    ],
    feeTotal: "₹1,35,000",
    feeSteps: [
      { stage: "Stage 1", pct: "50%", amount: "₹67,500", title: "At enrolment", desc: "Paid upfront to secure your place before the programme starts." },
      { stage: "Stage 2", pct: "50%", amount: "₹67,500", title: "On offer or certification", desc: "Paid when you receive a job offer or complete certification." },
    ],
    salaryBands: [
      { level: "Entry (0–2 yr)", amount: "₹3–5 LPA" },
      { level: "Mid (3–5 yr)", amount: "₹6–10 LPA" },
      { level: "Senior (5+ yr)", amount: "₹12–20 LPA" },
    ],
    published: true,
    metaTitle: "Railway Engineering Programme — Veritas by IQgrads",
    metaDesc: "Hands-on railway engineering programme covering signalling, rolling stock, track infrastructure and safety-critical rail systems. Pearson-standard training.",
  },

  // ──────────────────────────────────────────────
  // D-02 Semiconductor Manufacturing
  // ──────────────────────────────────────────────
  {
    title: "Semiconductor Manufacturing",
    slug: "semiconductor-manufacturing",
    domainCode: "D-02",
    tag: "Programme",
    sceneClass: "s-semi",
    shortDesc: "Fabrication, cleanroom and packaging.",
    lead: "Semiconductors power everything from phones to satellites. This programme covers fabrication processes, cleanroom operations and advanced packaging — the skills India's growing chip ecosystem needs.",
    overview: "India is investing heavily in semiconductor fabrication and OSAT facilities. The industry demands technicians who understand lithography, etching, deposition, cleanroom protocols and back-end packaging. This programme provides the process-level knowledge and hands-on skills to work in fab lines, test floors and packaging units with precision and discipline.",
    quickStats: [
      { value: "5–6 mo", label: "Duration" },
      { value: "Graduate", label: "Entry level" },
      { value: "On-campus", label: "Format" },
      { value: "Pearson", label: "Standard" },
    ],
    skills: [
      "Cleanroom protocols and contamination control",
      "Photolithography process steps",
      "Thin film deposition (CVD, PVD)",
      "Etching techniques (wet and dry)",
      "Semiconductor packaging and bonding",
      "Wafer-level testing and yield analysis",
      "Metrology and inspection tools",
      "ESD handling and safety",
    ],
    roles: [
      { role: "Process Technician", desc: "Operates and monitors lithography, etching and deposition equipment in a fabrication line." },
      { role: "Cleanroom Operator", desc: "Manages gowning protocols, particle monitoring and environmental controls in ISO-class cleanrooms." },
      { role: "Packaging / Assembly Technician", desc: "Handles wire bonding, die attach, moulding and final test in OSAT or backend facilities." },
      { role: "Metrology / QA Technician", desc: "Runs inspection tools — SEM, profilometer, ellipsometer — and logs measurements for yield tracking." },
    ],
    projects: [
      { pnum: "PRJ-01", title: "Cleanroom Protocol Drill", desc: "Simulate a Class 1000 cleanroom entry, gowning sequence and particle count verification using handheld counters." },
      { pnum: "PRJ-02", title: "Lithography Process Sequence", desc: "Map out a full lithography sequence on paper — resist coat, soft bake, expose, develop, hard bake — with defect analysis." },
      { pnum: "PRJ-03", title: "Die Bond and Wire Bond Lab", desc: "Practice die attach and wire bonding on a training board, then run continuity and pull tests." },
    ],
    feeTotal: "₹1,40,000",
    feeSteps: [
      { stage: "Stage 1", pct: "50%", amount: "₹70,000", title: "At enrolment", desc: "Paid upfront to secure your place." },
      { stage: "Stage 2", pct: "50%", amount: "₹70,000", title: "On offer or certification", desc: "Paid upon job offer or certification completion." },
    ],
    salaryBands: [
      { level: "Entry (0–2 yr)", amount: "₹3.5–6 LPA" },
      { level: "Mid (3–5 yr)", amount: "₹7–12 LPA" },
      { level: "Senior (5+ yr)", amount: "₹14–22 LPA" },
    ],
    published: true,
    metaTitle: "Semiconductor Manufacturing Programme — Veritas by IQgrads",
    metaDesc: "Learn semiconductor fabrication, cleanroom operations, lithography and packaging. Hands-on training aligned to India's growing chip ecosystem.",
  },

  // ──────────────────────────────────────────────
  // D-03 Robotics
  // ──────────────────────────────────────────────
  {
    title: "Robotics",
    slug: "robotics",
    domainCode: "D-03",
    tag: "Programme",
    sceneClass: "s-robot",
    shortDesc: "Industrial arms, work cells and programming.",
    lead: "Robotic arms assemble, weld and pick-and-place on factory floors worldwide. This programme teaches you to program, commission and maintain industrial robots and integrated work cells.",
    overview: "Industrial robotics is one of the fastest-growing segments in Indian manufacturing. Automotive, electronics, food and pharma lines all depend on articulated robots, SCARA arms and collaborative robots (cobots). This programme builds skills in robot programming, end-effector design, cell layout, safety integration and vision-guided applications — exactly what systems integrators and OEMs hire for.",
    quickStats: [
      { value: "5–6 mo", label: "Duration" },
      { value: "Graduate", label: "Entry level" },
      { value: "On-campus", label: "Format" },
      { value: "Pearson", label: "Standard" },
    ],
    skills: [
      "Industrial robot programming (teach pendant and offline)",
      "Robot kinematics and coordinate systems",
      "End-effector and gripper design",
      "Work cell layout and safety fencing",
      "Collaborative robot (cobot) integration",
      "Vision-guided pick and place",
      "PLC–robot communication (I/O and fieldbus)",
      "Preventive maintenance of robotic systems",
    ],
    roles: [
      { role: "Robot Programmer", desc: "Writes and调试 robot programs — point-to-point, continuous path and logic — for welding, palletising and assembly." },
      { role: "Robot Technician", desc: "Performs mechanical and electrical maintenance, tool changes, calibration and troubleshooting on production robots." },
      { role: "Cell Integration Engineer", desc: "Designs and commissions robotic work cells including conveyors, sensors, safety interlocks and PLC handshakes." },
      { role: "Vision Systems Technician", desc: "Configures and maintains 2D/3D vision systems for part location, inspection and quality checks on robotic lines." },
    ],
    projects: [
      { pnum: "PRJ-01", title: "Pick-and-Place Program", desc: "Program a 6-axis robot arm to pick parts from a conveyor, orient them and place into a tray using teach pendant commands." },
      { pnum: "PRJ-02", title: "Cobot Safety Cell", desc: "Design and wire a collaborative robot cell with safety scanners, light curtains and reduced-speed zones for human-robot co-working." },
      { pnum: "PRJ-03", title: "Vision-Guided Bin Picking", desc: "Set up a camera, calibrate coordinates and program a robot to pick randomly oriented parts from a bin using vision feedback." },
    ],
    feeTotal: "₹1,45,000",
    feeSteps: [
      { stage: "Stage 1", pct: "50%", amount: "₹72,500", title: "At enrolment", desc: "Paid upfront to secure your place." },
      { stage: "Stage 2", pct: "50%", amount: "₹72,500", title: "On offer or certification", desc: "Paid upon job offer or certification completion." },
    ],
    salaryBands: [
      { level: "Entry (0–2 yr)", amount: "₹3.5–6 LPA" },
      { level: "Mid (3–5 yr)", amount: "₹7–12 LPA" },
      { level: "Senior (5+ yr)", amount: "₹14–24 LPA" },
    ],
    published: true,
    metaTitle: "Robotics Programme — Veritas by IQgrads",
    metaDesc: "Hands-on industrial robotics training — robot programming, work cells, cobots and vision systems. Pearson-standard programme.",
  },

  // ──────────────────────────────────────────────
  // D-04 Mechatronics
  // ──────────────────────────────────────────────
  {
    title: "Mechatronics",
    slug: "mechatronics",
    domainCode: "D-04",
    tag: "Programme",
    sceneClass: "s-auto",
    shortDesc: "Integrated mechanical–electronic systems.",
    lead: "Mechatronics sits at the intersection of mechanics, electronics and control. This programme gives you the ability to design, build and troubleshoot smart electromechanical systems used in modern factories.",
    overview: "Mechatronics engineers are the bridge between mechanical hardware and electronic control. They design assemblies that integrate motors, sensors, actuators and microcontrollers into a single functioning system. With Indian manufacturing shifting towards smart, automated production, mechatronics skills are in demand across automotive, consumer electronics, aerospace and white goods industries.",
    quickStats: [
      { value: "5–6 mo", label: "Duration" },
      { value: "Graduate", label: "Entry level" },
      { value: "On-campus", label: "Format" },
      { value: "Pearson", label: "Standard" },
    ],
    skills: [
      "Electromechanical system design",
      "Motor drives and actuator control",
      "Sensor integration and signal conditioning",
      "Microcontroller programming (Arduino / STM32)",
      "Basic pneumatics and hydraulics",
      "CAD for mechanical assemblies",
      "PCB design and soldering",
      "System-level troubleshooting",
    ],
    roles: [
      { role: "Mechatronics Technician", desc: "Assembles, tests and maintains electromechanical systems combining mechanical, electrical and electronic components." },
      { role: "Assembly Line Engineer", desc: "Designs and optimises production fixtures, jigs and automated assembly stations." },
      { role: "Product Development Technician", desc: "Builds and tests prototypes, runs endurance and functional tests, and iterates on designs." },
      { role: "Maintenance Technician (Automated Lines)", desc: "Troubleshoots and repairs mechatronic assemblies on production lines — motors, actuators, sensors and controllers." },
    ],
    projects: [
      { pnum: "PRJ-01", title: "Servo Positioning System", desc: "Build a closed-loop servo system using a microcontroller, encoder and DC motor. Implement PID control and tune for step response." },
      { pnum: "PRJ-02", title: "Pneumatic Sorting Station", desc: "Design and build a pneumatic sorting station with sensors that detects part colour or material and diverts it to the correct lane." },
      { pnum: "PRJ-03", title: "Smart Actuator Module", desc: "Integrate a stepper motor, limit switches and an LCD display into a single module controlled via serial commands from a PC." },
    ],
    feeTotal: "₹1,30,000",
    feeSteps: [
      { stage: "Stage 1", pct: "50%", amount: "₹65,000", title: "At enrolment", desc: "Paid upfront to secure your place." },
      { stage: "Stage 2", pct: "50%", amount: "₹65,000", title: "On offer or certification", desc: "Paid upon job offer or certification completion." },
    ],
    salaryBands: [
      { level: "Entry (0–2 yr)", amount: "₹3–5 LPA" },
      { level: "Mid (3–5 yr)", amount: "₹6–10 LPA" },
      { level: "Senior (5+ yr)", amount: "₹12–20 LPA" },
    ],
    published: true,
    metaTitle: "Mechatronics Programme — Veritas by IQgrads",
    metaDesc: "Mechatronics training covering electromechanical systems, motor drives, sensors and microcontroller programming. Practical, industry-aligned curriculum.",
  },

  // ──────────────────────────────────────────────
  // D-05 Internet of Things (IoT)
  // ──────────────────────────────────────────────
  {
    title: "Internet of Things (IoT)",
    slug: "internet-of-things-iot",
    domainCode: "D-05",
    tag: "Programme",
    sceneClass: "s-iot",
    shortDesc: "Sensors, connectivity and edge devices.",
    lead: "IoT connects physical machines to data. This programme builds the skills to deploy sensors, set up connectivity protocols and manage edge devices that power smart factories and cities.",
    overview: "The Internet of Things is transforming Indian industry — from smart meters and connected pumps to factory-wide asset monitoring. This programme covers the full IoT stack: sensor hardware, microcontroller firmware, communication protocols (MQTT, LoRa, Wi-Fi, cellular), edge computing and basic cloud dashboards. You'll learn to build, deploy and troubleshoot real IoT systems.",
    quickStats: [
      { value: "5–6 mo", label: "Duration" },
      { value: "Graduate", label: "Entry level" },
      { value: "On-campus", label: "Format" },
      { value: "Pearson", label: "Standard" },
    ],
    skills: [
      "Sensor selection and wiring (temperature, pressure, vibration)",
      "Microcontroller programming (ESP32, STM32)",
      "Communication protocols (MQTT, HTTP, CoAP)",
      "Wireless connectivity (Wi-Fi, LoRa, BLE, NB-IoT)",
      "Edge computing and gateway setup",
      "Basic cloud IoT platforms (ThingSpeak, AWS IoT)",
      "Data logging and time-series basics",
      "Power management for remote devices",
    ],
    roles: [
      { role: "IoT Technician", desc: "Deploys and maintains sensor networks, gateways and edge devices in industrial and commercial environments." },
      { role: "Firmware Developer", desc: "Writes embedded firmware for IoT devices — sensor polling, connectivity and OTA updates." },
      { role: "Edge Computing Technician", desc: "Sets up and manages edge gateways that preprocess data locally before sending to the cloud." },
      { role: "IoT Solutions Integrator", desc: "Connects sensors, gateways and cloud dashboards into a working end-to-end solution for a specific use case." },
    ],
    projects: [
      { pnum: "PRJ-01", title: "Environmental Monitor Node", desc: "Build an ESP32-based node that reads temperature, humidity and air quality, then publishes data to a cloud dashboard via MQTT." },
      { pnum: "PRJ-02", title: "LoRa Sensor Network", desc: "Set up three LoRa sensor nodes transmitting pressure and temperature to a central gateway with a 1 km range test." },
      { pnum: "PRJ-03", title: "Predictive Alert System", desc: "Create an edge device that monitors vibration data from a motor and triggers an alert when values exceed a threshold." },
    ],
    feeTotal: "₹1,25,000",
    feeSteps: [
      { stage: "Stage 1", pct: "50%", amount: "₹62,500", title: "At enrolment", desc: "Paid upfront to secure your place." },
      { stage: "Stage 2", pct: "50%", amount: "₹62,500", title: "On offer or certification", desc: "Paid upon job offer or certification completion." },
    ],
    salaryBands: [
      { level: "Entry (0–2 yr)", amount: "₹3–5.5 LPA" },
      { level: "Mid (3–5 yr)", amount: "₹6–11 LPA" },
      { level: "Senior (5+ yr)", amount: "₹12–20 LPA" },
    ],
    published: true,
    metaTitle: "Internet of Things (IoT) Programme — Veritas by IQgrads",
    metaDesc: "Hands-on IoT training covering sensors, microcontrollers, MQTT, LoRa and edge computing. Build real smart systems.",
  },

  // ──────────────────────────────────────────────
  // D-06 Industrial Automation
  // ──────────────────────────────────────────────
  {
    title: "Industrial Automation",
    slug: "industrial-automation",
    domainCode: "D-06",
    tag: "Programme",
    sceneClass: "s-auto",
    shortDesc: "Control systems and production lines.",
    lead: "PLCs, drives and sensors keep modern factories running. This programme builds the core skills to program, commission and troubleshoot industrial automation systems on real production lines.",
    overview: "Industrial automation is the backbone of modern manufacturing. Every car, pharmaceutical tablet and packaged food item passes through automated systems. Indian factories are scaling up rapidly, creating massive demand for automation engineers who can handle PLCs, VFDs, sensors, pneumatic actuators and HMI screens. This programme takes you from fundamentals to practical commissioning.",
    quickStats: [
      { value: "5–6 mo", label: "Duration" },
      { value: "Graduate", label: "Entry level" },
      { value: "On-campus", label: "Format" },
      { value: "Pearson", label: "Standard" },
    ],
    skills: [
      "PLC programming (ladder logic, function blocks)",
      "Sensor integration (proximity, photoelectric, ultrasonic)",
      "VFD parameterisation and motor speed control",
      "Pneumatic and hydraulic actuator systems",
      "HMI screen design and alarm management",
      "Industrial wiring and panel assembly",
      "Control panel layout and documentation",
      "Line commissioning and handover",
    ],
    roles: [
      { role: "Automation Engineer", desc: "Designs, programs and commissions PLC-based control systems for production lines and machinery." },
      { role: "PLC Programmer", desc: "Writes and debugs ladder logic and function block programs for real-time machine control." },
      { role: "Panel Builder / Wiring Technician", desc: "Assembles and wires control panels, including breakers, relays, PLCs and terminal blocks." },
      { role: "Commissioning Engineer", desc: "Installs and tests control systems on-site, resolves integration issues and signs off systems for production." },
    ],
    projects: [
      { pnum: "PRJ-01", title: "Bottle Filling Line", desc: "Program a PLC to control a four-station bottle filling line — conveyor, fill nozzle, capping and reject mechanism." },
      { pnum: "PRJ-02", title: "Motor Starter Panel", desc: "Wire and program a DOL and star-delta motor starter panel with overcurrent, overvoltage and thermal protection." },
      { pnum: "PRJ-03", title: "HMI Alarm Dashboard", desc: "Design an HMI screen with real-time process values, alarm history, operator override buttons and recipe management." },
    ],
    feeTotal: "₹1,30,000",
    feeSteps: [
      { stage: "Stage 1", pct: "50%", amount: "₹65,000", title: "At enrolment", desc: "Paid upfront to secure your place." },
      { stage: "Stage 2", pct: "50%", amount: "₹65,000", title: "On offer or certification", desc: "Paid upon job offer or certification completion." },
    ],
    salaryBands: [
      { level: "Entry (0–2 yr)", amount: "₹3–5 LPA" },
      { level: "Mid (3–5 yr)", amount: "₹6–10 LPA" },
      { level: "Senior (5+ yr)", amount: "₹12–20 LPA" },
    ],
    published: true,
    metaTitle: "Industrial Automation Programme — Veritas by IQgrads",
    metaDesc: "Practical industrial automation training — PLC programming, VFDs, sensors, pneumatics and HMI. Build real control systems.",
  },

  // ──────────────────────────────────────────────
  // D-07 PLC & SCADA
  // ──────────────────────────────────────────────
  {
    title: "PLC & SCADA",
    slug: "plc-scada",
    domainCode: "D-07",
    tag: "Programme",
    sceneClass: "s-auto",
    shortDesc: "Programming, HMI and supervisory control.",
    lead: "PLCs control the machine; SCADA lets humans supervise the plant. This programme goes deep into PLC programming and SCADA system design for real industrial environments.",
    overview: "PLC and SCADA are two of the most in-demand skills in Indian manufacturing. A PLC programmer writes the logic that makes machines run; a SCADA engineer builds the screens and data systems that let operators monitor and control entire plants. This programme covers both in depth — from relay logic and ladder diagrams to multi-screen SCADA architectures with historian integration.",
    quickStats: [
      { value: "5–6 mo", label: "Duration" },
      { value: "Graduate", label: "Entry level" },
      { value: "On-campus", label: "Format" },
      { value: "Pearson", label: "Standard" },
    ],
    skills: [
      "Ladder logic programming",
      "Function block and structured text",
      "PLC I/O configuration and wiring",
      "SCADA screen design and animation",
      "Tag database and alarm configuration",
      "Historian and trend logging",
      "Modbus, Profibus and Ethernet/IP communication",
      "PLC–SCADA integration and testing",
    ],
    roles: [
      { role: "PLC Programmer", desc: "Writes, tests and optimises PLC programs for manufacturing processes using ladder, FBD and structured text." },
      { role: "SCADA Engineer", desc: "Designs and configures SCADA screens, alarms, trends and data logging for plant supervision." },
      { role: "Controls Engineer", desc: "Integrates PLC, HMI and SCADA into a complete control solution, including communication setup and testing." },
      { role: "Field Service Engineer", desc: "Troubleshoots and maintains PLC and SCADA systems on-site at customer plants." },
    ],
    projects: [
      { pnum: "PRJ-01", title: "Batch Process PLC", desc: "Program a PLC for a three-tank batch mixing system with fill, mix, drain and temperature control sequences." },
      { pnum: "PRJ-02", title: "SCADA Water Treatment Plant", desc: "Build a SCADA interface for a miniature water treatment plant with live tank levels, pump control and chemical dosing alarms." },
      { pnum: "PRJ-03", title: "Multi-Station Communication", desc: "Set up Modbus communication between two PLCs and a SCADA server, logging data to a historian with trend graphs." },
    ],
    feeTotal: "₹1,35,000",
    feeSteps: [
      { stage: "Stage 1", pct: "50%", amount: "₹67,500", title: "At enrolment", desc: "Paid upfront to secure your place." },
      { stage: "Stage 2", pct: "50%", amount: "₹67,500", title: "On offer or certification", desc: "Paid upon job offer or certification completion." },
    ],
    salaryBands: [
      { level: "Entry (0–2 yr)", amount: "₹3.5–6 LPA" },
      { level: "Mid (3–5 yr)", amount: "₹7–12 LPA" },
      { level: "Senior (5+ yr)", amount: "₹14–22 LPA" },
    ],
    published: true,
    metaTitle: "PLC & SCADA Programme — Veritas by IQgrads",
    metaDesc: "In-depth PLC programming and SCADA design training. Ladder logic, function blocks, HMI screens and historian integration.",
  },

  // ──────────────────────────────────────────────
  // D-08 Embedded Systems
  // ──────────────────────────────────────────────
  {
    title: "Embedded Systems",
    slug: "embedded-systems",
    domainCode: "D-08",
    tag: "Programme",
    sceneClass: "s-iot",
    shortDesc: "Firmware, microcontrollers, real-time.",
    lead: "Embedded systems are the hidden brains inside every smart device. This programme teaches firmware development, microcontroller programming and real-time system design on actual hardware.",
    overview: "From automotive ECUs to medical devices and consumer electronics, embedded systems are everywhere. India's embedded design and manufacturing sector is growing fast. This programme covers C programming for microcontrollers, peripheral interfacing, real-time operating systems, debugging techniques and hardware-software co-design — skills that are critical for product companies and EMS firms.",
    quickStats: [
      { value: "5–6 mo", label: "Duration" },
      { value: "Graduate", label: "Entry level" },
      { value: "On-campus", label: "Format" },
      { value: "Pearson", label: "Standard" },
    ],
    skills: [
      "C programming for embedded targets",
      "Microcontroller architecture (ARM Cortex-M, AVR)",
      "Peripheral interfacing (UART, SPI, I2C, ADC, PWM)",
      "Real-time operating systems (FreeRTOS)",
      "Interrupt handling and DMA",
      "Debugging with oscilloscopes and logic analysers",
      "PCB basics and schematic reading",
      "Low-power design and sleep modes",
    ],
    roles: [
      { role: "Embedded Firmware Developer", desc: "Writes and optimises C firmware for microcontrollers — sensor drivers, communication stacks and control loops." },
      { role: "Embedded Test Engineer", desc: "Designs and runs hardware-in-the-loop tests, validates firmware against specifications and logs defects." },
      { role: "Hardware-Software Integration Engineer", desc: "Brings up new boards, debugs boot sequences and integrates firmware with hardware peripherals." },
      { role: "Firmware Support Engineer", desc: "Supports field issues, reproduces bugs, patches firmware and manages OTA update pipelines." },
    ],
    projects: [
      { pnum: "PRJ-01", title: "Sensor Data Logger", desc: "Build an STM32-based data logger that reads temperature, pressure and accelerometer data, timestamps and stores to SD card." },
      { pnum: "PRJ-02", title: "FreeRTOS Task Scheduler", desc: "Implement a multi-task RTOS application with three tasks — UART reception, LED blinking and ADC sampling — using semaphores and queues." },
      { pnum: "PRJ-03", title: "Motor Controller Firmware", desc: "Write firmware for an H-bridge motor controller with speed PID, direction control and emergency stop via interrupt." },
    ],
    feeTotal: "₹1,30,000",
    feeSteps: [
      { stage: "Stage 1", pct: "50%", amount: "₹65,000", title: "At enrolment", desc: "Paid upfront to secure your place." },
      { stage: "Stage 2", pct: "50%", amount: "₹65,000", title: "On offer or certification", desc: "Paid upon job offer or certification completion." },
    ],
    salaryBands: [
      { level: "Entry (0–2 yr)", amount: "₹3.5–6 LPA" },
      { level: "Mid (3–5 yr)", amount: "₹7–13 LPA" },
      { level: "Senior (5+ yr)", amount: "₹15–25 LPA" },
    ],
    published: true,
    metaTitle: "Embedded Systems Programme — Veritas by IQgrads",
    metaDesc: "Embedded firmware development training — C programming, microcontrollers, RTOS and hardware debugging. Build real embedded products.",
  },

  // ──────────────────────────────────────────────
  // D-09 AI for Manufacturing
  // ──────────────────────────────────────────────
  {
    title: "AI for Manufacturing",
    slug: "ai-for-manufacturing",
    domainCode: "D-09",
    tag: "Programme",
    sceneClass: "s-robot",
    shortDesc: "Vision, optimisation and smart control.",
    lead: "AI is moving from labs to factory floors. This programme teaches how computer vision, predictive models and optimisation algorithms are applied in real manufacturing environments.",
    overview: "Artificial intelligence in manufacturing is not about ChatGPT — it's about machine vision for defect detection, predictive models for tool wear, and optimisation algorithms for scheduling. This programme bridges the gap between AI fundamentals and practical factory deployment, teaching you to collect manufacturing data, build models and deploy them on edge devices for real-time decisions.",
    quickStats: [
      { value: "5–6 mo", label: "Duration" },
      { value: "Graduate", label: "Entry level" },
      { value: "On-campus", label: "Format" },
      { value: "Pearson", label: "Standard" },
    ],
    skills: [
      "Machine vision for defect detection",
      "Image preprocessing and classification",
      "Predictive maintenance modelling",
      "Data collection from shop-floor sensors",
      "Edge AI deployment (NVIDIA Jetson, Raspberry Pi)",
      "Python for data analysis and model training",
      "Time-series analysis for process data",
      "Basic MLOps and model versioning",
    ],
    roles: [
      { role: "AI / Vision Technician", desc: "Sets up and calibrates camera systems, trains defect classifiers and maintains vision inspection stations." },
      { role: "Data Collection Engineer", desc: "Installs sensors, configures data loggers and pipelines that feed manufacturing data to AI models." },
      { role: "Edge AI Deployment Engineer", desc: "Deploys trained models on edge devices, optimises inference speed and manages model updates." },
      { role: "Process Optimisation Analyst", desc: "Analyses manufacturing data to identify bottlenecks, predict failures and recommend parameter changes." },
    ],
    projects: [
      { pnum: "PRJ-01", title: "Surface Defect Detector", desc: "Build a machine vision system that detects scratches, dents and discolouration on metal parts using OpenCV and a trained classifier." },
      { pnum: "PRJ-02", title: "Tool Wear Predictor", desc: "Collect vibration and current data from a CNC spindle, train a regression model and deploy it on a Raspberry Pi for real-time tool wear prediction." },
      { pnum: "PRJ-03", title: "Production Scheduler Optimiser", desc: "Write a Python optimiser that schedules five jobs across three machines to minimise total makespan using greedy and genetic algorithms." },
    ],
    feeTotal: "₹1,50,000",
    feeSteps: [
      { stage: "Stage 1", pct: "50%", amount: "₹75,000", title: "At enrolment", desc: "Paid upfront to secure your place." },
      { stage: "Stage 2", pct: "50%", amount: "₹75,000", title: "On offer or certification", desc: "Paid upon job offer or certification completion." },
    ],
    salaryBands: [
      { level: "Entry (0–2 yr)", amount: "₹4–7 LPA" },
      { level: "Mid (3–5 yr)", amount: "₹8–14 LPA" },
      { level: "Senior (5+ yr)", amount: "₹16–28 LPA" },
    ],
    published: true,
    metaTitle: "AI for Manufacturing Programme — Veritas by IQgrads",
    metaDesc: "Applied AI training for manufacturing — machine vision, predictive models and edge deployment. Build real factory-floor intelligence.",
  },

  // ──────────────────────────────────────────────
  // D-10 Electric Vehicles
  // ──────────────────────────────────────────────
  {
    title: "Electric Vehicles",
    slug: "electric-vehicles",
    domainCode: "D-10",
    tag: "Programme",
    sceneClass: "s-ev",
    shortDesc: "Powertrains, batteries and charging.",
    lead: "India's EV market is booming. This programme builds the skills to work with battery systems, electric drivetrains, charging infrastructure and vehicle-level diagnostics.",
    overview: "Electric vehicles require a completely different skill set from internal combustion engines. Battery management systems, high-voltage power electronics, regenerative braking and charging protocols are the new core competencies. With government subsidies and rapid adoption in two-wheelers, three-wheelers and commercial fleets, India needs trained EV technicians and engineers urgently.",
    quickStats: [
      { value: "5–6 mo", label: "Duration" },
      { value: "Graduate", label: "Entry level" },
      { value: "On-campus", label: "Format" },
      { value: "Pearson", label: "Standard" },
    ],
    skills: [
      "Battery Management Systems (BMS)",
      "High-voltage safety and PPE protocols",
      "Electric motor types (BLDC, PMSM, induction)",
      "Power electronics and inverter operation",
      "Charging standards (CCS, CHAdeMO, Type 2)",
      "Vehicle CAN bus diagnostics",
      "Thermal management of battery packs",
      "Regenerative braking systems",
    ],
    roles: [
      { role: "EV Technician", desc: "Diagnoses and repairs electric vehicles — battery packs, drivetrains, charging systems and high-voltage circuits." },
      { role: "Battery Pack Assembler / Tester", desc: "Assembles, tests and balances battery modules, manages BMS calibration and performs pack-level safety checks." },
      { role: "Charging Infrastructure Technician", desc: "Installs, commissions and maintains AC and DC charging stations including communication protocol testing." },
      { role: "Powertrain Test Technician", desc: "Runs dyno tests on motors and inverters, records efficiency data and validates regenerative braking performance." },
    ],
    projects: [
      { pnum: "PRJ-01", title: "Battery Pack Assembly", desc: "Assemble a 48V lithium-ion battery pack with BMS, perform cell balancing and run charge-discharge cycle tests." },
      { pnum: "PRJ-02", title: "BLDC Motor Controller", desc: "Wire and test a BLDC motor with an ESC, measure speed-torque curves and implement regenerative braking on a test rig." },
      { pnum: "PRJ-03", title: "CAN Bus Diagnostics", desc: "Connect to an EV's CAN bus, decode diagnostic messages using a CAN analyser and log real-time motor and battery data." },
    ],
    feeTotal: "₹1,45,000",
    feeSteps: [
      { stage: "Stage 1", pct: "50%", amount: "₹72,500", title: "At enrolment", desc: "Paid upfront to secure your place." },
      { stage: "Stage 2", pct: "50%", amount: "₹72,500", title: "On offer or certification", desc: "Paid upon job offer or certification completion." },
    ],
    salaryBands: [
      { level: "Entry (0–2 yr)", amount: "₹3.5–6 LPA" },
      { level: "Mid (3–5 yr)", amount: "₹7–12 LPA" },
      { level: "Senior (5+ yr)", amount: "₹14–24 LPA" },
    ],
    published: true,
    metaTitle: "Electric Vehicles Programme — Veritas by IQgrads",
    metaDesc: "Hands-on EV training — battery systems, powertrains, charging infrastructure and CAN bus diagnostics. Industry-ready skills.",
  },

  // ──────────────────────────────────────────────
  // D-11 Industry 4.0
  // ──────────────────────────────────────────────
  {
    title: "Industry 4.0",
    slug: "industry-4-0",
    domainCode: "D-11",
    tag: "Programme",
    sceneClass: "s-auto",
    shortDesc: "Connected, data-driven production.",
    lead: "Industry 4.0 connects machines, data and people. This programme builds skills in connected manufacturing — from sensor networks and edge computing to MES integration and data dashboards.",
    overview: "Industry 4.0 is the convergence of IT and OT — information technology meeting operational technology on the factory floor. It's about connecting PLCs to the cloud, using real-time data for decision-making and building digital threads across the production chain. This programme covers the key pillars: IoT connectivity, edge computing, MES/MOM systems, data analytics and cybersecurity for industrial networks.",
    quickStats: [
      { value: "5–6 mo", label: "Duration" },
      { value: "Graduate", label: "Entry level" },
      { value: "On-campus", label: "Format" },
      { value: "Pearson", label: "Standard" },
    ],
    skills: [
      "Industrial IoT connectivity (OPC UA, MQTT)",
      "Edge computing and data preprocessing",
      "MES/MOM system basics",
      "OPC UA server and client configuration",
      "Industrial network design (IT/OT convergence)",
      "Data visualisation dashboards (Grafana, Power BI)",
      "Cybersecurity for OT networks",
      "Digital thread and traceability concepts",
    ],
    roles: [
      { role: "Industry 4.0 Technician", desc: "Deploys and maintains connected manufacturing systems — sensors, gateways, MES terminals and data pipelines." },
      { role: "OT Network Engineer", desc: "Designs and manages industrial networks connecting PLCs, HMIs, SCADA and enterprise systems." },
      { role: "MES / MOM Administrator", desc: "Configures and supports manufacturing execution systems — production tracking, quality logging and downtime analysis." },
      { role: "Data Dashboard Developer", desc: "Builds and maintains real-time dashboards showing OEE, throughput, scrap rates and production KPIs." },
    ],
    projects: [
      { pnum: "PRJ-01", title: "OPC UA Data Pipeline", desc: "Connect a PLC to an OPC UA server, configure tags and stream data to a time-series database with Grafana dashboards." },
      { pnum: "PRJ-02", title: "OEE Monitoring Station", desc: "Build a real-time OEE (Overall Equipment Effectiveness) monitor using sensor inputs — availability, performance and quality." },
      { pnum: "PRJ-03", title: "IT/OT Network Segmentation", desc: "Design a network architecture separating office IT from shop-floor OT with a DMZ, firewall rules and VLAN configuration." },
    ],
    feeTotal: "₹1,40,000",
    feeSteps: [
      { stage: "Stage 1", pct: "50%", amount: "₹70,000", title: "At enrolment", desc: "Paid upfront to secure your place." },
      { stage: "Stage 2", pct: "50%", amount: "₹70,000", title: "On offer or certification", desc: "Paid upon job offer or certification completion." },
    ],
    salaryBands: [
      { level: "Entry (0–2 yr)", amount: "₹3.5–6 LPA" },
      { level: "Mid (3–5 yr)", amount: "₹7–13 LPA" },
      { level: "Senior (5+ yr)", amount: "₹15–25 LPA" },
    ],
    published: true,
    metaTitle: "Industry 4.0 Programme — Veritas by IQgrads",
    metaDesc: "Connected manufacturing training — IoT, OPC UA, MES, edge computing and industrial cybersecurity. Prepare for smart factories.",
  },

  // ──────────────────────────────────────────────
  // D-12 Smart Manufacturing
  // ──────────────────────────────────────────────
  {
    title: "Smart Manufacturing",
    slug: "smart-manufacturing",
    domainCode: "D-12",
    tag: "Programme",
    sceneClass: "s-semi",
    shortDesc: "Digitised, flexible factories.",
    lead: "Smart manufacturing uses data, automation and flexibility to produce better, faster and cheaper. This programme covers the tools and methods behind digitised, adaptive factory operations.",
    overview: "Smart manufacturing goes beyond individual machines — it optimises the entire production ecosystem. Digital work instructions, automated material handling, real-time quality monitoring and flexible production cells all work together. This programme trains you to implement and manage these integrated systems, combining automation skills with digital tools for modern factory operations.",
    quickStats: [
      { value: "5–6 mo", label: "Duration" },
      { value: "Graduate", label: "Entry level" },
      { value: "On-campus", label: "Format" },
      { value: "Pearson", label: "Standard" },
    ],
    skills: [
      "Digital work instruction systems",
      "Flexible manufacturing cell design",
      "Automated material handling (conveyors, AGVs)",
      "Real-time quality monitoring",
      "Production scheduling software",
      "RFID and barcode tracking systems",
      "Lean and Six Sigma basics",
      "MES integration and data flow",
    ],
    roles: [
      { role: "Smart Factory Technician", desc: "Operates and maintains integrated production systems — automated cells, material handling and digital tracking." },
      { role: "Process Digitisation Engineer", desc: "Converts manual processes into digital workflows, configures tracking systems and manages data collection." },
      { role: "Quality Systems Technician", desc: "Runs SPC, configures inline inspection stations and manages non-conformance tracking through digital systems." },
      { role: "Production Optimisation Analyst", desc: "Analyses production data to identify bottlenecks, reduce changeover times and improve throughput." },
    ],
    projects: [
      { pnum: "PRJ-01", title: "Flexible Assembly Cell", desc: "Configure a manufacturing cell that can switch between three product variants with automated tool changes and digital instructions." },
      { pnum: "PRJ-02", title: "RFID Production Tracker", desc: "Implement RFID-based tracking from raw material to finished goods with a dashboard showing WIP and throughput." },
      { pnum: "PRJ-03", title: "SPC Control Chart System", desc: "Build a real-time SPC system that collects measurements, plots X-bar and R charts, and triggers alerts on out-of-control conditions." },
    ],
    feeTotal: "₹1,35,000",
    feeSteps: [
      { stage: "Stage 1", pct: "50%", amount: "₹67,500", title: "At enrolment", desc: "Paid upfront to secure your place." },
      { stage: "Stage 2", pct: "50%", amount: "₹67,500", title: "On offer or certification", desc: "Paid upon job offer or certification completion." },
    ],
    salaryBands: [
      { level: "Entry (0–2 yr)", amount: "₹3.5–6 LPA" },
      { level: "Mid (3–5 yr)", amount: "₹7–12 LPA" },
      { level: "Senior (5+ yr)", amount: "₹14–22 LPA" },
    ],
    published: true,
    metaTitle: "Smart Manufacturing Programme — Veritas by IQgrads",
    metaDesc: "Smart manufacturing training — digital work cells, RFID tracking, SPC and flexible production systems. Prepare for modern factories.",
  },

  // ──────────────────────────────────────────────
  // D-13 Machine Vision
  // ──────────────────────────────────────────────
  {
    title: "Machine Vision",
    slug: "machine-vision",
    domainCode: "D-13",
    tag: "Programme",
    sceneClass: "s-iot",
    shortDesc: "Automated inspection and guidance.",
    lead: "Machine vision lets machines see, inspect and decide. This programme covers camera systems, lighting, image processing and AI-based inspection for manufacturing quality control.",
    overview: "Machine vision is used in every industry that needs fast, consistent quality inspection — automotive, electronics, food, pharma and packaging. This programme teaches the full stack: camera selection, lens and lighting design, image acquisition, classical image processing with OpenCV, AI-based defect classification and integration with PLCs and production lines.",
    quickStats: [
      { value: "5–6 mo", label: "Duration" },
      { value: "Graduate", label: "Entry level" },
      { value: "On-campus", label: "Format" },
      { value: "Pearson", label: "Standard" },
    ],
    skills: [
      "Camera and lens selection (area scan, line scan)",
      "Industrial lighting techniques (backlight, ring, coaxial)",
      "Image acquisition and frame grabbers",
      "Classical image processing (OpenCV)",
      "Feature extraction and pattern matching",
      "AI-based defect classification",
      "Vision system calibration and accuracy testing",
      "PLC and robot integration with vision triggers",
    ],
    roles: [
      { role: "Machine Vision Technician", desc: "Sets up cameras, configures lighting and calibrates vision systems for inline inspection on production lines." },
      { role: "Vision Application Developer", desc: "Writes and optimises inspection algorithms — defect detection, measurement and feature verification." },
      { role: "Vision Integration Engineer", desc: "Integrates vision systems with PLCs and robots — trigger signals, pass/fail outputs and reject mechanisms." },
      { role: "Quality Inspection Engineer", desc: "Defines inspection criteria, validates vision system accuracy and maintains inspection standards over time." },
    ],
    projects: [
      { pnum: "PRJ-01", title: "Surface Inspection Station", desc: "Build a line-scan camera station that inspects a moving belt for surface defects, classifying and logging each defect type." },
      { pnum: "PRJ-02", title: "Dimensional Measurement", desc: "Use a calibrated area-scan camera to measure part dimensions (length, width, hole diameter) and compare against CAD tolerances." },
      { pnum: "PRJ-03", title: "Vision-Guided Sorting", desc: "Integrate a camera with a robot arm to sort parts by colour and shape, sending pick coordinates to the robot controller." },
    ],
    feeTotal: "₹1,40,000",
    feeSteps: [
      { stage: "Stage 1", pct: "50%", amount: "₹70,000", title: "At enrolment", desc: "Paid upfront to secure your place." },
      { stage: "Stage 2", pct: "50%", amount: "₹70,000", title: "On offer or certification", desc: "Paid upon job offer or certification completion." },
    ],
    salaryBands: [
      { level: "Entry (0–2 yr)", amount: "₹3.5–6 LPA" },
      { level: "Mid (3–5 yr)", amount: "₹7–12 LPA" },
      { level: "Senior (5+ yr)", amount: "₹14–24 LPA" },
    ],
    published: true,
    metaTitle: "Machine Vision Programme — Veritas by IQgrads",
    metaDesc: "Machine vision training — cameras, lighting, OpenCV, AI inspection and PLC integration. Build real quality inspection systems.",
  },

  // ──────────────────────────────────────────────
  // D-14 Industrial Networking
  // ──────────────────────────────────────────────
  {
    title: "Industrial Networking",
    slug: "industrial-networking",
    domainCode: "D-14",
    tag: "Programme",
    sceneClass: "s-iot",
    shortDesc: "Protocols and plant connectivity.",
    lead: "Factory networks are different from office networks. This programme covers the protocols, hardware and security practices that keep industrial communications reliable and safe.",
    overview: "Industrial networking connects everything on the factory floor — PLCs, HMIs, drives, sensors and enterprise systems. It uses specific protocols (Modbus, Profibus, EtherNet/IP, PROFINET) and demands reliability, low latency and deterministic communication. This programme teaches you to design, install and troubleshoot industrial networks with proper segmentation, redundancy and cybersecurity.",
    quickStats: [
      { value: "5–6 mo", label: "Duration" },
      { value: "Graduate", label: "Entry level" },
      { value: "On-campus", label: "Format" },
      { value: "Pearson", label: "Standard" },
    ],
    skills: [
      "Modbus RTU and TCP configuration",
      "Profibus and PROFINET setup",
      "EtherNet/IP and CIP communication",
      "Industrial switch and router configuration",
      "Network segmentation and VLANs",
      "Industrial firewall and DMZ design",
      "Redundancy protocols (MRP, RSTP)",
      "Network troubleshooting with protocol analysers",
    ],
    roles: [
      { role: "Industrial Network Technician", desc: "Installs, configures and maintains industrial switches, routers and communication modules on plant networks." },
      { role: "Fieldbus Engineer", desc: "Sets up and troubleshoots fieldbus networks — Profibus, Modbus, EtherNet/IP — connecting PLCs to field devices." },
      { role: "OT Network Security Analyst", desc: "Monitors and protects industrial networks from cyber threats, manages firewall rules and conducts vulnerability assessments." },
      { role: "Communications Integration Engineer", desc: "Bridges communication between different protocols and systems, ensuring seamless data flow from sensor to cloud." },
    ],
    projects: [
      { pnum: "PRJ-01", title: "Modbus Network Setup", desc: "Configure a Modbus RTU network with a master PLC and five slave devices, verify data exchange and diagnose communication faults." },
      { pnum: "PRJ-02", title: "VLAN Segmentation Lab", desc: "Design and implement VLAN segmentation between office IT and shop-floor OT networks using managed industrial switches." },
      { pnum: "PRJ-03", title: "Protocol Bridge", desc: "Set up a gateway that bridges Modbus TCP devices to an EtherNet/IP network, validating data integrity in both directions." },
    ],
    feeTotal: "₹1,30,000",
    feeSteps: [
      { stage: "Stage 1", pct: "50%", amount: "₹65,000", title: "At enrolment", desc: "Paid upfront to secure your place." },
      { stage: "Stage 2", pct: "50%", amount: "₹65,000", title: "On offer or certification", desc: "Paid upon job offer or certification completion." },
    ],
    salaryBands: [
      { level: "Entry (0–2 yr)", amount: "₹3.5–6 LPA" },
      { level: "Mid (3–5 yr)", amount: "₹7–12 LPA" },
      { level: "Senior (5+ yr)", amount: "₹14–22 LPA" },
    ],
    published: true,
    metaTitle: "Industrial Networking Programme — Veritas by IQgrads",
    metaDesc: "Industrial networking training — Modbus, Profibus, PROFINET, VLANs and OT cybersecurity. Reliable plant communications.",
  },

  // ──────────────────────────────────────────────
  // D-15 Digital Twin
  // ──────────────────────────────────────────────
  {
    title: "Digital Twin",
    slug: "digital-twin",
    domainCode: "D-15",
    tag: "Programme",
    sceneClass: "s-auto",
    shortDesc: "Simulation and virtual commissioning.",
    lead: "A digital twin mirrors a real machine in software. This programme teaches simulation, virtual commissioning and model-based design for modern manufacturing systems.",
    overview: "Digital twins are virtual replicas of physical systems used for simulation, testing and optimisation before — or alongside — real production. They allow engineers to test control logic, validate throughput and predict failures without stopping a production line. This programme covers simulation tools, PLC virtual commissioning, 3D plant modelling and data synchronisation between the digital twin and the real asset.",
    quickStats: [
      { value: "5–6 mo", label: "Duration" },
      { value: "Graduate", label: "Entry level" },
      { value: "On-campus", label: "Format" },
      { value: "Pearson", label: "Standard" },
    ],
    skills: [
      "Plant simulation and discrete event modelling",
      "PLC virtual commissioning (PLCSIM, Factory I/O)",
      "3D visualisation and animation of production lines",
      "Motion simulation and kinematic modelling",
      "Data synchronisation (real-time vs simulated)",
      "Scenario analysis and what-if studies",
      "Integration with SCADA and MES",
      "Model validation and calibration",
    ],
    roles: [
      { role: "Digital Twin Technician", desc: "Builds and maintains virtual models of production systems, synchronises data and runs simulation scenarios." },
      { role: "Virtual Commissioning Engineer", desc: "Tests PLC programs in a simulated environment before deploying to real machines, reducing on-site commissioning time." },
      { role: "Simulation Analyst", desc: "Runs throughput simulations, identifies bottlenecks and recommends layout or parameter changes using the digital twin." },
      { role: "3D Visualisation Specialist", desc: "Creates animated 3D models of factory lines for training, presentations and remote monitoring." },
    ],
    projects: [
      { pnum: "PRJ-01", title: "Virtual Conveyor System", desc: "Build a Factory I/O simulation of a conveyor sorting system, program the PLC logic virtually and validate before deploying to hardware." },
      { pnum: "PRJ-02", title: "Bottleneck Analysis", desc: "Create a simulation model of a packaging line, run throughput tests under different configurations and identify the bottleneck." },
      { pnum: "PRJ-03", title: "Digital Twin Dashboard", desc: "Connect a simulated PLC to a web dashboard that displays live simulated production data — count, cycle time and rejects." },
    ],
    feeTotal: "₹1,40,000",
    feeSteps: [
      { stage: "Stage 1", pct: "50%", amount: "₹70,000", title: "At enrolment", desc: "Paid upfront to secure your place." },
      { stage: "Stage 2", pct: "50%", amount: "₹70,000", title: "On offer or certification", desc: "Paid upon job offer or certification completion." },
    ],
    salaryBands: [
      { level: "Entry (0–2 yr)", amount: "₹4–7 LPA" },
      { level: "Mid (3–5 yr)", amount: "₹8–14 LPA" },
      { level: "Senior (5+ yr)", amount: "₹16–28 LPA" },
    ],
    published: true,
    metaTitle: "Digital Twin Programme — Veritas by IQgrads",
    metaDesc: "Digital twin and simulation training — virtual commissioning, plant simulation and 3D visualisation. Test before you deploy.",
  },

  // ──────────────────────────────────────────────
  // D-16 Industrial Cybersecurity
  // ──────────────────────────────────────────────
  {
    title: "Industrial Cybersecurity",
    slug: "industrial-cybersecurity",
    domainCode: "D-16",
    tag: "Programme",
    sceneClass: "s-robot",
    shortDesc: "Securing connected operations.",
    lead: "Connected factories are vulnerable factories. This programme teaches the specific cybersecurity skills needed to protect industrial control systems and OT networks.",
    overview: "As factories connect PLCs, SCADA and IIoT devices to networks, the attack surface expands dramatically. Industrial cybersecurity is different from IT security — it must protect availability and safety, not just confidentiality. This programme covers ICS/SCADA threat landscapes, network segmentation, secure remote access, anomaly detection and incident response for operational technology environments.",
    quickStats: [
      { value: "5–6 mo", label: "Duration" },
      { value: "Graduate", label: "Entry level" },
      { value: "On-campus", label: "Format" },
      { value: "Pearson", label: "Standard" },
    ],
    skills: [
      "ICS/SCADA threat landscape",
      "Network segmentation (Purdue model, IEC 62443)",
      "Industrial firewall and DMZ configuration",
      "Secure remote access for OT environments",
      "Anomaly detection on industrial networks",
      "Vulnerability assessment of OT assets",
      "Incident response for ICS environments",
      "Security hardening of PLCs and HMIs",
    ],
    roles: [
      { role: "OT Security Analyst", desc: "Monitors industrial networks for threats, investigates alerts and ensures compliance with ICS security policies." },
      { role: "ICS Security Engineer", desc: "Designs and implements secure architectures for industrial control systems — segmentation, firewalls and access control." },
      { role: "Vulnerability Assessor (OT)", desc: "Conducts vulnerability scans and penetration tests on industrial assets and reports findings with remediation steps." },
      { role: "Incident Responder (ICS)", desc: "Responds to security incidents in OT environments, isolates affected systems and coordinates recovery with operations." },
    ],
    projects: [
      { pnum: "PRJ-01", title: "OT Network Audit", desc: "Map an industrial network, identify all connected assets (PLCs, HMIs, engineering workstations) and produce a risk register." },
      { pnum: "PRJ-02", title: "Purdue Model Implementation", desc: "Segment a simulated plant network into Purdue levels 0–4 with firewalls, jump servers and data diodes." },
      { pnum: "PRJ-03", title: "SCADA Anomaly Detection", desc: "Deploy a network-based anomaly detection tool on a SCADA testbed, train it on normal traffic and detect simulated attacks." },
    ],
    feeTotal: "₹1,50,000",
    feeSteps: [
      { stage: "Stage 1", pct: "50%", amount: "₹75,000", title: "At enrolment", desc: "Paid upfront to secure your place." },
      { stage: "Stage 2", pct: "50%", amount: "₹75,000", title: "On offer or certification", desc: "Paid upon job offer or certification completion." },
    ],
    salaryBands: [
      { level: "Entry (0–2 yr)", amount: "₹4–7 LPA" },
      { level: "Mid (3–5 yr)", amount: "₹8–15 LPA" },
      { level: "Senior (5+ yr)", amount: "₹18–30 LPA" },
    ],
    published: true,
    metaTitle: "Industrial Cybersecurity Programme — Veritas by IQgrads",
    metaDesc: "Industrial cybersecurity training — ICS/SCADA security, network segmentation, vulnerability assessment and incident response.",
  },

  // ──────────────────────────────────────────────
  // D-17 Renewable Energy Systems
  // ──────────────────────────────────────────────
  {
    title: "Renewable Energy Systems",
    slug: "renewable-energy-systems",
    domainCode: "D-17",
    tag: "Programme",
    sceneClass: "s-ev",
    shortDesc: "Solar, wind and energy integration.",
    lead: "India's renewable energy sector is growing rapidly. This programme builds the skills to install, maintain and monitor solar, wind and hybrid energy systems.",
    overview: "India aims for 500 GW of renewable energy capacity by 2030. Solar, wind and hybrid systems need technicians who can handle panel installation, inverter configuration, battery storage, grid integration and performance monitoring. This programme covers the full renewable energy value chain — from site survey and system design to commissioning, O&M and performance analytics.",
    quickStats: [
      { value: "5–6 mo", label: "Duration" },
      { value: "Graduate", label: "Entry level" },
      { value: "On-campus", label: "Format" },
      { value: "Pearson", label: "Standard" },
    ],
    skills: [
      "Solar PV system design and installation",
      "Inverter types and configuration (string, central, micro)",
      "Battery energy storage systems (BESS)",
      "Wind turbine basics and maintenance",
      "Grid-tie and off-grid system design",
      "Electrical safety and earthing",
      "Performance monitoring and analytics",
      "Site survey and resource assessment",
    ],
    roles: [
      { role: "Solar PV Technician", desc: "Installs, commissions and maintains rooftop and ground-mount solar PV systems including inverters and AC/DC wiring." },
      { role: "Wind Turbine Technician", desc: "Performs scheduled and unscheduled maintenance on wind turbine nacelles, gearboxes and generators." },
      { role: "BESS / Storage Technician", desc: "Installs and maintains battery storage systems, manages BMS configuration and performs cell-level diagnostics." },
      { role: "Renewable Energy O&M Analyst", desc: "Monitors plant performance using SCADA and analytics tools, identifies underperformance and recommends corrective actions." },
    ],
    projects: [
      { pnum: "PRJ-01", title: "Rooftop Solar System", desc: "Design and install a 5 kW rooftop solar system — panel layout, DC wiring, inverter configuration and grid-tie commissioning." },
      { pnum: "PRJ-02", title: "Off-Grid Power System", desc: "Build a small off-grid system with solar panels, charge controller, battery bank and inverter powering a local load." },
      { pnum: "PRJ-03", title: "Plant Performance Dashboard", desc: "Connect a solar inverter to a monitoring platform, display real-time generation, irradiance and performance ratio on a dashboard." },
    ],
    feeTotal: "₹1,30,000",
    feeSteps: [
      { stage: "Stage 1", pct: "50%", amount: "₹65,000", title: "At enrolment", desc: "Paid upfront to secure your place." },
      { stage: "Stage 2", pct: "50%", amount: "₹65,000", title: "On offer or certification", desc: "Paid upon job offer or certification completion." },
    ],
    salaryBands: [
      { level: "Entry (0–2 yr)", amount: "₹3–5.5 LPA" },
      { level: "Mid (3–5 yr)", amount: "₹6–11 LPA" },
      { level: "Senior (5+ yr)", amount: "₹12–20 LPA" },
    ],
    published: true,
    metaTitle: "Renewable Energy Systems Programme — Veritas by IQgrads",
    metaDesc: "Renewable energy training — solar PV, wind, battery storage and grid integration. Hands-on skills for India's green energy sector.",
  },

  // ──────────────────────────────────────────────
  // D-18 Predictive Maintenance
  // ──────────────────────────────────────────────
  {
    title: "Predictive Maintenance",
    slug: "predictive-maintenance",
    domainCode: "D-18",
    tag: "Programme",
    sceneClass: "s-auto",
    shortDesc: "Condition monitoring and analytics.",
    lead: "Reactive maintenance is expensive; predictive maintenance prevents failures before they happen. This programme covers vibration analysis, thermal monitoring and data-driven maintenance strategies.",
    overview: "Unplanned downtime costs Indian manufacturers crores every year. Predictive maintenance uses sensor data — vibration, temperature, current, acoustics — to detect early signs of equipment failure and schedule maintenance before breakdown. This programme teaches condition monitoring techniques, data collection, analysis tools and the decision frameworks that turn raw sensor data into actionable maintenance plans.",
    quickStats: [
      { value: "5–6 mo", label: "Duration" },
      { value: "Graduate", label: "Entry level" },
      { value: "On-campus", label: "Format" },
      { value: "Pearson", label: "Standard" },
    ],
    skills: [
      "Vibration analysis (time waveform and FFT)",
      "Thermal imaging for electrical and mechanical systems",
      "Ultrasonic testing for bearings and leaks",
      "Oil analysis and wear particle monitoring",
      "Motor current signature analysis (MCSA)",
      "Data collection and sensor deployment",
      "P-F curve and maintenance strategy planning",
      "Condition monitoring software tools",
    ],
    roles: [
      { role: "Condition Monitoring Technician", desc: "Collects and analyses vibration, thermal and ultrasonic data from rotating equipment to detect early faults." },
      { role: "Predictive Maintenance Analyst", desc: "Interprets monitoring data, generates work orders and prioritises maintenance activities based on equipment condition." },
      { role: "Reliability Engineer", desc: "Develops maintenance strategies, sets alarm thresholds, tracks asset health KPIs and reduces unplanned downtime." },
      { role: "Instrumentation Technician (PdM)", desc: "Installs and maintains sensors — accelerometers, temperature probes, current clamps — used in condition monitoring." },
    ],
    projects: [
      { pnum: "PRJ-01", title: "Vibration Fault Diagnosis", desc: "Collect vibration data from a motor test rig, perform FFT analysis and identify misalignment, imbalance and bearing defects." },
      { pnum: "PRJ-02", title: "Thermal Survey", desc: "Conduct an IR thermal survey of an electrical panel, identify hotspots and produce a prioritised report." },
      { pnum: "PRJ-03", title: "P-F Curve Dashboard", desc: "Build a dashboard that tracks the condition of five assets over time, plots P-F curves and alerts when intervention is needed." },
    ],
    feeTotal: "₹1,35,000",
    feeSteps: [
      { stage: "Stage 1", pct: "50%", amount: "₹67,500", title: "At enrolment", desc: "Paid upfront to secure your place." },
      { stage: "Stage 2", pct: "50%", amount: "₹67,500", title: "On offer or certification", desc: "Paid upon job offer or certification completion." },
    ],
    salaryBands: [
      { level: "Entry (0–2 yr)", amount: "₹3.5–6 LPA" },
      { level: "Mid (3–5 yr)", amount: "₹7–12 LPA" },
      { level: "Senior (5+ yr)", amount: "₹14–24 LPA" },
    ],
    published: true,
    metaTitle: "Predictive Maintenance Programme — Veritas by IQgrads",
    metaDesc: "Predictive maintenance training — vibration analysis, thermal imaging, MCSA and condition monitoring. Prevent failures before they happen.",
  },

  // ──────────────────────────────────────────────
  // D-19 Quality Engineering
  // ──────────────────────────────────────────────
  {
    title: "Quality Engineering",
    slug: "quality-engineering",
    domainCode: "D-19",
    tag: "Programme",
    sceneClass: "s-semi",
    shortDesc: "Standards, inspection and control.",
    lead: "Quality is not an act — it's a system. This programme teaches inspection methods, measurement tools, statistical quality control and the standards that global manufacturers demand.",
    overview: "Quality engineering ensures that products meet specifications consistently. It covers metrology, coordinate measuring machines (CMM), statistical process control (SPC), capability analysis, FMEA, control plans and audit-ready documentation. In India's export-oriented manufacturing sector, quality engineers are essential for meeting IATF 16949, ISO 9001 and AS9100 requirements.",
    quickStats: [
      { value: "5–6 mo", label: "Duration" },
      { value: "Graduate", label: "Entry level" },
      { value: "On-campus", label: "Format" },
      { value: "Pearson", label: "Standard" },
    ],
    skills: [
      "Dimensional inspection (calipers, micrometers, CMM)",
      "Statistical Process Control (SPC)",
      "Measurement System Analysis (MSA / Gage R&R)",
      "FMEA and control plan development",
      "Cp, Cpk and process capability analysis",
      "ISO 9001 / IATF 16949 basics",
      "Non-conformance and CAPA management",
      "Quality documentation and audit preparation",
    ],
    roles: [
      { role: "Quality Inspector", desc: "Performs dimensional and visual inspections using gauges, CMM and optical comparators, logs results against specifications." },
      { role: "SPC / Quality Analyst", desc: "Collects process data, builds control charts, analyses capability and recommends process adjustments." },
      { role: "Quality Engineer (Junior)", desc: "Develops FMEAs, control plans and PPAP documentation. Supports internal and customer audits." },
      { role: "Incoming / In-Process Quality Technician", desc: "Inspects raw materials and in-process parts, manages non-conformance records and coordinates containment actions." },
    ],
    projects: [
      { pnum: "PRJ-01", title: "CMM Measurement Lab", desc: "Measure a machined part on a CMM, generate a measurement report and compare results against GD&T tolerances." },
      { pnum: "PRJ-02", title: "SPC Control Study", desc: "Collect 25 samples of a critical dimension, build X-bar and R charts, calculate Cp and Cpk and assess process capability." },
      { pnum: "PRJ-03", title: "FMEA Workshop", desc: "Conduct a process FMEA for a five-step manufacturing operation, assign RPN values and develop recommended actions." },
    ],
    feeTotal: "₹1,25,000",
    feeSteps: [
      { stage: "Stage 1", pct: "50%", amount: "₹62,500", title: "At enrolment", desc: "Paid upfront to secure your place." },
      { stage: "Stage 2", pct: "50%", amount: "₹62,500", title: "On offer or certification", desc: "Paid upon job offer or certification completion." },
    ],
    salaryBands: [
      { level: "Entry (0–2 yr)", amount: "₹3–5 LPA" },
      { level: "Mid (3–5 yr)", amount: "₹6–10 LPA" },
      { level: "Senior (5+ yr)", amount: "₹12–20 LPA" },
    ],
    published: true,
    metaTitle: "Quality Engineering Programme — Veritas by IQgrads",
    metaDesc: "Quality engineering training — metrology, SPC, CMM, FMEA and ISO standards. Build the skills that global manufacturers require.",
  },

  // ──────────────────────────────────────────────
  // D-20 Manufacturing Excellence
  // ──────────────────────────────────────────────
  {
    title: "Manufacturing Excellence",
    slug: "manufacturing-excellence",
    domainCode: "D-20",
    tag: "Programme",
    sceneClass: "s-rail",
    shortDesc: "Lean, Six Sigma and operations.",
    lead: "Manufacturing excellence is about doing more with less. This programme teaches Lean, Six Sigma, TPM and operational improvement methods that reduce waste and boost productivity.",
    overview: "Manufacturing excellence is a strategic discipline that combines Lean manufacturing, Six Sigma, Total Productive Maintenance and operational KPIs to drive continuous improvement. This programme equips you with structured problem-solving methods, waste identification tools, value stream mapping skills and the ability to lead improvement projects on the shop floor.",
    quickStats: [
      { value: "5–6 mo", label: "Duration" },
      { value: "Graduate", label: "Entry level" },
      { value: "On-campus", label: "Format" },
      { value: "Pearson", label: "Standard" },
    ],
    skills: [
      "Lean manufacturing principles (7 wastes, 5S, Kaizen)",
      "Six Sigma DMAIC methodology",
      "Value stream mapping",
      "Total Productive Maintenance (TPM)",
      "Overall Equipment Effectiveness (OEE)",
      "Root cause analysis (5-Why, Fishbone, 8D)",
      "Visual management and standard work",
      "KPI tracking and operational dashboards",
    ],
    roles: [
      { role: "Lean Manufacturing Associate", desc: "Identifies wastes, conducts Kaizen events and supports Lean implementation on production lines." },
      { role: "Quality / Process Improvement Analyst", desc: "Leads DMAIC projects, analyses process data and implements corrective actions to reduce defects." },
      { role: "TPM Coordinator", desc: "Implements TPM pillars — autonomous maintenance, planned maintenance and early equipment management." },
      { role: "Operations Analyst", desc: "Tracks plant KPIs, builds dashboards and supports management with data-driven improvement recommendations." },
    ],
    projects: [
      { pnum: "PRJ-01", title: "Value Stream Map", desc: "Map the current-state VSM for a five-step process, identify waste and design a future-state VSM with 30% lead time reduction." },
      { pnum: "PRJ-02", title: "5S Audit and Implementation", desc: "Conduct a 5S audit on a workshop area, score each S, implement improvements and document the before-after transformation." },
      { pnum: "PRJ-03", title: "DMAIC Project", desc: "Complete a full DMAIC project on a real process — define the problem, measure baseline, analyse root causes, improve and control." },
    ],
    feeTotal: "₹1,20,000",
    feeSteps: [
      { stage: "Stage 1", pct: "50%", amount: "₹60,000", title: "At enrolment", desc: "Paid upfront to secure your place." },
      { stage: "Stage 2", pct: "50%", amount: "₹60,000", title: "On offer or certification", desc: "Paid upon job offer or certification completion." },
    ],
    salaryBands: [
      { level: "Entry (0–2 yr)", amount: "₹3–5 LPA" },
      { level: "Mid (3–5 yr)", amount: "₹6–10 LPA" },
      { level: "Senior (5+ yr)", amount: "₹12–22 LPA" },
    ],
    published: true,
    metaTitle: "Manufacturing Excellence Programme — Veritas by IQgrads",
    metaDesc: "Lean manufacturing and Six Sigma training — VSM, DMAIC, TPM and OEE. Drive continuous improvement on the shop floor.",
  },

  // ──────────────────────────────────────────────
  // D-21 Industrial Data Analytics
  // ──────────────────────────────────────────────
  {
    title: "Industrial Data Analytics",
    slug: "industrial-data-analytics",
    domainCode: "D-21",
    tag: "Programme",
    sceneClass: "s-iot",
    shortDesc: "Turning machine data into insight.",
    lead: "Factories produce terabytes of data. This programme teaches you to collect, clean, analyse and visualise industrial data to drive better manufacturing decisions.",
    overview: "Industrial data analytics bridges OT (sensor data from machines) and IT (dashboards, databases and BI tools). This programme covers data pipelines from PLCs and SCADA systems, time-series databases, Python for industrial data analysis, statistical methods and real-time dashboards. You'll learn to turn raw machine signals into actionable insights for operations, quality and maintenance teams.",
    quickStats: [
      { value: "5–6 mo", label: "Duration" },
      { value: "Graduate", label: "Entry level" },
      { value: "On-campus", label: "Format" },
      { value: "Pearson", label: "Standard" },
    ],
    skills: [
      "Data collection from PLC, SCADA and IoT systems",
      "Time-series databases (InfluxDB, TimescaleDB)",
      "Python for data analysis (pandas, NumPy)",
      "Data cleaning and preprocessing",
      "Statistical analysis and correlation",
      "Dashboard development (Grafana, Power BI)",
      "SQL for manufacturing data",
      "Data governance and documentation",
    ],
    roles: [
      { role: "Data Analyst (Manufacturing)", desc: "Collects, cleans and analyses production data, builds reports and dashboards for operational decision-making." },
      { role: "OT Data Engineer", desc: "Builds data pipelines from shop-floor systems (PLC, SCADA) to databases and analytics platforms." },
      { role: "Dashboard / BI Developer", desc: "Designs and maintains real-time dashboards showing production, quality and maintenance KPIs." },
      { role: "Process Data Scientist (Junior)", desc: "Applies statistical methods and basic ML to manufacturing data — anomaly detection, clustering and forecasting." },
    ],
    projects: [
      { pnum: "PRJ-01", title: "Production Data Pipeline", desc: "Build a pipeline from a simulated PLC to InfluxDB, then visualise OEE, cycle time and reject rate on a Grafana dashboard." },
      { pnum: "PRJ-02", title: "Scrap Root Cause Analysis", desc: "Analyse a dataset of 10,000 production records using Python to identify which process parameters most strongly correlate with scrap." },
      { pnum: "PRJ-03", title: "Downtime Tracker", desc: "Create an automated downtime tracker that logs machine stop reasons, duration and frequency, with a Pareto chart dashboard." },
    ],
    feeTotal: "₹1,30,000",
    feeSteps: [
      { stage: "Stage 1", pct: "50%", amount: "₹65,000", title: "At enrolment", desc: "Paid upfront to secure your place." },
      { stage: "Stage 2", pct: "50%", amount: "₹65,000", title: "On offer or certification", desc: "Paid upon job offer or certification completion." },
    ],
    salaryBands: [
      { level: "Entry (0–2 yr)", amount: "₹3.5–6 LPA" },
      { level: "Mid (3–5 yr)", amount: "₹7–12 LPA" },
      { level: "Senior (5+ yr)", amount: "₹14–24 LPA" },
    ],
    published: true,
    metaTitle: "Industrial Data Analytics Programme — Veritas by IQgrads",
    metaDesc: "Industrial data analytics training — time-series databases, Python, Grafana and manufacturing dashboards. Turn data into decisions.",
  },

  // ──────────────────────────────────────────────
  // D-22 Advanced Manufacturing
  // ──────────────────────────────────────────────
  {
    title: "Advanced Manufacturing",
    slug: "advanced-manufacturing",
    domainCode: "D-22",
    tag: "Programme",
    sceneClass: "s-robot",
    shortDesc: "Additive and next-gen processes.",
    lead: "3D printing, laser cutting and hybrid manufacturing are changing how things are made. This programme covers the tools and techniques of next-generation manufacturing.",
    overview: "Advanced manufacturing includes additive manufacturing (3D printing), subtractive processes (CNC, laser), hybrid techniques and new materials processing. These technologies enable rapid prototyping, low-volume production and complex geometries that traditional methods cannot achieve. This programme covers FDM, SLA, SLS and metal printing, CNC programming, laser processing and design-for-manufacture principles.",
    quickStats: [
      { value: "5–6 mo", label: "Duration" },
      { value: "Graduate", label: "Entry level" },
      { value: "On-campus", label: "Format" },
      { value: "Pearson", label: "Standard" },
    ],
    skills: [
      "FDM, SLA and SLS 3D printing operation",
      "Metal additive manufacturing basics",
      "CAD-to-print workflow and slicer settings",
      "CNC programming (G-code, CAM basics)",
      "Laser cutting and engraving",
      "Material selection for additive processes",
      "Post-processing and finishing techniques",
      "Design for additive manufacturing (DfAM)",
    ],
    roles: [
      { role: "Additive Manufacturing Technician", desc: "Operates 3D printers — FDM, SLA, SLS — manages print parameters, material handling and post-processing." },
      { role: "CNC Programming Technician", desc: "Writes and optimises CNC programs using CAM software, sets up tools and validates parts against CAD models." },
      { role: "Rapid Prototyping Specialist", desc: "Takes designs from CAD to physical prototype using multiple technologies, optimising for speed and quality." },
      { role: "Advanced Process Technician", desc: "Operates laser cutting systems, manages hybrid manufacturing cells and troubleshoots process parameters." },
    ],
    projects: [
      { pnum: "PRJ-01", title: "Functional Prototype", desc: "Design and 3D-print a multi-part functional prototype, optimise print orientation, support structures and post-process for assembly." },
      { pnum: "PRJ-02", title: "CNC Part Program", desc: "Program a three-axis CNC mill to machine an aluminium part from a CAD model, including tool selection and fixture design." },
      { pnum: "PRJ-03", title: "Hybrid Part Production", desc: "Produce a part that combines additive (3D-printed base) and subtractive (CNC-machined features) processes in one workflow." },
    ],
    feeTotal: "₹1,40,000",
    feeSteps: [
      { stage: "Stage 1", pct: "50%", amount: "₹70,000", title: "At enrolment", desc: "Paid upfront to secure your place." },
      { stage: "Stage 2", pct: "50%", amount: "₹70,000", title: "On offer or certification", desc: "Paid upon job offer or certification completion." },
    ],
    salaryBands: [
      { level: "Entry (0–2 yr)", amount: "₹3.5–6 LPA" },
      { level: "Mid (3–5 yr)", amount: "₹7–12 LPA" },
      { level: "Senior (5+ yr)", amount: "₹14–24 LPA" },
    ],
    published: true,
    metaTitle: "Advanced Manufacturing Programme — Veritas by IQgrads",
    metaDesc: "Advanced manufacturing training — 3D printing, CNC, laser processing and hybrid techniques. Build the future of manufacturing.",
  },
];

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function seed() {
  console.log("Connecting to MongoDB Atlas…");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected.\n");

  // Upsert programmes (replace with full content)
  let updated = 0;
  let inserted = 0;
  for (const p of FULL_PROGRAMMES) {
    const slug = p.slug || slugify(p.title);
    const exists = await Programme.findOne({ slug });
    if (exists) {
      await Programme.updateOne({ slug }, { $set: { ...p, slug } });
      updated++;
      console.log(`  ↻ ${p.domainCode} ${p.title} (updated)`);
    } else {
      await Programme.create({ ...p, slug });
      inserted++;
      console.log(`  + ${p.domainCode} ${p.title} (inserted)`);
    }
  }
  console.log(`\nProgrammes: ${inserted} inserted, ${updated} updated.\n`);

  // Upsert admin
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@veritas.com").toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";
  const existingAdmin = await Admin.findOne({ email: adminEmail });
  if (existingAdmin) {
    console.log(`Admin (${adminEmail}) already exists — skipped.\n`);
  } else {
    const bcrypt = require("bcryptjs");
    const hashed = await bcrypt.hash(adminPassword, 12);
    await Admin.create({
      name: "Admin",
      email: adminEmail,
      password: hashed,
      role: "admin",
    });
    console.log(`Admin seeded: ${adminEmail} / ${adminPassword}\n`);
  }

  await mongoose.disconnect();
  console.log("Done. Disconnected.");
}

seed().catch((err) => { console.error(err); process.exit(1); });
