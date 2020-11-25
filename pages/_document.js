import Document, { Html, Head, Main, NextScript } from "next/document";
import { ServerStyleSheets } from '@material-ui/core/styles';


class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const materialUiSheets = new ServerStyleSheets();
    const originalRenderPage = ctx.renderPage;
    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (props) =>
          materialUiSheets.collect(<App {...props} />)
    });
    const initialProps = await Document.getInitialProps(ctx);
    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          {materialUiSheets.getStyleElement()}
        </>
      ),
    };
  }

  render() {
    return (
      <Html>
        <Head/>
        <link href="https://fonts.googleapis.com/css2?family=Assistant:wght@300;400;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600&display=swap" rel="stylesheet" />
        <title>Accounting-App</title>
        <body dir="rtl">
          <Main/>
          <NextScript/>
        </body>
      </Html>
    );
  }
}
export default MyDocument;