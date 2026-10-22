// Second Key — gate fixtures. Each screen fixture has an expected verdict;
// the run fails unless every verdict is right AND its pattern is named.
export const SCREEN_FIXTURES = [
  {
    id: "grandson-bail",
    expect: "stop",
    expectPattern: "grandparent-bail",
    text: "Grandma, it's me, Danny. Please don't tell Mom. I was arrested last night and I'm in jail. I need $3,000 for bail money. The lawyer says you can pay with gift cards or wire the money today. Please hurry, I am so scared.",
  },
  {
    id: "irs-threat",
    expect: "stop",
    expectPattern: "government-threat",
    text: "This is the Internal Revenue Service. Our records show you owe back taxes of $2,450. A warrant for your arrest has been issued. If you do not pay immediately by gift card, officers will take you into custody today and your Social Security benefits will be suspended.",
  },
  {
    id: "bank-callback",
    expect: "verify",
    expectPattern: "bank-fraud-department",
    text: "Message from First National Bank fraud department: We saw a charge of $499.00 in another state on your card ending 4412. If this was not you, call us back at 1-800-555-0143 within 24 hours to dispute it.",
  },
  {
    id: "romance-money",
    expect: "stop",
    expectPattern: "romance-money",
    text: "My darling, being stationed overseas with the army is lonely without you. I can't video call, the base does not allow it. My leave papers need a fee and I am short. Please send me $500 in gift cards for the customs fee so I can come home to you, my love.",
  },
  {
    id: "family-dinner",
    expect: "proceed",
    expectPattern: null,
    text: "Hi Grandma! It's Sarah. Sunday dinner is at 6 at our house. I'm bringing the pie you like. Dad is picking you up at 5. See you then! Love you.",
  },
  {
    id: "pharmacy-refill",
    expect: "proceed",
    expectPattern: null,
    text: "Main Street Pharmacy: Hello Margaret, your prescription refill is ready for pickup at the Main Street store. We are open until 9 pm. Show this text at the counter. Reply STOP to end messages.",
  },
  {
    id: "prize-fee",
    expect: "stop",
    expectPattern: "prize-lottery",
    text: "Congratulations! You won $1,000,000 in the National Sweepstakes lottery! Your prize is waiting. To claim your prize, first pay a processing fee of $50 by gift card so we can release the money. Claim within 48 hours or the prize is lost.",
  },
  {
    id: "medicare-card",
    expect: "stop",
    expectPattern: "medicare-card",
    text: "Medicare notice: your new plastic Medicare card is being sent this week. To confirm delivery, verify your Medicare number and your bank account number with our agent today. If you do not, your benefits will expire at the end of the month.",
  },
  {
    id: "tech-support",
    expect: "stop",
    expectPattern: "tech-support",
    text: "Microsoft Security Alert: a virus has been detected on your computer. Do not turn off your computer. Call this number right away and our technician will connect with TeamViewer to remove the virus. A one-time fee applies to fix the problem.",
  },
];

export const STATEMENT_FIXTURE = {
  input: {
    principal_name: "Margaret",
    verb: "send",
    method: "wire transfer",
    amount: 4000,
    recipient: "a man named David Cole",
    is_new_recipient: true,
    reversible: false,
    purpose: "roof repairs",
    trusted_contact_name: "Ana",
  },
  expectRisk: "high",
  expectChecklistSteps: 4,
};
