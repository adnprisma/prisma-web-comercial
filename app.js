(() => {
  const cfg = window.PRISMA_CONFIG || {};
  document.getElementById('year').textContent = new Date().getFullYear();

  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  menuToggle?.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!open));
    mobileMenu.hidden = false;
    mobileMenu.classList.toggle('open', !open);
    if (open) setTimeout(() => mobileMenu.hidden = true, 150);
  });
  mobileMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    menuToggle.setAttribute('aria-expanded', 'false'); mobileMenu.classList.remove('open'); mobileMenu.hidden = true;
  }));

  const reveal = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); reveal.unobserve(e.target); }
  }), {threshold:.12});
  document.querySelectorAll('.reveal').forEach(el => reveal.observe(el));

  const paymentData = {
    full: {today:'$27,000', todayNote:'pago único', later:'—', laterNote:'sin mensualidades'},
    '3': {today:'$5,000', todayNote:'anticipo', later:'3 × $7,334', laterNote:'primera mensualidad +1 mes · total $27,002'},
    '6': {today:'$5,000', todayNote:'anticipo', later:'6 × $3,667', laterNote:'primera mensualidad +1 mes · total $27,002'}
  };
  document.querySelectorAll('[data-pay]').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('[data-pay]').forEach(b => b.classList.remove('active')); btn.classList.add('active');
    const d = paymentData[btn.dataset.pay];
    document.getElementById('pay-today').textContent=d.today; document.getElementById('pay-today-note').textContent=d.todayNote;
    document.getElementById('pay-later').textContent=d.later; document.getElementById('pay-later-note').textContent=d.laterNote;
  }));

  const leadDialog = document.getElementById('lead-dialog');
  const diagnosticMessage = 'Hola, quiero solicitar mi diagnóstico PRISMA.';
  const diagnosticHref = `https://wa.me/${cfg.whatsappNumber || '525567823281'}?text=${encodeURIComponent(diagnosticMessage)}`;
  document.querySelectorAll('[data-open-lead]').forEach(btn => btn.addEventListener('click', e => {
    e.preventDefault();
    document.getElementById('plan-dialog')?.close();
    window.location.href = diagnosticHref;
  }));

  const leadForm = document.getElementById('lead-form');
  const out = document.getElementById('lead-output');
  const msgEl = document.getElementById('lead-message');
  const wa = document.getElementById('whatsapp-lead');
  let currentMessage = '';
  leadForm?.addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(leadForm);
    currentMessage = `Hola, soy ${fd.get('name')} de ${fd.get('business')}. Quiero solicitar un diagnóstico PRISMA.\n\nMi WhatsApp: ${fd.get('phone')}\nMe gustaría resolver primero: ${fd.get('need')}.`;
    msgEl.textContent = currentMessage; out.hidden = false;
    if (cfg.whatsappNumber) { wa.href = `https://wa.me/${cfg.whatsappNumber}?text=${encodeURIComponent(currentMessage)}`; wa.hidden = false; }
  });
  document.getElementById('copy-lead')?.addEventListener('click', async () => {
    await navigator.clipboard.writeText(currentMessage); const b=document.getElementById('copy-lead'); const old=b.textContent; b.textContent='Copiado ✓'; setTimeout(()=>b.textContent=old,1600);
  });

  const planInfo = {
    inicia:{name:'Inicia',price:'$15,000 MXN',desc:'Núcleo completo del motor + identidad express + 3 meses de acompañamiento.',items:['CRM + pipeline','Agente conversacional básico entrenado con la información del negocio','WhatsApp, Instagram y Facebook','Reseñas automáticas en Google','Calendario que agenda citas solo','Identidad express: logo, paleta y tipografía base','Acompañamiento 3 meses','Financiamiento disponible']},
    esencial:{name:'Esencial',price:'$27,000 MXN',desc:'El plan más vendido: sistema + landing de captura + ADN de marca completo.',items:['Todo lo de Inicia','Landing page de captura conectada al CRM','Estrategia y psicología de marca','Identidad completa','Voz de marca','Contenido de arranque','Acompañamiento 6 meses','Facilidad de pago disponible']},
    completo:{name:'Completo',price:'$45,000 MXN',desc:'La implementación integral para negocios que quieren construir y escalar.',items:['Todo lo de Esencial','Módulos extra del motor','Sitio web básico','Contenido ampliado','Acompañamiento 12 meses','Financiamiento disponible']}
  };
  const planDialog=document.getElementById('plan-dialog'), planContent=document.getElementById('plan-dialog-content');
  document.querySelectorAll('[data-plan-detail]').forEach(btn=>btn.addEventListener('click',()=>{
    const p=planInfo[btn.dataset.planDetail]; planContent.innerHTML=`<h2>${p.name}</h2><div class="price">${p.price}</div><p>${p.desc}</p><ul>${p.items.map(i=>`<li>${i}</li>`).join('')}</ul>`; planDialog.showModal();
  }));
  document.querySelectorAll('[data-close-plan]').forEach(btn=>btn.addEventListener('click',()=>planDialog.close()));
  [leadDialog,planDialog].forEach(d=>d?.addEventListener('click',e=>{ if(e.target===d)d.close(); }));
})();
