import { useEffect, useRef } from "react";

const DIdAgent = ({ onStatusChange }) => {
  const initializedRef = useRef(false);
  const cleanupRef = useRef(null);

  useEffect(() => {
    // React StrictMode duplicate initialization protection
    if (initializedRef.current) {
      return;
    }

    initializedRef.current = true;

    const clientKey =
      import.meta.env.VITE_DID_CLIENT_KEY;

    const agentId =
      import.meta.env.VITE_DID_AGENT_ID;

    console.log("=================================");
    console.log("D-ID AGENT CHECK");
    console.log(
      "Agent ID:",
      agentId || "MISSING"
    );
    console.log(
      "Client Key:",
      clientKey ? "Present" : "MISSING"
    );
    console.log("=================================");

    if (!clientKey || !agentId) {
      console.error(
        "❌ D-ID Agent ID or Client Key missing"
      );

      onStatusChange?.("fail");

      return;
    }

    const SCRIPT_ID = "did-agent-script";

    let script =
      document.getElementById(SCRIPT_ID);

    const setupEvents = () => {
      const api =
        window.DID_AGENTS_API;

      if (!api) {
        console.error(
          "❌ DID_AGENTS_API not available"
        );

        onStatusChange?.("fail");

        return;
      }

      console.log(
        "✅ D-ID API loaded"
      );

      console.log(
        "D-ID API:",
        api
      );

      // -----------------------------------------
      // CONNECTION EVENT
      // -----------------------------------------

      const unsubscribeConnection =
        api.events.on(
          "connection",
          ({ state }) => {
            console.log(
              "🔵 D-ID CONNECTION:",
              state
            );

            onStatusChange?.(state);

            if (
              state === "connected"
            ) {
              console.log(
                "✅ D-ID INTERVIEWER CONNECTED"
              );
            }

            if (
              state === "connecting"
            ) {
              console.log(
                "⏳ D-ID CONNECTING..."
              );
            }

            if (
              state === "fail"
            ) {
              console.error(
                "❌ D-ID CONNECTION FAILED"
              );
            }

            if (
              state === "disconnected"
            ) {
              console.warn(
                "⚠️ D-ID DISCONNECTED"
              );
            }
          }
        );

      // -----------------------------------------
      // AGENT ACTIVITY
      // -----------------------------------------

      const unsubscribeActivity =
        api.events.on(
          "agentActivity",
          ({ state }) => {
            console.log(
              "🤖 D-ID ACTIVITY:",
              state
            );
          }
        );

      // -----------------------------------------
      // ERROR
      // -----------------------------------------

      const unsubscribeError =
        api.events.on(
          "error",
          ({ error }) => {
            console.error(
              "❌ D-ID ERROR:",
              error
            );

            onStatusChange?.("fail");
          }
        );

      // -----------------------------------------
      // CONFIGURE
      // -----------------------------------------

      try {
        if (
          api.configure
        ) {
          api.configure({
            orientation:
              "horizontal",

            openMode:
              "expanded",

            autoConnect:
              true,
          });
        }
      } catch (error) {
        console.error(
          "D-ID configure error:",
          error
        );
      }

      cleanupRef.current = () => {
        unsubscribeConnection?.();
        unsubscribeActivity?.();
        unsubscribeError?.();
      };
    };

    // =====================================================
    // IF SCRIPT ALREADY EXISTS
    // =====================================================

    if (script) {
      console.log(
        "ℹ️ D-ID script already exists"
      );

      let attempts = 0;

      const checkApi =
        setInterval(() => {
          attempts++;

          if (
            window.DID_AGENTS_API
          ) {
            clearInterval(
              checkApi
            );

            setupEvents();
          }

          if (attempts >= 100) {
            clearInterval(
              checkApi
            );

            console.error(
              "❌ D-ID API timeout"
            );

            onStatusChange?.(
              "fail"
            );
          }
        }, 100);

      cleanupRef.current = () => {
        clearInterval(
          checkApi
        );
      };

      return () => {
        cleanupRef.current?.();
      };
    }

    // =====================================================
    // CREATE SCRIPT
    // =====================================================

    script =
      document.createElement(
        "script"
      );

    script.id =
      SCRIPT_ID;

    script.type =
      "module";

    script.src =
      "https://agent.d-id.com/v2/index.js";

    // IMPORTANT
    script.setAttribute(
      "data-name",
      "did-agent"
    );

    script.setAttribute(
      "data-mode",
      "full"
    );

    script.setAttribute(
      "data-target-id",
      "did-agent-container"
    );

    script.setAttribute(
      "data-client-key",
      clientKey
    );

    script.setAttribute(
      "data-agent-id",
      agentId
    );

    script.setAttribute(
      "data-orientation",
      "horizontal"
    );

    script.setAttribute(
      "data-open-mode",
      "expanded"
    );

    script.setAttribute(
      "data-auto-connect",
      "true"
    );

    script.setAttribute(
      "data-show-agent-name",
      "false"
    );

    // -----------------------------------------
    // SCRIPT LOAD
    // -----------------------------------------

    script.onload = () => {
      console.log(
        "✅ D-ID SCRIPT LOADED"
      );

      let attempts = 0;

      const checkApi =
        setInterval(() => {
          attempts++;

          if (
            window.DID_AGENTS_API
          ) {
            clearInterval(
              checkApi
            );

            setupEvents();
          }

          if (attempts >= 100) {
            clearInterval(
              checkApi
            );

            console.error(
              "❌ D-ID API failed to load"
            );

            onStatusChange?.(
              "fail"
            );
          }
        }, 100);
    };

    script.onerror = (
      error
    ) => {
      console.error(
        "❌ D-ID SCRIPT ERROR:",
        error
      );

      onStatusChange?.(
        "fail"
      );
    };

    document.body.appendChild(
      script
    );

    return () => {
      cleanupRef.current?.();
    };
  }, [onStatusChange]);

  return (
    <div
      id="did-agent-container"
      className="did-agent-container"
    />
  );
};

export default DIdAgent;