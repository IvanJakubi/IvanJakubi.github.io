(function () {
  var root = document.getElementById('calc'); if (!root) return;
  var P = {
    'Toadshroom': [20,10,15,55,25,15], 'Leobat': [35,10,20,15,30,5], 'Shocpion': [35,5,5,30,50,35],
    'Boablaze': [10,20,10,60,30,20], 'Teakka': [10,70,15,5,5,55], 'Lizord': [80,15,90,10,40,5],
    'Hexadillo': [70,15,45,10,95,5], 'Abunibus': [15,60,5,70,15,100], 'Groobeet': [95,20,50,20,100,20],
    'Sparlin': [70,100,30,20,30,85], 'Charpup': [40,90,25,50,20,80]
  };
  var N = {
    'Balanced': [1,1,1,1,1,1], 'Combative': [1,1.1,.9,1,.9,1.1], 'Shy': [1.2,.9,1,.9,1,1],
    'Intuitive': [1,.9,.9,1.1,1.1,1], 'Fortuitous': [1.1,.9,1.1,.9,1.1,.9], 'Primitive': [1,1.1,.9,.9,.9,1.2],
    'Witty': [.9,1,1,1.1,1,1], 'Compassionate': [1.1,.9,1.1,1,1,.9], 'Patient': [.9,.9,1,1.2,1,1]
  };
  var S = ['Health','Attack','Defence','Sp. Attack','Sp. Defence','Speed'];
  var $ = function (id) { return document.getElementById(id); };
  var sp = $('c-p'), sn = $('c-n');
  Object.keys(P).forEach(function (k) { sp.add(new Option(k, k)); });
  Object.keys(N).forEach(function (k) { sn.add(new Option(k, k)); });
  sp.value = 'Charpup'; sn.value = 'Combative';
  var out = $('c-out');
  S.forEach(function (n, i) {
    out.insertAdjacentHTML('beforeend', '<div class="crow"><span class="cl">' + n + '</span><span class="cb"><i id="cb' + i + '"></i></span><span class="cv" id="cv' + i + '"></span></div>');
  });
  function rarity(t) { return t <= 200 ? ['Common',4,function(L){return .75*L*L*L;}] : t <= 300 ? ['Uncommon',6,function(L){return L*L*L;}] : t <= 400 ? ['Rare',8,function(L){return 4/3*L*L*L-13*L*L+120*L-190;}] : ['Legendary',10,function(L){return 1.4*L*L*L;}]; }
  function run() {
    var b = P[sp.value], m = N[sn.value], L = +$('c-lv').value, it = +$('c-it').value, td = +$('c-td').value;
    $('c-lv-o').value = L; $('c-it-o').value = it; $('c-td-o').value = td;
    for (var i = 0; i < 6; i++) {
      var v = i === 0 ? (((b[0] + it + td / 8) * L / 50) + L + 10) * m[0] * 2
                      : (((4 * b[i] + it + td / 8) * L / 150) + 10) * m[i];
      var max = i === 0 ? 840 : 350;
      $('cv' + i).textContent = Math.round(v);
      $('cb' + i).style.width = Math.min(100, v / max * 100) + '%';
      $('cb' + i).className = m[i] > 1 ? 'up' : m[i] < 1 ? 'dn' : '';
    }
    var t = b.reduce(function (a, c) { return a + c; }, 0), r = rarity(t);
    var mo = Math.max(b[3], b[4]); mo = mo <= 25 ? 4 : mo <= 50 ? 5 : mo <= 75 ? 6 : 7;
    $('c-meta').textContent = r[0] + ' (base total ' + t + ') · gives ' + Math.round(t * r[1] / 20) + ' base EXP · ' +
      Math.max(0, Math.round(r[2](L))).toLocaleString('en-US') + ' total EXP at level ' + L + ' · ' + mo + ' Momentum per hit';
  }
  root.addEventListener('input', run); root.addEventListener('change', run); run();
})();
