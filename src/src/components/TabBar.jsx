import React from "react";

export default function TabBar({
  tabs,
  activeTab,
  setActiveTab,

  closeTab,
}) {
  return (
    <div className="tab-bar">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`tab ${tab.id === activeTab ? "active" : ""}`}
          onClick={() => setActiveTab(tab.id)}
        >
          <span>{tab.title}</span>
          <button
            className="close-btn"
            onClick={(e) => {
              e.stopPropagation();
              closeTab(tab.id);
            }}
          >
            <div className="tab-control">
              <span className="btn close"></span>
            </div>
          </button>
        </div>
      ))}
    </div>
  );
}
