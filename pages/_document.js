import Document, { Html, Head, Main, NextScript } from "next/document";
import { SheetsRegistry, JssProvider, createGenerateId } from "react-jss";
import { ServerStyleSheets } from '@material-ui/core/styles';


class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const registry = new SheetsRegistry();
    const materialUiSheets = new ServerStyleSheets();
    const generateId = createGenerateId();
    const originalRenderPage = ctx.renderPage;
    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (props) => (
          materialUiSheets.collect(
            <JssProvider registry={registry} generateId={generateId}>
              <App {...props} />
            </JssProvider>)
        ),
      });
    const initialProps = await Document.getInitialProps(ctx);
    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          <style id="server-side-styles">{registry.toString()}</style>
          {materialUiSheets.getStyleElement()}
        </>
      ),
    };
  }

  render() {
    return (
      <Html>
        <Head/>
        <body>
          <Main/>
          <NextScript/>
        </body>
      </Html>
    );
  }
}
export default MyDocument;