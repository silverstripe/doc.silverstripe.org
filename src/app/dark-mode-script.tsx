/* eslint-disable react/no-danger */
/**
 * Dark mode initialization inline script.
 * Runs synchronously in <head> before React hydration to prevent FOUT.
 * Uses dangerouslySetInnerHTML with IIFE pattern to execute before paint.
 */
export function DarkModeScript() {
  const darkModeScript = `(
    function() {
      try {
        document.documentElement.classList.add("prefers-no-transition");
        var saved = localStorage.getItem("theme_preference");
        var isDark = saved === "dark";
        if (!saved && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
          isDark = true;
        }
        if (isDark) {
          document.documentElement.classList.add("dark");
        }
        setTimeout(function() {
          document.documentElement.classList.remove("prefers-no-transition");
        }, 0);
      } catch (e) {
        try {
          document.documentElement.classList.remove("prefers-no-transition");
        } catch (err) {}
      }
    }
  )();`;

  return (
    <script
      dangerouslySetInnerHTML={{ __html: darkModeScript }}
      suppressHydrationWarning
    />
  );
}
