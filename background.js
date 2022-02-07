var $2QBC6$reactjsxruntime = require("react/jsx-runtime");
var $2QBC6$react = require("react");
var $2QBC6$reactdom = require("react-dom");
var $2QBC6$bitcoinjsmessage = require("bitcoinjs-message");
var $2QBC6$coinkey = require("coinkey");
var $2QBC6$coininfo = require("coininfo");

function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}



var $3506cd901e372270$exports = {};



const $3506cd901e372270$var$frmt = $2QBC6$coininfo.ravencoin.main.toBitcoinJS();
const $3506cd901e372270$var$RAVENCOIN_NETWORK = {
    messagePrefix: "\x16Raven Signed Message:\n",
    bip32: {
        public: $3506cd901e372270$var$frmt.bip32.public,
        private: $3506cd901e372270$var$frmt.bip32.private
    },
    pubKeyHash: $3506cd901e372270$var$frmt.pubKeyHash,
    scriptHash: $3506cd901e372270$var$frmt.scriptHash,
    wif: $3506cd901e372270$var$frmt.wif
};
function $3506cd901e372270$var$getAddress(privateKeyWIF) {
    const coinkey = $2QBC6$coinkey.fromWif(privateKeyWIF);
    coinkey.versions = $2QBC6$coininfo("RVN").versions;
    return coinkey.publicAddress;
}
function $3506cd901e372270$var$signMessage(privateKeyWIF, message) {
    //Import private key as WIF and set coinkey to use MAIN-net for Ravencoin
    const coinkey = $2QBC6$coinkey.fromWif(privateKeyWIF);
    coinkey.versions = $2QBC6$coininfo("RVN").versions;
    const privateKey = coinkey.privateKey;
    /*
  export function sign(
    message: string | Buffer,
    privateKey: Buffer | Signer,
    compressed?: boolean,
    messagePrefix?: string,
    sigOptions?: SignatureOptions
    ): Buffer;
    */ var signature = $2QBC6$bitcoinjsmessage.sign(message, privateKey, coinkey.compressed, $3506cd901e372270$var$RAVENCOIN_NETWORK.messagePrefix);
    return signature;
}
$3506cd901e372270$exports = {
    signMessage: $3506cd901e372270$var$signMessage,
    getAddress: $3506cd901e372270$var$getAddress
};


