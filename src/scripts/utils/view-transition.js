export async function transitionHelper(updateCallback) {
  // Hormati preferensi aksesibilitas pengguna yang membatasi animasi gerakan
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Jika peramban mendukung View Transitions API dan pengguna tidak meminta reduced motion
  if (!prefersReducedMotion && document.startViewTransition) {
    try {
      const transition = document.startViewTransition(async () => {
        await updateCallback();
      });
      await transition.ready;
      return transition;
    } catch {
      // Jika terjadi kesalahan atau skipped (misal: inactive state), fallback langsung panggil callback
      await updateCallback();
    }
  } else {
    // Fallback untuk peramban yang belum mendukung View Transition API
    await updateCallback();
  }
}
