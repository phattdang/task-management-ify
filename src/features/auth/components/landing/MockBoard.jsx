import React from "react";

// Component con hiển thị thẻ Card nhỏ
const Card = ({ title, tag, tagColor, avatars = [] }) => (
  <div className="bg-white dark:bg-slate-900/60 p-3 rounded-lg shadow-sm dark:shadow-none border border-slate-200 dark:border-slate-800/50 hover:shadow-md dark:hover:border-cyan-500/30 transition-all duration-300 cursor-pointer group hover:-translate-y-0.5">
    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-3 group-hover:text-blue-600 dark:group-hover:text-cyan-400">
      {title}
    </p>
    <div className="flex justify-between items-center">
      <span
        className={`${tagColor} text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase`}
      >
        {tag}
      </span>
      {/* Avatar Group */}
      <div className="flex -space-x-1">
        {avatars.map((ava, i) => (
          <div
            key={i}
            className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 border border-white dark:border-slate-900 flex items-center justify-center text-[8px] overflow-hidden text-slate-700 dark:text-slate-200"
          >
            {ava}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default function MockBoard() {
  return (
    <div className="bg-white dark:bg-slate-900/40 rounded-xl shadow-2xl dark:shadow-[0_25px_50px_rgba(6,182,212,0.08)] p-4 w-full max-w-3xl border border-slate-200 dark:border-slate-800/50 transform rotate-1 md:rotate-0 transition-all duration-500 hover:scale-[1.01] backdrop-blur-sm">
      {/* Fake Header */}
      <div className="flex items-center justify-between mb-6 border-b border-slate-200 dark:border-slate-800/50 pb-3">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold text-lg">
          <span className="w-6 h-6 bg-blue-600 dark:bg-cyan-500 rounded flex items-center justify-center text-white text-xs">
            UT
          </span>{" "}
          UNEMPLOYED TEAM
        </div>
        <div className="flex gap-3 items-center">
          <div className="bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-sm px-3 py-1.5 rounded w-48 hidden sm:block border border-slate-200 dark:border-slate-700/50">
            Search...
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 border border-slate-200 dark:border-slate-600"></div>
        </div>
      </div>

      {/* Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Column: TO DO */}
        <div className="bg-slate-50 dark:bg-slate-950/50 p-2 rounded-lg flex flex-col gap-3 border border-slate-100 dark:border-slate-800/30">
          <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">
            To Do
          </h4>
          <Card
            title="Design new billing API"
            tag="Features"
            tagColor="bg-blue-600 dark:bg-blue-500"
            avatars={["👨‍🦰"]}
          />
          <div className="bg-white dark:bg-slate-900/60 p-3 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800/50 border-l-4 border-l-emerald-500 dark:border-l-cyan-500">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-4 h-4 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded text-[10px] flex items-center justify-center font-bold">
                ST
              </span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                STORY
              </span>
            </div>
          </div>
        </div>

        {/* Column: IN PROGRESS */}
        <div className="bg-slate-50 dark:bg-slate-950/50 p-2 rounded-lg flex flex-col gap-3 border border-slate-100 dark:border-slate-800/30">
          <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">
            In Progress
          </h4>
          <Card
            title="Add advanced analytics tracking events"
            tag="Analytics"
            tagColor="bg-emerald-600 dark:bg-emerald-500"
            avatars={["👩"]}
          />
          <Card
            title="Create AI-generated shopping suggestions for homepage"
            tag="Features"
            tagColor="bg-blue-600 dark:bg-blue-500"
            avatars={["⛔", "👤"]}
          />
        </div>

        {/* Column: DONE */}
        <div className="bg-slate-50 dark:bg-slate-950/50 p-2 rounded-lg flex flex-col gap-3 border border-slate-100 dark:border-slate-800/30">
          <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">
            Done
          </h4>
          <Card
            title="Define requirements to use new AI integrations"
            tag="Features"
            tagColor="bg-blue-600 dark:bg-blue-500"
            avatars={["🚩", "🧔"]}
          />
          <Card
            title="Improve payment checkout time on mobile"
            tag="Payments"
            tagColor="bg-purple-600 dark:bg-purple-500"
            avatars={["👨‍💻"]}
          />
          <div className="bg-white dark:bg-slate-900/60 p-2 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800/50 flex items-center gap-2">
            <span className="w-4 h-4 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 rounded text-[10px] flex items-center justify-center font-bold">
              ●
            </span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              BUG
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
