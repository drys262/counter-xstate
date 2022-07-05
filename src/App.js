import { useMachine } from "@xstate/react";
import { useEffect } from "react";
import { onboardingPackMachine } from "./machines/onboardingPack";

function App() {
  const [state, send] = useMachine(onboardingPackMachine, {
    services: {
      fetchOnboarding: async () => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return { isBasicComplete: true };
      },
    },
  });

  useEffect(() => {
    console.log("CONTEXT CHANGED", state.context);
    console.log(state.value);
    console.log(state);
  }, [state.context]);

  return (
    <>
      <button onClick={() => send("checkDetails")}>
        {/* {state.value === "Enabled" ? "Click to disable" : "Click to enable"} */}
        Next state
      </button>

      {state.value === "Show onboarding form only" && (
        <h1>Show onboarding form</h1>
      )}

      {state.value === "Show Blank Onboarding Pack" && (
        <h1>Show Blank Onboarding Pack</h1>
      )}

      {state.value === "Error fetching onboarding" && (
        <h1>Error fetching onboarding</h1>
      )}

      {state.value["Basic Info Complete"] === "Show Onboarding Form" && (
        <h1>Show Onboarding Form</h1>
      )}
    </>
  );
}

export default App;
