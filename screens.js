/* TogetherPay prototype - screens (HTML builders). Prototype only: simulated bank, no real money. */
(function () {
  var TP = window.TP, S = TP.S, P = TP.PEOPLE, m = TP.m;
  var I = {
    home: '<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    list: '<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
    bell: '<path d="M6 17v-6a6 6 0 0 1 12 0v6l2 2H4z"/><path d="M10 21h4"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
    users: '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3 3-5 6-5s6 2 6 5M16 5a3 3 0 0 1 0 6M18 15c2 .5 3 2 3 5"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
    check: '<path d="M5 12l5 5 9-10"/>', x: '<path d="M6 6l12 12M18 6L6 18"/>', back: '<path d="M15 5l-7 7 7 7"/>',
    lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', cash: '<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/>',
    fp: '<path d="M12 4a7 7 0 0 1 7 7v2M5 12a7 7 0 0 1 7-8M8 20c1-2 1-4 1-6a3 3 0 0 1 6 0c0 2 0 5-1 7M12 13v3"/>',
    face: '<path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2M9 10v1M15 10v1M9 15c1.5 1 4.5 1 6 0"/>',
    bank: '<path d="M3 10l9-6 9 6M5 10v8M9 10v8M15 10v8M19 10v8M3 20h18"/>', alert: '<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18h.01"/>',
    stop: '<circle cx="12" cy="12" r="9"/><path d="M9 9h6v6H9z"/>', chev: '<path d="M9 6l6 6-6 6"/>'
  };
  var ic = (TP.ic = function (n, s) { return '<svg viewBox="0 0 24 24"' + (s ? ' style="width:' + s + 'px;height:' + s + 'px"' : '') + '>' + I[n] + '</svg>'; });
  function chip(t, k) { return '<span class="chip ' + (k || 'info') + '">' + t + '</span>'; }
  function av(id, sz) { var p = P[id]; return '<div class="av' + (sz ? ' ' + sz : '') + '" style="background:' + p.col + '">' + p.init + '</div>'; }
  function top(t, back) { return '<div class="top">' + (back ? '<button class="ib" data-a="go" data-v="' + back + '">' + ic('back') + '</button>' : '') + '<b>' + t + '</b></div>'; }
  function body(h) { return '<div class="body">' + h + '</div>'; }
  function btn(t, a, v, cls, extra) { return '<button class="btn ' + (cls || '') + '" data-a="' + a + '"' + (v !== undefined ? ' data-v="' + v + '"' : '') + (extra || '') + '>' + t + '</button>'; }
  function banner(k, t) { return '<div class="banner ' + k + '">' + ic(k === 'bad' ? 'alert' : k === 'ok' ? 'check' : 'shield', 20) + '<span>' + t + '</span></div>'; }
  function sim() { return banner('info', 'Prototype only. Simulated bank, sample people, no real money.'); }
  function userName() { return P[S.user].name; }
  function unread() { return S.notes.filter(function (n) { return vis(n) && !n.read; }).length; }
  function vis(n) { return n.to === 'all' || n.to.indexOf(S.user) > -1; }
  function nav() {
    var t = [['home', 'home', 'Home'], ['approvals', 'users', 'Approvals'], ['history', 'list', 'History'], ['alerts', 'bell', 'Alerts'], ['profile', 'user', 'Profile']];
    var pend = TP.mine() ? 1 : 0, u = unread();
    return '<div class="nav">' + t.map(function (x) {
      var b = x[0] === 'approvals' ? pend : x[0] === 'alerts' ? u : 0;
      return '<button data-a="tab" data-v="' + x[0] + '" class="' + (S.tab === x[0] ? 'on' : '') + '">' + ic(x[1]) + x[2] + (b ? '<i>' + b + '</i>' : '') + '</button>';
    }).join('') + '</div>';
  }
  function frozenBar() {
    if (!S.frozen) return '';
    return '<div class="banner bad">' + ic('alert', 20) + '<span>Withdrawals are FROZEN by ' + TP.nm(S.frozen.by) + '. Unfreezing needs all 3 signatories.</span></div>';
  }
  function tl(items) {
    return '<div class="tl">' + items.map(function (s) {
      return '<div class="st ' + s[0] + '"><div class="dot">' + (s[0] === 'ok' ? ic('check', 15) : s[0] === 'bad' ? ic('x', 15) : '') + '</div><div><b>' + s[1] + '</b><div class="mute">' + s[2] + '</div></div></div>';
    }).join('') + '</div>';
  }
  function audit(r) {
    return tl(r.audit.map(function (e) { return [e.k === 'ok' ? 'ok' : e.k === 'bad' ? 'bad' : e.k === 'pend' ? 'now' : '', e.x, e.t + ' · ' + e.a]; }));
  }
  function steps(r) {
    var n = TP.count(r), fin = r.st === 'code' || r.st === 'done', s = [['ok', 'Request sent', TP.nm(r.by) + ' · ' + m(r.amt) + ' · ' + (r.ch === 'POS' ? 'POS / ATM' : 'Branch pickup')]];
    s.push([r.st === 'rejected' ? 'bad' : n === 3 ? 'ok' : r.st === 'cancelled' ? '' : 'now', 'Signatory approvals', n + ' of 3 approved' + (r.hv ? ' (biometric/PIN + face)' : ' (biometric/PIN)')]);
    if (r.hv) s.push([fin ? 'ok' : r.st === 'delay' ? 'now' : '', 'Safety delay', (r.delayMs ? r.delayMs / 60000 : S.setup.delay) + ' minutes. Any signatory can stop it.']);
    s.push([fin ? 'ok' : '', 'One-time cash code', fin ? 'Issued to ' + TP.nm(r.by) : 'Released after the checks above']);
    if (r.st === 'rejected') s.push(['bad', 'Closed: rejected', r.reason]);
    if (r.st === 'cancelled') s.push(['bad', 'Cancelled', r.audit[r.audit.length - 1].x]);
    return tl(s);
  }
  function signers(r) {
    return TP.IDS.map(function (i) {
      var st = r.ap[i], k = st === 'approved' ? 'ok' : st === 'rejected' ? 'bad' : 'pend';
      return '<div class="item">' + av(i) + '<div class="grow"><b>' + P[i].name + (i === S.user ? ' (you)' : '') + '</b><div class="mute">' + (st === 'approved' ? 'Verified: biometric/PIN' + (r.hv ? ' + face' : '') : st === 'rejected' ? 'Rejected' : 'Waiting for decision') + '</div></div>' + chip(st === 'approved' ? 'Approved' : st === 'rejected' ? 'Rejected' : 'Pending', k) + '</div>';
    }).join('');
  }
  function reqRow(r) {
    var b = TP.status(r);
    if (r.type === 'sec') return '<button class="item" data-a="sheet" data-v="detail:' + r.id + '"><div class="av" style="background:' + (b[1] === 'bad' ? 'var(--red)' : 'var(--navy)') + '">' + ic('shield', 20) + '</div><div class="grow"><b>' + r.title + '</b><div class="mute">' + r.when + '</div></div>' + chip(b[0], b[1]) + '</button>';
    return '<button class="item" data-a="sheet" data-v="detail:' + r.id + '">' + av(r.by) + '<div class="grow"><b>' + m(r.amt) + ' cash request</b><div class="mute">' + TP.nm(r.by) + ' · ' + r.when + (r.hv ? ' · high value' : '') + '</div></div>' + chip(b[0], b[1]) + '</button>';
  }
  function setc(label, key, arr, fmt) {
    return '<div class="card"><div class="lab">' + label + '</div><div class="chips">' + arr.map(function (v) { return '<button data-a="setc" data-k="' + key + '" data-v="' + v + '" class="' + (S.setup[key] === v ? 'on' : '') + '">' + fmt(v) + '</button>'; }).join('') + '</div></div>';
  }
  function reqCard(r) {
    var b = TP.status(r);
    return '<div class="card"><div class="row sp"><b style="font-size:18px">' + m(r.amt) + '</b>' + chip(b[0], b[1]) + '</div><div class="mute">' + TP.nm(r.by) + ' · ' + (r.ch === 'POS' ? 'POS / ATM' : 'Branch pickup') + (r.hv ? ' · high value' : '') + '</div><div class="bar2" style="margin:10px 0"><i style="width:' + TP.count(r) / 3 * 100 + '%"></i></div>' + btn('Track request', 'go', 'track', 'sec') + '</div>';
  }

  var V = (TP.V = {});

  // ---------- onboarding
  V.welcome = function () {
    return '<div class="dark"><div class="c" style="margin-top:18px"><div class="logo">' + ic('shield') + '</div><h1>TogetherPay</h1><div style="font-size:18px;font-weight:800;color:#86EFAC;margin-top:4px">Secure. Easy. Fast.</div><div class="mute" style="margin-top:10px">A secure approval layer for bank joint accounts. Every signatory approves from their own phone, and the bank stays in charge.</div></div>' +
      '<div class="card"><div class="item">' + ic('lock', 22) + '<div class="grow"><b>We never hold your money</b><div class="mute">Money stays in the bank. We only carry approvals.</div></div></div><div class="item">' + ic('shield', 22) + '<div class="grow"><b>No bank passwords</b><div class="mute">You sign in on the bank\'s own page.</div></div></div><div class="item">' + ic('users', 22) + '<div class="grow"><b>Everyone approves</b><div class="mute">Bank rules always come first.</div></div></div></div><div style="flex:1"></div>' +
      btn('Get started', 'auth', 'signup') + btn('Log in', 'auth', 'login', 'sec') +
      '<div class="c mute">Prototype only. Simulated bank. No real money.</div><button class="c mute" style="text-decoration:underline" data-a="skip">Skip setup (prototype shortcut)</button></div>';
  };
  V.auth = function () {
    var f = S.form, su = S.authTab === 'signup';
    return top(su ? 'Create account' : 'Log in', 'welcome') + body('<div class="seg"><button data-a="authtab" data-v="signup" class="' + (su ? 'on' : '') + '">Sign up</button><button data-a="authtab" data-v="login" class="' + (!su ? 'on' : '') + '">Log in</button></div>' +
      (su ? '<div><div class="lab">Full name</div><input class="field" data-bind="name" value="' + f.name + '" placeholder="Full name"></div>' : '') +
      '<div><div class="lab">Phone number</div><input class="field" data-bind="' + (su ? 'phone' : 'lphone') + '" inputmode="numeric" maxlength="11" value="' + (su ? f.phone : f.lphone) + '" placeholder="11-digit phone"></div>' +
      '<div><div class="lab">' + (su ? 'Create a 4-digit PIN' : 'Your 4-digit PIN') + '</div><input class="field" data-bind="' + (su ? 'pin' : 'lpin') + '" type="password" inputmode="numeric" maxlength="4" value="' + (su ? f.pin : f.lpin) + '" placeholder="••••"></div>' +
      '<button class="chip info" style="align-self:flex-start;border:0" data-a="sample">' + (su ? 'Use sample details' : 'Fill my details') + '</button>' +
      '<div class="banner info">' + ic('lock', 20) + '<span>Your PIN is used to confirm approvals. Sample data only in this prototype.</span></div><div style="flex:1"></div>' + btn(su ? 'Create account' : 'Log in', 'authgo', undefined, '', ' id="primary"') + sim());
  };
  V.otp = function () {
    return top('Verify phone', 'auth') + body('<h1>Enter the 6-digit code</h1><div class="mute">We "sent" a code to •••• •••' + (S.form.phone || '0000').slice(-4) + '. This is a simulation: no SMS is sent.</div><input class="field" data-bind="otp" inputmode="numeric" maxlength="6" value="' + S.form.otp + '" placeholder="6-digit code" style="text-align:center;letter-spacing:6px;font-size:24px"><button class="chip info" style="align-self:center;border:0" data-a="otpfill">Demo code: ' + TP.DEMO_OTP + ' (tap to fill)</button><div style="flex:1"></div>' + btn('Verify', 'otpgo', undefined, '', ' id="primary"'));
  };
  V.idv = function () {
    var f = S.form;
    return top('Verify identity', 'otp') + body('<h1>Confirm it is really you</h1><div class="mute">Step 1: consent to a BVN or NIN check. Step 2: a live face check matched to your record.</div><div class="seg"><button data-a="idt" data-v="BVN" class="' + (f.idt === 'BVN' ? 'on' : '') + '">BVN</button><button data-a="idt" data-v="NIN" class="' + (f.idt === 'NIN' ? 'on' : '') + '">NIN</button></div><input class="field" data-bind="idn" inputmode="numeric" maxlength="11" value="' + f.idn + '" placeholder="11-digit ' + f.idt + '"><button class="chip info" style="align-self:flex-start;border:0" data-a="idsample">Use sample number</button><div class="banner info">' + ic('shield', 20) + '<span>Simulated consent (like NIBSS iGree). No real ' + f.idt + ' is checked or stored.</span></div><div style="flex:1"></div>' + btn(ic('face') + ' Continue to face check', 'idgo', undefined, '', ' id="primary"'));
  };
  V.idok = function () {
    return body('<div class="c" style="margin-top:24px"><div class="av xl" style="margin:auto;background:var(--green)">' + ic('check', 40) + '</div><h1 style="margin-top:14px">Identity verified</h1><div class="mute">Matched to the (simulated) bank record.</div></div><div class="card"><div class="item"><span class="grow mute">' + S.form.idt + ' consent</span>' + chip('Given', 'ok') + '</div><div class="item"><span class="grow mute">Liveness check</span>' + chip('Passed', 'ok') + '</div><div class="item"><span class="grow mute">Face match</span>' + chip('98% (simulated)', 'ok') + '</div><div class="item"><span class="grow mute">Phone and device</span>' + chip('Bound', 'ok') + '</div></div><div style="flex:1"></div>' + btn('Choose your bank', 'go', 'bank'));
  };
  V.verify = function () {
    var v = S.vf; if (!v) return V.home();
    if (v.step === 'face') {
      var L = ['Position your face in the oval', 'Blink slowly', 'Turn your head to the left', 'Matching with your record…', 'Face matched'], d = v.fs || 0;
      return '<div class="top"><button class="ib" data-a="vfx">' + ic('x') + '</button><b>Face verification</b></div><div class="cam"><div class="oval ' + (d >= 4 ? 'ok' : d >= 1 ? 'go' : '') + '">' + ic('user') + (d < 4 ? '<div class="scan"></div>' : '') + '</div><h2>' + L[d] + '</h2><div class="dots">' + [0, 1, 2, 3, 4].map(function (i) { return '<i class="' + (i <= d ? 'on' : '') + '"></i>'; }).join('') + '</div><div style="opacity:.75;font-size:13px">Simulated. No camera is used in this prototype.</div></div>';
    }
    var pin = v.mode === 'pin';
    return top(v.title, 'vfx') + body('<div class="c"><div class="mute">' + v.sub + '</div></div>' +
      (pin ? '<div class="pin">' + [0, 1, 2, 3].map(function (i) { return '<i class="' + (i < (v.pin || '').length ? 'on' : '') + '"></i>'; }).join('') + '</div><div class="c" style="color:var(--red);font-weight:700;min-height:20px">' + (v.err || '') + '</div><div class="pad">' + ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map(function (k) { return k === '' ? '<span></span>' : '<button data-a="pk" data-v="' + k + '">' + k + '</button>'; }).join('') + '</div><div class="c mute">Sample PIN for this prototype: ' + S.pin + '</div>' + btn('Use fingerprint instead', 'vfmode', 'bio', 'sec')
        : '<div class="fp ' + (v.scanning ? 'scanning' : '') + '">' + ic('fp') + '</div><div class="c" style="font-weight:700">' + (v.scanning ? 'Scanning…' : 'Touch the sensor') + '</div><div class="c mute">Simulated fingerprint prompt</div>' + btn(v.scanning ? 'Scanning…' : 'Scan fingerprint', 'scan', undefined, '', v.scanning ? ' disabled' : '') + btn('Use PIN instead', 'vfmode', 'pin', 'sec')) +
      (v.steps.length > 1 ? '<div class="banner warn">' + ic('face', 20) + '<span>High-value request: a face check comes next.</span></div>' : ''));
  };

  // ---------- bank linking
  V.bank = function () {
    return top('Choose your bank', 'idok') + body('<h1>Which bank holds your joint account?</h1>' + sim() + '<div class="card" style="padding:4px 16px">' + TP.BANKS.map(function (b) {
      return '<button class="item" style="opacity:' + (b.ok ? 1 : .55) + '" data-a="' + (b.ok ? 'bank' : 'soon') + '" data-v="' + b.id + '"><div class="av" style="background:var(--navy)">' + ic('bank', 20) + '</div><div class="grow"><b>' + b.name + '</b><div class="mute">' + b.note + '</div></div>' + (b.ok ? chip(S.setup.bank === b.id ? 'Selected' : 'Partner', S.setup.bank === b.id ? 'ok' : 'info') : chip('Soon', 'pend')) + '</button>';
    }).join('') + '</div><div class="mute">Only partner banks can enforce shared approvals.</div><div style="flex:1"></div>' + btn('Continue', 'go', 'consent', '', S.setup.bank ? '' : ' disabled'));
  };
  V.consent = function () {
    return '<div class="top" style="background:#0E3B8C"><button class="ib" data-a="go" data-v="bank">' + ic('back') + '</button><b>Unity Demo Bank (simulated)</b>' + ic('lock', 20) + '</div>' + body(banner('warn', 'This simulates the bank\'s own sign-in page. No real credentials are entered or stored.') + '<div><div class="lab">Username</div><input class="field" value="demo.user" disabled></div><div><div class="lab">Password</div><input class="field" value="••••••••" disabled></div><div class="card"><h2>Unity Demo Bank asks you to allow TogetherPay to:</h2><div class="item">' + ic('check', 20) + '<span>See your joint accounts and their signing rules</span></div><div class="item">' + ic('check', 20) + '<span>Send approval requests to the other signatories</span></div><div class="item">' + ic('check', 20) + '<span>Ask the bank to release a cash code, only after all approvals</span></div></div><div class="card"><h2>TogetherPay can never:</h2><div class="item" style="color:var(--red)">' + ic('x', 20) + '<span>See your bank password or PIN</span></div><div class="item" style="color:var(--red)">' + ic('x', 20) + '<span>Move money without all approvals</span></div><div class="item" style="color:var(--red)">' + ic('x', 20) + '<span>Change the bank\'s signing rule</span></div></div><div style="flex:1"></div>' + btn('Allow access', 'go', 'accounts') + btn('Cancel', 'go', 'bank', 'sec'));
  };
  V.accounts = function () {
    return top('Select joint account', 'consent') + body('<h1>Your joint accounts</h1><div class="mute">Each account was checked against the bank\'s signing rules.</div>' + TP.ACCOUNTS.map(function (a) {
      var ok = a.state === 'eligible';
      return '<button class="card" style="text-align:left;opacity:' + (ok ? 1 : .65) + ';' + (ok ? 'border-color:var(--blue)' : '') + '" data-a="' + (ok ? 'acct' : 'noacct') + '" data-v="' + a.id + '"><div class="row sp"><b>' + a.name + '</b>' + chip(ok ? 'Eligible' : 'Not available', ok ? 'ok' : 'pend') + '</div><div class="mute">•••• ' + a.no + ' · ' + a.rule + '</div>' + (ok ? '' : '<div class="mute" style="margin-top:6px">' + a.why + '</div>') + '</button>';
    }).join(''));
  };
  V.rule = function () {
    return top('Bank signing rule', 'accounts') + body('<div class="banner ok">' + ic('lock', 20) + '<span><b>Set by the bank. Read only.</b><br>All 3 signatories must approve every withdrawal.</span></div><div class="card"><h2>Signatories on the bank\'s record</h2>' + TP.IDS.map(function (i) {
      return '<div class="item">' + av(i) + '<div class="grow"><b>' + P[i].name + '</b><div class="mute">BVN ••••••• ' + P[i].bvn + ' · Phone •••• ' + P[i].ph + '</div></div>' + chip('Bank verified', 'ok') + '</div>';
    }).join('') + '</div><div class="banner info">' + ic('shield', 20) + '<span>Bank rules always win. TogetherPay can only add stricter safety conditions.</span></div><div style="flex:1"></div>' + btn('Continue', 'go', 'conditions'));
  };
  V.conditions = function () {
    var o = TP.OPT;
    return top('Safety conditions', 'rule') + body('<h1>Add stricter conditions</h1><div class="banner info">' + ic('shield', 20) + '<span>Stricter only. You cannot go below the bank\'s rule (all must sign).</span></div>' +
      setc('Maximum per request', 'max', o.max, TP.mk) + setc('High-value starts at (face check + safety delay)', 'hv', o.hv, TP.mk) + setc('Safety delay for high-value requests', 'delay', o.delay, function (v) { return v + ' min'; }) +
      '<div class="card"><div class="lab">Always on</div><div class="item">' + ic('check', 20) + '<span>All 3 signatories approve (bank rule)</span></div><div class="item">' + ic('check', 20) + '<span>Biometric or PIN confirmation</span></div><div class="item">' + ic('check', 20) + '<span>Single-use, amount-locked cash code</span></div></div><div style="flex:1"></div>' + btn('Send invites', 'sendinv'));
  };
  V.invites = function () {
    var inv = S.setup.inv, n = 1 + inv.B + inv.C;
    return top('Invite signatories', 'conditions') + body('<h1>Waiting for everyone</h1><div class="mute">Invites go to the phone numbers the bank has on file. You cannot change them.</div><div class="bar2"><i style="width:' + n / 3 * 100 + '%"></i></div><div class="mute">' + n + ' of 3 verified</div><div class="card">' + TP.IDS.map(function (i) {
      var ok = i === 'A' || inv[i];
      return '<div class="item">' + av(i) + '<div class="grow"><b>' + P[i].name + '</b><div class="mute">' + (i === 'A' ? 'You' : ok ? 'BVN consent, face match, phone and terms done' : 'Invite sent to •••• ' + P[i].ph + ' · expires in 72h') + '</div></div>' + chip(ok ? 'Verified' : 'Invited', ok ? 'ok' : 'pend') + '</div>';
    }).join('') + '</div><div class="card"><b>Each signatory must:</b><div class="mute" style="margin-top:6px">1. Consent to a BVN check<br>2. Pass a face check<br>3. Register their phone<br>4. Accept the digital signing terms</div></div>' +
      ['B', 'C'].filter(function (i) { return !inv[i]; }).map(function (i) { return btn('Prototype: simulate ' + P[i].short + ' accepting', 'accept', i, 'demo'); }).join('') + '<div style="flex:1"></div>' + btn('Activate with bank', 'activate', undefined, '', n === 3 ? '' : ' disabled'));
  };
  V.activation = function () {
    if (!S.setup.act) return '<div class="body" style="justify-content:center;text-align:center"><div class="spin"></div><h1>Bank is activating…</h1><div class="mute">Checking every signature and recording your setup.<br>(Simulated)</div></div>';
    return body('<div class="c" style="margin-top:20px"><div class="av xl" style="margin:auto;background:var(--green)">' + ic('check', 40) + '</div><h1 style="margin-top:14px">Shared approvals are active</h1><div class="mute">Confirmed by Unity Demo Bank (simulated).</div></div><div class="card"><div class="item"><span class="grow mute">Reference</span><b>' + S.setup.ref + '</b></div><div class="item"><span class="grow mute">Bank rule</span><b>All 3 sign</b></div><div class="item"><span class="grow mute">Max per request</span><b>' + m(S.setup.max) + '</b></div><div class="item"><span class="grow mute">High-value from</span><b>' + m(S.setup.hv) + '</b></div></div><div class="banner warn">' + ic('alert', 20) + '<span>No real bank is connected. This is a demonstration.</span></div><div style="flex:1"></div>' + btn('Go to dashboard', 'go', 'home'));
  };

  // ---------- dashboard and tabs
  V.home = function () {
    var a = TP.ACCOUNTS[0], r = TP.active() ? S.req : null, mine = TP.mine(), recent = S.hist.slice(0, 3);
    return '<div class="top"><div class="av" style="background:' + P[S.user].col + '">' + P[S.user].init + '</div><b>Hi, ' + P[S.user].short + '</b><button class="ib" data-a="tab" data-v="alerts">' + ic('bell') + (unread() ? '<i style="position:absolute;top:8px;right:8px;width:10px;height:10px;border-radius:50%;background:var(--red)"></i>' : '') + '</button></div>' +
      body(frozenBar() + '<div class="hero"><div class="lbl">Unity Demo Bank (simulated) · •••• ' + a.no + '</div><div style="font-weight:800;font-size:18px">' + a.name + '</div><div class="amt">' + m(TP.BALANCE) + '</div><div class="lbl">Sample balance. Display only.</div><div class="row" style="flex-wrap:wrap;gap:8px">' + chip('Shared approvals: Active') + chip('All 3 must sign') + '</div></div>' +
        '<div class="row" style="gap:8px;flex-wrap:wrap">' + chip(ic('check', 12) + ' Identity verified', 'ok') + chip(ic('lock', 12) + ' Device bound', 'ok') + chip(ic('face', 12) + ' Face check ready', 'ok') + '</div>' +
        '<div class="row" style="gap:10px">' + btn(ic('cash') + ' Request cash', 'go', 'request', '', S.frozen ? ' disabled' : '') + btn(ic('stop') + ' Freeze', 'sheet', 'freeze', 'redo', S.frozen ? ' disabled' : '') + '</div>' +
        (mine ? '<div class="card" style="background:var(--asoft);border-color:var(--amber)"><div class="row">' + av(mine.by) + '<div class="grow"><b>' + TP.nm(mine.by) + ' needs your approval</b><div class="mute">' + m(mine.amt) + (mine.hv ? ' · high value' : '') + '</div></div></div><div style="height:10px"></div>' + btn('Review request', 'go', 'approve') + '</div>' : '') +
        (r && !mine ? reqCard(r) : '') +
        '<div class="card"><div class="row sp"><h2>Recent activity</h2><button class="chip info" style="border:0" data-a="tab" data-v="history">See all</button></div>' + recent.map(reqRow).join('') + '</div><div class="c mute">Prototype only. Simulated bank. No real money.</div>') + nav();
  };
  V.request = function () {
    var amt = Number(S.amt), err = S.amt ? TP.check(amt) : '', hv = amt && TP.isHV(amt);
    return top('Request cash', 'home') + body(frozenBar() + '<div class="c mute">How much do you need?</div><div class="big">' + m(S.amt || 0) + '</div><div class="c" style="font-size:13px;font-weight:700;color:' + (err ? 'var(--red)' : 'var(--mute)') + '">' + (err || 'Up to ' + m(S.setup.max) + ' per request') + '</div><div class="chips" style="justify-content:center">' + TP.CHIPS.map(function (v) { return '<button data-a="amt" data-v="' + v + '" class="' + (amt === v ? 'on' : '') + '">' + TP.mk(v) + '</button>'; }).join('') + '</div>' +
      (hv && !err ? '<div class="banner warn">' + ic('alert', 20) + '<span><b>High-value request.</b> Needs: ' + TP.needs(amt).join(', ') + '.</span></div>' : '') +
      '<div class="pad">' + ['1', '2', '3', '4', '5', '6', '7', '8', '9', '000', '0', '⌫'].map(function (k) { return '<button data-a="key" data-v="' + k + '">' + k + '</button>'; }).join('') + '</div>' + btn('Continue', 'sheet', 'review', '', amt && !err ? '' : ' disabled'));
  };
  V.track = function () {
    var r = S.req; if (!r) return V.home();
    var b = TP.status(r), me = S.user === r.by, pend = TP.IDS.filter(function (i) { return r.ap[i] === 'pending' && i !== S.user; });
    var acts = '';
    if (r.st === 'pending') {
      if (TP.mine()) acts += btn('Review and approve', 'go', 'approve');
      pend.forEach(function (i) { acts += btn('Prototype: open ' + P[i].short + '\'s phone', 'as', i, 'demo', ' data-s="' + (r.ap[i] === 'pending' ? 'approve' : 'home') + '"'); });
      if (me) acts += btn('Cancel request', 'sheet', 'cancel', 'redo');
    }
    if (r.st === 'delay') acts += btn('View safety delay', 'go', 'delay');
    if (r.st === 'code' && me) acts += btn('Show my cash code', 'go', 'code', 'green');
    if ((r.st === 'delay' || r.st === 'code') && !me) acts += btn('Prototype: back to ' + P[r.by].short + '\'s phone', 'as', r.by, 'demo', ' data-s="track"');
    if (r.st === 'rejected' || r.st === 'cancelled') acts += btn('Back to dashboard', 'go', 'home');
    return top('Approval tracking', 'home') + body('<div class="c"><div class="big" style="font-size:38px">' + m(r.amt) + '</div>' + chip(b[0], b[1]) + (r.hv ? ' ' + chip('High value', 'pend') : '') + '</div><div class="card">' + steps(r) + '</div><div class="card"><h2>Signatories</h2>' + signers(r) + '</div>' + acts);
  };
  V.approve = function () {
    var r = S.req; if (!r) return V.home();
    return top('Approval request', 'home') + body('<div class="c">' + av(r.by, 'xl').replace('class="av', 'style="margin:auto;background:' + P[r.by].col + '" class="av') + '<div class="mute" style="margin-top:10px">' + P[r.by].name + ' is asking for</div><div class="big" style="color:var(--navy)">' + m(r.amt) + '</div>' + chip(r.ch === 'POS' ? 'POS / ATM' : 'Branch pickup', 'info') + '</div><div class="card"><h2>Required checks</h2>' + TP.needs(r.amt).map(function (n) { return '<div class="item">' + ic('check', 18) + '<span>' + n + '</span></div>'; }).join('') + '</div><div class="card"><div class="item"><span class="grow mute">Expires in</span><b>09:42</b></div><div class="item"><span class="grow mute">Approved so far</span><b>' + TP.count(r) + ' of 3</b></div></div><div style="flex:1"></div>' +
      (TP.mine() ? btn(ic('fp') + ' Approve', 'vstart', 'approve') + btn('Reject', 'sheet', 'reject', 'sec') + btn('This is not me: freeze', 'sheet', 'freeze', 'redo') : '<div class="banner info">' + ic('check', 20) + '<span>You have already responded to this request.</span></div>' + btn('Back to tracking', 'go', 'track')));
  };
  V.delay = function () {
    var r = S.req; if (!r) return V.home();
    return top('Safety delay', 'track') + body('<div class="c" style="margin-top:8px"><div class="av xl" style="margin:auto;background:var(--amber)">' + ic('clock', 40) + '</div><h1 style="margin-top:12px">Safety delay</h1><div class="mute">All 3 signatories approved ' + m(r.amt) + '. The code is released when the timer ends. Any signatory can stop it.</div></div><div class="timer" data-count="' + (r.delayStart + r.delayMs) + '" data-mode="delay">--:--</div><div class="card">' + signers(r) + '</div><div style="flex:1"></div>' + btn(ic('stop') + ' Stop this withdrawal', 'sheet', 'stop', 'red') + btn('Prototype: skip the delay', 'skipdelay', undefined, 'demo'));
  };
  V.code = function () {
    var r = S.req; if (!r) return V.home();
    if (r.st !== 'code') return V.track();
    if (S.user !== r.by) return top('Cash code', 'track') + body(banner('info', 'Only ' + P[r.by].short + ' can see this one-time code.') + btn('Back to tracking', 'go', 'track'));
    return top('One-time cash code', 'track') + body('<div class="card"><div class="row sp"><b>Cash code</b>' + chip('<span data-count="' + (r.codeAt + 900000) + '" data-mode="code">15:00</span> left', 'pend') + '</div><div style="height:12px"></div><div class="mono">' + r.code + '</div><div class="item"><span class="grow mute">Amount (locked)</span><b>' + m(r.amt) + '</b></div><div class="item"><span class="grow mute">Use at</span><b>' + (r.ch === 'POS' ? 'POS agent or ATM' : 'Bank teller') + '</b></div><div class="item"><span class="grow mute">Approved by</span><b>' + TP.names(TP.others(r.by)) + '</b></div></div><div class="banner info">' + ic('lock', 20) + '<span>Works once, for this amount only. Never share it by call or chat. TogetherPay will never ask for it.</span></div><div style="flex:1"></div>' + btn('I have my cash', 'complete', undefined, 'green') + btn('Cancel code', 'sheet', 'cancel', 'redo'));
  };
  V.approvals = function () {
    var r = S.req, past = S.hist.filter(function (x) { return x.type === 'req' && x !== r; }).slice(0, 4);
    return top('Approvals') + body(frozenBar() + (r && ['pending', 'delay', 'code'].indexOf(r.st) > -1 ? '<h2>In progress</h2>' + (TP.mine() ? '<div class="card" style="background:var(--asoft);border-color:var(--amber)"><b>' + TP.nm(r.by) + ' needs your approval</b><div class="mute">' + m(r.amt) + '</div><div style="height:10px"></div>' + btn('Review request', 'go', 'approve') + '</div>' : '') + reqCard(r) : '<div class="card c" style="padding:28px 16px"><div class="av" style="margin:0 auto 10px;background:var(--green)">' + ic('check', 20) + '</div><b>All caught up</b><div class="mute">No approvals are waiting.</div></div>') + '<div class="card"><h2>Recently decided</h2>' + (past.length ? past.map(reqRow).join('') : '<div class="mute" style="padding:12px 0">Nothing yet.</div>') + '</div>') + nav();
  };
  V.history = function () {
    var f = S.filter, list = S.hist.filter(function (x) {
      var b = TP.status(x)[0]; return f === 'All' || (f === 'Pending' && (b === 'Pending' || b === 'Safety delay')) || (f === 'Approved' && (b === 'Approved' || b === 'Completed')) || (f === 'Rejected' && (b === 'Rejected' || b === 'Cancelled')) || (f === 'Security' && x.type === 'sec');
    });
    return top('History and audit') + body('<div class="chips">' + ['All', 'Pending', 'Approved', 'Rejected', 'Security'].map(function (x) { return '<button data-a="filter" data-v="' + x + '" class="' + (f === x ? 'on' : '') + '">' + x + '</button>'; }).join('') + '</div><div class="card" style="padding:4px 16px">' + (list.length ? list.map(reqRow).join('') : '<div class="mute c" style="padding:20px">Nothing here yet.</div>') + '</div><div class="mute c">Every step is recorded in a tamper-evident log (simulated).</div>') + nav();
  };
  V.alerts = function () {
    var l = S.notes.filter(vis), col = { ok: 'var(--green)', pend: 'var(--amber)', bad: 'var(--red)', info: 'var(--blue)' };
    return '<div class="top"><b>Alerts</b><button class="chip info" style="border:0" data-a="readall">Mark all read</button></div>' + body('<div class="card" style="padding:4px 16px">' + (l.length ? l.map(function (n) {
      return '<button class="item" data-a="read" data-v="' + n.id + '"><div class="av" style="background:' + col[n.k] + ';width:36px;height:36px">' + ic(n.k === 'bad' ? 'alert' : n.k === 'ok' ? 'check' : n.k === 'pend' ? 'clock' : 'bell', 18) + '</div><div class="grow"><b>' + n.title + '</b><div class="mute">' + n.body + '</div><div class="mute" style="font-size:12px">' + n.t + '</div></div>' + (n.read ? '' : '<span style="width:10px;height:10px;border-radius:50%;background:var(--blue)"></span>') + '</button>';
    }).join('') : '<div class="mute c" style="padding:20px">No alerts.</div>') + '</div>') + nav();
  };
  V.profile = function () {
    var a = TP.ACCOUNTS[0], p = P[S.user], f = S.frozen;
    return top('Profile') + body(
      '<div class="card row">' + av(S.user, 'xl') + '<div class="grow"><h2>' + p.name + '</h2><div class="mute">Signatory</div><div style="margin-top:6px">' + chip(ic('check', 12) + ' Identity verified', 'ok') + '</div></div></div>' +
      '<div class="card"><div class="item"><span class="grow mute">BVN</span><b>••••••• ' + p.bvn + '</b></div><div class="item"><span class="grow mute">Phone</span><b>•••• ' + p.ph + '</b></div><div class="item"><span class="grow mute">Face check</span>' + chip('Passed', 'ok') + '</div><div class="item"><span class="grow mute">Device</span>' + chip('Bound', 'ok') + '</div><div class="item"><span class="grow mute">Biometric / PIN</span>' + chip('On', 'ok') + '</div></div>' +
      '<div class="card"><div class="row sp"><h2>Joint account</h2>' + chip(f ? 'Frozen' : 'Active', f ? 'bad' : 'ok') + '</div><div class="item"><span class="grow mute">Name</span><b>' + a.name + '</b></div><div class="item"><span class="grow mute">Bank</span><b>Unity Demo Bank (simulated)</b></div><div class="item"><span class="grow mute">Account</span><b>•••• ' + a.no + '</b></div><div class="item"><span class="grow mute">Bank rule</span><b>All 3 sign</b></div><div class="item"><span class="grow mute">Confirmation</span><b>' + (S.setup.ref || 'UDB-TP-00417') + '</b></div></div>' +
      '<div class="card"><h2>Safety conditions</h2><div class="item"><span class="grow mute">Max per request</span><b>' + m(S.setup.max) + '</b></div><div class="item"><span class="grow mute">High-value from</span><b>' + m(S.setup.hv) + '</b></div><div class="item"><span class="grow mute">Safety delay</span><b>' + S.setup.delay + ' min</b></div></div>' +
      '<div class="card"><h2>Signatories</h2>' + TP.IDS.map(function (i) { return '<div class="item">' + av(i) + '<div class="grow"><b>' + P[i].name + '</b><div class="mute">BVN ••••••• ' + P[i].bvn + '</div></div>' + chip(i === S.user ? 'You' : 'Verified', i === S.user ? 'info' : 'ok') + '</div>'; }).join('') + '</div>' +
      (f ? '<div class="card" style="border-color:var(--red)"><h2 style="color:var(--red)">Frozen by ' + TP.nm(f.by) + '</h2><div class="mute">Unfreezing needs all 3 signatories.</div>' + TP.IDS.map(function (i) { return '<div class="item">' + av(i) + '<div class="grow"><b>' + P[i].short + '</b></div>' + chip(f.un[i] ? 'Approved' : 'Waiting', f.un[i] ? 'ok' : 'pend') + '</div>'; }).join('') + btn('Approve unfreeze', 'vstart', 'unfreeze', 'green', f.un[S.user] ? ' disabled' : '') + '</div>' : btn(ic('stop') + ' Freeze withdrawals (emergency)', 'sheet', 'freeze', 'red')) +
      '<div class="card" style="border:1px dashed var(--amber)"><h2>Prototype tools</h2><div class="mute" style="margin:4px 0 10px">Switch between the 3 sample signatories to demonstrate approvals.</div>' + TP.IDS.filter(function (i) { return i !== S.user; }).map(function (i) { return btn('View as ' + P[i].name, 'as', i, 'demo', ' data-s="home"'); }).join('<div style="height:8px"></div>') + '<div style="height:8px"></div>' + btn('Reset demo', 'sheet', 'reset', 'sec') + '</div>' +
      btn('Sign out', 'sheet', 'logout', 'sec') + '<div class="c mute">TogetherPay prototype v1.0 · Sample data only</div>') + nav();
  };

  // ---------- bottom sheets
  TP.sheet = function () {
    var k = S.sheet; if (!k) return '';
    var b = '', r = S.req, d = k.split(':');
    if (k === 'review') {
      var amt = Number(S.amt);
      b = '<h1 style="font-size:22px">Review request</h1><div class="chips"><button data-a="ch" data-v="POS" class="' + (S.ch === 'POS' ? 'on' : '') + '">POS / ATM</button><button data-a="ch" data-v="BR" class="' + (S.ch === 'BR' ? 'on' : '') + '">Bank branch</button></div><div class="card"><div class="item"><span class="grow mute">Amount</span><b>' + m(amt) + '</b></div><div class="item"><span class="grow mute">Needs approval from</span><b>' + TP.names(TP.others(S.user)) + '</b></div></div><div class="card"><div class="lab">Required checks</div>' + TP.needs(amt).map(function (n) { return '<div class="item">' + ic('check', 18) + '<span>' + n + '</span></div>'; }).join('') + '</div>' + (amt > 500000 && S.ch === 'POS' ? '<div class="banner warn">' + ic('alert', 20) + '<span>Cash above ₦500,000 may attract bank or CBN cash limits and fees. For large amounts, choose branch pickup.</span></div>' : '') + btn('Verify and send', 'vstart', 'send');
    } else if (k === 'reject') {
      b = '<h1 style="font-size:22px">Reject this request?</h1><div class="chips">' + ['Amount not agreed', 'Did not expect this', 'Looks suspicious'].map(function (x) { return '<button data-a="rr" data-v="' + x + '" class="' + (S.rr === x ? 'on' : '') + '">' + x + '</button>'; }).join('') + '</div><div class="mute">The request closes and no code is issued.</div>' + btn('Reject request', 'reject', undefined, 'red') + btn('Keep it open', 'close', undefined, 'sec');
    } else if (k === 'cancel') {
      b = '<h1 style="font-size:22px">Cancel this request?</h1><div class="mute">Everyone will be told. Any unused cash code stops working.</div>' + btn('Cancel request', 'cancelreq', undefined, 'red') + btn('Keep it', 'close', undefined, 'sec');
    } else if (k === 'stop') {
      b = '<h1 style="font-size:22px">Stop this withdrawal?</h1><div class="mute">Any signatory can stop it during the safety delay. No code will be issued.</div>' + btn('Stop withdrawal', 'stopreq', undefined, 'red') + btn('Keep waiting', 'close', undefined, 'sec');
    } else if (k === 'freeze') {
      b = '<div class="c"><div class="av" style="margin:0 auto 8px;background:var(--red)">' + ic('alert', 22) + '</div><h1 style="font-size:22px">Freeze all withdrawals?</h1></div><div class="mute">Emergency stop. All signatories are alerted, any active request is cancelled, and unfreezing needs all 3 signatories.</div>' + btn('Freeze now', 'dofreeze', undefined, 'red') + btn('Keep active', 'close', undefined, 'sec');
    } else if (k === 'logout') {
      b = '<h1 style="font-size:22px">Sign out of TogetherPay?</h1><div class="mute">Your setup stays saved in this demo. You will need your PIN to log back in.</div>' + btn('Sign out', 'logout', undefined, 'red') + btn('Stay signed in', 'close', undefined, 'sec');
    } else if (k === 'reset') {
      b = '<h1 style="font-size:22px">Reset the demo?</h1><div class="mute">This clears all sample progress and returns to the welcome screen.</div>' + btn('Reset', 'reset', undefined, 'red') + btn('Cancel', 'close', undefined, 'sec');
    } else if (d[0] === 'detail') {
      var x = S.hist.filter(function (h) { return h.id === d[1]; })[0]; if (!x) return '';
      var st = TP.status(x);
      b = '<div class="row sp"><h1 style="font-size:22px">' + (x.type === 'sec' ? x.title : m(x.amt) + ' cash request') + '</h1>' + chip(st[0], st[1]) + '</div>' + (x.type === 'req' ? '<div class="card"><div class="item"><span class="grow mute">Requested by</span><b>' + P[x.by].name + '</b></div><div class="item"><span class="grow mute">Payout</span><b>' + (x.ch === 'POS' ? 'POS / ATM' : 'Bank branch') + '</b></div><div class="item"><span class="grow mute">Checks</span><b>' + (x.hv ? 'Biometric + face + delay' : 'Biometric / PIN') + '</b></div>' + (x.reason ? '<div class="item"><span class="grow mute">Reason</span><b>' + x.reason + '</b></div>' : '') + '</div><div class="card"><h2>Signatories</h2>' + signers(x) + '</div>' : '') + '<div class="card"><h2>Audit trail</h2><div style="height:8px"></div>' + audit(x) + '<div class="mute" style="font-size:12px">Audit ref ' + x.ref + ' · tamper-evident log (simulated)</div></div>' + btn('Close', 'close', undefined, 'sec');
    }
    return '<div class="shade" data-a="close"></div><div class="sheet"><div class="grab"></div>' + b + '</div>';
  };
  TP.userName = userName;
})();
