document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('feedbackBtn');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    const message = await window.customPrompt(t('feedbackPrompt'));
    if (!message || !message.trim()) return;

    const roomSlug = document.body.dataset.room || null;
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message.trim(), room_slug: roomSlug }),
      });
      if (!res.ok) throw new Error('failed');
      await window.customAlert(t('feedbackThanks'));
    } catch (err) {
      await window.customAlert(t('GENERIC_ERROR'));
    }
  });
});

