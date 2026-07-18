"use client";
import Link from "next/link";

const STATIC_DOMAINS = [
  ["D-01","Railway Engineering","Signalling, rolling stock and rail systems.","s-rail"],
  ["D-02","Semiconductor Manufacturing","Fabrication, cleanroom and packaging.","s-semi"],
  ["D-03","Robotics","Industrial arms, work cells and programming.","s-robot"],
  ["D-04","Mechatronics","Integrated mechanical–electronic systems.","s-auto"],
  ["D-05","Internet of Things (IoT)","Sensors, connectivity and edge devices.","s-iot"],
  ["D-06","Industrial Automation","Control systems and production lines.","s-auto"],
  ["D-07","PLC & SCADA","Programming, HMI and supervisory control.","s-auto"],
  ["D-08","Embedded Systems","Firmware, microcontrollers, real-time.","s-iot"],
  ["D-09","AI for Manufacturing","Vision, optimisation and smart control.","s-robot"],
  ["D-10","Electric Vehicles","Powertrains, batteries and charging.","s-ev"],
  ["D-11","Industry 4.0","Connected, data-driven production.","s-auto"],
  ["D-12","Smart Manufacturing","Digitised, flexible factories.","s-semi"],
  ["D-13","Machine Vision","Automated inspection and guidance.","s-iot"],
  ["D-14","Industrial Networking","Protocols and plant connectivity.","s-iot"],
  ["D-15","Digital Twin","Simulation and virtual commissioning.","s-auto"],
  ["D-16","Industrial Cybersecurity","Securing connected operations.","s-robot"],
  ["D-17","Renewable Energy Systems","Solar, wind and energy integration.","s-ev"],
  ["D-18","Predictive Maintenance","Condition monitoring and analytics.","s-auto"],
  ["D-19","Quality Engineering","Standards, inspection and control.","s-semi"],
  ["D-20","Manufacturing Excellence","Lean, Six Sigma and operations.","s-rail"],
  ["D-21","Industrial Data Analytics","Turning machine data into insight.","s-iot"],
  ["D-22","Advanced Manufacturing","Additive and next-gen processes.","s-robot"],
];

export default function ProgrammesGrid({ dbProgrammes = [] }) {
  // Build a map of domainCode -> db slug
  const dbMap = {};
  dbProgrammes.forEach((p) => { dbMap[p.domainCode] = p; });

  return (
    <div className="prog-grid" id="progGrid">
      {/* DB-published programmes first */}
      {dbProgrammes.map((p) => (
        <Link className="prog-card" href={`/programmes/${p.slug}`} key={p._id}>
          <div className={`pc-img cine ${p.sceneClass || "s-auto"}`}><div className="ph"></div><div className="tint"></div></div>
          <div className="pc-body">
            <div className="pc-top">
              <span className="pc-tag">Programme</span>
              <span className="pc-num">{p.domainCode}</span>
            </div>
            <h3>{p.title}</h3>
            <p>{p.shortDesc}</p>
            <div className="pc-foot"><span>View pathway</span><span>→</span></div>
          </div>
        </Link>
      ))}

      {/* Static cards for domains NOT yet in DB */}
      {STATIC_DOMAINS.filter(([code]) => !dbMap[code]).map(([code, title, desc, cls]) => (
        <Link className="prog-card" href="/programme" key={code}>
          <div className={`pc-img cine ${cls}`}><div className="ph"></div><div className="tint"></div></div>
          <div className="pc-body">
            <div className="pc-top">
              <span className="pc-tag">Programme</span>
              <span className="pc-num">{code}</span>
            </div>
            <h3>{title}</h3>
            <p>{desc}</p>
            <div className="pc-foot"><span>View pathway</span><span>→</span></div>
          </div>
        </Link>
      ))}
    </div>
  );
}
