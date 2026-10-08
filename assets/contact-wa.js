(function(){
  var lcp=document.createElement('script');lcp.src='/assets/lcp-boost.js';document.head.appendChild(lcp);
  if(!document.querySelector('script[src*="i18n-router"]')){var i18n=document.createElement('script');i18n.src='/assets/i18n-router.js';i18n.defer=true;document.head.appendChild(i18n);}

  // Dynamic FAQPage JSON-LD (from .faq-item or details)
  var faq = document.createElement('script');
  faq.src = '/assets/faqpage.js';
  faq.defer = true;
  document.head.appendChild(faq);

  if (document.querySelector('.wa-fab')) return;
  var css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = '/assets/contact-wa.css';
  document.head.appendChild(css);

  var wa = document.createElement('a');
  wa.href = 'https://wa.me/393471988894?text=' + encodeURIComponent('Ciao Stefano, ho visto il sito e vorrei parlare di Google Ads');
  wa.className = 'wa-fab';
  wa.target = '_blank';
  wa.rel = 'noopener noreferrer';
  wa.setAttribute('aria-label', 'Contatta su WhatsApp');
  wa.title = 'WhatsApp';
  wa.textContent = 'WA';
  document.body.appendChild(wa);
  wa.addEventListener('click', function(){
    if (typeof gtag === 'function') gtag('event','click_whatsapp',{event_category:'engagement'});
  });

  if (document.getElementById('contatti-articolo')) return;
  if (!/\/blog\//.test(location.pathname) || location.pathname === '/blog/' || location.pathname === '/blog') return;

  var box = document.createElement('div');
  box.id = 'contatti-articolo';
  box.innerHTML = '<h2>Hai una domanda su questo articolo?</h2>' +
    '<p class="cf-lead">Risposta entro 24 ore. Nessuno spam.</p>' +
    '<form action="https://formsubmit.co/stefano.superina@gmail.com" method="POST">' +
    '<input type="hidden" name="_subject" value="Contatto da articolo blog — stefanosuperina.it" />' +
    '<input type="hidden" name="_captcha" value="false" />' +
    '<input type="text" name="_honey" style="display:none" tabindex="-1" autocomplete="off" />' +
    '<input type="hidden" name="pagina" value="' + location.href + '" />' +
    '<label>Nome *</label><input required name="nome" placeholder="Il tuo nome" />' +
    '<label>Email *</label><input type="email" required name="email" placeholder="nome@azienda.it" />' +
    '<label>Messaggio</label><textarea name="messaggio" rows="3" placeholder="Contesto o domanda (opzionale)"></textarea>' +
    '<button type="submit">Invia messaggio</button></form>';

  var footer = document.querySelector('footer');
  if (footer) footer.parentNode.insertBefore(box, footer);
  else document.body.appendChild(box);
})();

/* G-Man FAQ Chatbot bootstrap */
(function(){
  function inject(){
    if(!document.querySelector('link[href*="faq-chatbot.css"]')){
      var l=document.createElement('link');l.rel='stylesheet';l.href='/assets/faq-chatbot.css';document.head.appendChild(l);
    }
    if(!document.querySelector('script[src*="faq-chatbot.js"]')){
      var s=document.createElement('script');s.src='/assets/faq-chatbot.js';s.defer=true;document.body.appendChild(s);
    }
    var ctas=document.querySelector('.hero-ctas');
    if(ctas && !ctas.querySelector('[data-gman-chat-open]')){
      var b=document.createElement('button');
      b.type='button';b.className='btn-ai-hero';b.setAttribute('data-gman-chat-open','');
      b.textContent='✦ Chiedi alla AI';
      ctas.appendChild(b);
    }
    var sec=document.getElementById('contatti');
    if(sec && !document.getElementById('assistente-ai')){
      var formCard=sec.querySelector('.form-card');
      var box=document.createElement('div');
      box.className='gman-chat-section';box.id='assistente-ai';
      box.innerHTML='<h3>✦ Assistente AI — FAQ Google Ads & Tracking</h3><p>Risposte immediate dalle <a href="/blog/faq-google-ads-analytics-tracking/" style="color:var(--accent)">100 FAQ</a> su Google Ads, GA4, ROAS, Consent Mode e lead generation. Per un audit personalizzato usa il form sopra.</p><button type="button" class="btn-ai" data-gman-chat-open>Apri l\'assistente AI</button>';
      if(formCard && formCard.parentNode){ formCard.parentNode.insertBefore(box, formCard.nextSibling); }
      else if(sec.querySelector('.container')){ sec.querySelector('.container').appendChild(box); }
    }
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', inject);
  else inject();
})();
