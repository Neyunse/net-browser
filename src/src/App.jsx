import React, { useState } from "react";
import TabBar from "./components/TabBar";
import TopBar from "./components/TopBar";
import BrowserWindow from "./components/BrowserWindow";

export default function App() {
  const [tabs, setTabs] = useState();
  const [activeTab, setActiveTab] = useState();

  const addTab = (url, title) => {
    const id = Math.random().toString(36).substr(2, 9);

    const newTab = {
      id: id,
      title: title ? title : "about:blank",
      url: url ? url : "about:blank",
    };

    if (tabs) {
      setTabs([...tabs, newTab]);
      setActiveTab(id);
      return;
    }

    setTabs([newTab]);
    setActiveTab(id);
  };

  const closeTab = (id) => {
    const idx = tabs.findIndex((t) => t.id === id);
    const newTabs = tabs.filter((t) => t.id !== id);
    setTabs(newTabs);

    if (activeTab === id) {
      if (newTabs.length) {
        const newActive = newTabs[idx]
          ? newTabs[idx].id
          : newTabs[newTabs.length - 1].id;
        setActiveTab(newActive);
      } else {
        setActiveTab();
      }
    }
  };

  const updateTab = (url, title) => {
    setTabs((prev) =>
      prev.map((t) => (t.id === activeTab ? { ...t, title, url } : t))
    );
  };

  const active = tabs ? tabs.find((t) => t.id === activeTab) : null;

  return (
    <div className="app">
      <TopBar
        addTab={addTab}
        tab={active}
        onNavigate={(url) => updateTab(url, url)}
      />

      <BrowserWindow tab={active} onVisit={updateTab}>
        <TabBar
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          closeTab={closeTab}
        />
      </BrowserWindow>
    </div>
  );
}
