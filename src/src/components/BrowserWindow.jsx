import React, { useEffect, useRef, useState } from "react";

export default function BrowserWindow({ tab, onVisit, children }) {
  const webviewRef = useRef();
  const [error, setError] = useState(null);

  useEffect(() => {
    const webview = webviewRef.current;

    if (webview && tab?.url) {
      const handleDidFailLoad = (event) => {
        console.error("Error loading page:", event.errorDescription);
        setError({
          description: event.errorDescription,
          code: event.errorCode,
          url: event.validatedURL,
        });
        onVisit(tab.url, "Error loading page");
      };

      const handleDidNavigate = (event) => {
        console.log("Navigated to:", event.url);
        setError(null);
      };

      webview.addEventListener("did-fail-load", handleDidFailLoad);
      webview.addEventListener("did-navigate", handleDidNavigate);

      return () => {
        webview.removeEventListener("did-fail-load", handleDidFailLoad);
        webview.removeEventListener("did-navigate", handleDidNavigate);
      };
    }
  }, [tab, webviewRef]);

  useEffect(() => {
    const webview = webviewRef.current;
    if (!webview || !tab) return;

    const updateTitle = () => {
      const title = webview.getTitle();
      if (title) onVisit(tab.url, title);
    };

    setTimeout(() => {
      const title = webview.getTitle();
      if (tab.title !== title) {
        onVisit(tab.url, title);
        clearInterval();
      }
    }, 100);

    webview.addEventListener("did-finish-load", updateTitle);
    webview.addEventListener("page-title-updated", updateTitle);

    return () => {
      webview.removeEventListener("did-finish-load", updateTitle);
      webview.removeEventListener("page-title-updated", updateTitle);
    };
  }, [tab]);

  return (
    <>
      {tab && children}
      <div className="webViewContainer flex-1 bg-white">
        {tab && (
          <>
            {error && (
              <div className="error-overlay">
                <h2>The page could not be loaded.</h2>
                <p>URL: {error.url}</p>
                <p className="error-code">
                  {error.description} (código {error.code})
                </p>
                <button
                  onClick={() => {
                    if (webviewRef.current) {
                      setError(null);
                      webviewRef.current.reload();
                    }
                  }}
                >
                  Reintentar
                </button>
              </div>
            )}
            <webview
              ref={webviewRef}
              src={tab.url}
              useragent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36"
              allowpopups
              className="webview"
              style={{
                display: error ? "none" : "flex",
              }}
            ></webview>
          </>
        )}
      </div>
    </>
  );
}
