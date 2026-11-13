// フォーム送信先。FormSubmit（アカウント登録不要）を使用。初回の送信時に、宛先メールへ有効化の確認メールが届きます。
// Formspree 等に切り替える場合は、このURLを差し替えてください。空にすると、訪問者のメールソフトが開く方式になります。
// 送信先：digirep.work（同じサーバー）の /api/lead。メール通知と自動返信はサーバー側で行う。失敗時はメールソフトを開く。
var FORM_ENDPOINT='/api/lead';
var TO='yumoto@digirep.work';
(function(){
 var y=document.getElementById('y');if(y)y.textContent=new Date().getFullYear();
 // 流入元（?ref= / utm_source など）を、最初に着いたときに覚えておく。お申込みのメモに入れて、どの経路が効いたかを分かるようにする
 var SRC='';try{var q=new URLSearchParams(location.search),a=[];['ref','utm_source','utm_medium','utm_campaign'].forEach(function(k){var v=(q.get(k)||'').replace(/[^0-9A-Za-z_.-]/g,'').slice(0,40);if(v)a.push(k.replace('utm_','')+'='+v)});
  if(a.length)sessionStorage.setItem('kao_src',a.join(' '));else if(!sessionStorage.getItem('kao_src')&&document.referrer&&document.referrer.indexOf(location.host)<0)sessionStorage.setItem('kao_src','from='+document.referrer.replace(/^https?:[/][/]/,'').split('/')[0].slice(0,40));
  SRC=sessionStorage.getItem('kao_src')||'';if(!sessionStorage.getItem('kao_land'))sessionStorage.setItem('kao_land',location.pathname);}catch(e){}
 function srcLine(){var l='';try{l=sessionStorage.getItem('kao_land')||''}catch(e){}return (SRC?'\n流入：'+SRC:'')+(l?'\n最初に見たページ：'+l:'')}
 window.__t0=Date.now();
 // 採用ページ3点チェック（会社名とメールだけ）
 var c3=document.getElementById('c3f');
 if(c3){var ce=document.getElementById('c3err');c3.addEventListener('submit',function(e){e.preventDefault();ce.style.display='none';
  var d=new FormData(c3);function bad(t,id){ce.textContent=t;ce.style.display='block';ce.style.color='#c8372d';document.getElementById(id).focus()}
  if(d.get('_honey')){c3.style.display='none';document.getElementById('c3done').style.display='block';return}
  var co=(d.get('会社名')||'').trim(),ml=(d.get('email')||'').trim(),ur=(d.get('URL')||'').trim(),nm=(d.get('お名前')||'').trim();
  if(!co){bad('会社名をご入力ください。','c3co');return}
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ml)){bad('メールアドレスの形式をご確認ください。','c3ml');return}
  var b=c3.querySelector('button');b.disabled=true;b.textContent='送信中…';
  var body={purpose:'採用支援（採用ページ3点チェックのお申込み）',company:co,name:nm||'ご担当者',email:ml,tel:'',media:'採用の顔・新卒ダイレクト',diag:'',hp:'',ts:window.__t0,message:'採用ページ・求人票のURL：'+(ur||'（未記入）')+'\n送信元ページ：'+location.pathname+srcLine()};
  fetch(FORM_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(body)})
   .then(function(r){if(!r.ok)throw 0;c3.style.display='none';document.getElementById('c3done').style.display='block';try{if(window.gtag)gtag('event','generate_lead',{event_category:'saiyo_check3',event_label:location.pathname,value:1})}catch(e){}})
   .catch(function(){b.disabled=false;b.textContent='3点チェックを受け取る（無料）';location.href='mailto:'+TO+'?subject='+encodeURIComponent('【採用ページ3点チェックのお申込み】'+co)+'&body='+encodeURIComponent('会社名：'+co+'\nお名前：'+nm+'\nメール：'+ml+'\n採用ページ・求人票のURL：'+ur);ce.textContent='メールソフトが開きます。そのまま送信してください。開かない場合は、お電話（080-5527-1689）でご連絡ください。';ce.style.display='block';ce.style.color='#128a5a'});
 })}
 // モバイルメニュー
 var mb=document.querySelector('.mbtn'),mn=document.getElementById('mnav');
 if(mb&&mn){mb.addEventListener('click',function(){var on=mn.classList.toggle('on');mb.setAttribute('aria-expanded',on);mb.setAttribute('aria-label',on?'メニューを閉じる':'メニューを開く');document.body.style.overflow=on?'hidden':''});
  mn.addEventListener('click',function(e){if(e.target.closest('a')){mn.classList.remove('on');mb.setAttribute('aria-expanded','false');document.body.style.overflow=''}})}
 // スクロール表示
 var io=('IntersectionObserver' in window)?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.08}):null;
 document.querySelectorAll('.rv').forEach(function(el,i){if(io){el.style.transitionDelay=(i%4*70)+'ms';io.observe(el)}else el.classList.add('in')});
 // フォーム
 var f=document.getElementById('f'),err=document.getElementById('err');if(!f)return;
 function showErr(t,ok){err.textContent=t;err.style.display='block';err.style.color=ok?'#128a5a':'#c8372d'}
 function done(){f.style.display='none';document.getElementById('done').style.display='block';try{if(window.gtag)gtag('event','generate_lead',{event_category:'saiyo',event_label:location.pathname,value:1})}catch(e){}}
 function viaMail(o){location.href='mailto:'+TO+'?subject='+encodeURIComponent('【採用診断のお申込み】'+o['会社名'])+'&body='+encodeURIComponent(Object.keys(o).filter(function(k){return k.charAt(0)!=='_'}).map(function(k){return k+'：'+o[k]}).join('\n'));
  showErr('メールソフトが開きます。そのまま送信してください。開かない場合は、お電話（080-5527-1689）でご連絡ください。',1)}
 f.addEventListener('submit',function(e){
  e.preventDefault();err.style.display='none';
  var d=new FormData(f);if(d.get('_honey')){done();return}
  var need=[['co','会社名'],['nm','お名前'],['tl','電話番号'],['ml','メールアドレス']];
  for(var i=0;i<need.length;i++){var el=document.getElementById(need[i][0]);if(!el.value.trim()){showErr(need[i][1]+'をご入力ください。');el.focus();return}}
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.get('email'))){showErr('メールアドレスの形式をご確認ください。');document.getElementById('ml').focus();return}
  var o={};d.forEach(function(v,k){if(k!=='_honey')o[k]=v});window.__t0=window.__t0||Date.now();o['送信元ページ']=location.pathname;var sl=srcLine();
  if(!FORM_ENDPOINT){viaMail(o);return}
  var skip={'会社名':1,'お名前':1,'電話番号':1,'email':1,'診断結果':1};
  var body={purpose:'採用支援（'+(o['診断結果']?'かんたん診断からの詳しい診断のお申込み':'無料採用診断のお申込み')+'）',company:o['会社名'],name:o['お名前'],email:o['email'],tel:o['電話番号'],media:'採用の顔・新卒ダイレクト',diag:o['診断結果']||'',hp:'',ts:(window.__t0||0),
   message:Object.keys(o).filter(function(k){return !skip[k]&&k.charAt(0)!=='_'}).map(function(k){return k+'：'+o[k]}).join('\n')+sl};
  var b=f.querySelector('button');b.disabled=true;b.textContent='送信中…';
  fetch(FORM_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(body)})
   .then(function(r){if(!r.ok)throw 0;done()})
   .catch(function(){b.disabled=false;b.textContent='無料の採用診断を申し込む';viaMail(o)});
 });
})();
