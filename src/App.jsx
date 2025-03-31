import React from 'react'
import * as Pages from './layout/index.js'

function App() {

  React.useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        console.log("Accounts changed:", accounts);
      });
      window.ethereum.on("chainChanged", (chainId) => {
        console.log("Chain changed:", chainId);
        window.location.reload();
      });
    }
  }, []);
  return (
    <>
      <Pages.HomePage_main/>
    </>
  )
}


export default App
