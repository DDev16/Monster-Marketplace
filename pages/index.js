import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
import { useRouter } from "next/router";
import NFTCollection from "../engine/NFTCollection.json";
import Resell from "../engine/Resell.json";
import Market from "../engine/Market.json";
import NFT from "../engine/NFT.json";
import { Grid, Card, Text, Button, Row, Spacer, Container, Loading } from "@nextui-org/react";
import { hhnft, hhmarket, hhresell, hhnftcol, hhrpc } from "../engine/configuration";
import { goenft, goemarket, goeresell, goenftcol, goerpc } from "../engine/configuration";
import { bsctnft, bsctmarket, bsctresell, bsctnftcol, bsctrpc } from "../engine/configuration";
import { mmnft, mmmarket, mmresell, mmnftcol, mmrpc } from "../engine/configuration";
import { flrnft, flrmarket, flrresell, flrnftcol, flrrpc } from "../engine/configuration";
import { ethnft, ethmarket, ethresell, ethnftcol, ethrpc } from "../engine/configuration";
import { bnbnft, bnbmarket, bnbresell, bnbnftcol, bnbrpc } from "../engine/configuration";
import { polynft, polymarket, polyresell, polynftcol, polyrpc, } from "../engine/configuration";
import { simpleCrypto } from "../engine/configuration";
import confetti from "canvas-confetti";
import "sf-font";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import detectEthereumProvider from "@metamask/detect-provider";
import { bscTest, ethTest, hardChain, polyTest, flrChain, ethChain, bscChain, polyChain  } from "../engine/chainchange";
import Web3 from "web3";
import LoadingPopup from "../components/LoadingPopup";
import BuyCard from "../components/BuyCard";

