import logo from "./logo.svg";
import "./App.css";
import Landlayout from "./layout/Landlayout";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig, useAccount } from "wagmi";
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  zora,
  goerli,
  pulsechain,
} from "wagmi/chains";

import { publicProvider } from "wagmi/providers/public";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [pulsechain, mainnet, polygon, optimism, arbitrum, zora, goerli],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "RainbowKit demo",
  projectId: "b174fef01c4f47289ba4030378ae648c",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

function App() {
  return (
    <div className="App">
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains}>
          <Router>
            <Routes>
              <Route exact path="/" element={<Landlayout></Landlayout>}></Route>
              {/*   
            <Coming path = "/coming"></Coming>
            <TokenFeaturesLayout></TokenFeaturesLayout>
            <Roadmap></Roadmap>
            <TeamLayout></TeamLayout>
            <SubscribeLayout></SubscribeLayout>
            */}
            </Routes>
          </Router>
        </RainbowKitProvider>
      </WagmiConfig>
    </div>
  );
}

export default App;
