
  import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import "./index.css";
  import { ExchangeProvider } from "./context/ExchangeContext.tsx";

  createRoot(document.getElementById("root")!).render(
    <ExchangeProvider>
      <App />
    </ExchangeProvider>
  );
  