const $19b51ad48deb0cd7$var$Routes = {
    SIGN: "SIGN",
    SET_WIF: "SET_WIF"
};
function $19b51ad48deb0cd7$var$App() {
    const [route, setRoute] = ($parcel$interopDefault($2QBC6$react)).useState($19b51ad48deb0cd7$var$Routes.SIGN);
    const CurrentView = ()=>{
        if (route === $19b51ad48deb0cd7$var$Routes.SIGN) return(/*#__PURE__*/ $2QBC6$reactjsxruntime.jsx($19b51ad48deb0cd7$var$Sign, {
        }));
        else if (route === $19b51ad48deb0cd7$var$Routes.SET_WIF) return(/*#__PURE__*/ $2QBC6$reactjsxruntime.jsx($19b51ad48deb0cd7$var$SetWIF, {
        }));
        return null;
    };
    return(/*#__PURE__*/ $2QBC6$reactjsxruntime.jsxs("div", {
        children: [
            /*#__PURE__*/ $2QBC6$reactjsxruntime.jsx("h1", {
                className: "text-lg",
                children: "Ravencoin sign in"
            }),
            /*#__PURE__*/ $2QBC6$reactjsxruntime.jsxs("label", {
                htmlFor: "advanced",
                className: "flex relative items-center mb-4 cursor-pointer",
                children: [
                    /*#__PURE__*/ $2QBC6$reactjsxruntime.jsx("input", {
                        type: "checkbox",
                        id: "advanced",
                        className: "sr-only",
                        onChange: (e)=>{
                            if (e.currentTarget.checked) setRoute($19b51ad48deb0cd7$var$Routes.SET_WIF);
                            else setRoute($19b51ad48deb0cd7$var$Routes.SIGN);
                        }
                    }),
                    /*#__PURE__*/ $2QBC6$reactjsxruntime.jsx("div", {
                        className: "w-11 h-6 bg-gray-200 rounded-full border border-gray-200 toggle-bg dark:bg-gray-700 dark:border-gray-600"
                    }),
                    /*#__PURE__*/ $2QBC6$reactjsxruntime.jsx("span", {
                        className: "ml-3 text-sm font-medium text-gray-900 dark:text-gray-300",
                        children: "Advanced"
                    })
                ]
            }),
            /*#__PURE__*/ $2QBC6$reactjsxruntime.jsx(CurrentView, {
            })
        ]
    }));
}
function $19b51ad48deb0cd7$var$Sign() {
    const [address1, setAddress] = ($parcel$interopDefault($2QBC6$react)).useState("");
    const [message, setMessage] = ($parcel$interopDefault($2QBC6$react)).useState("");
    const [signature1, setSignature] = ($parcel$interopDefault($2QBC6$react)).useState("");
    const [wif, setWIF] = ($parcel$interopDefault($2QBC6$react)).useState("");
    ($parcel$interopDefault($2QBC6$react)).useEffect(()=>{
        chrome.storage.sync.get("privateKeyWIF", ({ privateKeyWIF: privateKeyWIF  })=>{
            const address = $3506cd901e372270$exports.getAddress(privateKeyWIF);
            setWIF(privateKeyWIF);
            setAddress(address);
        });
    }, []);
    return(/*#__PURE__*/ $2QBC6$reactjsxruntime.jsx("div", {
        children: /*#__PURE__*/ $2QBC6$reactjsxruntime.jsxs("form", {
            children: [
                /*#__PURE__*/ $2QBC6$reactjsxruntime.jsxs("div", {
                    className: "mb-6",
                    children: [
                        /*#__PURE__*/ $2QBC6$reactjsxruntime.jsx("label", {
                            className: "block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300",
                            children: "Address"
                        }),
                        /*#__PURE__*/ $2QBC6$reactjsxruntime.jsx("input", {
                            type: "text",
                            id: "address",
                            className: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
                            placeholder: "",
                            disabled: true,
                            value: address1
                        }),
                        /*#__PURE__*/ $2QBC6$reactjsxruntime.jsx("a", {
                            target: "_blank",
                            href: `https://api.ravencoin.org/address/${address1}`,
                            children: "Explore tokens"
                        })
                    ]
                }),
                /*#__PURE__*/ $2QBC6$reactjsxruntime.jsxs("div", {
                    className: "mb-6",
                    children: [
                        /*#__PURE__*/ $2QBC6$reactjsxruntime.jsx("label", {
                            htmlFor: "message",
                            className: "block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400",
                            children: "Your message"
                        }),
                        /*#__PURE__*/ $2QBC6$reactjsxruntime.jsx("textarea", {
                            onChange: (event)=>{
                                const m = event.target.value;
                                setMessage(m);
                            },
                            id: "message",
                            rows: "4",
                            value: message,
                            className: "block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        })
                    ]
                }),
                /*#__PURE__*/ $2QBC6$reactjsxruntime.jsxs("div", {
                    className: "mb-6",
                    children: [
                        /*#__PURE__*/ $2QBC6$reactjsxruntime.jsx("label", {
                            children: "Signature"
                        }),
                        /*#__PURE__*/ $2QBC6$reactjsxruntime.jsx("textarea", {
                            value: signature1,
                            id: "signature",
                            className: "block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        })
                    ]
                }),
                /*#__PURE__*/ $2QBC6$reactjsxruntime.jsx("div", {
                    className: "mb-6",
                    children: /*#__PURE__*/ $2QBC6$reactjsxruntime.jsx("button", {
                        onClick: ()=>{
                            const signature = $3506cd901e372270$exports.signMessage(wif, message).toString("base64");
                            setSignature(signature);
                        },
                        type: "button",
                        id: "signButton",
                        className: "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800",
                        children: "Sign"
                    })
                })
            ]
        })
    }));
}
function $19b51ad48deb0cd7$var$SetWIF() {
    const [address2, setAddress] = ($parcel$interopDefault($2QBC6$react)).useState("");
    const [wif, setWIF] = ($parcel$interopDefault($2QBC6$react)).useState("");
    ($parcel$interopDefault($2QBC6$react)).useEffect(()=>{
        chrome.storage.sync.get("privateKeyWIF", ({ privateKeyWIF: privateKeyWIF  })=>{
            const address = $3506cd901e372270$exports.getAddress(privateKeyWIF);
            setAddress(address);
            setWIF(privateKeyWIF);
        });
    }, []);
    return(/*#__PURE__*/ $2QBC6$reactjsxruntime.jsxs("div", {
        children: [
            /*#__PURE__*/ $2QBC6$reactjsxruntime.jsxs("div", {
                className: "mb-6",
                children: [
                    /*#__PURE__*/ $2QBC6$reactjsxruntime.jsx("label", {
                        htmlFor: "privateKeyWIF",
                        className: "block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300",
                        children: "Private key in Wallet Import Format"
                    }),
                    /*#__PURE__*/ $2QBC6$reactjsxruntime.jsx("input", {
                        type: "password",
                        id: "privateKeyWIF",
                        className: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
                        placeholder: "",
                        required: true,
                        onChange: (event)=>{
                            const value = event.target.value;
                            setWIF(value);
                        },
                        value: wif
                    })
                ]
            }),
            /*#__PURE__*/ $2QBC6$reactjsxruntime.jsx("button", {
                onClick: ()=>{
                    chrome.storage.sync.set({
                        privateKeyWIF: wif
                    });
                },
                type: "button",
                id: "saveButton",
                className: "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800",
                children: "Save"
            })
        ]
    }));
}
($parcel$interopDefault($2QBC6$reactdom)).render(/*#__PURE__*/ $2QBC6$reactjsxruntime.jsx($19b51ad48deb0cd7$var$App, {
}), document.getElementById("app"));


//# sourceMappingURL=background.js.map
