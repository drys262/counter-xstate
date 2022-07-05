import { assign, createMachine } from "xstate";

export const counterMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QGUDuBLALgYwBYDoBRAOwEMAjAG0gGIAVAeyimsVAAcHYt0Hi2QAD0QBaAMwA2ABz4AnACYxAVgAMS+bLEqALNqlKANCACeo2UvwSV5ifO3yA7MunyAvq6NosefABF0sBTUEPRMLGACnNyYvPxIQogWKipSEtoAjGLy6Q7SUspGpggi6Uqy+OnZYrISCrraDnruHiDEDBBwAl44BCRBkJFcPHwCwsXV2vja5unpetYO8tmFoooy8hK1tVLpNRKS7p4YPX4B-RCD0bGjoloSU5W6qXtZKwiZFou7tmtKyjqHEDdPCXYZxUBjEQZGTTJSzeayRbLEy3Wb4NZiSRlXZibTNVxAA */
  createMachine({
    context: { isButtonLoading: false },
    id: "Switch",
    initial: "Enabled",
    states: {
      Enabled: {
        on: {
          Toggle: {
            actions: "toggleButton",
            target: "Disabled",
          },
        },
      },
      Disabled: {
        on: {
          Toggle: {
            actions: "toggleButton",
            target: "Enabled",
          },
        },
      },
    },
  }).withConfig({
    actions: {
      toggleButton: assign((context) => {
        return {
          isButtonLoading: !context.isButtonLoading,
        };
      }),
    },
  });
