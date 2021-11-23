// Configuring web3 with a provider from metamask 
import Web3 from "web3";
 
let web3;
 
if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  // We are in the browser and metamask is running.
  window.ethereum.request({ method: "eth_requestAccounts" });
  web3 = new Web3(window.ethereum);
} else {
  // We are on the server *OR* the user is not running metamask
  // Creating our own provider with remote node(infura).
  const provider = new Web3.providers.HttpProvider(
    "https://rinkeby.infura.io/v3/7afefe2c25f74ba29f3038676ae08a58"
  );
  web3 = new Web3(provider);
}
 
export default web3;