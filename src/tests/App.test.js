import React from "react";
import { render, screen, waitFor, fireEvent, waitForElementToBeRemoved } from "@testing-library/react";
import Web3 from "web3";
import FakeBrowser from "./FakeBrowser";
import { CONTRACT_NAME, CONTRACT_ADDRESS, BYTECODE } from '../config';
import { Drizzle } from "@drizzle/store";
import FakeApp from './FakeApp';
import KittyCoreABI from '../contracts/KittyCoreABI.json';
import ganache from 'ganache-core';

const { window } = global;

var accounts;
var deployedContract;
var provider;
var basicOptions = {
    data: '0x' + BYTECODE,
    gasPrice: '1',
    gas: 4000000
};

beforeAll(async () => {
  provider = ganache.provider();
  window.web3 = new Web3(provider);
  accounts = await web3.eth.getAccounts();
  const basic = new web3.eth.Contract(KittyCoreABI, basicOptions);
  deployedContract = await basic.deploy().send({from: accounts[0]});
});

afterAll(function(done){
  provider.close(done);
});

test("Genes is displayed", async () => {
  const genes = "511229998153539947409592147383647003171985755429529459812734525458756043";
  await deployedContract.methods.setCOO(accounts[1]).send({from: accounts[0], gas: 400000});
  await deployedContract.methods.createPromoKitty(genes, accounts[2]).send({from: accounts[1], gas: 400000});

  render(<FakeApp kittyLimit="1" contractAddress={deployedContract.options.address} />);
  //await waitForElementToBeRemoved(screen.getByText(/Loading dapp.../i), {timeout: 30000})
  await waitFor(() => screen.getByText(/FIND KITTY/i), {timeout: 4000});
  var inputEl = screen.getByPlaceholderText("123123");
  
  fireEvent.change(inputEl, { target: { value: "1" } })
  fireEvent.click(screen.getByText(/FIND KITTY/i));
  await waitFor(() => screen.getByText(/Generation/i), {timeout: 17000});

  expect(inputEl.value).toBe("1");
  expect(screen.getByText(genes)).toBeTruthy();

}, 50000);