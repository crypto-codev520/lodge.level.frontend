import "./App.css";
import Landlayout from "./layout/Landlayout";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
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
  [pulsechain],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "LodgeProject",
  projectId: "a4085f9595fd1d631d7144c68a397e50",
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
