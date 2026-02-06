import Document, { Html, Head, Main, NextScript } from "next/document";

const themeScript = `
(function() {
  try {
    var theme = localStorage.getItem('THEME_PREFERENCE');
    var isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) document.documentElement.classList.add('dark');
  } catch(e) {}
})();
`;

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=5"
          />
          <link rel="manifest" href="/manifest.json" />
          <link rel="apple-touch-icon" href="/icon.png"></link>
          <meta name="theme-color" content="#fff" />
        </Head>
        <body>
          <script dangerouslySetInnerHTML={{ __html: themeScript }} />
          <Main />
          <div id="note"></div>
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
