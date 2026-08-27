"use client";
import { useState } from "react";
import Link from "next/link";

const DEFAULT_QUIZ_CONTENT = {
  questions: [
    {
      q: "Where are you right now?",
      opts: [
        { label: "A recent graduate", val: "grad" },
        { label: "Out of work for a while", val: "unemp" },
        { label: "Working, but want to switch fields", val: "switch" },
      ],
    },
    {
      q: "What's holding you back most?",
      opts: [
        { label: "No real practical skills yet", val: "a" },
        { label: "No interview callbacks", val: "b" },
        { label: "Not sure which field to pick", val: "c" },
      ],
    },
    {
      q: "What matters most to you?",
      opts: [
        { label: "A career, with support until I'm in it", val: "support" },
        { label: "Skills employers actually want", val: "skills" },
        { label: "A path that could lead abroad later", val: "abroad" },
      ],
    },
  ],
  messages: {
    grad: "You're closer than it feels. The missing piece is usually demonstrable, hands-on skill - exactly what a Veritas programme builds, to a globally trusted Pearson standard, with support until you're hired.",
    unemp: "The silence isn't a verdict on you. With job-ready skills and a team that keeps working with you - including bridging training - getting placed becomes a process, not a gamble.",
    switch: "Switching is more realistic than it looks. A focused, hands-on path into a high-demand field, plus placement support, is how career changers make the jump.",
    default: "You have a clear next step - and you don't have to take it alone.",
    abroadSuffix: " And these skills open real pathways to a Master's abroad, especially in Europe.",
  },
};

export default function QuizSection({ content = DEFAULT_QUIZ_CONTENT }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [done, setDone] = useState(false);

  const quiz = content || DEFAULT_QUIZ_CONTENT;
  const questions = quiz.questions || DEFAULT_QUIZ_CONTENT.questions;
  const messages = quiz.messages || DEFAULT_QUIZ_CONTENT.messages;

  const handleOpt = (val) => {
    const newAnswers = [...answers, val];
    if (step < questions.length - 1) {
      setAnswers(newAnswers);
      setStep(step + 1);
    } else {
      setAnswers(newAnswers);
      setDone(true);
    }
  };

  const retake = () => { setAnswers([]); setStep(0); setDone(false); };

  const getMsg = () => {
    let msg = messages[answers[0]] || messages.default || DEFAULT_QUIZ_CONTENT.messages.default;
    const finalAnswer = answers[questions.length - 1];
    if (finalAnswer === "abroad") msg += messages.abroadSuffix || DEFAULT_QUIZ_CONTENT.messages.abroadSuffix;
    return msg;
  };

  return (
    <div className="quiz-wrap">
      {!done ? (
        <>
          <div className="quiz-prog">Question {step + 1} of {questions.length}</div>
          <div className="quiz-q">{questions[step]?.q}</div>
          <div className="quiz-opts">
            {(questions[step]?.opts || []).map((opt, index) => (
              <button
                key={`${opt.val || opt.label || "opt"}-${index}`}
                className="quiz-opt"
                onClick={() => handleOpt(opt.val)}
              >
                {opt.label}
              </button>
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
