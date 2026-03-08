import "@/styles/globals.css";
import { Provider } from "react-redux";
import { store } from "@/store/store";

import WrapperComponent from "@/wrapper";
import SmoothScroll from "@/components/SmoothScroll";
export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      
        <WrapperComponent>
          <SmoothScroll>
          <Component {...pageProps} />
          </SmoothScroll>
        </WrapperComponent>
    </Provider>
  );
}
