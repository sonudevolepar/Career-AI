import { useEffect } from "react";

const DIdAgent = () => {
  useEffect(() => {
    const existing = document.querySelector(
      'script[data-name="did-agent"]'
    );

    if (existing) return;

    const script = document.createElement("script");

    script.type = "module";
    script.src = "https://agent.d-id.com/v2/index.js";

    script.setAttribute("data-mode", "fabio");

    script.setAttribute(
      "data-client-key",
      import.meta.env.VITE_DID_CLIENT_KEY
    );

    script.setAttribute(
      "data-agent-id",
      import.meta.env.VITE_DID_AGENT_ID
    );

    script.setAttribute("data-name", "did-agent");

    script.setAttribute("data-monitor", "true");

    script.setAttribute("data-light-mode", "false");

    script.setAttribute(
      "data-orientation",
      "horizontal"
    );

    script.setAttribute(
      "data-open-mode",
      "expanded"
    );

    document.body.appendChild(script);

    return () => {
      const agent = document.querySelector(
        'script[data-name="did-agent"]'
      );

      if (agent) {
        document.body.removeChild(agent);
      }
    };
  }, []);

  return null;
};

export default DIdAgent;