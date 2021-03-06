import "../../styles/globals.css";
import "../../styles/tooltip.css";
import "../../styles/card.css";
import "react-quill/dist/quill.snow.css";

import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import store from "../redux/store";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}
export default MyApp;
