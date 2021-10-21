let providers = {
	10000: new ethers.providers.JsonRpcProvider('https://smartbch.fountainhead.cash/mainnet', 10000),
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse)=>{
	if(message.getMetadatas) {
		getMetadatas(message.getMetadatas[0], message.getMetadatas[1]).then(response => {
			sendResponse(response);
		});
		return true;
	}
});

async function getMetadatas(network, txHash) {
	let receipt = await providers[network].getTransactionReceipt(txHash);

	let result = [];
	for(let i=0;i<receipt.logs.length;++i) {
		let log = receipt.logs[i];
		result[i] = null;

		if(log.topics[0] != '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef') continue;
		if(log.topics.length < 4) continue;
		
		result[i] = await getMetadata(network, log.address, log.topics[3]);
	}
	
	return result;
}

async function getMetadata(network, addr, tokenId) {
	let contract = new ethers.Contract(addr, IERC721ABI, providers[network]);
	let tokenURI = await contract.tokenURI( tokenId );

	let response = await fetch(tokenURI);
	let result = await response.json();
	result.address = addr;
	result.tokenId = tokenId;

	return result;
}
