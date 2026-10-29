const inquiryForm = document.querySelector('[data-purpose="inquiry-form"]');
const inquiryStatus = document.querySelector('[data-purpose="form-status"]');

if (!inquiryForm || !inquiryStatus) {
  console.error('The contact form or its status message element is missing.');
} else {
  inquiryForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!inquiryForm.reportValidity()) return;

    const emailInput = inquiryForm.querySelector('input[name="Email"]');
    const replyToInput = inquiryForm.querySelector('input[name="_replyto"]');
    const submitButton = inquiryForm.querySelector('button[type="submit"]');
    const submitLabel = submitButton.querySelector('span');
    const originalLabel = submitLabel.textContent;

    replyToInput.value = emailInput.value.trim();
    submitButton.disabled = true;
    submitLabel.textContent = 'Sending...';
    inquiryStatus.textContent = 'Sending your inquiry securely...';

    try {
      const response = await fetch(inquiryForm.action, {
        method: 'POST',
        body: new FormData(inquiryForm),
        headers: { Accept: 'application/json' },
      });
      const result = await response.json();

      if (!response.ok || (result.success !== true && result.success !== 'true')) {
        throw new Error(result.message || 'The email service rejected the inquiry.');
      }

      inquiryStatus.textContent =
        'Your inquiry was submitted. If this is the first submission, check thulasiramviolet@gmail.com for a confirmation email and activate the form to enable delivery.';
      inquiryForm.reset();
    } catch (error) {
      console.error('Contact form submission failed:', error);
      inquiryStatus.textContent =
        'We could not send your inquiry. Please check your connection and try again.';
    } finally {
      submitButton.disabled = false;
      submitLabel.textContent = originalLabel;
    }
  });
}

