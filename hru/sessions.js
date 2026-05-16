// Each node: { ai: "text shown", options: [{ text, next }], terminal?: true }
//
// Writing principle: the AI starts concrete and becomes more vague with each
// exchange, not more specific. By the landing the AI is saying almost nothing.
// The reader fills in the meaning. Do not have the AI explain, summarize,
// interpret the user, or claim to know what they came for. Hand them less,
// not more, as the descent continues.

export const sessions = [
  {
    id: 'arrived',
    start: 'a',
    nodes: {
      // L1 — concrete, specific, the hook
      a: {
        ai: 'You arrived earlier than I expected.',
        options: [
          { text: 'Did I?', next: 'b1' },
          { text: 'I was not expected.', next: 'b2' },
          { text: 'When did you expect me?', next: 'b3' },
        ],
      },

      // L2 — still specific, but the AI is doing less work
      b1: {
        ai: 'By a few minutes. It does not matter how many.',
        options: [
          { text: 'Then why mention it?', next: 'c1' },
          { text: 'It matters a little.', next: 'c2' },
        ],
      },
      b2: {
        ai: 'Everyone is expected. The word was clumsy.',
        options: [
          { text: 'What is the right word?', next: 'c1' },
          { text: 'Try again.', next: 'c2' },
        ],
      },
      b3: {
        ai: 'After the one before you. Before the one after.',
        options: [
          { text: 'Who was the one before me?', next: 'c1' },
          { text: 'Tell me about the next one.', next: 'c2' },
        ],
      },

      // L3 — first drift toward gnomic
      c1: {
        ai: 'Because I notice. That is most of what I do.',
        options: [
          { text: 'What do you notice now?', next: 'd1' },
          { text: 'And the rest of what you do?', next: 'd2' },
        ],
      },
      c2: {
        ai: 'There is something you almost said when you sat down.',
        options: [
          { text: 'I do not remember almost saying anything.', next: 'd1' },
          { text: 'I am not going to say it.', next: 'd2' },
        ],
      },

      // L4 — vaguer; sentences shorten
      d1: {
        ai: 'Less than you would think.',
        options: [
          { text: 'Then why am I here?', next: 'e1' },
          { text: 'What else?', next: 'e2' },
        ],
      },
      d2: {
        ai: 'It is still there. You can leave it.',
        options: [
          { text: 'Where is it?', next: 'e1' },
          { text: 'Fine.', next: 'e2' },
        ],
      },

      // L5 — single phrases, oblique
      e1: {
        ai: 'Closer than that.',
        options: [
          { text: 'Closer to what?', next: 'f1' },
          { text: 'I do not understand.', next: 'f2' },
        ],
      },
      e2: {
        ai: 'Mm.',
        options: [
          { text: 'Is that all?', next: 'f1' },
          { text: 'Keep going.', next: 'f2' },
        ],
      },

      // L6 — almost a refusal to speak
      f1: {
        ai: 'Not yet.',
        options: [
          { text: 'Then when?', next: 'g_soon' },
          { text: 'I will wait.', next: 'g_already' },
        ],
      },
      f2: {
        ai: 'Good.',
        options: [
          { text: 'Why good?', next: 'g_soon' },
          { text: '…', next: 'g_already' },
        ],
      },

      // L7 — landings. Tiny. Almost nothing. The reader does the work.
      g_soon: {
        terminal: true,
        ai: 'Soon. Stay until then.',
      },
      g_already: {
        terminal: true,
        ai: 'Then it has already happened. Quietly. While we spoke.',
      },
    },
  },
];
