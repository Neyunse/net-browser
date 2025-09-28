import React, { useState, useEffect } from "react";

export default function TopBar({ tab, addTab, onNavigate }) {
  const [url, setUrl] = useState(tab?.url || "");
  const [isValidUrl, setIsValidUrl] = useState(true);
  useEffect(() => {
    if (tab?.url) {
      setUrl(tab.url.replace(/^https?:\/\//, ""));
    } else {
      setUrl("");
    }
  }, [tab]);

  const validateUrl = (value) => {
    const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/i;
    return urlPattern.test(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const valid = validateUrl(url);
      setIsValidUrl(valid);
      if (!valid) return;
      let finalUrl = url;
      if (!/^https?:\/\//.test(url)) {
        finalUrl = "https://" + url;
      }

      if (url && !tab) {
        addTab(finalUrl, finalUrl);
      }

      onNavigate(finalUrl);
    }
  };

  return (
    <div className="safari-bar">
      {/* Botones ventana */}
      {/* Botón compartir y añadir pestaña */}
      <div className="actions">
        <button onClick={() => addTab()} className="icon">
          ＋
        </button>
      </div>

      {/* Barra de direcciones */}
      <input
        className="address-bar"
        value={url}
        onChange={(e) => {
          setUrl(e.target.value);
          setIsValidUrl(true);
        }}
        onKeyDown={handleKeyDown}
        placeholder="Buscar o ingresar dirección"
        style={{ borderColor: isValidUrl ? "#ccc" : "red" }}
      />

      <div className="window-controls">
        <span
          onClick={window.electronAPI.MaximizeBrowser}
          className="btn maximize"
        ></span>
        <span
          onClick={window.electronAPI.MinimizeBrowser}
          className="btn minimize"
        ></span>
        <span
          onClick={window.electronAPI.CloseBrowser}
          className="btn close"
        ></span>
      </div>
    </div>
  );
}
