// フォーム送信先。FormSubmit（アカウント登録不要）を使用。初回の送信時に、宛先メールへ有効化の確認メールが届きます。
// Formspree 等に切り替える場合は、このURLを差し替えてください。空にすると、訪問者のメールソフトが開く方式になります。
// 送信先：digirep.work（同じサーバー）の /api/lead。メール通知と自動返信はサーバー側で行う。失敗時はメールソフトを開く。
var FORM_ENDPOINT='/api/lead';
var TO='digirep.yumoto@gmail.com';
(function(){
 var y=document.getElementById('y');if(y)y.textContent=new Date().getFullYear();
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
  var d=new FormData(f);if(d.get('_honey'))return;
  var need=[['co','会社名'],['nm','お名前'],['tl','電話番号'],['ml','メールアドレス']];
  for(var i=0;i<need.length;i++){var el=document.getElementById(need[i][0]);if(!el.value.trim()){showErr(need[i][1]+'をご入力ください。');el.focus();return}}
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.get('email'))){showErr('メールアドレスの形式をご確認ください。');document.getElementById('ml').focus();return}
  var o={};d.forEach(function(v,k){if(k!=='_honey')o[k]=v});o['送信元ページ']=location.pathname;
  if(!FORM_ENDPOINT){viaMail(o);return}
  var skip={'会社名':1,'お名前':1,'電話番号':1,'email':1,'診断結果':1};
  var body={purpose:'採用支援（'+(o['診断結果']?'かんたん診断からの詳しい診断のお申込み':'無料採用診断のお申込み')+'）',company:o['会社名'],name:o['お名前'],email:o['email'],tel:o['電話番号'],media:'採用の顔・新卒ダイレクト',diag:o['診断結果']||'',
   message:Object.keys(o).filter(function(k){return !skip[k]&&k.charAt(0)!=='_'}).map(function(k){return k+'：'+o[k]}).join('\n')};
  var b=f.querySelector('button');b.disabled=true;b.textContent='送信中…';
  fetch(FORM_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(body)})
   .then(function(r){if(!r.ok)throw 0;done()})
   .catch(function(){b.disabled=false;b.textContent='無料の採用診断を申し込む';viaMail(o)});
 });
})();
