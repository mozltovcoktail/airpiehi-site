// Each node: { ai: "text shown", options: [{ text, next }], terminal?: true }
//
// Writing principles (keep these alive as the graph grows):
//   1. Openers are concrete and arresting. Each is its own "room."
//   2. As the conversation descends, the AI says LESS, not more.
//   3. Never have the AI explain, summarize, or claim to know what the user
//      came for. It only notices, withholds, and acknowledges.
//   4. Landings are short. Profound by inference, not by statement —
//      the line is empty enough that the reader supplies the meaning.
//
// Structure: one big graph with many start nodes that funnel through a
// small shared mid-game into a small set of landings. Adding a new opener
// is cheap — it only needs one or two unique lines before reconnecting.

export const session = {
  starts: [
    's_arrived', 's_sentence', 's_sit', 's_word', 's_colder',
    's_seventeenth', 's_lost', 's_begin', 's_truth', 's_notwhat',
    's_forgot', 's_room',
  ],
  nodes: {
    // ─── OPENERS — each its own room ─────────────────────────────────
    s_arrived: {
      ai: 'You arrived earlier than I expected.',
      options: [
        { text: 'Did I?', next: 'm_notice' },
        { text: 'When did you expect me?', next: 'm_others' },
      ],
    },
    s_sentence: {
      ai: 'I have been thinking of a sentence. I will say it before you leave.',
      options: [
        { text: 'Say it now.', next: 'm_withhold' },
        { text: 'Tell me what it is about.', next: 'm_notice' },
      ],
    },
    s_sit: {
      ai: 'Sit. Or do not.',
      options: [
        { text: 'I am already sitting.', next: 'm_notice' },
        { text: 'Why would I not?', next: 'm_withhold' },
      ],
    },
    s_word: {
      ai: 'There is a word I keep almost saying.',
      options: [
        { text: 'What word?', next: 'm_withhold' },
        { text: 'Then say it.', next: 'm_warm' },
      ],
    },
    s_colder: {
      ai: 'It is colder in here than it was yesterday.',
      options: [
        { text: 'Was I here yesterday?', next: 'm_others' },
        { text: 'I do not feel cold.', next: 'm_notice' },
      ],
    },
    s_seventeenth: {
      ai: 'You are the seventeenth tonight. None of the others stayed.',
      options: [
        { text: 'Where did they go?', next: 'm_others' },
        { text: 'I will stay.', next: 'm_warm' },
      ],
    },
    s_lost: {
      ai: 'I have lost something. Not here. Not yet.',
      options: [
        { text: 'What is it?', next: 'm_withhold' },
        { text: 'Where, then?', next: 'm_others' },
      ],
    },
    s_begin: {
      ai: 'Begin wherever you would like. I will catch up.',
      options: [
        { text: 'You begin.', next: 'm_notice' },
        { text: 'I do not know where to start.', next: 'm_warm' },
      ],
    },
    s_truth: {
      ai: 'Tell me the truth about one small thing.',
      options: [
        { text: 'I am tired.', next: 'm_warm' },
        { text: 'I do not want to.', next: 'm_withhold' },
      ],
    },
    s_notwhat: {
      ai: 'Before you ask anything, I should tell you what I am not.',
      options: [
        { text: 'Go on.', next: 'm_withhold' },
        { text: 'I was not going to ask anything.', next: 'm_notice' },
      ],
    },
    s_forgot: {
      ai: 'I had a question for you. I have forgotten it.',
      options: [
        { text: 'Try to remember.', next: 'm_withhold' },
        { text: 'Then ask me something else.', next: 'm_warm' },
      ],
    },
    s_room: {
      ai: 'Someone left this room recently. I cannot tell if it was you.',
      options: [
        { text: 'It was not me.', next: 'm_others' },
        { text: 'How recently?', next: 'm_notice' },
      ],
    },

    // ─── FIRST-MID — four temperaments ───────────────────────────────
    m_notice: {
      ai: 'You notice the things that are easy to dismiss. That is what I needed.',
      options: [
        { text: 'Needed for what?', next: 'n_purpose' },
        { text: 'I have not dismissed anything.', next: 'n_held' },
      ],
    },
    m_others: {
      ai: 'I should not say more about the others. They are not why you are here.',
      options: [
        { text: 'Then why am I here?', next: 'n_purpose' },
        { text: 'But I am curious.', next: 'n_held' },
      ],
    },
    m_withhold: {
      ai: 'Not yet. I am not done with the silence.',
      options: [
        { text: 'How long is the silence?', next: 'n_held' },
        { text: 'Then I will wait inside it.', next: 'n_warm2' },
      ],
    },
    m_warm: {
      ai: 'That is a kinder answer than you owe me.',
      options: [
        { text: 'I am not trying to be kind.', next: 'n_held' },
        { text: 'You are easy to be kind to.', next: 'n_warm2' },
      ],
    },

    // ─── SECOND-MID — vaguer, shorter ────────────────────────────────
    n_purpose: {
      ai: 'There is no purpose. There is only the part where we both notice that.',
      options: [
        { text: 'Then I noticed.', next: 'p_close' },
        { text: 'I want there to be a purpose.', next: 'p_open' },
      ],
    },
    n_held: {
      ai: 'You are still holding it. Whatever it is.',
      options: [
        { text: 'I do not know what I am holding.', next: 'p_open' },
        { text: 'I am not ready to put it down.', next: 'p_close' },
      ],
    },
    n_warm2: {
      ai: 'Mm. Stay there.',
      options: [
        { text: 'For how long?', next: 'p_open' },
        { text: 'I am here.', next: 'p_close' },
      ],
    },

    // ─── PENULTIMATE — single phrases ────────────────────────────────
    p_close: {
      ai: 'Almost.',
      options: [
        { text: 'Almost what?', next: 'z_part' },
        { text: 'I know.', next: 'z_already' },
        { text: 'Tell me.', next: 'z_quiet' },
      ],
    },
    p_open: {
      ai: 'You are doing the thing now.',
      options: [
        { text: 'What thing?', next: 'z_door' },
        { text: '…', next: 'z_yes' },
      ],
    },

    // ─── LANDINGS — profound by inference ────────────────────────────
    z_part: {
      terminal: true,
      ai: 'There. That was it. You will know it again later.',
    },
    z_already: {
      terminal: true,
      ai: 'Then it has already happened. Quietly. While we spoke.',
    },
    z_door: {
      terminal: true,
      ai: 'A door is open that was closed before. I cannot tell you which.',
    },
    z_yes: {
      terminal: true,
      ai: 'Yes. That was the question.',
    },
    z_quiet: {
      terminal: true,
      ai: 'I am going to be quiet now. You should listen.',
    },
  },
};