export default function Home() {
  const [connectedWallet, setConnectedWallet] = useState(null);
  const [hhlist, hhResellNfts] = useState(null);
  const [hhnfts, hhsetNfts] = useState(null);
  const [goelist, goeResellNfts] = useState(null);
  const [goenfts, goesetNfts] = useState(null);
  const [bsctlist, bsctResellNfts] = useState(null);
  const [bsctnfts, bsctsetNfts] = useState(null);
  const [mmlist, MumResellNfts] = useState(null);
  const [mmnfts, MumsetNfts] = useState(null);
  const [flrlist, flrResellNfts] = useState(null);
  const [flrnfts, flrsetNfts] = useState(null);
  const [ethlist, ethResellNfts] = useState(null);
  const [ethnfts, ethsetNfts] = useState(null);
  const [bnblist, bnbResellNfts] = useState(null);
  const [bnbnfts, bnbsetNfts] = useState(null);
  const [polylist, polyResellNfts] = useState(null);
  const [polynfts, polysetNfts] = useState(null);
  const [activeChain, setActiveChain] = useState(null);
  const [visible, setVisible] = useState(false);
  const [allNfts, setAllNfts] = useState(null);

  useEffect(() => {
    loadHardHatResell();
    detectChain();
    loadGoerliResell();
    loadBsctResell();
    loadMumResell();
    loadFlareResell();
    loadEthResell();
    loadBnbResell();
    loadPolyResell();
  }, [
    goesetNfts,
    goeResellNfts,
    flrsetNfts,
    flrResellNfts,
    bsctResellNfts,
    bsctsetNfts,
    MumResellNfts,
    MumsetNfts,
    hhResellNfts,
    hhsetNfts,
    ethsetNfts,
    ethResellNfts,
    bnbResellNfts,
    bnbsetNfts,
    polyResellNfts,
    polysetNfts,
    polyTest,
    activeChain,
    connectedWallet,
  ]);

  useEffect(() => {
    window.ethereum.on("chainChanged", (chainId) => {
      console.log("chainChanged", chainId);
      setActiveChain(chainId);
    });
  }, []);

  const handleConfetti = () => {
    confetti();
  };
  const router = useRouter();

  const detectChain = async () => {
    const provider = await detectEthereumProvider();

    const chainId = await provider.request({ method: "eth_chainId" });

    setActiveChain(chainId);
  };

  useEffect(() => {
    console.log("activeChain", activeChain);
  }, [activeChain]);

  useEffect(() => {
    if (!activeChain) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((data) => {
          console.log("data", data[0]);
          setConnectedWallet(data[0]);
        });
    }
    window.ethereum.on("accountsChanged", function (accounts) {
      // Time to reload your interface with accounts[0]!
      console.log("account ==============>", accounts);
      setConnectedWallet(accounts[0]);
    });
  }, []);

  useEffect(() => {
    if (
      // goelist &&
      // goenfts &&
      // bsctlist &&
      // bsctnfts &&
      // mmlist &&
      // mmnfts &&
      hhlist &&
      hhnfts
    ) {
      const arr = [
        // ...goelist,
        // ...goenfts,
        // ...bsctlist,
        // ...bsctnfts,
        // ...mmlist,
        // ...mmnfts,
        ...hhlist,
        ...hhnfts,
      ];
      setAllNfts(arr);
    }
  }, [hhlist, hhnfts]);

  /*
  Songbird Listings Functions
  */

  async function loadHardHatResell() {
    const provider = new ethers.providers.JsonRpcProvider(hhrpc);
    const contract = new ethers.Contract(hhnftcol, NFTCollection, provider);
    const market = new ethers.Contract(hhresell, Resell, provider);
    const itemArray = [];

    contract.totalSupply().then((result) => {
      for (let i = 0; i < result; i++) {
        var token = i + 1;
        var owner = contract.ownerOf(token);
        var getOwner = Promise.resolve(owner);
        getOwner.then((address) => {
          if (address == hhresell) {
            const rawUri = contract.tokenURI(token);
            const Uri = Promise.resolve(rawUri);
            const getUri = Uri.then((value) => {
              let str = value;
              let cleanUri = str.replace(
                "ipfs://",
                "https://infura-ipfs.io/ipfs/"
              );
              // console.log(cleanUri);
              let metadata = axios.get(cleanUri).catch(function (error) {
                console.log(error.toJSON());
              });
              return metadata;
            });
            getUri.then((value) => {
              let rawImg = value.data.image;
              var name = value.data.name;
              var desc = value.data.description;
              let image = rawImg.replace(
                "ipfs://",
                "https://infura-ipfs.io/ipfs/"
              );
              const price = market.getPrice(token);
              Promise.resolve(price).then((_hex) => {
                var salePrice = Number(_hex);
                var txPrice = salePrice.toString();
                Promise.resolve(owner).then((value) => {
                  let ownerW = value;
                  let outPrice = ethers.utils.formatUnits(
                    salePrice.toString(),
                    "ether"
                  );
                  let meta = {
                    name: name,
                    image: image,
                    cost: txPrice,
                    val: outPrice,
                    tokenId: token,
                    wallet: ownerW,
                    desc,
                  };
                  // console.log(meta);
                  itemArray.push(meta);
                });
              });
            });
          }
        });
      }
    });
    await new Promise((r) => setTimeout(r, 3000));
    hhResellNfts(itemArray);
    loadHHSaleNFTs();
  }
  async function loadHHSaleNFTs() {
    const provider = new ethers.providers.JsonRpcProvider(hhrpc);
    const tokenContract = new ethers.Contract(hhnft, NFT, provider);
    const marketContract = new ethers.Contract(hhmarket, Market, provider);
    const data = await marketContract.getAvailableNft();

    const items = await Promise.all(
      data.map(async (i) => {
        if (i.tokenId.toNumber() !== 0) {
          const tokenUri = await tokenContract.tokenURI(i.tokenId);
          const meta = await axios.get(tokenUri);
          let price = ethers.utils.formatUnits(i.price.toString(), "ether");
          let item = {
            price,
            tokenId: i.tokenId.toNumber(),
            itemId: i.itemId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: meta.data.image.replace("ipfs://", "https://ipfs.io/ipfs/"),
            name: meta.data.name,
            description: meta.data.description,
          };

          return item;
        }
      })
    );
    const result = items.filter((el) => {
      return el !== undefined;
    });
    hhsetNfts(result);
  }

  async function buyNewHH(nft) {
    setVisible(true);
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(hhmarket, Market, signer);
    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
    const transaction = await contract
      .n2DMarketSale(hhnft, parseInt(nft.itemId), {
        value: price,
        gasPrice: "30000000000",
      })
      .catch((error) => {
        if (error.data?.message.includes("insufficient funds")) {
          window.alert(error.data.message);
        }
        setVisible(false);
      });
    if (!transaction) {
      return;
    }
    await transaction.wait();
    loadHHSaleNFTs();
    setVisible(false);
  }

  async function hhCancelList(itemId) {
    setVisible(true);
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    let contract = new ethers.Contract(hhmarket, Market, signer);
    // const gasPrice = signer.getGasPrice();
    let transaction = await contract
      .cancelSale(itemId, hhnft.toLowerCase(), {
        gasPrice: "30000000000",
      })
      .catch((err) => {
        setVisible(false);
        console.log("err", err.message);
      });
    if (!transaction) {
      return;
    }
    await transaction.wait();
    console.log("CANCELLED");
    loadHHSaleNFTs();
    setVisible(false);
  }

  /*
  Goerli Listings Functions
  */

  async function loadGoerliResell() {
    const provider = new ethers.providers.JsonRpcProvider(goerpc);
    const contract = new ethers.Contract(goenftcol, NFTCollection, provider);
    const market = new ethers.Contract(goeresell, Resell, provider);
    const itemArray = [];

    await contract.totalSupply().then((result) => {
      for (let i = 0; i < result; i++) {
        var token = i + 1;
        var owner = contract.ownerOf(token);
        var getOwner = Promise.resolve(owner);
        getOwner.then((address) => {
          if (address.toLowerCase() == goeresell) {
            const rawUri = contract.tokenURI(token);
            const Uri = Promise.resolve(rawUri);
            const getUri = Uri.then((value) => {
              let cleanUri = value.replace(
                "ipfs://",
                "https://infura-ipfs.io/ipfs/"
              );
              // console.log(cleanUri);
              let metadata = axios.get(cleanUri).catch(function (error) {
                console.log(error.toJSON());
              });
              return metadata;
            });
            getUri.then((value) => {
              let rawImg = value.data.image;
              var name = value.data.name;
              var desc = value.data.description;
              let image = rawImg.replace(
                "ipfs://",
                "https://infura-ipfs.io/ipfs/"
              );
              const price = market.getPrice(token);
              Promise.resolve(price).then((_hex) => {
                var salePrice = Number(_hex);
                var txPrice = salePrice.toString();
                Promise.resolve(owner).then((value) => {
                  let ownerW = value;
                  let outPrice = ethers.utils.formatUnits(
                    salePrice.toString(),
                    "ether"
                  );
                  let meta = {
                    name: name,
                    image: image,
                    cost: txPrice,
                    val: outPrice,
                    tokenId: token,
                    wallet: ownerW,
                    desc,
                  };
                  // console.log(meta);
                  itemArray.push(meta);
                });
              });
            });
          }
        });
      }
    });
    await new Promise((r) => setTimeout(r, 3000));
    goeResellNfts(itemArray);
    loadGoeSaleNFTs();
  }

  async function loadGoeSaleNFTs() {
    const provider = new ethers.providers.JsonRpcProvider(goerpc);
    const tokenContract = new ethers.Contract(goenft, NFT, provider);
    const marketContract = new ethers.Contract(goemarket, Market, provider);
    const data = await marketContract.getAvailableNft();
    const items = await Promise.all(
      data.map(async (i) => {
        if (i.tokenId.toNumber() !== 0) {
          const tokenUri = await tokenContract.tokenURI(i.tokenId);
          const meta = await axios.get(tokenUri);
          let price = ethers.utils.formatUnits(i.price.toString(), "ether");
          let item = {
            price,
            tokenId: i.tokenId.toNumber(),
            itemId: i.itemId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: meta.data.image.replace("ipfs://", "https://ipfs.io/ipfs/"),
            name: meta.data.name,
            description: meta.data.description,
          };
          // console.log("item", item);
          return item;
        }
      })
    );
    const result = items.filter((el) => {
      return el !== undefined;
    });
    goesetNfts(result);
  }

  async function buyNewGoe(nft) {
    setVisible(true);
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(goemarket, Market, signer);
    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
    const transaction = await contract
      .n2DMarketSale(goenft, parseInt(nft.itemId), {
        value: price,
      })
      .catch((error) => {
        if (error.data?.message.includes("insufficient funds")) {
          window.alert(error.data.message);
        }
        setVisible(false);
      });
    if (!transaction) {
      return;
    }
    await transaction.wait();
    loadGoeSaleNFTs();
    setVisible(false);
  }

  async function goeCancelList(itemId) {
    setVisible(true);
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    let contract = new ethers.Contract(goemarket, Market, signer);
    const gasPrice = signer.getGasPrice();
    let transaction = await contract
      .cancelSale(itemId, goenft.toLowerCase(), {
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
    console.log("CANCELLED");
    loadGoeSaleNFTs();
    setVisible(false);
  }

  /*
  BSCT Listings Functions
  */

  async function loadBsctResell() {
    const provider = new ethers.providers.JsonRpcProvider(bsctrpc);
    const contract = new ethers.Contract(bsctnftcol, NFTCollection, provider);
    const market = new ethers.Contract(bsctresell, Resell, provider);
    const itemArray = [];
    await contract.totalSupply().then((result) => {
      for (let i = 0; i < result; i++) {
        var token = i + 1;
        var owner = contract.ownerOf(token);
        var getOwner = Promise.resolve(owner);
        getOwner.then((address) => {
          if (address.toLowerCase() == bsctresell) {
            const rawUri = contract.tokenURI(token);
            const Uri = Promise.resolve(rawUri);
            const getUri = Uri.then((value) => {
              let str = value;
              let cleanUri = str.replace(
                "ipfs://",
                "https://infura-ipfs.io/ipfs/"
              );
              // console.log(cleanUri);
              let metadata = axios.get(cleanUri).catch(function (error) {
                console.log(error.toJSON());
              });
              return metadata;
            });
            getUri.then((value) => {
              let rawImg = value.data.image;
              var name = value.data.name;
              var desc = value.data.description;
              let image = rawImg.replace(
                "ipfs://",
                "https://infura-ipfs.io/ipfs/"
              );
              const price = market.getPrice(token);
              Promise.resolve(price).then((_hex) => {
                var salePrice = Number(_hex);
                var txPrice = salePrice.toString();
                Promise.resolve(owner).then((value) => {
                  let ownerW = value;
                  let outPrice = ethers.utils.formatUnits(
                    salePrice.toString(),
                    "ether"
                  );
                  let meta = {
                    name: name,
                    image: image,
                    cost: txPrice,
                    val: outPrice,
                    tokenId: token,
                    wallet: ownerW,
                    desc,
                  };
                  // console.log(meta);
                  itemArray.push(meta);
                });
              });
            });
          }
        });
      }
    });
    await new Promise((r) => setTimeout(r, 3000));
    bsctResellNfts(itemArray);
    loadBsctSaleNFTs();
  }

  async function loadBsctSaleNFTs() {
    const provider = new ethers.providers.JsonRpcProvider(bsctrpc);
    const tokenContract = new ethers.Contract(bsctnft, NFT, provider);
    const marketContract = new ethers.Contract(bsctmarket, Market, provider);

    const data = await marketContract.getAvailableNft();
    const items = await Promise.all(
      data.map(async (i) => {
        if (i.tokenId.toNumber() !== 0) {
          const tokenUri = await tokenContract.tokenURI(i.tokenId);
          const meta = await axios.get(tokenUri);
          let price = ethers.utils.formatUnits(i.price.toString(), "ether");
          let item = {
            price,
            tokenId: i.tokenId.toNumber(),
            itemId: i.itemId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: meta.data.image.replace("ipfs://", "https://ipfs.io/ipfs/"),
            name: meta.data.name,
            description: meta.data.description,
          };
          return item;
        }
      })
    );
    const result = items.filter((el) => {
      return el !== undefined;
    });
    bsctsetNfts(result);
  }

  async function buyNewBsct(nft) {
    setVisible(true);
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(bsctmarket, Market, signer);
    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
    const transaction = await contract
      .n2DMarketSale(bsctnft, nft.itemId, {
        value: price,
      })
      .catch((error) => {
        if (error.data?.message.includes("insufficient funds")) {
          window.alert(error.data.message);
        }
        setVisible(false);
      });
    if (!transaction) {
      return;
    }
    await transaction.wait();
    loadBsctSaleNFTs();
    setVisible(false);
  }

  async function bsctCancelList(itemId) {
    setVisible(true);
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    let contract = new ethers.Contract(bsctmarket, Market, signer);
    const gasPrice = signer.getGasPrice();
    let transaction = await contract
      .cancelSale(itemId, bsctnft.toLowerCase(), {
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
    console.log("CANCELLED");
    loadBsctSaleNFTs();
    setVisible(false);
  }

  /*
  Mumbai Listings Functions
  */

  async function loadMumResell() {
    const provider = new ethers.providers.JsonRpcProvider(mmrpc);
    const contract = new ethers.Contract(mmnftcol, NFTCollection, provider);
    const market = new ethers.Contract(mmresell, Resell, provider);
    const itemArray = [];
    await market.nftListings().then((result) => {
      const items = result.map((item) => {
        const tokenId = item.tokenId.toNumber();
        if (item.holder.toLowerCase() == mmresell) {
          const rawUri = contract.tokenURI(tokenId);
          const Uri = Promise.resolve(rawUri);
          const getUri = Uri.then((value) => {
            let str = value;
            let cleanUri = str.replace(
              "ipfs://",
              "https://infura-ipfs.io/ipfs/"
            );
            // console.log("cleanUri123", cleanUri);

            let metadata = axios.get(cleanUri).catch(function (error) {
              console.log(error.toJSON());
            });
            return metadata;
          });
          getUri.then((value) => {
            // console.log("valuemm", value);
            let rawImg = value.data.image;
            var name = value.data.name;
            var desc = value.data.description;
            let image = rawImg.replace(
              "ipfs://",
              "https://infura-ipfs.io/ipfs/"
            );
            const price = market.getPrice(tokenId);
            Promise.resolve(price).then((_hex) => {
              var salePrice = Number(_hex);
              var txPrice = salePrice.toString();
              // console.log("txPrice", txPrice);
              // if ( txPrice != 0) {
              Promise.resolve(item.seller).then((value) => {
                // console.log("value3", value);
                let ownerW = value;
                let outPrice = ethers.utils.formatUnits(
                  salePrice.toString(),
                  "ether"
                );
                let meta = {
                  name: name,
                  image: image,
                  cost: txPrice,
                  val: outPrice,
                  tokenId: tokenId,
                  wallet: ownerW,
                  desc,
                };
                // console.log(meta);
                itemArray.push(meta);
              });
              // }
            });
          });
        }
      });
    });
    await new Promise((r) => setTimeout(r, 3000));
    MumResellNfts(itemArray);
    loadMumSaleNFTs();
  }

  async function loadMumSaleNFTs() {
    const provider = new ethers.providers.JsonRpcProvider(mmrpc);
    const tokenContract = new ethers.Contract(mmnft, NFT, provider);
    const marketContract = new ethers.Contract(mmmarket, Market, provider);
    const data = await marketContract.getAvailableNft();
    const items = await Promise.all(
      data.map(async (i) => {
        if (i.tokenId.toNumber() !== 0) {
          const tokenUri = await tokenContract.tokenURI(i.tokenId);
          const meta = await axios.get(tokenUri).then((result) => {
            if (result.data) {
              let price = ethers.utils.formatUnits(i.price.toString(), "ether");
              let item = {
                price,
                tokenId: i.tokenId.toNumber(),
                itemId: i.itemId.toNumber(),
                seller: i.seller,
                owner: i.owner,
                image: result.data.image.replace(
                  "ipfs://",
                  "https://ipfs.io/ipfs/"
                ),
                name: result.data.name,
                description: result.data.description,
              };
              return item;
            }
          });
          return meta;
        }
      })
    );
    const arr = items.filter(function (element) {
      return element !== undefined;
    });
    // console.log("items", items);
    MumsetNfts(arr);
  }

  async function buyNewMum(nft) {
    setVisible(true);
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(mmmarket, Market, signer);
    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
    const transaction = await contract
      .n2DMarketSale(mmnft, nft.itemId, {
        value: price,
        gasPrice: "30000000000",
      })
      .catch((error) => {
        if (error.data?.message.includes("insufficient funds")) {
          window.alert(error.data.message);
        }
        setVisible(false);
      });
    if (!transaction) {
      return;
    }
    await transaction.wait();
    loadMumSaleNFTs();
    setVisible(false);
  }

  async function mumCancelList(itemId) {
    setVisible(true);
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    let contract = new ethers.Contract(mmmarket, Market, signer);
    // const gasPrice = signer.getGasPrice();
    let transaction = await contract
      .cancelSale(itemId, mmnft.toLowerCase(), {
        gasPrice: "30000000000",
      })
      .catch((err) => {
        setVisible(false);
        console.log("err", err.message);
      });
    if (!transaction) {
      return;
    }
    await transaction.wait();
    console.log("CANCELLED");
    loadMumSaleNFTs();
    setVisible(false);
  }

   /*Flare Networks functions*/



  async function loadFlareResell() {
    const provider = new ethers.providers.JsonRpcProvider(flrrpc);
    const contract = new ethers.Contract(flrnftcol, NFTCollection, provider);
    const market = new ethers.Contract(flrresell, Resell, provider);
    const itemArray = [];

    await contract.totalSupply().then((result) => {
      for (let i = 0; i < result; i++) {
        var token = i + 1;
        var owner = contract.ownerOf(token);
        var getOwner = Promise.resolve(owner);
        getOwner.then((address) => {
          if (address.toLowerCase() == flrresell) {
            const rawUri = contract.tokenURI(token);
            const Uri = Promise.resolve(rawUri);
            const getUri = Uri.then((value) => {
              let cleanUri = value.replace(
                "ipfs://",
                "https://infura-ipfs.io/ipfs/"
              );
              // console.log(cleanUri);
              let metadata = axios.get(cleanUri).catch(function (error) {
                console.log(error.toJSON());
              });
              return metadata;
            });
            getUri.then((value) => {
              let rawImg = value.data.image;
              var name = value.data.name;
              var desc = value.data.description;
              let image = rawImg.replace(
                "ipfs://",
                "https://infura-ipfs.io/ipfs/"
              );
              const price = market.getPrice(token);
              Promise.resolve(price).then((_hex) => {
                var salePrice = Number(_hex);
                var txPrice = salePrice.toString();
                Promise.resolve(owner).then((value) => {
                  let ownerW = value;
                  let outPrice = ethers.utils.formatUnits(
                    salePrice.toString(),
                    "ether"
                  );
                  let meta = {
                    name: name,
                    image: image,
                    cost: txPrice,
                    val: outPrice,
                    tokenId: token,
                    wallet: ownerW,
                    desc,
                  };
                  // console.log(meta);
                  itemArray.push(meta);
                });
              });
            });
          }
        });
      }
    });
    await new Promise((r) => setTimeout(r, 3000));
    flrResellNfts(itemArray);
    loadFlrSaleNFTs();
  }

  async function loadFlrSaleNFTs() {
    const provider = new ethers.providers.JsonRpcProvider(flrrpc);
    const tokenContract = new ethers.Contract(flrnft, NFT, provider);
    const marketContract = new ethers.Contract(flrmarket, Market, provider);
    const data = await marketContract.getAvailableNft();
    const items = await Promise.all(
      data.map(async (i) => {
        if (i.tokenId.toNumber() !== 0) {
          const tokenUri = await tokenContract.tokenURI(i.tokenId);
          const meta = await axios.get(tokenUri);
          let price = ethers.utils.formatUnits(i.price.toString(), "ether");
          let item = {
            price,
            tokenId: i.tokenId.toNumber(),
            itemId: i.itemId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: meta.data.image.replace("ipfs://", "https://ipfs.io/ipfs/"),
            name: meta.data.name,
            description: meta.data.description,
          };
          // console.log("item", item);
          return item;
        }
      })
    );
    const result = items.filter((el) => {
      return el !== undefined;
    });
    flrsetNfts(result);
  }

  async function buyNewFlr(nft) {
    setVisible(true);
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(flrmarket, Market, signer);
    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
    const transaction = await contract
      .n2DMarketSale(flrnft, parseInt(nft.itemId), {
        value: price,
      })
      .catch((error) => {
        if (error.data?.message.includes("insufficient funds")) {
          window.alert(error.data.message);
        }
        setVisible(false);
      });
    if (!transaction) {
      return;
    }
    await transaction.wait();
    loadFlrSaleNFTs();
    setVisible(false);
  }

  async function flrCancelList(itemId) {
    setVisible(true);
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    let contract = new ethers.Contract(flrmarket, Market, signer);
    const gasPrice = signer.getGasPrice();
    let transaction = await contract
      .cancelSale(itemId, flrnft.toLowerCase(), {
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
    console.log("CANCELLED");
    loadFlrSaleNFTs();
    setVisible(false);
  }

  /*
  Ethereum Listings Functions
  */

  async function loadEthResell() {
    const provider = new ethers.providers.JsonRpcProvider(ethrpc);
    const contract = new ethers.Contract(ethnftcol, NFTCollection, provider);
    const market = new ethers.Contract(ethresell, Resell, provider);
    const itemArray = [];

    await contract.totalSupply().then((result) => {
      for (let i = 0; i < result; i++) {
        var token = i + 1;
        var owner = contract.ownerOf(token);
        var getOwner = Promise.resolve(owner);
        getOwner.then((address) => {
          if (address.toLowerCase() == ethresell) {
            const rawUri = contract.tokenURI(token);
            const Uri = Promise.resolve(rawUri);
            const getUri = Uri.then((value) => {
              let cleanUri = value.replace(
                "ipfs://",
                "https://infura-ipfs.io/ipfs/"
              );
              // console.log(cleanUri);
              let metadata = axios.get(cleanUri).catch(function (error) {
                console.log(error.toJSON());
              });
              return metadata;
            });
            getUri.then((value) => {
              let rawImg = value.data.image;
              var name = value.data.name;
              var desc = value.data.description;
              let image = rawImg.replace(
                "ipfs://",
                "https://infura-ipfs.io/ipfs/"
              );
              const price = market.getPrice(token);
              Promise.resolve(price).then((_hex) => {
                var salePrice = Number(_hex);
                var txPrice = salePrice.toString();
                Promise.resolve(owner).then((value) => {
                  let ownerW = value;
                  let outPrice = ethers.utils.formatUnits(
                    salePrice.toString(),
                    "ether"
                  );
                  let meta = {
                    name: name,
                    image: image,
                    cost: txPrice,
                    val: outPrice,
                    tokenId: token,
                    wallet: ownerW,
                    desc,
                  };
                  // console.log(meta);
                  itemArray.push(meta);
                });
              });
            });
          }
        });
      }
    });
    await new Promise((r) => setTimeout(r, 3000));
    ethResellNfts(itemArray);
    loadEthSaleNFTs();
  }

  async function loadEthSaleNFTs() {
    const provider = new ethers.providers.JsonRpcProvider(ethrpc);
    const tokenContract = new ethers.Contract(ethnft, NFT, provider);
    const marketContract = new ethers.Contract(ethmarket, Market, provider);
    const data = await marketContract.getAvailableNft();
    const items = await Promise.all(
      data.map(async (i) => {
        if (i.tokenId.toNumber() !== 0) {
          const tokenUri = await tokenContract.tokenURI(i.tokenId);
          const meta = await axios.get(tokenUri);
          let price = ethers.utils.formatUnits(i.price.toString(), "ether");
          let item = {
            price,
            tokenId: i.tokenId.toNumber(),
            itemId: i.itemId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: meta.data.image.replace("ipfs://", "https://ipfs.io/ipfs/"),
            name: meta.data.name,
            description: meta.data.description,
          };
          // console.log("item", item);
          return item;
        }
      })
    );
    const result = items.filter((el) => {
      return el !== undefined;
    });
    ethsetNfts(result);
  }

  async function buyNewEth(nft) {
    setVisible(true);
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(ethmarket, Market, signer);
    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
    const transaction = await contract
      .n2DMarketSale(ethnft, parseInt(nft.itemId), {
        value: price,
      })
      .catch((error) => {
        if (error.data?.message.includes("insufficient funds")) {
          window.alert(error.data.message);
        }
        setVisible(false);
      });
    if (!transaction) {
      return;
    }
    await transaction.wait();
    loadEthSaleNFTs();
    setVisible(false);
  }

  async function ethCancelList(itemId) {
    setVisible(true);
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    let contract = new ethers.Contract(ethmarket, Market, signer);
    const gasPrice = signer.getGasPrice();
    let transaction = await contract
      .cancelSale(itemId, goenft.toLowerCase(), {
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
    console.log("CANCELLED");
    loadEthSaleNFTs();
    setVisible(false);
  }

  /*
  Binance Listings Functions
  */

  async function loadBnbResell() {
    const provider = new ethers.providers.JsonRpcProvider(bnbrpc);
    const contract = new ethers.Contract(bnbnftcol, NFTCollection, provider);
    const market = new ethers.Contract(bnbresell, Resell, provider);
    const itemArray = [];
    await contract.totalSupply().then((result) => {
      for (let i = 0; i < result; i++) {
        var token = i + 1;
        var owner = contract.ownerOf(token);
        var getOwner = Promise.resolve(owner);
        getOwner.then((address) => {
          if (address.toLowerCase() == bnbresell) {
            const rawUri = contract.tokenURI(token);
            const Uri = Promise.resolve(rawUri);
            const getUri = Uri.then((value) => {
              let str = value;
              let cleanUri = str.replace(
                "ipfs://",
                "https://infura-ipfs.io/ipfs/"
              );
              // console.log(cleanUri);
              let metadata = axios.get(cleanUri).catch(function (error) {
                console.log(error.toJSON());
              });
              return metadata;
            });
            getUri.then((value) => {
              let rawImg = value.data.image;
              var name = value.data.name;
              var desc = value.data.description;
              let image = rawImg.replace(
                "ipfs://",
                "https://infura-ipfs.io/ipfs/"
              );
              const price = market.getPrice(token);
              Promise.resolve(price).then((_hex) => {
                var salePrice = Number(_hex);
                var txPrice = salePrice.toString();
                Promise.resolve(owner).then((value) => {
                  let ownerW = value;
                  let outPrice = ethers.utils.formatUnits(
                    salePrice.toString(),
                    "ether"
                  );
                  let meta = {
                    name: name,
                    image: image,
                    cost: txPrice,
                    val: outPrice,
                    tokenId: token,
                    wallet: ownerW,
                    desc,
                  };
                  // console.log(meta);
                  itemArray.push(meta);
                });
              });
            });
          }
        });
      }
    });
    await new Promise((r) => setTimeout(r, 3000));
    bnbResellNfts(itemArray);
    loadBnbSaleNFTs();
  }

  async function loadBnbSaleNFTs() {
    const provider = new ethers.providers.JsonRpcProvider(bnbrpc);
    const tokenContract = new ethers.Contract(bnbnft, NFT, provider);
    const marketContract = new ethers.Contract(bnbmarket, Market, provider);

    const data = await marketContract.getAvailableNft();
    const items = await Promise.all(
      data.map(async (i) => {
        if (i.tokenId.toNumber() !== 0) {
          const tokenUri = await tokenContract.tokenURI(i.tokenId);
          const meta = await axios.get(tokenUri);
          let price = ethers.utils.formatUnits(i.price.toString(), "ether");
          let item = {
            price,
            tokenId: i.tokenId.toNumber(),
            itemId: i.itemId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: meta.data.image.replace("ipfs://", "https://ipfs.io/ipfs/"),
            name: meta.data.name,
            description: meta.data.description,
          };
          return item;
        }
      })
    );
    const result = items.filter((el) => {
      return el !== undefined;
    });
    bnbsetNfts(result);
  }

  async function buyNewBnb(nft) {
    setVisible(true);
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(bnbmarket, Market, signer);
    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
    const transaction = await contract
      .n2DMarketSale(bnbnft, nft.itemId, {
        value: price,
      })
      .catch((error) => {
        if (error.data?.message.includes("insufficient funds")) {
          window.alert(error.data.message);
        }
        setVisible(false);
      });
    if (!transaction) {
      return;
    }
    await transaction.wait();
    loadBnbSaleNFTs();
    setVisible(false);
  }

  async function bnbCancelList(itemId) {
    setVisible(true);
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    let contract = new ethers.Contract(bnbmarket, Market, signer);
    const gasPrice = signer.getGasPrice();
    let transaction = await contract
      .cancelSale(itemId, bnbnft.toLowerCase(), {
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
    console.log("CANCELLED");
    loadBnbSaleNFTs();
    setVisible(false);
  }

  /*
  Polygon Listings Functions
  */

  async function loadPolyResell() {
    const provider = new ethers.providers.JsonRpcProvider(polyrpc);
    const contract = new ethers.Contract(polynftcol, NFTCollection, provider);
    const market = new ethers.Contract(polyresell, Resell, provider);
    const itemArray = [];
    await market.nftListings().then((result) => {
      const items = result.map((item) => {
        const tokenId = item.tokenId.toNumber();
        if (item.holder.toLowerCase() == polyresell) {
          const rawUri = contract.tokenURI(tokenId);
          const Uri = Promise.resolve(rawUri);
          const getUri = Uri.then((value) => {
            let str = value;
            let cleanUri = str.replace(
              "ipfs://",
              "https://infura-ipfs.io/ipfs/"
            );
            // console.log("cleanUri123", cleanUri);

            let metadata = axios.get(cleanUri).catch(function (error) {
              console.log(error.toJSON());
            });
            return metadata;
          });
          getUri.then((value) => {
            // console.log("valuemm", value);
            let rawImg = value.data.image;
            var name = value.data.name;
            var desc = value.data.description;
            let image = rawImg.replace(
              "ipfs://",
              "https://infura-ipfs.io/ipfs/"
            );
            const price = market.getPrice(tokenId);
            Promise.resolve(price).then((_hex) => {
              var salePrice = Number(_hex);
              var txPrice = salePrice.toString();
              // console.log("txPrice", txPrice);
              // if ( txPrice != 0) {
              Promise.resolve(item.seller).then((value) => {
                // console.log("value3", value);
                let ownerW = value;
                let outPrice = ethers.utils.formatUnits(
                  salePrice.toString(),
                  "ether"
                );
                let meta = {
                  name: name,
                  image: image,
                  cost: txPrice,
                  val: outPrice,
                  tokenId: tokenId,
                  wallet: ownerW,
                  desc,
                };
                // console.log(meta);
                itemArray.push(meta);
              });
              // }
            });
          });
        }
      });
    });
    await new Promise((r) => setTimeout(r, 3000));
    polyResellNfts(itemArray);
    loadPolySaleNFTs();
  }

  async function loadPolySaleNFTs() {
    const provider = new ethers.providers.JsonRpcProvider(polyrpc);
    const tokenContract = new ethers.Contract(polynft, NFT, provider);
    const marketContract = new ethers.Contract(polymarket, Market, provider);
    const data = await marketContract.getAvailableNft();
    const items = await Promise.all(
      data.map(async (i) => {
        if (i.tokenId.toNumber() !== 0) {
          const tokenUri = await tokenContract.tokenURI(i.tokenId);
          const meta = await axios.get(tokenUri).then((result) => {
            if (result.data) {
              let price = ethers.utils.formatUnits(i.price.toString(), "ether");
              let item = {
                price,
                tokenId: i.tokenId.toNumber(),
                itemId: i.itemId.toNumber(),
                seller: i.seller,
                owner: i.owner,
                image: result.data.image.replace(
                  "ipfs://",
                  "https://ipfs.io/ipfs/"
                ),
                name: result.data.name,
                description: result.data.description,
              };
              return item;
            }
          });
          return meta;
        }
      })
    );
    const arr = items.filter(function (element) {
      return element !== undefined;
    });
    // console.log("items", items);
    polysetNfts(arr);
  }

  async function buyNewPoly(nft) {
    setVisible(true);
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(polymarket, Market, signer);
    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
    const transaction = await contract
      .n2DMarketSale(polynft, nft.itemId, {
        value: price,
        gasPrice: "30000000000",
      })
      .catch((error) => {
        if (error.data?.message.includes("insufficient funds")) {
          window.alert(error.data.message);
        }
        setVisible(false);
      });
    if (!transaction) {
      return;
    }
    await transaction.wait();
    loadPolySaleNFTs();
    setVisible(false);
  }

  async function polyCancelList(itemId) {
    setVisible(true);
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    let contract = new ethers.Contract(polymarket, Market, signer);
    // const gasPrice = signer.getGasPrice();
    let transaction = await contract
      .cancelSale(itemId, mmnft.toLowerCase(), {
        gasPrice: "30000000000",
      })
      .catch((err) => {
        setVisible(false);
        console.log("err", err.message);
      });
    if (!transaction) {
      return;
    }
    await transaction.wait();
    console.log("CANCELLED");
    loadPolySaleNFTs();
    setVisible(false);
  }



  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
      slidesToSlide: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
      slidesToSlide: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1,
    },
  };

  useEffect(() => {
    console.log("hhnfts======", hhnfts);
    console.log("goenfts ======", goenfts);
    console.log("mmnfts======", mmnfts);
    console.log("bsctnfts======", bsctnfts);
    console.log("hhlist======", hhlist);
    console.log("flrnfts ======", flrnfts);
    console.log("ethnfts ======", ethnfts);
    console.log("polynfts======", polynfts);
    console.log("bnbnfts======", bnbnfts);
    console.log("allNfts======", allNfts);
  }, [goenfts, flrnfts, mmnfts, ethnfts, bnbnfts, polynfts, bsctnfts, hhlist, allNfts, hhnfts]);

  return (

    
    <><div>
      {allNfts && (
        <div>
          
          <Container
            xl
            css={{
              backgroundImage: "url(./8e145599d4847e339828787162952035.gif)",
              backgroundSize: "cover",
            }}
          >
            <Container
              xs
              css={{
                marginBottom: "$20",
                "& .SliderWrapper": {
                  "& ul": {
                    alignItems: "center",
                    "& li": {
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "fit-content",
                    },
                  },
                  "& .custom-dot-list-style": { bottom: "-9px" },
                },
              }}
            >
              <Text
                css={{
                  textAlign: "center",
                  textShadow: "2px 2px 3px #000",
                  fontFamily: "Comic Sans MS",
                  animation: "spin 2s linear infinite",
                  backgroundSize: "cover",
                }}
                h2
              >
                🔥 Top NFT's 🔥
              </Text>
              <div style={{ textAlign: "center" }}>
              <audio controls style={{ color: "blue"  }}>
  <source src="./ytmp3free.cc_30-seconds-of-intro-songs-dubstep-stronger-2012-1-youtubemp3free.org (1).mp3" type="audio/mpeg" />
  <source src="./ytmp3free.cc_30-seconds-of-intro-songs-dubstep-stronger-2012-1-youtubemp3free.org (1).mp3" type="audio/ogg" />
  Your browser does not support the audio element.
</audio>


              </div>
              <Carousel
                swipeable={true}
                draggable={true}
                showDots={true}
                responsive={responsive}
                ssr={true}
                infinite={true}
                autoPlay={true}
                autoPlaySpeed={10000}
                keyBoardControl={true}
                customTransition="all .5"
                transitionDuration={800}
                containerClass="carousel-container"
                removeArrowOnDeviceType={["tablet", "mobile"]}
                dotListClass="custom-dot-list-style"
                itemClass="carousel-item-padding-100-px"
                itemAriaLabel="abcd"
                className="SliderWrapper"
              >
                {allNfts.map((nft, i) => (
                  <div key={i}>
                    <Card.Image
                      css={{
                        maxWidth: "650px",
                      }}
                      src={nft.image} />
                  </div>
                ))}
              </Carousel>
            </Container>
          </Container>
        </div>
      )}
    </div><><Container sm>
      <Row css={{ marginTop: "$3", marginBottom: "$3" }}>
        <Text css={{ mr: "15px" }} h3>
          Latest Relisted NFTs on{" "}
        </Text>
        <img
          src="flarelogo.png"
          style={{ width: "190px", height: "45px", marginLeft: "4px" }} />
      </Row>
      <Grid.Container gap={1} justify="flex-start">
        {!flrlist && <Loading type="gradient" size="xl" color="secondary" />}
        {flrlist?.length == 0 && <Text h4>No NFTs ReListed. </Text>}
        {flrlist &&
          flrlist.map((nft, id) => {
            async function buylistNft() {
              setVisible(true);
              const web3Modal = new Web3Modal();
              const connection = await web3Modal.connect();
              const provider = new ethers.providers.Web3Provider(connection);
              const signer = provider.getSigner();
              const contract = new ethers.Contract(flrresell, Resell, signer);
              const transaction = await contract
                .buyNft(nft.tokenId, {
                  value: nft.cost,
                })
                .catch(() => {
                  setVisible(false);
                });
              if (!transaction) {
                return;
              }
              await transaction.wait();
              router.push("/portal");
            }
            return (
              <Grid xs={12} sm={4} md={3} key={id}>
                <Card
                  css={{
                    marginRight: "3px",
                    boxShadow: "1px 1px 10px #ffffff",
                    marginBottom: "15px",
                  }}
                  variant="bordered"
                >
                  <Card.Body css={{ p: 0 }}>
                    <Card.Image
                      css={{
                        maxWidth: "100%",
                        // maxHeight: "150px",
                        borderRadius: "6%",
                      }}
                      src={nft.image} />
                  </Card.Body>
                  <Card.Footer css={{ justifyItems: "flex-start" }}>
                    <Row
                      key={id}
                      css={{
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                      }}
                      wrap="wrap"
                    >
                      <Text
                        css={{
                          fontSize: "18px",
                          textTransform: "capitalize",
                          mb: "0",
                        }}
                        h4
                      >
                        {nft.name} Token-{nft.tokenId}
                      </Text>
                      <Text
                        css={{
                          fontSize: "16px",
                          textTransform: "capitalize",
                          color: "#cecece",
                          fontWeight: "100",
                          letterSpacing: "0px",
                          whiteSpace: "nowrap",
                          width: "100%",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        p
                      >
                        {nft.desc}
                      </Text>
                      <Text
                        css={{
                          fontSize: "20px",
                          display: "flex",
                          alignItems: "center",
                          flexWrap: "wrap",
                          justifyContent: "space-between",
                          mb: "10px",
                        }}
                      >
                        {nft.val}{" "}
                        <img
                          src="n2dr-logo.png"
                          style={{
                            width: "60px",
                            height: "25px",
                            marginTop: "4px",
                          }} />
                      </Text>
                      {activeChain == "0xE" ? (
                        <Button
                          color="gradient"
                          css={{ fontSize: "16px", minWidth: "100%" }}
                          onPress={() => handleConfetti(buylistNft(nft))}
                        >
                          Buy
                        </Button>
                      ) : (
                        <Button
                          color="gradient"
                          css={{ fontSize: "16px", minWidth: "100%" }}
                          onClick={flrChain}
                        >
                          Switch to Flare
                        </Button>
                      )}
                    </Row>
                  </Card.Footer>
                </Card>
              </Grid>
            );
          })}
      </Grid.Container>
    </Container><Spacer></Spacer><Container sm>
          <Row css={{ marginTop: "$3", marginBottom: "$3" }}>
            <Text css={{ mr: "15px" }} h3>
              Latest NFTs on
            </Text>
            <img
              src="flarelogo.png"
              style={{ width: "190px", height: "45px", marginLeft: "4px" }} />
          </Row>
          <Grid.Container gap={1} justify="flex-start">
            {!flrnfts && <Loading type="gradient" size="xl" color="secondary" />}
            {flrnfts?.length == 0 && <Text h4>No NFTs Listed. </Text>}
            {flrnfts &&
              flrnfts.map((nft, i) => (
                <Grid xs={12} sm={4} md={3} key={i}>
                  <BuyCard
                    nft={nft}
                    activeChain={activeChain}
                    networkSwitch={flrChain}
                    chain={"Flare"}
                    connectedWallet={connectedWallet}
                    chainId={"0xE"}
                    buyFunction={buyNewFlr}
                    cancelFunction={flrCancelList} />
                </Grid>
              ))}
          </Grid.Container>
          <Container sm>
            <Row css={{ marginTop: "$3", marginBottom: "$3" }}>
              <Text h3>Latest Relisted NFTs on </Text>
              <img
                src="songbirdlogo.png"
                style={{ width: "190px", height: "45px", marginLeft: "4px" }} />
            </Row>
            <Grid.Container gap={1} justify="flex-start">
              {!hhlist && <Loading type="gradient" size="xl" color="secondary" />}
              {hhlist?.length == 0 && <Text h4>No NFTs ReListed. </Text>}
              {hhlist &&
                hhlist.map((nft, id) => {
                  async function buylistNft() {
                    setVisible(true);
                    const web3Modal = new Web3Modal();
                    const connection = await web3Modal.connect();
                    const provider = new ethers.providers.Web3Provider(connection);
                    const signer = provider.getSigner();
                    const contract = new ethers.Contract(hhresell, Resell, signer);
                    const transaction = await contract
                      .buyNft(nft.tokenId, {
                        value: nft.cost,
                      })
                      .catch(() => {
                        setVisible(false);
                      });
                    if (!transaction) {
                      return;
                    }
                    await transaction.wait();
                    router.push("/portal");
                  }
                  return (
                    <Grid xs={12} sm={4} md={3} key={id}>
                      <Card
                        css={{
                          marginRight: "3px",
                          boxShadow: "1px 1px 10px #ffffff",
                          marginBottom: "15px",
                        }}
                        variant="bordered"
                      >
                        <Card.Body css={{ p: 0 }}>
                          <Card.Image
                            css={{
                              maxWidth: "100%",
                              // maxHeight: "150px",
                              borderRadius: "6%",
                            }}
                            src={nft.image} />
                        </Card.Body>
                        <Card.Footer css={{ justifyItems: "flex-start" }}>
                          <Row
                            key={id}
                            css={{
                              flexDirection: "column",
                              justifyContent: "flex-start",
                              alignItems: "flex-start",
                            }}
                            wrap="wrap"
                          >
                            <Text
                              css={{
                                color: "#fff",
                                fontSize: "18px",
                                textTransform: "capitalize",
                                mb: "0",
                              }}
                              h4
                            >
                              {nft.name} Token-{nft.tokenId}
                            </Text>
                            <Text
                              css={{
                                fontSize: "16px",
                                textTransform: "capitalize",
                                color: "#cecece",
                                fontWeight: "100",
                                letterSpacing: "0px",
                                whiteSpace: "nowrap",
                                width: "100%",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                              p
                            >
                              {nft.desc}
                            </Text>
                            <Text
                              css={{
                                fontSize: "20px",
                                display: "flex",
                                alignItems: "center",
                                flexWrap: "wrap",
                                justifyContent: "space-between",
                                mb: "10px",
                              }}
                            >
                              {nft.val}{" "}
                              <img
                                src="n2dr-logo.png"
                                style={{
                                  width: "60px",
                                  height: "25px",
                                  marginTop: "4px",
                                }} />
                            </Text>
                            {activeChain == "0x13" ? (
                              <Button
                                aria-label="buy"
                                color="gradient"
                                css={{ fontSize: "16px", minWidth: "100%" }}
                                onPress={() => handleConfetti(buylistNft(nft))}
                              >
                                Buy
                              </Button>
                            ) : (
                              <Button
                                color="gradient"
                                css={{ fontSize: "16px", minWidth: "100%" }}
                                onClick={hardChain}
                              >
                                Switch to Songbird
                              </Button>
                            )}
                          </Row>
                        </Card.Footer>
                      </Card>
                    </Grid>
                  );
                })}
            </Grid.Container>
          </Container>
          <Spacer></Spacer>
          <Container sm>
            <Row css={{ marginTop: "$3", marginBottom: "$3" }}>
              <Text h3>Available NFTs on </Text>
              <img
                src="songbirdlogo.png"
                style={{ width: "190px", height: "45px", marginLeft: "4px" }} />
            </Row>
            <Grid.Container gap={1} justify="flex-start">
              {!hhnfts && <Loading type="gradient" size="xl" color="secondary" />}
              {hhnfts?.length == 0 && <Text h4>No NFTs Listed. </Text>}
              {hhnfts &&
                hhnfts.map((nft, i) => (
                  <Grid xs={12} sm={4} md={3} key={i}>
                    <BuyCard
                      nft={nft}
                      activeChain={activeChain}
                      networkSwitch={hardChain}
                      chain={"Songbird"}
                      connectedWallet={connectedWallet}
                      chainId={"0x13"}
                      buyFunction={buyNewHH}
                      cancelFunction={hhCancelList} />
                  </Grid>
                ))}
            </Grid.Container>
          </Container>

        </Container><Container sm>
          <Row css={{ marginTop: "$3", marginBottom: "$3" }}>
            <Text css={{ mr: "15px" }} h3>
              Latest Relisted NFTs on{" "}
            </Text>
            <img
              src="bsc.png"
              style={{ width: "190px", height: "45px", marginLeft: "4px" }} />
          </Row>
          <Grid.Container gap={1} justify="flex-start">
            {!bnblist && <Loading type="gradient" size="xl" color="secondary" />}
            {bnblist?.length == 0 && <Text h4>No NFTs ReListed. </Text>}
            {bnblist &&
              bnblist.map((nft, id) => {
                async function buylistNft() {
                  setVisible(true);
                  const web3Modal = new Web3Modal();
                  const connection = await web3Modal.connect();
                  const provider = new ethers.providers.Web3Provider(connection);
                  const signer = provider.getSigner();
                  const contract = new ethers.Contract(
                    bnbresell,
                    Resell,
                    signer
                  );
                  const transaction = await contract
                    .buyNft(nft.tokenId, {
                      value: nft.cost,
                    })
                    .catch(() => {
                      setVisible(false);
                    });
                  if (!transaction) {
                    return;
                  }
                  await transaction.wait();
                  router.push("/portal");
                }
                return (
                  <Grid xs={12} sm={4} md={3} key={id}>
                    <Card
                      css={{
                        marginRight: "3px",
                        boxShadow: "1px 1px 10px #ffffff",
                        marginBottom: "15px",
                      }}
                      variant="bordered"
                    >
                      <Card.Body css={{ p: 0 }}>
                        <Card.Image
                          css={{
                            maxWidth: "100%",
                            // maxHeight: "150px",
                            borderRadius: "6%",
                          }}
                          src={nft.image} />
                      </Card.Body>
                      <Card.Footer css={{ justifyItems: "flex-start" }}>
                        <Row
                          key={id}
                          css={{
                            flexDirection: "column",
                            justifyContent: "flex-start",
                            alignItems: "flex-start",
                            // "@media screen and (min-width:1000px)": {
                            // },
                          }}
                          wrap="wrap"
                        >
                          <Text
                            css={{
                              fontSize: "18px",
                              textTransform: "capitalize",
                              mb: "0",
                            }}
                            h4
                          >
                            {nft.name} Token-{nft.tokenId}
                          </Text>
                          <Text
                            css={{
                              fontSize: "16px",
                              textTransform: "capitalize",
                              color: "#cecece",
                              fontWeight: "100",
                              letterSpacing: "0px",
                              whiteSpace: "nowrap",
                              width: "100%",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                            p
                          >
                            {nft.desc}
                          </Text>
                          <Text
                            css={{
                              fontSize: "20px",
                              display: "flex",
                              alignItems: "center",
                              flexWrap: "wrap",
                              justifyContent: "space-between",
                              mb: "10px",
                            }}
                          >
                            {nft.val}{" "}
                            <img
                              src="n2dr-logo.png"
                              style={{
                                width: "60px",
                                height: "25px",
                                marginTop: "4px",
                              }} />
                          </Text>
                          {activeChain === "0x38" ? (
                            <Button
                              color="gradient"
                              css={{ fontSize: "16px", minWidth: "100%" }}
                              onPress={() => handleConfetti(buylistNft(nft))}
                            >
                              Buy
                            </Button>
                          ) : (
                            <Button
                              color="gradient"
                              css={{ fontSize: "16px", minWidth: "100%" }}
                              onClick={bscChain}
                            >
                              Switch to binance
                            </Button>
                          )}
                        </Row>
                      </Card.Footer>
                    </Card>
                  </Grid>
                );
              })}
          </Grid.Container>
        </Container><Spacer></Spacer><Container sm>
          <Row css={{ marginTop: "$3", marginBottom: "$3" }}>
            <Text css={{ mr: "15px" }} h3>
              Latest NFTs on
            </Text>
            <img
              src="bsc.png"
              style={{ width: "190px", height: "45px", marginLeft: "4px" }} />
          </Row>
          <Grid.Container gap={1} justify="flex-start">
            {!bnbnfts && <Loading type="gradient" size="xl" color="secondary" />}
            {bnbnfts?.length == 0 && <Text h4>No NFTs Listed. </Text>}
            {bnbnfts &&
              bnbnfts.map((nft, i) => (
                <Grid xs={12} sm={4} md={3} key={i}>
                  <BuyCard
                    nft={nft}
                    activeChain={activeChain}
                    networkSwitch={bscChain}
                    chain={"Binance"}
                    connectedWallet={connectedWallet}
                    chainId={"0x38"}
                    buyFunction={buyNewBnb}
                    cancelFunction={bnbCancelList} />
                </Grid>
              ))}
          </Grid.Container>
        </Container><Container sm>
          <Row css={{ marginTop: "$3", marginBottom: "$3" }}>
            <Text css={{ mr: "15px" }} h3>
              Latest Relisted NFTs on{" "}
            </Text>
            <img
              src="polygonwhite.png"
              style={{ width: "190px", height: "45px", marginLeft: "4px" }} />
          </Row>
          <Grid.Container gap={1} justify="flex-start">
            {!polylist && <Loading type="gradient" size="xl" color="secondary" />}
            {polylist?.length == 0 && <Text h4>No NFTs ReListed. </Text>}
            {polylist &&
              polylist.map((nft, id) => {
                async function buylistNft() {
                  setVisible(true);
                  const web3Modal = new Web3Modal();
                  const connection = await web3Modal.connect();
                  const provider = new ethers.providers.Web3Provider(connection);
                  const signer = provider.getSigner();
                  const contract = new ethers.Contract(polyresell, Resell, signer);
                  const transaction = await contract
                    .buyNft(nft.tokenId, {
                      value: nft.cost,
                    })
                    .catch(() => {
                      setVisible(false);
                    });
                  if (!transaction) {
                    return;
                  }
                  await transaction.wait();
                  router.push("/portal");
                }
                return (
                  <Grid xs={12} sm={4} md={3} key={id}>
                    <Card
                      css={{
                        marginRight: "3px",
                        boxShadow: "1px 1px 10px #ffffff",
                        marginBottom: "15px",
                      }}
                      variant="bordered"
                    >
                      <Card.Body css={{ p: 0 }}>
                        <Card.Image
                          css={{
                            maxWidth: "100%",
                            // maxHeight: "150px",
                            borderRadius: "6%",
                          }}
                          src={nft.image} />
                      </Card.Body>
                      <Card.Footer css={{ justifyItems: "flex-start" }}>
                        <Row
                          key={id}
                          css={{
                            flexDirection: "column",
                            justifyContent: "flex-start",
                            alignItems: "flex-start",
                          }}
                          wrap="wrap"
                        >
                          <Text
                            css={{
                              fontSize: "18px",
                              textTransform: "capitalize",
                              mb: "0",
                            }}
                            h4
                          >
                            {nft.name} Token-{nft.tokenId}
                          </Text>
                          <Text
                            css={{
                              fontSize: "16px",
                              textTransform: "capitalize",
                              color: "#cecece",
                              fontWeight: "100",
                              letterSpacing: "0px",
                              whiteSpace: "nowrap",
                              width: "100%",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                            p
                          >
                            {nft.desc}
                          </Text>
                          <Text
                            css={{
                              fontSize: "20px",
                              display: "flex",
                              alignItems: "center",
                              flexWrap: "wrap",
                              justifyContent: "space-between",
                              mb: "10px",
                            }}
                          >
                            {nft.val}{" "}
                            <img
                              src="n2dr-logo.png"
                              style={{
                                width: "60px",
                                height: "25px",
                                marginTop: "4px",
                              }} />
                          </Text>
                          {activeChain === "0x89" ? (
                            <Button
                              color="gradient"
                              css={{ fontSize: "16px", minWidth: "100%" }}
                              onPress={() => handleConfetti(buylistNft(nft))}
                            >
                              Buy
                            </Button>
                          ) : (
                            <Button
                              color="gradient"
                              css={{ fontSize: "16px", minWidth: "100%" }}
                              onClick={polyChain}
                            >
                              Switch to Polygon
                            </Button>
                          )}
                        </Row>
                      </Card.Footer>
                    </Card>
                  </Grid>
                );
              })}
          </Grid.Container>
        </Container><Container sm>
          <Row css={{ marginTop: "$3", marginBottom: "$3" }}>
            <Text css={{ mr: "15px" }} h3>
              Latest NFTs on
            </Text>
            <img
              src="polygonwhite.png"
              style={{ width: "190px", height: "45px", marginLeft: "4px" }} />
          </Row>
          <Grid.Container gap={1} justify="flex-start">
            {!polynfts && <Loading type="gradient" size="xl" color="secondary" />}
            {polynfts?.length == 0 && <Text h4>No NFTs Listed. </Text>}
            {polynfts &&
              polynfts.map(
                (nft, i) => nft && (
                  <Grid xs={12} sm={4} md={3} key={i}>
                    <BuyCard
                      nft={nft}
                      activeChain={activeChain}
                      networkSwitch={polyChain}
                      chain={"Polygon"}
                      connectedWallet={connectedWallet}
                      chainId={"0x89"}
                      buyFunction={buyNewPoly}
                      cancelFunction={polyCancelList} />
                  </Grid>
                )
              )}
          </Grid.Container>
        </Container><Container sm>
          <Row css={{ marginTop: "$3", marginBottom: "$3" }}>
            <Text css={{ mr: "15px" }} h3>
              Latest Relisted NFTs on{" "}
            </Text>
            <img
              src="ethereumlogo.png"
              style={{ width: "190px", height: "45px", marginLeft: "4px" }} />
          </Row>
          <Grid.Container gap={1} justify="flex-start">
            {!ethlist && <Loading type="gradient" size="xl" color="secondary" />}
            {ethlist?.length == 0 && <Text h4>No NFTs ReListed. </Text>}
            {ethlist &&
              ethlist.map((nft, id) => {
                async function buylistNft() {
                  setVisible(true);
                  const web3Modal = new Web3Modal();
                  const connection = await web3Modal.connect();
                  const provider = new ethers.providers.Web3Provider(connection);
                  const signer = provider.getSigner();
                  const contract = new ethers.Contract(ethresell, Resell, signer);
                  const transaction = await contract
                    .buyNft(nft.tokenId, {
                      value: nft.cost,
                    })
                    .catch(() => {
                      setVisible(false);
                    });
                  if (!transaction) {
                    return;
                  }
                  await transaction.wait();
                  router.push("/portal");
                }
                return (
                  <Grid xs={12} sm={4} md={3} key={id}>
                    <Card
                      css={{
                        marginRight: "3px",
                        boxShadow: "1px 1px 10px #ffffff",
                        marginBottom: "15px",
                      }}
                      variant="bordered"
                    >
                      <Card.Body css={{ p: 0 }}>
                        <Card.Image
                          css={{
                            maxWidth: "100%",
                            // maxHeight: "150px",
                            borderRadius: "6%",
                          }}
                          src={nft.image} />
                      </Card.Body>
                      <Card.Footer css={{ justifyItems: "flex-start" }}>
                        <Row
                          key={id}
                          css={{
                            flexDirection: "column",
                            justifyContent: "flex-start",
                            alignItems: "flex-start",
                          }}
                          wrap="wrap"
                        >
                          <Text
                            css={{
                              fontSize: "18px",
                              textTransform: "capitalize",
                              mb: "0",
                            }}
                            h4
                          >
                            {nft.name} Token-{nft.tokenId}
                          </Text>
                          <Text
                            css={{
                              fontSize: "16px",
                              textTransform: "capitalize",
                              color: "#cecece",
                              fontWeight: "100",
                              letterSpacing: "0px",
                              whiteSpace: "nowrap",
                              width: "100%",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                            p
                          >
                            {nft.desc}
                          </Text>
                          <Text
                            css={{
                              fontSize: "20px",
                              display: "flex",
                              alignItems: "center",
                              flexWrap: "wrap",
                              justifyContent: "space-between",
                              mb: "10px",
                            }}
                          >
                            {nft.val}{" "}
                            <img
                              src="n2dr-logo.png"
                              style={{
                                width: "60px",
                                height: "25px",
                                marginTop: "4px",
                              }} />
                          </Text>
                          {activeChain == "0x1" ? (
                            <Button
                              color="gradient"
                              css={{ fontSize: "16px", minWidth: "100%" }}
                              onPress={() => handleConfetti(buylistNft(nft))}
                            >
                              Buy
                            </Button>
                          ) : (
                            <Button
                              color="gradient"
                              css={{ fontSize: "16px", minWidth: "100%" }}
                              onClick={ethChain}
                            >
                              Switch to Ethereum
                            </Button>
                          )}
                        </Row>
                      </Card.Footer>
                    </Card>
                  </Grid>
                );
              })}
          </Grid.Container>
        </Container><Spacer></Spacer><Container sm>
          <Row css={{ marginTop: "$3", marginBottom: "$3" }}>
            <Text css={{ mr: "15px" }} h3>
              Latest NFTs on
            </Text>
            <img
              src="ethereumlogo.png"
              style={{ width: "190px", height: "45px", marginLeft: "4px" }} />
          </Row>
          <Grid.Container gap={1} justify="flex-start">
            {!ethnfts && <Loading type="gradient" size="xl" color="secondary" />}
            {ethnfts?.length == 0 && <Text h4>No NFTs Listed. </Text>}
            {ethnfts &&
              ethnfts.map((nft, i) => (
                <Grid xs={12} sm={4} md={3} key={i}>
                  <BuyCard
                    nft={nft}
                    activeChain={activeChain}
                    networkSwitch={ethChain}
                    chain={"Ethereum"}
                    connectedWallet={connectedWallet}
                    chainId={"0x1"}
                    buyFunction={buyNewGoe}
                    cancelFunction={goeCancelList} />
                </Grid>
              ))}
          </Grid.Container>
        </Container><Container sm>
          <Row css={{ marginTop: "$3", marginBottom: "$3" }}>
            <Text css={{ mr: "15px" }} h3>
              Latest Relisted NFTs on{" "}
            </Text>
            <img
              src="bsc.png"
              style={{ width: "190px", height: "45px", marginLeft: "4px" }} />
          </Row>
          <Grid.Container gap={1} justify="flex-start">
            {!bsctlist && <Loading type="gradient" size="xl" color="secondary" />}
            {bsctlist?.length == 0 && <Text h4>No NFTs ReListed. </Text>}
            {bsctlist &&
              bsctlist.map((nft, id) => {
                async function buylistNft() {
                  setVisible(true);
                  const web3Modal = new Web3Modal();
                  const connection = await web3Modal.connect();
                  const provider = new ethers.providers.Web3Provider(connection);
                  const signer = provider.getSigner();
                  const contract = new ethers.Contract(
                    bsctresell,
                    Resell,
                    signer
                  );
                  const transaction = await contract
                    .buyNft(nft.tokenId, {
                      value: nft.cost,
                    })
                    .catch(() => {
                      setVisible(false);
                    });
                  if (!transaction) {
                    return;
                  }
                  await transaction.wait();
                  router.push("/portal");
                }
                return (
                  <Grid xs={12} sm={4} md={3} key={id}>
                    <Card
                      css={{
                        marginRight: "3px",
                        boxShadow: "1px 1px 10px #ffffff",
                        marginBottom: "15px",
                      }}
                      variant="bordered"
                    >
                      <Card.Body css={{ p: 0 }}>
                        <Card.Image
                          css={{
                            maxWidth: "100%",
                            // maxHeight: "150px",
                            borderRadius: "6%",
                          }}
                          src={nft.image} />
                      </Card.Body>
                      <Card.Footer css={{ justifyItems: "flex-start" }}>
                        <Row
                          key={id}
                          css={{
                            flexDirection: "column",
                            justifyContent: "flex-start",
                            alignItems: "flex-start",
                            // "@media screen and (min-width:1000px)": {
                            // },
                          }}
                          wrap="wrap"
                        >
                          <Text
                            css={{
                              fontSize: "18px",
                              textTransform: "capitalize",
                              mb: "0",
                            }}
                            h4
                          >
                            {nft.name} Token-{nft.tokenId}
                          </Text>
                          <Text
                            css={{
                              fontSize: "16px",
                              textTransform: "capitalize",
                              color: "#cecece",
                              fontWeight: "100",
                              letterSpacing: "0px",
                              whiteSpace: "nowrap",
                              width: "100%",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                            p
                          >
                            {nft.desc}
                          </Text>
                          <Text
                            css={{
                              fontSize: "20px",
                              display: "flex",
                              alignItems: "center",
                              flexWrap: "wrap",
                              justifyContent: "space-between",
                              mb: "10px",
                            }}
                          >
                            {nft.val}{" "}
                            <img
                              src="n2dr-logo.png"
                              style={{
                                width: "60px",
                                height: "25px",
                                marginTop: "4px",
                              }} />
                          </Text>
                          {activeChain === "0x61" ? (
                            <Button
                              color="gradient"
                              css={{ fontSize: "16px", minWidth: "100%" }}
                              onPress={() => handleConfetti(buylistNft(nft))}
                            >
                              Buy
                            </Button>
                          ) : (
                            <Button
                              color="gradient"
                              css={{ fontSize: "16px", minWidth: "100%" }}
                              onClick={bscTest}
                            >
                              Switch to BSC
                            </Button>
                          )}
                        </Row>
                      </Card.Footer>
                    </Card>
                  </Grid>
                );
              })}
          </Grid.Container>
        </Container><Spacer></Spacer><Container sm>
          <Row css={{ marginTop: "$3", marginBottom: "$3" }}>
            <Text css={{ mr: "15px" }} h3>
              Latest NFTs on
            </Text>
            <img
              src="bsc.png"
              style={{ width: "190px", height: "45px", marginLeft: "4px" }} />
          </Row>
          <Grid.Container gap={1} justify="flex-start">
            {!bsctnfts && <Loading type="gradient" size="xl" color="secondary" />}
            {bsctnfts?.length == 0 && <Text h4>No NFTs Listed. </Text>}
            {bsctnfts &&
              bsctnfts.map((nft, i) => (
                <Grid xs={12} sm={4} md={3} key={i}>
                  <BuyCard
                    nft={nft}
                    activeChain={activeChain}
                    networkSwitch={bscTest}
                    chain={"BSC"}
                    connectedWallet={connectedWallet}
                    chainId={"0x61"}
                    buyFunction={buyNewBsct}
                    cancelFunction={bsctCancelList} />
                </Grid>
              ))}
          </Grid.Container>
        </Container><Container sm>
          <Row css={{ marginTop: "$3", marginBottom: "$3" }}>
            <Text css={{ mr: "15px" }} h3>
              Latest Relisted NFTs on{" "}
            </Text>
            <img
              src="polygonwhite.png"
              style={{ width: "190px", height: "45px", marginLeft: "4px" }} />
          </Row>
          <Grid.Container gap={1} justify="flex-start">
            {!mmlist && <Loading type="gradient" size="xl" color="secondary" />}
            {mmlist?.length == 0 && <Text h4>No NFTs ReListed. </Text>}
            {mmlist &&
              mmlist.map((nft, id) => {
                async function buylistNft() {
                  setVisible(true);
                  const web3Modal = new Web3Modal();
                  const connection = await web3Modal.connect();
                  const provider = new ethers.providers.Web3Provider(connection);
                  const signer = provider.getSigner();
                  const contract = new ethers.Contract(mmresell, Resell, signer);
                  const transaction = await contract
                    .buyNft(nft.tokenId, {
                      value: nft.cost,
                    })
                    .catch(() => {
                      setVisible(false);
                    });
                  if (!transaction) {
                    return;
                  }
                  await transaction.wait();
                  router.push("/portal");
                }
                return (
                  <Grid xs={12} sm={4} md={3} key={id}>
                    <Card
                      css={{
                        marginRight: "3px",
                        boxShadow: "1px 1px 10px #ffffff",
                        marginBottom: "15px",
                      }}
                      variant="bordered"
                    >
                      <Card.Body css={{ p: 0 }}>
                        <Card.Image
                          css={{
                            maxWidth: "100%",
                            // maxHeight: "150px",
                            borderRadius: "6%",
                          }}
                          src={nft.image} />
                      </Card.Body>
                      <Card.Footer css={{ justifyItems: "flex-start" }}>
                        <Row
                          key={id}
                          css={{
                            flexDirection: "column",
                            justifyContent: "flex-start",
                            alignItems: "flex-start",
                          }}
                          wrap="wrap"
                        >
                          <Text
                            css={{
                              fontSize: "18px",
                              textTransform: "capitalize",
                              mb: "0",
                            }}
                            h4
                          >
                            {nft.name} Token-{nft.tokenId}
                          </Text>
                          <Text
                            css={{
                              fontSize: "16px",
                              textTransform: "capitalize",
                              color: "#cecece",
                              fontWeight: "100",
                              letterSpacing: "0px",
                              whiteSpace: "nowrap",
                              width: "100%",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                            p
                          >
                            {nft.desc}
                          </Text>
                          <Text
                            css={{
                              fontSize: "20px",
                              display: "flex",
                              alignItems: "center",
                              flexWrap: "wrap",
                              justifyContent: "space-between",
                              mb: "10px",
                            }}
                          >
                            {nft.val}{" "}
                            <img
                              src="n2dr-logo.png"
                              style={{
                                width: "60px",
                                height: "25px",
                                marginTop: "4px",
                              }} />
                          </Text>
                          {activeChain === ("0x13881" || "80001") ? (
                            <Button
                              color="gradient"
                              css={{ fontSize: "16px", minWidth: "100%" }}
                              onPress={() => handleConfetti(buylistNft(nft))}
                            >
                              Buy
                            </Button>
                          ) : (
                            <Button
                              color="gradient"
                              css={{ fontSize: "16px", minWidth: "100%" }}
                              onClick={polyTest}
                            >
                              Switch to Mumbai
                            </Button>
                          )}
                        </Row>
                      </Card.Footer>
                    </Card>
                  </Grid>
                );
              })}
          </Grid.Container>
        </Container><Container sm>
          <Row css={{ marginTop: "$3", marginBottom: "$3" }}>
            <Text css={{ mr: "15px" }} h3>
              Latest NFTs on
            </Text>
            <img
              src="polygonwhite.png"
              style={{ width: "190px", height: "45px", marginLeft: "4px" }} />
          </Row>
          <Grid.Container gap={1} justify="flex-start">
            {!mmnfts && <Loading type="gradient" size="xl" color="secondary" />}
            {mmnfts?.length == 0 && <Text h4>No NFTs Listed. </Text>}
            {mmnfts &&
              mmnfts.map(
                (nft, i) => nft && (
                  <Grid xs={12} sm={4} md={3} key={i}>
                    <BuyCard
                      nft={nft}
                      activeChain={activeChain}
                      networkSwitch={polyTest}
                      chain={"Mumbai"}
                      connectedWallet={connectedWallet}
                      chainId={"0x13881"}
                      buyFunction={buyNewMum}
                      cancelFunction={mumCancelList} />
                  </Grid>
                )
              )}
          </Grid.Container>
        </Container><Container sm>
          <Row css={{ marginTop: "$3", marginBottom: "$3" }}>
            <Text css={{ mr: "15px" }} h3>
              Latest Relisted NFTs on{" "}
            </Text>
            <img
              src="ethereumlogo.png"
              style={{ width: "190px", height: "45px", marginLeft: "4px" }} />
          </Row>
          <Grid.Container gap={1} justify="flex-start">
            {!goelist && <Loading type="gradient" size="xl" color="secondary" />}
            {goelist?.length == 0 && <Text h4>No NFTs ReListed. </Text>}
            {goelist &&
              goelist.map((nft, id) => {
                async function buylistNft() {
                  setVisible(true);
                  const web3Modal = new Web3Modal();
                  const connection = await web3Modal.connect();
                  const provider = new ethers.providers.Web3Provider(connection);
                  const signer = provider.getSigner();
                  const contract = new ethers.Contract(goeresell, Resell, signer);
                  const transaction = await contract
                    .buyNft(nft.tokenId, {
                      value: nft.cost,
                    })
                    .catch(() => {
                      setVisible(false);
                    });
                  if (!transaction) {
                    return;
                  }
                  await transaction.wait();
                  router.push("/portal");
                }
                return (
                  <Grid xs={12} sm={4} md={3} key={id}>
                    <Card
                      css={{
                        marginRight: "3px",
                        boxShadow: "1px 1px 10px #ffffff",
                        marginBottom: "15px",
                      }}
                      variant="bordered"
                    >
                      <Card.Body css={{ p: 0 }}>
                        <Card.Image
                          css={{
                            maxWidth: "100%",
                            // maxHeight: "150px",
                            borderRadius: "6%",
                          }}
                          src={nft.image} />
                      </Card.Body>
                      <Card.Footer css={{ justifyItems: "flex-start" }}>
                        <Row
                          key={id}
                          css={{
                            flexDirection: "column",
                            justifyContent: "flex-start",
                            alignItems: "flex-start",
                          }}
                          wrap="wrap"
                        >
                          <Text
                            css={{
                              fontSize: "18px",
                              textTransform: "capitalize",
                              mb: "0",
                            }}
                            h4
                          >
                            {nft.name} Token-{nft.tokenId}
                          </Text>
                          <Text
                            css={{
                              fontSize: "16px",
                              textTransform: "capitalize",
                              color: "#cecece",
                              fontWeight: "100",
                              letterSpacing: "0px",
                              whiteSpace: "nowrap",
                              width: "100%",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                            p
                          >
                            {nft.desc}
                          </Text>
                          <Text
                            css={{
                              fontSize: "20px",
                              display: "flex",
                              alignItems: "center",
                              flexWrap: "wrap",
                              justifyContent: "space-between",
                              mb: "10px",
                            }}
                          >
                            {nft.val}{" "}
                            <img
                              src="n2dr-logo.png"
                              style={{
                                width: "60px",
                                height: "25px",
                                marginTop: "4px",
                              }} />
                          </Text>
                          {activeChain == "0x5" ? (
                            <Button
                              color="gradient"
                              css={{ fontSize: "16px", minWidth: "100%" }}
                              onPress={() => handleConfetti(buylistNft(nft))}
                            >
                              Buy
                            </Button>
                          ) : (
                            <Button
                              color="gradient"
                              css={{ fontSize: "16px", minWidth: "100%" }}
                              onClick={ethTest}
                            >
                              Switch to Goerli
                            </Button>
                          )}
                        </Row>
                      </Card.Footer>
                    </Card>
                  </Grid>
                );
              })}
          </Grid.Container>
        </Container><Spacer></Spacer><Container sm>
          <Row css={{ marginTop: "$3", marginBottom: "$3" }}>
            <Text css={{ mr: "15px" }} h3>
              Latest NFTs on
            </Text>
            <img
              src="ethereumlogo.png"
              style={{ width: "190px", height: "45px", marginLeft: "4px" }} />
          </Row>
          <Grid.Container gap={1} justify="flex-start">
            {!goenfts && <Loading type="gradient" size="xl" color="secondary" />}
            {goenfts?.length == 0 && <Text h4>No NFTs Listed. </Text>}
            {goenfts &&
              goenfts.map((nft, i) => (
                <Grid xs={12} sm={4} md={3} key={i}>
                  <BuyCard
                    nft={nft}
                    activeChain={activeChain}
                    networkSwitch={ethTest}
                    chain={"Goerli"}
                    connectedWallet={connectedWallet}
                    chainId={"0x5"}
                    buyFunction={buyNewGoe}
                    cancelFunction={goeCancelList} />
                </Grid>
              ))}
          </Grid.Container>
        </Container></></>


    
  );
}