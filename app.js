/* TogetherPay prototype - router, events and simulated verification flow. */
(function () {
  var TP = window.TP, S = TP.S, P = TP.PEOPLE;
  var TABS = ['home', 'approvals', 'history', 'alerts', 'profile'];
  var BACK = { auth: 'welcome', otp: 'auth', idv: 'otp', idok: 'idv', bank: 'idok', consent: 'bank', accounts: 'consent', rule: 'accounts', conditions: 'rule', invites: 'conditions', request: 'home', track: 'home', approve: 'home', delay: 'track', code: 'track' };
  var timers = [], toastT = null;
  TP.later = function (fn, ms) { timers.push(setTimeout(fn, ms)); };
  TP.clear = function () { timers.forEach(clearTimeout); timers = []; };

  // ---- rendering
  function render() {
    document.getElementById('app').innerHTML = TP.V[S.screen]() + TP.sheet() + (S.toast ? '<div class="toast">' + TP.ic('check', 18) + ' ' + S.toast + '</div>' : '');
    after();
  }
  TP.render = render;
  function go(s) { TP.clear(); S.screen = s; S.sheet = null; if (TABS.indexOf(s) > -1) S.tab = s; render(); }
  function say(t) { S.toast = t; render(); if (navigator.vibrate) navigator.vibrate(25); clearTimeout(toastT); toastT = setTimeout(function () { S.toast = null; render(); }, 2600); }

  // ---- form validation
  var OK = {
    auth: function () { var f = S.form; return S.authTab === 'signup' ? f.name.trim().length >= 3 && /^\d{11}$/.test(f.phone) && /^\d{4}$/.test(f.pin) : /^\d{11}$/.test(f.lphone) && /^\d{4}$/.test(f.lpin); },
    otp: function () { return /^\d{6}$/.test(S.form.otp); },
    idv: function () { return /^\d{11}$/.test(S.form.idn); }
  };
  function refresh() { var b = document.getElementById('primary'); if (b && OK[S.screen]) b.disabled = !OK[S.screen](); }
  function clockText() {
    document.querySelectorAll('[data-count]').forEach(function (e) {
      var s = Math.ceil(Math.max(0, Number(e.dataset.count) - Date.now()) / 1000);
      e.textContent = ('0' + Math.floor(s / 60)).slice(-2) + ':' + ('0' + (s % 60)).slice(-2);
    });
  }

  // ---- simulated verification: fingerprint/PIN, then face for high-value requests
  function startVerify(purpose) {
    var r = S.req, amt = Number(S.amt), hv = purpose === 'send' ? TP.isHV(amt) : purpose === 'approve' ? !!(r && r.hv) : false;
    var steps = purpose === 'identity' ? ['face'] : ['bio'].concat(hv ? ['face'] : []);
    var sub = { identity: 'Live face check for your identity', send: 'Confirm to send ' + TP.m(amt) + ' for approval', approve: 'Approve ' + (r ? TP.m(r.amt) : '') + ' for ' + (r ? TP.nm(r.by) : ''), unfreeze: 'Approve unfreezing withdrawals' }[purpose];
    S.vf = { purpose: purpose, steps: steps, i: 0, step: steps[0], mode: 'bio', pin: '', err: '', fs: 0, running: false, scanning: false, title: "Confirm it's you", sub: sub };
    go('verify');
  }
  function advance() {
    var v = S.vf; if (!v) return; v.i++;
    if (v.i >= v.steps.length) return finish();
    v.step = v.steps[v.i]; v.running = false; v.mode = 'bio'; render();
  }
  function runFace() {
    var v = S.vf; if (!v || v.running) return; v.running = true; v.fs = 0;
    (function tick() {
      TP.later(function () {
        if (S.vf !== v) return;
        if (v.fs >= 4) { TP.later(advance, TP.FT * 0.7); return; }
        v.fs++; render(); tick();
      }, TP.FT);
    })();
  }
  function finish() {
    var v = S.vf, p = v.purpose; S.vf = null;
    if (p === 'identity') { go('idok'); }
    else if (p === 'send') { TP.createRequest(); go('track'); say('Request sent. Waiting for the other signatories.'); }
    else if (p === 'approve') { TP.approve(S.user); go('track'); say(S.req.st === 'delay' ? 'All approved. Safety delay started.' : S.req.st === 'code' ? 'All approved. Cash code issued.' : 'Your approval is recorded.'); }
    else if (p === 'unfreeze') { TP.approveUnfreeze(S.user); go('profile'); say(S.frozen ? 'Your approval is recorded.' : 'Account unfrozen.'); }
  }
  function after() {
    refresh(); clockText();
    if (S.screen === 'verify' && S.vf && S.vf.step === 'face') runFace();
    if (S.screen === 'activation' && !S.setup.act && !S.actT) {
      S.actT = true;
      TP.later(function () { TP.activate(); S.setup.act = 1; S.actT = false; render(); }, TP.FT * 1.5);
    }
  }
  setInterval(function () {
    clockText();
    if (TP.tick()) { if (S.screen === 'delay') { go('track'); say('Safety delay finished. Cash code issued.'); } else render(); }
  }, 500);

  // ---- input binding (no re-render, keeps the keyboard open)
  document.addEventListener('input', function (e) {
    var k = e.target.dataset && e.target.dataset.bind; if (!k) return;
    var v = e.target.value; if (k !== 'name') { v = v.replace(/\D/g, ''); e.target.value = v; }
    S.form[k] = v; refresh();
  });

  // ---- clicks
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-a]'); if (!t) return;
    var a = t.dataset.a, v = t.dataset.v, f = S.form, nmk = TP.nm(S.user);
    switch (a) {
      case 'go':
        if (v === 'request' && TP.active()) { go('track'); say('A request is already in progress.'); } else go(v); break;
      case 'tab': go(v); break;
      case 'auth': S.authTab = v; go('auth'); break;
      case 'authtab': S.authTab = v; render(); break;
      case 'sample':
        if (S.authTab === 'signup') { f.name = 'Amina Bello'; f.phone = '08030001234'; f.pin = '1234'; } else { f.lphone = f.phone || '08030001234'; f.lpin = S.pin; }
        render(); break;
      case 'authgo':
        if (S.authTab === 'signup') {
          var w = f.name.trim().split(/\s+/); P.A.name = f.name.trim(); P.A.short = w[0]; P.A.init = (w[0][0] + (w[1] ? w[1][0] : '')).toUpperCase();
          S.pin = f.pin; S.signedUp = true; S.user = 'A'; go('otp');
        } else if (!S.signedUp) { say('No account yet. Sign up first.'); }
        else if (f.lphone !== f.phone || f.lpin !== S.pin) { say('Wrong phone number or PIN.'); }
        else { S.user = 'A'; go(S.setup.active ? 'home' : 'idv'); }
        break;
      case 'otpfill': f.otp = TP.DEMO_OTP; render(); break;
      case 'otpgo': if (f.otp === TP.DEMO_OTP) go('idv'); else say('That code is not right. Use the demo code.'); break;
      case 'idt': f.idt = v; render(); break;
      case 'idsample': f.idn = '12345678901'; render(); break;
      case 'idgo': startVerify('identity'); break;
      case 'vstart': startVerify(v); break;
      case 'vfx':
        var pu = S.vf && S.vf.purpose; S.vf = null; go({ identity: 'idv', send: 'request', approve: 'approve', unfreeze: 'profile' }[pu] || 'home'); break;
      case 'vfmode': S.vf.mode = v; S.vf.pin = ''; S.vf.err = ''; render(); break;
      case 'scan':
        S.vf.scanning = true; render();
        TP.later(function () { if (S.vf) { S.vf.scanning = false; advance(); } }, TP.FT * 1.1); break;
      case 'pk':
        var q = S.vf; if (v === '⌫') q.pin = q.pin.slice(0, -1); else if (q.pin.length < 4) q.pin += v; q.err = '';
        if (q.pin.length === 4) { if (q.pin === S.pin) { advance(); break; } q.err = 'Wrong PIN. Try again.'; q.pin = ''; }
        render(); break;
      case 'bank': S.setup.bank = v; render(); break;
      case 'soon': say('Not a partner yet. Joint accounts at this bank are not supported.'); break;
      case 'acct': S.setup.acct = v; go('rule'); break;
      case 'noacct': say(TP.ACCOUNTS.filter(function (x) { return x.id === v; })[0].why); break;
      case 'setc': S.setup[t.dataset.k] = Number(v); render(); break;
      case 'sendinv': S.setup.inv = { B: 0, C: 0 }; go('invites'); break;
      case 'accept': S.setup.inv[v] = 1; render(); say(P[v].short + ' verified: BVN, face, phone, terms (simulated)'); break;
      case 'activate': S.setup.act = 0; go('activation'); break;
      case 'skip': TP.demoSkip(); S.setup.act = 1; go('home'); say('Prototype shortcut: sample setup loaded'); break;
      case 'amt': S.amt = String(v); render(); break;
      case 'key':
        if (v === '⌫') S.amt = S.amt.slice(0, -1); else if (S.amt.length + v.length <= 8) S.amt = (S.amt + v).replace(/^0+/, '');
        render(); break;
      case 'sheet': S.sheet = v; render(); break;
      case 'close': S.sheet = null; render(); break;
      case 'ch': S.ch = v; render(); break;
      case 'cancelreq': TP.cancel(S.user, 'Cancelled by ' + nmk); go('track'); say('Request cancelled. Everyone was told.'); break;
      case 'stopreq': TP.cancel(S.user, 'Stopped during the safety delay by ' + nmk); go('track'); say('Withdrawal stopped. No code issued.'); break;
      case 'dofreeze': TP.freeze(S.user); go('home'); say('Withdrawals frozen. Everyone alerted.'); break;
      case 'rr': S.rr = v; render(); break;
      case 'reject': TP.reject(S.user, S.rr); go('track'); say('Request rejected.'); break;
      case 'complete': TP.complete(); go('home'); say('Done. Everyone was notified.'); break;
      case 'skipdelay': TP.skipDelay(); go('track'); say('Prototype: delay skipped. Cash code issued.'); break;
      case 'as':
        var d = t.dataset.s || 'home'; S.user = v; if (d === 'approve' && !TP.mine()) d = S.req ? 'track' : 'home'; if (d === 'track' && !S.req) d = 'home';
        go(d); say('Prototype: now viewing as ' + P[v].name); break;
      case 'filter': S.filter = v; render(); break;
      case 'read': S.notes.forEach(function (n) { if (String(n.id) === v) n.read = true; }); render(); break;
      case 'readall': S.notes.forEach(function (n) { n.read = true; }); render(); break;
      case 'logout': go('welcome'); S.user = 'A'; say('Signed out'); break;
      case 'reset': TP.reset(); go('welcome'); break;
    }
  });

  // ---- Android back button (only inside the installed app)
  var A = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App;
  if (A) A.addListener('backButton', function () {
    if (S.sheet) { S.sheet = null; render(); }
    else if (S.screen === 'verify') { document.querySelector('[data-a="vfx"]').click(); }
    else if (S.screen === 'activation' || S.screen === 'welcome') { if (S.screen === 'welcome') A.exitApp(); }
    else if (BACK[S.screen]) go(BACK[S.screen]);
    else if (S.screen !== 'home' && TABS.indexOf(S.screen) > -1) go('home');
    else A.exitApp();
  });

  TP.go = go; TP.say = say;
  render();
})();
