import React from "react";

// Component con hiển thị thẻ Card nhỏ
const Card = ({ title, tag, tagColor, avatars = [] }) => (
  <div className="bg-white p-3 rounded shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-pointer group">
    <p className="text-sm font-medium text-gray-700 mb-3 group-hover:text-blue-600">
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
            className="w-5 h-5 rounded-full bg-gray-200 border border-white flex items-center justify-center text-[8px] overflow-hidden"
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
    <div className="bg-white rounded-xl shadow-2xl p-4 w-full max-w-3xl border border-gray-100 transform rotate-1 md:rotate-0 transition-transform hover:scale-[1.01] duration-500">
      {/* Fake Header */}
      <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2 text-blue-900 font-bold text-lg">
          <span className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs">
            J
          </span>{" "}
          Jira
        </div>
        <div className="flex gap-3 items-center">
          <div className="bg-gray-100 text-gray-400 text-sm px-3 py-1.5 rounded w-48 hidden sm:block">
            Search...
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-200"></div>
        </div>
      </div>

      {/* Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Column: TO DO */}
        <div className="bg-gray-50 p-2 rounded-lg flex flex-col gap-3">
          <h4 className="text-xs font-bold text-gray-500 uppercase ml-1">
            To Do
          </h4>
          <Card
            title="Design new billing API"
            tag="Features"
            tagColor="bg-blue-600"
            avatars={["👨‍🦰"]}
          />
          <div className="bg-white p-3 rounded shadow-sm border border-gray-200 border-l-4 border-l-green-500">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-4 h-4 bg-green-100 text-green-600 rounded text-[10px] flex items-center justify-center font-bold">
                ST
              </span>
              <span className="text-xs font-bold text-gray-700">STORY</span>
            </div>
          </div>
        </div>

        {/* Column: IN PROGRESS */}
        <div className="bg-gray-50 p-2 rounded-lg flex flex-col gap-3">
          <h4 className="text-xs font-bold text-gray-500 uppercase ml-1">
            In Progress
          </h4>
          <Card
            title="Add advanced analytics tracking events"
            tag="Analytics"
            tagColor="bg-green-600"
            avatars={["👩"]}
          />
          <Card
            title="Create AI-generated shopping suggestions for homepage"
            tag="Features"
            tagColor="bg-blue-600"
            avatars={["⛔", "👤"]}
          />
        </div>

        {/* Column: DONE */}
        <div className="bg-gray-50 p-2 rounded-lg flex flex-col gap-3">
          <h4 className="text-xs font-bold text-gray-500 uppercase ml-1">
            Done
          </h4>
          <Card
            title="Define requirements to use new AI integrations"
            tag="Features"
            tagColor="bg-blue-600"
            avatars={["🚩", "🧔"]}
          />
          <Card
            title="Improve payment checkout time on mobile"
            tag="Payments"
            tagColor="bg-purple-600"
            avatars={["👨‍💻"]}
          />
          <div className="bg-white p-2 rounded shadow-sm border border-gray-200 flex items-center gap-2">
            <span className="w-4 h-4 bg-red-100 text-red-600 rounded text-[10px] flex items-center justify-center font-bold">
              ●
            </span>
            <span className="text-xs font-bold text-gray-700">BUG</span>
          </div>
        </div>
      </div>
    </div>
  );
}
