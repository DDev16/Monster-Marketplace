import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Web3Modal from "web3modal";
import NFT from "../engine/NFT.json";
import Market from "../engine/Market.json";
import { mmnft, mmmarket, hhnft, hhmarket } from "../engine/configuration";
import { goenft, goemarket, flrnft, flrmarket } from "../engine/configuration";
import { polynft, polymarket } from "../engine/configuration";
import { bnbnft, bnbmarket } from "../engine/configuration";
import { bsctnft, bsctmarket } from "../engine/configuration";
import detectEthereumProvider from "@metamask/detect-provider";
import {
  Card,
  Button,
  Input,
  Col,
  Row,
  Spacer,
  Container,
  Text,
  Loading,
  Grid,
} from "@nextui-org/react";
import { client } from "../engine/configuration";
import "sf-font";
import LoadingPopup from "../components/LoadingPopup";
import Image from "next/image";

import { connectWallet } from '../components/web3connect'







export default function CreateMarket() {
  const [fileUrl, setFileUrl] = useState(null);
  const [nftcontract, getNft] = useState([]);
  const [market, getMarket] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [visible, setVisible] = useState(false);



  const [formInput, updateFormInput] = useState({
    price: "",
    name: "",
    description: "",
  });

  useEffect(() => {
    setNft();
  }, [getNft, getMarket]);

  useEffect(() => {
    console.log("fileUrl", fileUrl);
  }, [fileUrl]);

  const router = useRouter();

  async function onChange(e) {
    const file = e.target.files[0];
    try {
      setFileUrl(file);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  async function createMarket() {
    setVisible(true);
    const { name, description, price } = formInput;
    if (!name || !description || !price || !fileUrl) return;

    const data = await client.store({
      name,
      description,
      image: fileUrl,
    });
    const metadataURI = data.url.replace(/^ipfs:\/\//, "");
    const URL = `https://ipfs.io/ipfs/${metadataURI}`;
    try {
      createNFT(URL);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  async function setNft() {
    const web3Modal = new Web3Modal();
    await web3Modal.connect();
    var hh = "0x13";
    var goe = "0x5";
    var mm = "0x13881";
    var bsct = "0x61";
    var flr = "0xe";
    var eth = "0x1";
    var bnb = "0x38";
    var poly = "0x89";
    const connected = await detectEthereumProvider();
    if (connected.chainId == goe) {
      var nftcontract = goenft;
    } else if (connected.chainId == mm) {
      var nftcontract = mmnft;
    } else if (connected.chainId == bsct) {
      var nftcontract = bsctnft;
    } else if (connected.chainId == hh) {
      var nftcontract = hhnft;
    } else if (connected.chainId == flr) {
      var nftcontract = flrnft;
    } else if (connected.chainId == bnb) {
      var nftcontract = bnbnft;
    } else if (connected.chainId == poly) {
      var nftcontract = polynft;
    }
    getNft(nftcontract.toLowerCase());
    console.log(nftcontract.toLowerCase());
    setMarket();
  }

  async function setMarket() {
    var hh = "0x13";
    var goe = "0x5";
    var mm = "0x13881";
    var bsct = "0x61";
    var flr = "0xe";
    var bnb = "0x38";
    var poly = "0x89";
    const connected = await detectEthereumProvider();
    if (connected.chainId == goe) {
      var market = goemarket;
    } else if (connected.chainId == mm) {
      var market = mmmarket;
    } else if (connected.chainId == bsct) {
      var market = bsctmarket;
    } else if (connected.chainId == hh) {
      var market = hhmarket;
    } else if (connected.chainId == flr) {
      var market = flrmarket;
    } else if (connected.chainId == bnb) {
      var market = bnbmarket;
    } else if (connected.chainId == poly) {
      var market = polymarket;
    }
    getMarket(market);
    console.log(market);
  }

  async function createNFT(url) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    let contract = new ethers.Contract(nftcontract, NFT, signer);
    let gasPrice, _value;

    switch (connection.chainId) {
        case "0x5":
            gasPrice = "50000000000";
            _value = "0";
            break;
        case "0x13881":
            gasPrice = "20000000000";
            _value = "1000000000000000000";
            break;
        case "0x61":
            gasPrice = "30000000000";
            _value = "0";
            break;
        case "0x13":
            gasPrice = "40000000000";
            _value = "0";
            break;
        case "0xe":
            gasPrice = "60000000000";
            _value = "0";
            break;
        case "0x38":
            gasPrice = "70000000000";
            _value = "0";
            break;
        case "0x89":
            gasPrice = "90000000000";
            _value = "0";
            break;
        default:
            console.log("Unsupported network");
            return;
    }
    let transaction = await contract
        .createNFT(url, { gasPrice: gasPrice, value: _value })
        .catch((err) => {
            setVisible(false);
            console.log("err", err.message);
        });

    if (!transaction) {
        return;
    }

    let tx = await transaction.wait();
    let event = tx.events.filter((i) => {
        if (i.event == "Transfer") {
            return i;
        }
    });
    console.log("event", event);
    let value = event[0].args[2];
    let tokenId = value.toNumber();
    const price = ethers.utils.parseUnits(formInput.price, "ether");
    contract = new ethers.Contract(market, Market, signer);
    let listingFee = await contract.getListingFee();
    listingFee = listingFee.toString();
    transaction = await contract
        .createVaultItem(nftcontract, tokenId, price, {
            value: listingFee,
            gasPrice: gasPrice,
        })
        .catch((err) => {
            setVisible(false);
            console.log("err", err.message);
        });
    if (!transaction) {
        return;
    }
    await transaction.wait();
    router.push("/");
}

  async function buyNFT() {
    setVisible(true);
    const { name, description } = formInput;
    if (!name || !description || !fileUrl) return;
    const data = await client.store({
      name,
      description,
      image: fileUrl,
    });
    const metadataURI = data.url.replace(/^ipfs:\/\//, "");
    const URL = `https://ipfs.io/ipfs/${metadataURI}`;
    try {
      mintNFT(URL);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  async function mintNFT(url) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    let contract = new ethers.Contract(nftcontract, NFT, signer);
    let cost = await contract.mintingCost();
    let transaction = await contract
      .mintNFT(url, { value: cost, gasPrice: "50000000000" })
      .catch((err) => {
        console.log("err", err);
        setVisible(false);
      });
    if (!transaction) {
      return;
    }
    await transaction.wait();
    router.push("/portal");
  }

  

  useEffect(() => {
    const checkauth = setInterval(() => {
        verifyUser()
    }, 2000)
    return () => clearInterval(checkauth)
})

async function verifyUser() {
    const output = await connectWallet()
    if (output === 0) {
      router.push('/denied')
    }
    else {
      router.push('/create')
    }
  }

  return (
    <div>
      <Spacer></Spacer>
      <Container
        lg
        gap={2}
        css={{ fontFamily: "SF Pro Display", fontWeight: "200"}}
      >
        <Text h2>NFT Creator Portal</Text>
        <Row gap={4}>
          <Col>
            <Spacer></Spacer>
            <Spacer></Spacer>
            <Spacer></Spacer>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Text h3 className="ml-3">
                The NFT Marketplace with a Reward.
              </Text>
            </div>

            <Card css={{ marginTop: "$5", boxShadow: "0px 0px 15px white" }}>
              <Card.Body style={{ backgroundColor: "#00000040"}}>
                <Text>
                  Select your Preferred Network, Create your Amazing NFT by
                  uploading your art using the simple NFT Dashboard. Simple!
                </Text>
              </Card.Body>
            </Card>
            <Spacer></Spacer>
            <div style={{ textAlign: "center" }}>
              <img src="monster.png" style={{ borderRadius: "50%", width: "300px", boxShadow: "0px 0px 10px" }} />
            </div>

            <Spacer></Spacer>
            

            <Spacer></Spacer>
            <Card css={{ marginTop: "$5", boxShadow: "0px 0px 15px white" }}>
              <Card.Body style={{ backgroundColor: "#00000040"}}>
                <Text>
                  Monsters Marketplace allows you to sell your NFT and accept
                  your favorite crypto as payment! No borders, No restrictions.
                  Simple!
                </Text>
              </Card.Body>
            </Card>
            <Spacer></Spacer>
            <Spacer></Spacer>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Text h3>Create and Sell your NFT in the Marketplace</Text>
            </div>
            <Spacer></Spacer>
            <Card
              style={{
                maxWidth: "300px",
                background: "#ffffff05",
                boxShadow: "0px 0px 10px #ffffff60",
              }}
            >
              {isLoading ? (
                <Loading type="gradient" size="xl" color="secondary" />
              ) : (
                <>
                  {" "}
                  <Card css={{ marginTop: "$1" }}>
                    <Card.Body style={{ backgroundColor: "#000000" }}>
                      <Input
                        aria-label="name"
                        placeholder="Enter your NFT Name"
                        onChange={(e) =>
                          updateFormInput({
                            ...formInput,
                            name: e.target.value,
                          })
                        }
                        helperText={!formInput.name && "*Required"}
                        helperColor="error"
                      />
                    </Card.Body>
                  </Card>
                  <Card>
                    <Card.Body style={{ backgroundColor: "#000000" }}>
                      <Input
                        aria-label="desc"
                        placeholder="NFT Description"
                        onChange={(e) =>
                          updateFormInput({
                            ...formInput,
                            description: e.target.value,
                          })
                        }
                        helperText={!formInput.description && "*Required"}
                        helperColor="error"
                      />
                    </Card.Body>
                  </Card>
                  <Card>
                    <Card.Body style={{ backgroundColor: "#white" }}>
                      <input type="file" name="Asset" onChange={onChange} />
                      {fileUrl && (
                        <Image
                          src={URL.createObjectURL(fileUrl)}
                          height="350"
                          width="350"
                        />
                      )}
                    </Card.Body>
                  </Card>
                  <Container css={{ marginBottom: "$2" }}>
                    <Input
                      css={{ marginTop: "$2" }}
                      placeholder="Set your price!"
                      onChange={(e) =>
                        updateFormInput({ ...formInput, price: e.target.value })
                      }
                      label="Price"
                      type="number"
                    />
                    <Button
                      aria-label="list"
                      size="sm"
                      style={{ fontSize: "20px" }}
                      onPress={createMarket}
                      css={{
                        marginTop: "$2",
                        marginBottom: "$5",
                        color: "$gradient",
                      }}
                      disabled={
                        !formInput.name ||
                        !formInput.description ||
                        !formInput.price ||
                        !fileUrl
                          ? true
                          : false
                      }
                    >
                      Mint/List your NFT!
                    </Button>
                    <Button
                      aria-label="mint"
                      size="sm"
                      style={{ fontSize: "20px" }}
                      onPress={buyNFT}
                      css={{
                        marginTop: "$2",
                        marginBottom: "$5",
                        color: "$gradient",
                      }}
                      disabled={
                        !formInput.name || !formInput.description || !fileUrl
                          ? true
                          : false
                      }
                    >
                      Mint your NFT!
                    </Button>
                  </Container>
                  <LoadingPopup visible={visible} setVisible={setVisible} />
                </>
              )}
            </Card>
            <Spacer/>
          </Col>
          <Col css={{ marginRight: "$7" }}>
          </Col>
        </Row>
      </Container>
    </div>
  );
}