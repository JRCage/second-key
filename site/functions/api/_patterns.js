// Second Key — elder-fraud pattern library (data).
//
// Each pattern: id, name (plain), whatItIs (one plain sentence for output),
// action (the ladder step when this pattern fires on its own: "stop" fires
// only with a hard signal present; see _engine.js), and signals.
// Each signal: id, label (plain language, shown to the user), re (RegExp),
// points, hard (true = this signal alone can push a matched pattern to STOP).
//
// Hard signals are the classic loss mechanics: pay by gift card / wire /
// crypto on demand, secrecy from family, threats of arrest, fees to claim a
// prize, requests for passwords / codes / account numbers, remote access to
// the computer, "move the money to a safe account".

export const PATTERNS = [
  {
    id: "grandparent-bail",
    name: "Family emergency (grandparent scam)",
    whatItIs:
      "Someone claims a grandchild or other family member is in jail, in a hospital, or in trouble, and needs money fast.",
    signals: [
      {
        id: "relative-in-trouble",
        label: "A family member is said to be in jail, hurt, or in trouble",
        re: /(grandson|granddaughter|grandchild|my son|my daughter|your son|your daughter|nephew|niece)[\s\S]{0,160}(jail|arrested|bail|hospital|accident|court|trouble|police)/i,
        points: 4,
      },
      {
        id: "trouble-first-person",
        label: "The writer says they are in jail or trouble and need help",
        re: /(i am|i'm|i was) (in jail|arrested|locked up|in the hospital|in trouble)[\s\S]{0,120}(money|bail|help|send)/i,
        points: 4,
      },
      {
        id: "bail-money",
        label: "Bail or legal fees are requested",
        re: /(bail|bond|lawyer|attorney|legal fees?)[\s\S]{0,80}(\$|money|pay|send|cash)/i,
        points: 3,
      },
    ],
  },
  {
    id: "government-threat",
    name: "Government threat (IRS / Social Security)",
    whatItIs:
      "Someone claims to be the IRS, Social Security, or another agency and says you owe money or your benefits will stop.",
    signals: [
      {
        id: "agency-claim",
        label: "The sender claims to be a government agency",
        re: /(internal revenue service|\bIRS\b|social security administration|department of the treasury|medicare office|federal agent|homeland security)/i,
        points: 3,
      },
      {
        id: "arrest-threat",
        label: "There is a threat of arrest, a warrant, or a lawsuit",
        re: /(arrest warrant|warrant for your arrest|you will be arrested|legal action|lawsuit against you|police will|taken into custody)/i,
        points: 3,
        hard: true,
      },
      {
        id: "benefits-stop",
        label: "Your benefits or account will be cut off, it says",
        re: /(benefits? (will be )?(suspended|stopped|cut off|terminated)|social security number (will be )?(suspended|blocked)|account (will be )?(frozen|closed|suspended))/i,
        points: 3,
      },
      {
        id: "tax-debt",
        label: "You are told you owe back taxes or a government debt",
        re: /(owe (back )?taxes|tax debt|unpaid taxes|amount owed to the (irs|government|treasury))/i,
        points: 2,
      },
    ],
  },
  {
    id: "tech-support",
    name: "Fake tech support",
    whatItIs:
      "Someone claims your computer or account has a virus or a problem, and wants you to call a number, pay, or let them connect to your computer.",
    signals: [
      {
        id: "brand-problem",
        label: "A big company name is used with a virus or security warning",
        re: /(microsoft|windows|apple|mac|geek squad|norton|mcafee)[\s\S]{0,120}(virus|infected|security (alert|warning|breach)|hacked|suspicious activity|problem detected)/i,
        points: 3,
      },
      {
        id: "remote-access",
        label: "They ask to connect to your computer or ask you to install software",
        re: /(anydesk|teamviewer|remote (access|support|session)|let (me|us) connect|install (this|the) (app|program|software)|share your screen)/i,
        points: 3,
        hard: true,
      },
      {
        id: "call-now-warning",
        label: "A warning tells you to call a number right away",
        re: /(call (us |now|immediately|right away)|call this number|do not (shut down|turn off|close))/i,
        points: 1,
      },
      {
        id: "pay-for-fix",
        label: "You must pay to fix the problem or remove the virus",
        re: /(pay|charge|fee|subscription)[\s\S]{0,80}(remove|fix|repair|clean|protect)/i,
        points: 2,
      },
    ],
  },
  {
    id: "prize-lottery",
    name: "Prize or lottery win",
    whatItIs:
      "Someone says you won money or a prize, and you must pay a fee, tax, or charge first to get it.",
    signals: [
      {
        id: "you-won",
        label: "The message says you won a prize, lottery, or sweepstakes",
        re: /(you (have )?won|winner|lottery|sweepstakes|prize (of|worth)|jackpot|selected to receive)/i,
        points: 3,
      },
      {
        id: "fee-to-claim",
        label: "A fee, tax, or charge must be paid before you can claim it",
        re: /(processing fee|claim fee|pay (a|the) (fee|tax|charge)|fee (of|is) \$|taxes? (must be|to be) paid|shipping (fee|charge))[\s\S]{0,80}(claim|receive|release|deliver)/i,
        points: 3,
        hard: true,
      },
      {
        id: "claim-deadline",
        label: "The prize will be lost if you do not act fast",
        re: /(claim (it |your prize )?(before|within|by)|expires (in|on|today)|unclaimed)/i,
        points: 1,
      },
    ],
  },
  {
    id: "romance-money",
    name: "Romance scam",
    whatItIs:
      "Someone met online builds a close bond, then asks for money. They often say they are in the military or working far away and cannot meet or video chat.",
    signals: [
      {
        id: "far-away",
        label: "The person says they are overseas, in the military, or on a rig or ship",
        re: /(stationed|deployed|overseas|military|army|oil rig|on a ship|working abroad|peacekeeping)/i,
        points: 2,
      },
      {
        id: "cannot-meet",
        label: "The person cannot meet or video chat, and gives a reason",
        re: /(can'?t (video|talk|meet|come home)|not allowed to (call|video)|camera is broken|no (internet|signal) for video)/i,
        points: 2,
      },
      {
        id: "money-ask-loved-one",
        label: "A person you know online asks for money, cards, or help with a fee",
        re: /(send (me )?(some )?money|send (me )?[\s\S]{0,24}gift cards?|buy (me )?[\s\S]{0,16}gift cards?|customs fee|hospital bill|plane ticket|leave (fee|paperwork)|help me (pay|with))/i,
        points: 3,
        hard: true,
      },
      {
        id: "love-fast",
        label: "Strong love is declared fast by someone never met in person",
        re: /(love of my life|soul ?mate|marry (you|me)|my (dear|love|darling|queen|king))[\s\S]{0,140}(money|send|help|card|fee)/i,
        points: 2,
      },
    ],
  },
  {
    id: "bank-fraud-department",
    name: "Bank fraud department callback",
    whatItIs:
      "A message claims to be your bank's fraud or security team and asks you to call a number, confirm a charge, or move money.",
    signals: [
      {
        id: "fraud-dept-claim",
        label: "The sender claims to be a bank fraud or security team",
        re: /(fraud department|fraud team|security department|fraud prevention|bank'?s security)/i,
        points: 3,
      },
      {
        id: "suspicious-charge",
        label: "A charge you did not make is named",
        re: /(charge of \$|suspicious (charge|transaction|activity)|unusual activity|did you (make|authorize) (this|a) (charge|purchase|transaction))/i,
        points: 2,
      },
      {
        id: "callback-request",
        label: "You are asked to call a number in the message",
        re: /(call (us|back|the number)|contact us at|reach (us|our team) at) (at |on )?(\+?1[-. ]?)?\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}/i,
        points: 1,
      },
      {
        id: "safe-account",
        label: "You are told to move money to a safe or new account",
        re: /(move (your )?money|transfer (your )?(money|funds))[\s\S]{0,60}(safe|new|protected) account/i,
        points: 4,
        hard: true,
      },
      {
        id: "dont-tell-bank",
        label: "You are told not to tell the bank staff or anyone at the branch",
        re: /(do ?n[o']t tell (the )?(bank|branch|teller|staff)|staff (are|is) (involved|suspect)|under investigation (at|inside) the bank)/i,
        points: 3,
        hard: true,
      },
    ],
  },
  {
    id: "medicare-card",
    name: "Medicare card or benefits trick",
    whatItIs:
      "Someone claims Medicare is sending a new card or that benefits will end, and asks for your Medicare number or other private numbers.",
    signals: [
      {
        id: "medicare-mention",
        label: "Medicare is named",
        re: /medicare/i,
        points: 2,
      },
      {
        id: "new-card",
        label: "A new card is promised if you confirm your details",
        re: /(new (medicare )?card|card (is )?(being )?(sent|mailed|issued)|replace your card|plastic card|chip card)/i,
        points: 2,
      },
      {
        id: "number-ask",
        label: "Your Medicare number or other private number is requested",
        re: /(medicare number|social security number|bank account number|confirm your (number|details|information)|verify your (number|identity|information))/i,
        points: 3,
        hard: true,
      },
      {
        id: "benefits-expire",
        label: "Benefits will end or expire soon, it says",
        re: /(benefits? (will )?(expire|end|stop|be lost)|coverage (will )?(expire|end)|act (now|fast) to keep)/i,
        points: 2,
      },
    ],
  },
  {
    id: "crypto-investment",
    name: "Guaranteed investment or crypto pitch",
    whatItIs:
      "Someone promises high, safe returns on an investment or crypto trade, often a new friend or a wrong-number chat that turns friendly.",
    signals: [
      {
        id: "guaranteed-returns",
        label: "High returns are promised as safe or guaranteed",
        re: /(guaranteed (return|profit)|risk[- ]free|double your money|returns? of \d+\s?%|profit every (day|week)|never lose)/i,
        points: 3,
      },
      {
        id: "crypto-push",
        label: "Crypto or a trading platform is pushed by a new contact",
        re: /(crypto|bitcoin|usdt|trading platform|investment group|mentor|signals group)/i,
        points: 1,
      },
      {
        id: "withdrawal-fee",
        label: "A fee or tax must be paid to take your money out",
        re: /(withdrawal fee|pay (a )?(fee|tax) to withdraw|release your (funds|profits)|unlock your account)/i,
        points: 3,
        hard: true,
      },
    ],
  },
];

// Signals that count no matter which pattern they ride on. They are listed
// on every report where they appear, and some combinations escalate the
// verdict on their own (see _engine.js).
export const GENERIC_SIGNALS = [
  {
    id: "secrecy",
    label: "You are told to keep this secret or not tell family",
    re: /(don'?t tell|do not tell|keep (this|it) (a )?secret|between (you and me|us)|no one (else )?(can|must|should) know|don'?t (mention|say) (this|anything) to)/i,
    points: 2,
    hard: true,
  },
  {
    id: "gift-cards",
    label: "Payment by gift card is asked for",
    re: /gift cards?/i,
    points: 3,
    hard: true,
  },
  {
    id: "wire-or-crypto-pay",
    label: "Payment by wire, crypto, or a cash app is asked for",
    re: /(wire (the )?(money|funds|\$)|wire transfer|send (it |the money )?(by|via|through) (bitcoin|crypto|zelle|cash ?app|venmo)|buy (bitcoin|crypto)|atm (deposit|machine) (to|for) (send|pay))/i,
    points: 2,
    hard: true,
  },
  {
    id: "credential-ask",
    label: "A password, PIN, sign-in code, or account number is asked for",
    re: /(your (password|pin|passcode|one[- ]time code|security code|account number)|share (the|your) code|read (me )?(the|back the) code|tell me your (password|pin|code))/i,
    points: 3,
    hard: true,
  },
  {
    id: "urgency",
    label: "Hard time pressure: act now or lose out",
    re: /(right now|immediately|act now|within (the next )?\d+ (hours?|minutes?)|before it'?s too late|urgent(ly)?|as soon as possible|today only|last chance)/i,
    points: 1,
  },
  {
    id: "money-ask",
    label: "Money is asked for",
    re: /(send (me |us |him |her )?\$\s?\d|send (me |us )?(some )?money|pay \$\s?\d|pay (a |the |now )?\$\s?\d|need \$\s?\d|borrow \$\s?\d)/i,
    points: 1,
  },
];
