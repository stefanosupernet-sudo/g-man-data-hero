(function(){
  var lcp=document.createElement('script');lcp.src='/assets/lcp-boost.js';document.head.appendChild(lcp);

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
    '<input type="hidden" name="_subject" value="Contatto da articolo blog — stefanodagogle.com" />' +
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
