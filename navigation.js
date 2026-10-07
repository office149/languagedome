document.querySelectorAll('.course-menu').forEach(menu => {
  document.addEventListener('click', event => {
    if (!menu.contains(event.target)) menu.open = false;
  });
  menu.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      menu.open = false;
      menu.querySelector('summary').focus();
    }
  });
  menu.addEventListener('focusout', event => {
    if (!menu.contains(event.relatedTarget)) menu.open = false;
  });
});

// Enquiries stay in the form until the visitor chooses to continue to WhatsApp.
const enquiryDialog = document.createElement('dialog');
enquiryDialog.className = 'enquiry-dialog';
enquiryDialog.setAttribute('aria-labelledby', 'enquiry-title');
enquiryDialog.innerHTML = `
  <button type="button" class="dialog-close" aria-label="Close enquiry form">×</button>
  <div class="eyebrow">Let’s start learning</div>
  <h2 id="enquiry-title">Find the right course.</h2>
  <p>Tell us a little about your child. We’ll help you choose a language course or skills session.</p>
  <form class="popup-form">
    <label for="enquiry-name">Parent / guardian name</label>
    <input id="enquiry-name" name="Parent / guardian" autocomplete="name" maxlength="100" required>
    <label for="enquiry-phone">Phone number</label>
    <input id="enquiry-phone" name="Phone" type="tel" autocomplete="tel" maxlength="40" required>
    <div class="enquiry-columns"><div><label for="enquiry-course">Course</label>
    <select id="enquiry-course" name="Course"><option>English for Beginners</option><option>Turkish for Beginners</option><option>Arabic for Beginners</option><option>Child Skills Development</option></select></div>
    <div><label for="enquiry-age">Child’s age (optional)</label><input id="enquiry-age" name="Child age" type="number" min="0"></div></div>
    <label for="enquiry-format">Language learning format</label>
    <select id="enquiry-format" name="Learning format"><option>In person in Dubai</option><option>Live online</option><option>Please advise me</option></select>
    <label for="enquiry-message">Message (optional)</label>
    <textarea id="enquiry-message" name="Message" rows="2" maxlength="1000" placeholder="Your preferred schedule or questions"></textarea>
    <p class="enquiry-notice">Continuing opens WhatsApp with these details addressed to Language Dome (+971 55 116 5326). Review and send the message there. This website does not store your form details.</p>
    <p class="consent-notice">By clicking “Agree &amp; continue to WhatsApp”, you agree to our <a href="terms.html" target="_blank" rel="noopener">Terms &amp; Conditions</a>, acknowledge our <a href="privacy.html" target="_blank" rel="noopener">Privacy Policy</a>, and consent to sharing the details entered with WhatsApp to prepare your enquiry and with Language Dome when you send it. You confirm you are an adult parent or guardian. This does not subscribe you to marketing.</p><button class="btn whatsapp-submit" type="submit">Agree &amp; continue to WhatsApp</button>
  </form>`;
document.body.append(enquiryDialog);
let enquiryTrigger;
function rememberEnquiry() { try { sessionStorage.setItem('languageDomeEnquirySeen', 'yes'); } catch (_) {} }
function openEnquiry(trigger) {
  if (enquiryDialog.open) return;
  enquiryTrigger = trigger;
  rememberEnquiry();
  enquiryDialog.showModal();
  document.body.classList.add('enquiry-open');
}
enquiryDialog.querySelector('.dialog-close').addEventListener('click', () => enquiryDialog.close());
enquiryDialog.addEventListener('close', () => {
  document.body.classList.remove('enquiry-open');
  if (enquiryTrigger?.isConnected) enquiryTrigger.focus();
});
const courseSelect = enquiryDialog.querySelector('#enquiry-course');
const formatSelect = enquiryDialog.querySelector('#enquiry-format');
function updateFormat() { formatSelect.disabled = courseSelect.value === 'Child Skills Development'; }
courseSelect.addEventListener('change', updateFormat);
document.querySelectorAll('a[href="#contact"]').forEach(link => {
  if (!/Book a trial|Enquire about/i.test(link.textContent)) return;
  link.setAttribute('aria-haspopup', 'dialog');
  link.addEventListener('click', event => {
    event.preventDefault();
    const label = link.textContent;
    const language = ['Turkish', 'English', 'Arabic'].find(name => label.includes(name));
    if (language) courseSelect.value = language + ' for Beginners';
    else if (/child skills/i.test(label) || location.pathname.includes('child-skills-development')) courseSelect.value = 'Child Skills Development';
    updateFormat(); openEnquiry(link);
  });
});
function whatsappEnquiry(event) {
  event.preventDefault();
  const lines = ['Hello Language Dome, I would like to enquire about a course.'];
  for (const [name, value] of new FormData(event.currentTarget)) {
    if (String(value).trim()) lines.push(name + ': ' + String(value).trim());
  }
  lines.push('I agree to the Terms & Conditions (version 2026-10-03), acknowledge the Privacy Policy (version 2026-10-03), and consent to sharing my enquiry details via WhatsApp. I confirm I am an adult parent or guardian.');
  lines.push('Terms: https://languagedome.ae/terms.html');
  lines.push('Privacy: https://languagedome.ae/privacy.html');
  lines.push('Acknowledged at: ' + new Date().toISOString());
  window.location.assign('https://wa.me/971551165326?text=' + encodeURIComponent(lines.join('\n')));
}
enquiryDialog.querySelector('form').addEventListener('submit', whatsappEnquiry);
document.querySelectorAll('form.enroll').forEach(form => form.addEventListener('submit', whatsappEnquiry));
let hasSeenEnquiry = false;
try { hasSeenEnquiry = sessionStorage.getItem('languageDomeEnquirySeen') === 'yes'; } catch (_) {}
if (!hasSeenEnquiry && !/\/(terms|privacy|legal)\.html$/.test(location.pathname)) setTimeout(() => {
  if (!document.hidden && !document.activeElement?.closest('form') && location.hash !== '#contact') openEnquiry(document.activeElement);
}, 12000);

// The floating contact button also presents the notice before sharing details.
document.querySelectorAll('.whatsapp-float').forEach(link => {
  link.setAttribute('aria-haspopup', 'dialog');
  link.addEventListener('click', event => { event.preventDefault(); openEnquiry(link); });
});
