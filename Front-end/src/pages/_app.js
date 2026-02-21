import "@/styles/globals.css";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import WrapperComponent from "@/wrapper";
export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <WrapperComponent>
        <Component {...pageProps} />
      </WrapperComponent>
    </Provider>
  );
}
