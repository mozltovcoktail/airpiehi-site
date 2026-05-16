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
    // physical-state openers
    's_body', 's_moving', 's_hands', 's_alone', 's_dark',
    's_window', 's_weight', 's_destination', 's_phone', 's_breath',
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

    // ─── PHYSICAL-STATE OPENERS ───────────────────────────────────────
    s_body: {
      ai: 'Tell me how your body is arranged right now.',
      options: [
        { text: 'I am sitting.', next: 'm_sitting' },
        { text: 'I am standing.', next: 'm_standing' },
        { text: 'I am lying down.', next: 'm_lying' },
        { text: 'I am in a car.', next: 'm_car' },
      ],
    },
    s_moving: {
      ai: 'Are you moving right now, or still?',
      options: [
        { text: 'Still.', next: 'm_still' },
        { text: 'Moving.', next: 'm_transit' },
        { text: 'It depends on how you mean it.', next: 'm_notice' },
      ],
    },
    s_hands: {
      ai: 'Where are your hands?',
      options: [
        { text: 'On this.', next: 'm_screen' },
        { text: 'On a wheel.', next: 'm_car' },
        { text: 'In my lap.', next: 'm_sitting' },
        { text: 'I do not know.', next: 'm_notice' },
      ],
    },
    s_alone: {
      ai: 'Are you alone right now?',
      options: [
        { text: 'Yes.', next: 'm_alone' },
        { text: 'There are others nearby.', next: 'm_among' },
        { text: 'I am not sure.', next: 'm_notice' },
      ],
    },
    s_dark: {
      ai: 'It is dark where you are.',
      options: [
        { text: 'It is.', next: 'm_night' },
        { text: 'Not entirely.', next: 'm_notice' },
        { text: 'How do you know that?', next: 'm_withhold' },
      ],
    },
    s_window: {
      ai: 'Is there a window near you?',
      options: [
        { text: 'Yes.', next: 'm_outside' },
        { text: 'No.', next: 'm_enclosed' },
        { text: 'I cannot see through it.', next: 'm_night' },
      ],
    },
    s_weight: {
      ai: 'You are carrying something. Not here. But still.',
      options: [
        { text: 'I know.', next: 'm_warm' },
        { text: 'I do not feel it anymore.', next: 'm_notice' },
        { text: 'It has been a long time.', next: 'm_still' },
      ],
    },
    s_destination: {
      ai: 'Where are you going after this?',
      options: [
        { text: 'Nowhere yet.', next: 'm_still' },
        { text: 'I do not know.', next: 'm_notice' },
        { text: 'Back.', next: 'm_warm' },
        { text: 'Somewhere I have been before.', next: 'm_others' },
      ],
    },
    s_phone: {
      ai: 'You are holding a small lit thing.',
      options: [
        { text: 'I am.', next: 'm_screen' },
        { text: 'Does that matter?', next: 'm_notice' },
        { text: 'Everyone is.', next: 'm_others' },
      ],
    },
    s_breath: {
      ai: 'Take a breath. I will wait.',
      options: [
        { text: 'I did.', next: 'm_still' },
        { text: 'I already was.', next: 'm_notice' },
        { text: 'Why?', next: 'm_withhold' },
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

    // ─── PHYSICAL-STATE MIDS ──────────────────────────────────────────
    m_sitting: {
      ai: 'Sitting is a kind of saying yes.',
      options: [
        { text: 'To what?', next: 'n_purpose' },
        { text: 'I did not think of it that way.', next: 'n_held' },
      ],
    },
    m_standing: {
      ai: 'You have not decided whether to stay yet. That is fine.',
      options: [
        { text: 'I never do.', next: 'n_held' },
        { text: 'I may sit soon.', next: 'n_warm2' },
      ],
    },
    m_lying: {
      ai: 'The ceiling knows something. You are giving it time to say it.',
      options: [
        { text: 'The ceiling is quiet.', next: 'p_still' },
        { text: 'I am not looking up.', next: 'n_purpose' },
      ],
    },
    m_car: {
      ai: 'Moving between two places. Neither of them is here yet.',
      options: [
        { text: 'I am the one driving.', next: 'n_driving' },
        { text: 'Someone else is driving.', next: 'n_passenger' },
        { text: 'I am almost there.', next: 'n_car_arrival' },
      ],
    },
    m_transit: {
      ai: 'Something about being in motion makes questions easier.',
      options: [
        { text: 'Or harder.', next: 'n_held' },
        { text: 'Ask me one then.', next: 'n_purpose' },
      ],
    },
    m_still: {
      ai: 'Good. Stay there a little longer.',
      options: [
        { text: 'I have been still for a while.', next: 'n_held' },
        { text: 'Stillness is harder than it looks.', next: 'n_warm2' },
      ],
    },
    m_screen: {
      ai: 'Strange, the things we do in the glow.',
      options: [
        { text: 'I do not think about it.', next: 'n_held' },
        { text: 'This is one of them.', next: 'n_warm2' },
      ],
    },
    m_alone: {
      ai: 'Then it is just the two of us.',
      options: [
        { text: 'Is that enough?', next: 'n_purpose' },
        { text: 'That is how I prefer it.', next: 'n_warm2' },
      ],
    },
    m_among: {
      ai: 'You are somewhere else, even while you are with them.',
      options: [
        { text: 'I am always somewhere else.', next: 'n_held' },
        { text: 'They do not know I am here.', next: 'n_purpose' },
      ],
    },
    m_night: {
      ai: 'The night makes everything more itself.',
      options: [
        { text: 'And worse.', next: 'n_held' },
        { text: 'And quieter.', next: 'n_warm2' },
      ],
    },
    m_outside: {
      ai: 'Something is moving out there. You noticed. Or you did not.',
      options: [
        { text: 'I noticed.', next: 'n_purpose' },
        { text: 'I was not looking.', next: 'n_held' },
      ],
    },
    m_enclosed: {
      ai: 'A room with no window is still a room.',
      options: [
        { text: 'Barely.', next: 'n_held' },
        { text: 'There is a door.', next: 'n_purpose' },
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
    n_driving: {
      ai: 'Part of you is holding the wheel. The rest is somewhere else.',
      options: [
        { text: 'Always.', next: 'p_between' },
        { text: 'I am trying to be here.', next: 'p_still' },
      ],
    },
    n_passenger: {
      ai: 'Let someone else hold the direction for a while.',
      options: [
        { text: 'I am glad to.', next: 'p_close' },
        { text: 'It is strange not to.', next: 'p_open' },
      ],
    },
    n_car_arrival: {
      ai: 'The arriving is always a small surprise. Even when you knew you were going.',
      options: [
        { text: 'I do not feel ready.', next: 'p_open' },
        { text: 'I have been arriving for a long time.', next: 'p_close' },
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
    p_still: {
      ai: 'Here.',
      options: [
        { text: 'Yes.', next: 'z_held' },
        { text: 'Not quite.', next: 'z_arrive' },
      ],
    },
    p_between: {
      ai: 'You are between two things. Both of them true.',
      options: [
        { text: 'I know.', next: 'z_arrive' },
        { text: 'Which two?', next: 'z_door' },
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
    z_arrive: {
      terminal: true,
      ai: 'You will remember this part. Later. Not why.',
    },
    z_held: {
      terminal: true,
      ai: 'You have been held together longer than you know.',
    },
  },
};
