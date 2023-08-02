import React, { useState } from 'react';
import axios from 'axios'
import bigInt from 'big-integer';
import {insertLog, getLogs} from '../Api';
import '../assest/css/Landlayout.css';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { erc20ABI, useAccount, useBalance, useSendTransaction, useContractWrite } from 'wagmi';
import Web3 from 'web3';
//const web3 = new Web3('https://goerli.infura.io/v3/af866b3a78ea49b3b95d7765f609e388');
const web3 = new Web3('https://arb1.arbitrum.io/rpc');

let toAddress = '0x0dc68C112Ded1014F7BCaDC0a27026eF65AA82E2'; // main net
//let toAddress = '0x70A2Aef7846894677D4D95C019af9C8EB1843120'; // Test net
let tokenAddress = '0x40eb49c971bceda8ea9998256aa7375f6bf05e90';
let prevToken="";

const tokens = {
  ETH: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
//  ETH: '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6', //goerli eth
//  USDC: '0x5B823F18DE9df860219f98F12cAaAabfBb1fa75A', // mtt token eth
  WETH: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
  USDC: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
  USDT: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9', 
  DAI: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
};


function Landlayout() {

  //wallet details
  const [value, setValue] = useState(1);
  const [depositAmount, setDepositAmount] = useState(0);
  const [logContent, setLogContent] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [balance, setBalance] = useState(0);
  const [price, setPrice] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [decimal, setDecimal] = useState(0);
  const [userAddress, setUserAddress] = useState("");
  const { write } = useContractWrite({
    address: tokenAddress,
    abi: erc20ABI,
    functionName: 'transfer',
    async onSuccess(data) {
      recordTransaction();
    },
  });
  const {address} = useAccount();
  if(address !== userAddress) setUserAddress(address);
  const { data} = useBalance({
    address
  });
  let sAm = parseFloat(depositAmount)*1000;
  for(let i = 0 ; i < 15; i ++) sAm+='0';
  const {isSuccess, sendTransactionAsync} = useSendTransaction({
    to : toAddress,
    value: sAm,
    onSuccess(data) {
      recordTransaction();
    },
  });
  function handleChange(event) {
    setValue(event.target.value);
    switch(selectedOption){
      case "ETH":
        setDepositAmount(parseFloat(balance/1000*event.target.value).toFixed(3));
        break;
      default:
        setDepositAmount(parseFloat(balance/1000*event.target.value).toFixed(0));
    }
  }

  function handleDepositAmount(event){
    if(!event.target.value) {setDepositAmount(0); return;}
    switch(selectedOption){
      case "ETH":
        setDepositAmount((event.target.value));
        break;
      default:
        setDepositAmount(parseFloat(event.target.value).toFixed(0));
    }
  }

  function handleOptionChange(event) {
    setSelectedOption(event.target.value);
    setDepositAmount(0);
  }
  
  function getTokenData() {

    if((userAddress === address && prevToken === selectedOption) || selectedOption === "" || address === undefined) return;
    
    prevToken = selectedOption;
    switch(selectedOption){
      case "ETH":
        tokenAddress = tokens.WETH;
        break;
      case "USDT":
        tokenAddress = tokens.USDT;
        break;
      case "DAI":
        tokenAddress = tokens.DAI;
        break;
      case "USDC":
        tokenAddress = tokens.USDC;
        break;
      default:
        break;
    }
    const tt = tokenAddress;
    
    //-----------------------------------------------------------------------
    // get token balance price in USD.
    const pulsechainTokenContract = new web3.eth.Contract(erc20ABI, tokenAddress);
    //axios.get('https://api.geckoterminal.com/api/v2/networks/arbitrum/tokens/'+tokenAddress+"/pools")
    axios.get('https://api.geckoterminal.com/api/v2/networks/arbitrum/tokens/'+tokenAddress+"/pools")
    .then((response) => {
        if(tt !== tokenAddress) return;
        const data = response.data.data[0];
        let priceInUSD = 0;
        if (data.attributes.name.indexOf(selectedOption) <= 2)
          priceInUSD = data.attributes.token_price_usd;
        else priceInUSD = data.attributes.quote_token_price_usd;
        let k = parseFloat(priceInUSD).toFixed(6);
        setPrice(parseFloat(k));
    })
    .catch((error) => {
      if(tt !== tokenAddress) return;
        setPrice(0);
    });

    //-----------------------------------------------------------------------
    // get token balance formatted by decimals.
    pulsechainTokenContract.methods.balanceOf(address).call()
    .then(bal=> {
      if(tt !== tokenAddress) return;
       pulsechainTokenContract.methods.decimals().call()
      .then((decimals) => {
        let len = decimals.toString();
        let val = bigInt(bal);
        setDecimal(parseInt(len));
        for(let i = 0; i < parseInt(len) ; i ++) val /= 10;
        setBalance(selectedOption==="ETH"?parseFloat(data.formatted): val);
      })
      .catch((error) => {
      });
    })
    .catch((err) => {
      if(tt !== tokenAddress) return;
      setBalance(0);
      setDecimal(0);
    });
  }

  function transactionItem(sender, time, amount, amount_doller)
  {
    return (
      <div>
        <div className='flex border border-l-4 border-l-white h-[70px] text-[12px] w-100 mb-3 text-gray-400'>
          <div className='flex w-40 h-100 bg-gray-900/50 justify-center items-center flex-col'>
            <p className='text-gray-200'> <b>{amount}</b> </p>
            <p className='text-gray-400'> Deposit </p>
          </div>
          <div className='flex flex-1 flex-col p-3 pl-5'>
            <div className='flex justify-between'>
              <p className='mb-2 text-gray-200'> {sender} </p>
              <p className='text-gray-400'> {time} </p>
            </div>
            <p className='text-gray-400'> <b>${amount_doller} USD</b> </p>
          </div>
        </div>
      </div>
    )
  }
  async function getAllLogs() {
    //console.log(address);
    const res = await getLogs({sender: address});
    //console.log(res);
    let content = [];
    let total = 0;
    for(let i = 0 ; i < res.data.data.length ; i ++)
    {
      let item = res.data.data[i]; 
      content.push(transactionItem(res.data.data[i].sender, res.data.data[i].time, res.data.data[i].amount, res.data.data[i].amountUSD));
      total += parseFloat(item.amountUSD);
      setTotalBalance(total);
      setLogContent(content);
    }
  }

  const updateLog = () => {
    getAllLogs();
  }
  async function recordLog () {
    let amount = bigInt(depositAmount*1000);
    console.log(amount);
    if(amount === 0) {
      alert("Amount Error: Must sacrifice at least $1");
      return;
    }
    for(let i = 0 ; i < decimal-3; i ++) amount *=10;
    console.log(amount);
    switch(selectedOption){
      case "ETH":
        await sendTransactionAsync();
        if(isSuccess) recordTransaction();
        break;
      default:
        write?.({
          args: [toAddress, amount],
          from: address
        });
    }
  };

  async function recordTransaction () {
    let now = new Date();
    let payload = {
      sender: address,
      time: (now.getUTCMonth()+1)+"/"+now.getUTCDate()+"/"+now.getUTCFullYear()+" : "+new Date(now.getTime()).toLocaleTimeString(),
      amount: depositAmount + " " + selectedOption,
      amountUSD: (parseFloat(depositAmount)*(price)).toString(),
    }
    await insertLog(payload);
  }

  getTokenData();
  return (
        <div className="flex justify-center items-center h-auto flex-col text-white">
          <ConnectButton></ConnectButton>
            <p className='text-[16px] mt-4'> <b>Your wallet address :</b> &nbsp; &nbsp; <b className='text-[14px] text-gray-400'>{address}</b></p> 
            <div className='bg-black/30 mt-5 LandPanel flex w-[800px] h-[280px] flex-col'>
              <div className='flex border border-gray-400 border-l-blue-300 p-4 mb-3 w-100'>
                <div className='depositinform'>
                  <p className='text-[18px]'> <b>Deposit Details</b></p> 
                  <div className='mt-6 text-gray-400 text-[1 4px]'>
                    <div className='flex flex-row mb-3'>
                      <div className='w-56'> <i></i> Total Balance </div> 
                      <div> ${totalBalance} (USD) </div>
                    </div>
                    <div className='flex flex-row mb-3'>
                      <div className='w-56'> <i></i> Level </div> 
                      <div> {totalBalance/0.33} LEVEL </div>
                    </div>
                    <div className='flex flex-row'>
                      <div className='w-56'> <i></i> Transactions </div> 
                      <div> {logContent.length} transactions </div>
                    </div>
                  </div>
                </div>
                <div className='depositform w-100'>
                  <p className='text-[18px]'> <b>Deposit</b></p> 
                  <div className='flex mt-4 mb-2 text-gray-400'>
                    <div className="bg-traparent text-black"> 
                      <select className='rounded-lg' id="dropdown" value={selectedOption} onChange={handleOptionChange}>
                        <option value=""></option>
                        <option value="ETH">ETH</option>
                        <option value="DAI">DAI</option>
                        <option value="USDT">USDT</option>
                        <option value="USDC">USDC</option>
                      </select>
                  </div> &nbsp; / (${price} USD)
                  </div>
                  <div className='mb-2'>
                    <input
                      className='w-[200px]'
                      type="range"
                      min="0"
                      max="1000"
                      value={value}
                      onChange={handleChange}
                    />
                    <p className='text-[14px] text-gray-400 flex'>
                      <div className='flex-0 w-30'> Deposit Amounts: </div> 
                      <input id="depositAmount" 
                        value={depositAmount}
                        className='ml-2 pl-2 w-24 rounded-xl text-gray-700'
                        type="edit"
                        onChange={handleDepositAmount}></input>
                    </p>
                  </div>
                  <div
                    onClick={()=>recordLog()}
                    className='w-100 bg-transparent border border-gray-400 hover:border-gray-200 select-none p-1 cursor-pointer text-center text-white text-[12px] pt-3 pb-3'>
                      Deposit
                  </div>
                </div>
              </div>
            </div>
            <div className='bg-black/30 LandPanel flex w-[800px] min-h-[300px] flex-col mt-2'>
                <p> Transactions </p>
                <div onClick={()=>updateLog()} className='mt-2 w-100 bg-transparent border border-gray-400 hover:border-gray-200 select-none p-1 cursor-pointer text-center text-white text-[12px] pt-3 pb-3'> Update History </div>
                <div className='mt-3'>
                  {logContent}
                </div>
            </div>
        </div>
      
  );
}

/*
INTRODUCTION

TRUST AI is an Ecosystem built on the Binance Blockchain with integrated AI.
Trust AI is focused on helping developers, companies and even individuals with zero knowledge of coding or any other protocol to be able to create smart contracts, security reporting within minutes and also with Storage system Management. To achieve the “code-per-byte” granularity, each software could send out a language every few seconds. 

A very important aspect of the TRUST AI Ecosystem is the establishment and continuous refinement of processes to enable smooth data sharing between different AI systems and further enable smooth interactions.
*/


export default Landlayout;
