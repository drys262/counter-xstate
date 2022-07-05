import { assign, createMachine } from "xstate";

export const onboardingPackMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QHkB2AjA9gQwE4QEtUoACABWwGMBrEgWSoAsiwA6AZQBc9OBiCTKjZEAbpmps0WPIWLkqtBpWZCO3XJwSjMlbJwKCA2gAYAuolAAHTLAL7BFkAA9EAWgAcARgBsrb94B2AE4AZmNPIIAWTwAmbwBWABoQAE83GPj41niA70jAsM9czPcAX1LkqRx8IlIKGnomFjUeXjBcXExcVksAGz0AMy6AW1YqmVr5BqUVNi4eLVQxXXtUE3MkEGtbVccXBFccgNYgoONTgM93eIuk1PSQ33PjYJ9jSJCP8sqMatk6hSNZTNABC2FslBIAElUEMSABhTDDPpgThzRiYADuJHGNTkADERrxlGAaABFACumDRAEFKJQwJY0RAACq4bCoWBUVbwTbbOwGVB7RAhTyePyXG5i+KBD6ZZJpA5vVghIJxdzGdyRYxhdwhb4gXH-KaKJqqAAigjAJAGqOBckE0jxUF4jn5u02+1cIRCx19L2MxhijxiAUikQVblivncUU8IRiXgCAdi5QqIFQmAgcEcRsm9VN9rm6k4bpsAocnrcAQTrBr7mC8SDMsiAQCkYO8TCrEiif98T1NZingNebkBaBs1YYIh0NhmARSJRaI4GOx7AplhRwzAqHUKRtIzLO0FwoQ7hikVYseHMR1idO8Y7YpOvYS1ylQQC7jK6bHAOmM02BnAhIRhOFEWRXpUTYS09xIWA1wQzdt13fdD1wYZjwrIUqwQHwQlYIo4jONVE1jH0OyCLI728YMa3eHJPHiSJR1+CZx0BGZQXBUC5wgpdoJXdgkP-EhCUw7CPVAfZL3FTxAyDbUwjiAcI3uA44hiVhNR1DUEy04d4jYp1jQnbjVBAsD50XKCYKk088PjIIiICEjzhicjQhCDtvXcJ4g0vUNwjDR4TL+fMuKA1csRIEF+lQWgxILBzKxktwvCvQJYxuMM9WibwO3yHsCiMjJzmTX8flMyLAKLGLsUdCK5CGTCSEEXpFSsctpOcasFJ0uiYi-aiWNVTxn38OtrmiMU40eFjwo4gDCynODrVtTh7VIJrltS3D0oOX1tISWJg2omtgiCXyPkInJIgogrIiCMVWL-djnRNSdmgAUQ6LobTtFQdo+-59rPVxkyvYbtW-NtvDFdxfOolVQw+BTjG8LV-ACJbPvMoDwbwjxtT8QJQnCONVN87wdRVC5IniO9zi7II01KIA */
  createMachine({
  context: { transactions: [], onboarding: {} },
  initial: "Start",
  states: {
    Start: {
      invoke: {
        src: "fetchOnboarding",
        onDone: [
          {
            actions: "assignOnboarding",
            target: "Done fetching onboarding",
          },
        ],
        onError: [
          {
            target: "Error fetching onboarding",
          },
        ],
      },
    },
    "Basic Info Complete": {
      entry: "fetchTransactions",
      initial: "Show Onboarding Form",
      states: {
        "Show Supplementary form": {
          type: "final",
        },
        "Dont show supplementary form": {
          type: "final",
        },
        "Show Onboarding Form": {
          on: {
            checkQuoteAcceptedTransactions: [
              {
                cond: "engaged with quote accepted transactions",
                target: "Show Supplementary form",
              },
              {
                cond: "not engaged with quote accepted transactions",
                target: "Dont show supplementary form",
              },
            ],
          },
        },
      },
    },
    "Show Blank Onboarding Pack": {
      type: "final",
    },
    "Show onboarding form only": {
      type: "final",
    },
    "Done fetching onboarding": {
      always: [
        {
          cond: "onboarding is basic complete",
          target: "Basic Info Complete",
        },
        {
          cond: "no onboarding created",
          target: "Show Blank Onboarding Pack",
        },
        {
          cond: "there is an onboarding but not yet complete",
          target: "Show onboarding form only",
        },
      ],
    },
    "Error fetching onboarding": {
      type: "final",
    },
  },
  id: "Onboarding Pack Machine",
}).withConfig({
    actions: {
      assignOnboarding: assign((_, event) => {
        return { onboarding: event.data };
      }),
    },
    guards: {
      "onboarding is basic complete": (context) => {
        return context.onboarding.isBasicComplete;
      },
      "no onboarding created": (context) => {
        return Object.keys(context.onboarding).length === 0;
      },
      "there is an onboarding but not yet complete": (context) => {
        return (
          Object.keys(context.onboarding).length !== 0 &&
          context.onboarding.isBasicComplete === false
        );
      },
    },
    services: {
      fetchOnboarding: assign(async (context) => {
        // calling the API
        await new Promise((resolve) => setTimeout(resolve, 2000));
        console.log("Fetching onboarding");
        console.log("context", context);
        return {
          onboarding: { isBasicComplete: true },
        };
      }),
      fetchTransactions: assign(async () => {
        // calling the API
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return {
          transactions: [{ status: "QUOTEACCEPTED" }],
        };
      }),
    },
  });
