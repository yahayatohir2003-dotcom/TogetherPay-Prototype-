/* TogetherPay prototype - MOCK DATA ONLY.
   All people, banks, accounts and transactions are fictional. No real bank is connected. */
(function () {
  var TP = (window.TP = window.TP || {});
  TP.FT = window.FT || 1000;              // base animation time (ms)
  TP.DEMO_OTP = '482913';
  TP.IDS = ['A', 'B', 'C'];
  TP.PEOPLE = {
    A: { id: 'A', name: 'Amina Bello', short: 'Amina', init: 'AB', bvn: '7731', ph: '4471', col: '#1D4ED8' },
    B: { id: 'B', name: 'Chinedu Okafor', short: 'Chinedu', init: 'CO', bvn: '4417', ph: '2208', col: '#0F766E' },
    C: { id: 'C', name: 'Tunde Adeyemi', short: 'Tunde', init: 'TA', bvn: '9902', ph: '9035', col: '#7C3AED' }
  };
  TP.BANKS = [
    { id: 'unity', name: 'Unity Demo Bank', note: 'Simulated partner bank', ok: true },
    { id: 'harmony', name: 'Harmony Sandbox Bank', note: 'Coming soon', ok: false },
    { id: 'savannah', name: 'Savannah Demo Bank', note: 'Coming soon', ok: false }
  ];
  TP.ACCOUNTS = [
    { id: 'a1', name: 'Sunrise Ventures Joint Account', no: '4821', rule: 'All signatories must sign', state: 'eligible' },
    { id: 'a2', name: 'Family Savings', no: '1180', rule: 'Either to sign', state: 'no', why: 'One person can already use a card, so approvals are not needed.' },
    { id: 'a3', name: 'Operations Account', no: '5521', rule: 'Class A/B signatories with limits', state: 'no', why: 'Class A/B mandates are not supported yet.' }
  ];
  TP.CHIPS = [500000, 1000000, 1500000, 2000000, 5000000];
  TP.OPT = { max: [5000000, 10000000, 20000000], hv: [250000, 500000, 1000000], delay: [30, 60] };
  TP.BALANCE = 48250000; // sample balance, display only

  function a(t, who, x, k) { return { t: t, a: who, x: x, k: k || 'info' }; }
  TP.seed = function () {
    var done = function (id, amt, by, ch, when, ap, audit) {
      return { id: id, type: 'req', amt: amt, by: by, ch: ch, st: 'done', hv: amt >= 1000000, when: when, ap: ap, audit: audit, ref: TP.ref() };
    };
    var hist = [
      done('R-0912', 1500000, 'B', 'BR', 'Mon, 28 Sep', { A: 'approved', B: 'approved', C: 'approved' }, [
        a('2:02 pm', 'Chinedu', 'Requested ₦1,500,000 (branch pickup)'),
        a('2:05 pm', 'Amina', 'Approved: biometric + face match', 'ok'),
        a('2:07 pm', 'Tunde', 'Approved: biometric + face match', 'ok'),
        a('2:08 pm', 'System', 'Safety delay started (30 min)', 'pend'),
        a('2:38 pm', 'System', 'One-time cash code issued', 'ok'),
        a('2:52 pm', 'Chinedu', 'Cash collected', 'ok')]),
      { id: 'R-0911', type: 'req', amt: 3000000, by: 'A', ch: 'BR', st: 'rejected', hv: true, when: 'Fri, 25 Sep', reason: 'Amount not agreed',
        ap: { A: 'approved', B: 'pending', C: 'rejected' }, ref: TP.ref(), audit: [
          a('10:12 am', 'Amina', 'Requested ₦3,000,000 (branch pickup)'),
          a('10:20 am', 'Tunde', 'Rejected: Amount not agreed', 'bad'),
          a('10:20 am', 'System', 'Request closed. No code issued.', 'bad')] },
      done('R-0905', 850000, 'C', 'POS', 'Tue, 22 Sep', { A: 'approved', B: 'approved', C: 'approved' }, [
        a('4:40 pm', 'Tunde', 'Requested ₦850,000 (POS / ATM)'),
        a('4:44 pm', 'Chinedu', 'Approved: biometric', 'ok'),
        a('4:49 pm', 'Amina', 'Approved: biometric', 'ok'),
        a('4:49 pm', 'System', 'One-time cash code issued', 'ok'),
        a('5:03 pm', 'Tunde', 'Cash collected', 'ok')]),
      { id: 'S-0903', type: 'sec', amt: 0, st: 'sec', title: 'Account frozen by Tunde', when: 'Sun, 20 Sep', ref: TP.ref(), audit: [
        a('9:15 pm', 'Tunde', 'Pressed Freeze: emergency', 'bad'),
        a('9:16 pm', 'System', 'All signatories alerted', 'sec'),
        a('9:40 pm', 'All', 'Unfrozen with approval from all 3 signatories', 'ok')] }
    ];
    var notes = [
      { id: 1, to: 'all', t: 'Yesterday', title: 'Shared approvals active', body: 'Unity Demo Bank (simulated) confirmed your setup.', k: 'ok', read: true },
      { id: 2, to: 'all', t: 'Mon', title: 'Cash collected', body: 'Chinedu collected ₦1,500,000 at the branch.', k: 'ok', read: true }
    ];
    return { hist: hist, notes: notes };
  };
  TP.ref = function () {
    var h = '0123456789ABCDEF', s = '';
    for (var i = 0; i < 4; i++) s += h[Math.floor(Math.random() * 16)];
    return s + '…' + h[Math.floor(Math.random() * 16)] + h[Math.floor(Math.random() * 16)] + h[Math.floor(Math.random() * 16)];
  };
})();
