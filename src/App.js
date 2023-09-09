import "./app.css";
import { useCallback, useEffect, useState } from "react";
import Web3 from "web3";
import detectEthereumProvider from '@metamask/detect-provider'
import { loadContract } from "./utils/load-contract";

function App() {
   
  const [balance, setBallance] = useState(null)
  const [account, setAccount] = useState(null)
  const [shouldReload, reload] = useState(false)

  const [web3Api, setWeb3Api] = useState({
    provider: null,
    isProviderLoaded: false,
    web3: null,
    contract: null
  })
  
  const canConnectToContract = account && web3Api.contract
  const reloadEffect = useCallback(() => reload(!shouldReload), [shouldReload])


  const setAccountListener = provider => {
    provider.on("chainChanged", _ => window.location.reload())
  }

  //Following code shows account no or tells the user to install metamask
  
  useEffect(() => {            
    const loadProvider = async () => {
    
      const provider = await detectEthereumProvider()
      
      if (provider) {
        const contract = await loadContract("Faucet",provider)
        setAccountListener(provider)
        setWeb3Api({
          web3: new Web3(provider),
          provider,
          contract,
          isProviderLoaded: true
        })
      } else {
        setWeb3Api(api => ({...api, isProviderLoaded: true}))
        console.error("Please, install Metamask.")
      }
     
    }
    loadProvider()

  }, [])

  //The following code loads the balance in the website.
  useEffect(() => {
    const loadBalance = async () => {
      const { contract, web3 } = web3Api
      const balance = await web3.eth.getBalance(contract.address)
      setBallance(web3.utils.fromWei(balance, "ether"))
    }

    web3Api.contract && loadBalance()
  }, [web3Api,shouldReload])

  //The following code is used to add funds into the website ( Adds 1 eth per transaction)
  const addFunds = useCallback(async () => {
    const { contract, web3 } = web3Api
    await contract.addFunds({
      from: account,
      value: web3.utils.toWei("1", "ether")
    })
    reloadEffect()
  }, [web3Api, account, reloadEffect])

  //The following code is used to withdraw funds into the website ( withdraws 0.1 eth per transaction)
  const withdraw = async () => {
    const { contract, web3 } = web3Api
    const withdrawAmount = web3.utils.toWei("0.1", "ether")
    await contract.withdraw(withdrawAmount, {
      from: account
    })
    reloadEffect()
  }

 // Code used to get account no from metamask
  useEffect(() => {
    const getAccount = async () => {
      const accounts = await web3Api.web3.eth.getAccounts()
      setAccount(accounts[0])
    }

    web3Api.web3 && getAccount()
  }, [web3Api.web3])


  
  return (
    <>
    <div className="faucet-wrapper">
      <div className="faucet">
      { web3Api.isProviderLoaded ?
            <div className="is-flex is-align-items-center">
              <span>
                <strong className="mr-2">Account: </strong>
              </span>
                { account ?
                  <div>{account}</div> :
                  !web3Api.provider ?
                  <>
                    <div className="notification is-warning is-size-6 is-rounded">
                      Wallet is not detected!{` `}
                      <a target="_blank" rel="noreferrer" href="https://docs.metamask.io">
                        Install Metamask
                      </a>
                    </div>
                  </> :
                  <button
                    className="button is-small"
                    onClick={() =>
                      web3Api.provider.request({method: "eth_requestAccounts"}
                    )}
                  >
                    Connect Wallet
                  </button>
                }
            </div> :
            <span>Looking for Web3...</span>
          }
          <div className="balance-view is-size-2 my-4">
          Current Balance: <strong>{balance}</strong> ETH
        </div>
        { !canConnectToContract &&
            <i className="is-block">
              Connect to Ganache
            </i>
          }
        
        <button
        disabled={!canConnectToContract}
          onClick={addFunds}
            className="button is-link mr-2">
              Donate 1eth
            </button>
          <button
          disabled={!canConnectToContract}
           onClick={withdraw}
            className="button is-primary">Withdraw 0.1eth</button>
      </div>
    </div>
  </>
    
  );
}

export default App;


// Private key 32 byte number
// c0ab562fa567abc1597a9f9c840537342809a387f6d45f5e112d0d074c6875ce

// Public key(Uncompressed) 64 byte number
// 048bd5fbf4bc3d8421b8024229943170babd858b9338552ddccb2fa3da24f867ca071f658662bc263ef3272e15fd10a3abc9533991586f2e93136f548db9cb921f

// Public key(Compressed) 33 byte number
// 038bd5fbf4bc3d8421b8024229943170babd858b9338552ddccb2fa3da24f867ca
