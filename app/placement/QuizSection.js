"use client";
import { useState } from "react";
import Link from "next/link";

const QQ = [
  { q: "Where are you right now?", opts: [["A recent graduate","grad"],["Out of work for a while","unemp"],["Working, but want to switch fields","switch"]] },
  { q: "What's holding you back most?", opts: [["No real practical skills yet","a"],["No interview callbacks","b"],["Not sure which field to pick","c"]] },
  { q: "What matters most to you?", opts: [["A career, with support until I'm in it","support"],["Skills employers actually want","skills"],["A path that could lead abroad later","abroad"]] },
];

export default function QuizSection() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [done, setDone] = useState(false);

  const handleOpt = (val) => {
    const newAnswers = [...answers, val];
    if (step < 2) {
      setAnswers(newAnswers);
      setStep(step + 1);
    } else {
      setAnswers(newAnswers);
      setDone(true);
    }
  };

  const retake = () => { setAnswers([]); setStep(0); setDone(false); };

  const getMsg = () => {
    const msgs = {
      grad: "You're closer than it feels. The missing piece is usually demonstrable, hands-on skill — exactly what a Veritas programme builds, to a globally trusted Pearson standard, with support until you're hired.",
      unemp: "The silence isn't a verdict on you. With job-ready skills and a team that keeps working with you — including bridging training — getting placed becomes a process, not a gamble.",
      switch: "Switching is more realistic than it looks. A focused, hands-on path into a high-demand field, plus placement support, is how career changers make the jump.",
    };
    let msg = msgs[answers[0]] || "You have a clear next step — and you don't have to take it alone.";
    if (answers[2] === "abroad") msg += " And these skills open real pathways to a Master's abroad, especially in Europe.";
    return msg;
  };

  return (
    <div className="quiz-wrap">
      {!done ? (
        <>
          <div className="quiz-prog">Question {step + 1} of 3</div>
          <div className="quiz-q">{QQ[step].q}</div>
          <div className="quiz-opts">
            {QQ[step].opts.map(([label, val]) => (
              <button key={val} className="quiz-opt" onClick={() => handleOpt(val)}>{label}</button>
            ))}
          </div>
        </>
      ) : (
        <div className="quiz-result">
          <div className="qr-ic">
            <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3>Here&apos;s your next step</h3>
          <p>{getMsg()}</p>
          <Link className="btn btn-primary" href="/book">Book your free consultation <span className="arrow">→</span></Link>
          <div><button className="retake" onClick={retake}>Retake the check</button></div>
        </div>
      )}
    </div>
  );
}
