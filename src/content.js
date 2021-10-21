const adapters = {
	'www.smartscan.cash': {
		network: 10000,
		regExp: /\/transaction\/(0x[0-9a-fA-F]{64})/,
	},
	/*
	// Don't forget to add urls in manifest.json/content_scripts/matches if you want to add etherscan sites.
	'etherscan.io': {
		network: 1,
		regExp: /\/tx\/(0x[0-9a-fA-F]{64})/,
	},
	'ropsten.etherscan.io': {
		network: 3,
		regExp: /\/tx\/(0x[0-9a-fA-F]{64})/,
	},
	'rinkeby.etherscan.io': {
		network: 4,
		regExp: /\/tx\/(0x[0-9a-fA-F]{64})/,
	},
	'goerli.etherscan.io': {
		network: 5,
		regExp: /\/tx\/(0x[0-9a-fA-F]{64})/,
	},
	'kovan.etherscan.io': {
		network: 42,
		regExp: /\/tx\/(0x[0-9a-fA-F]{64})/,
	},
	*/
};

(()=>{
	let adapter = adapters[location.host];
	if(!adapter) return;
	
	let buf = adapter.regExp.exec(location.pathname);
	if(!buf) return;
	
	chrome.runtime.sendMessage({
		getMetadatas:[adapter.network, buf[1]],
	}, (response) => {
		if(!response) return;
		if(response.length <= 0) return;
		
		let metaListNode = null;
		
		for(let i=0;i<response.length;++i) {
			let meta = response[i];
			if(!meta) continue;
			
			if(!metaListNode) {
				metaListNode = createElement('div', {'class':'NETAYUKAWAYEN_nftmeta'}, []);
				document.body.appendChild(metaListNode);
			}
			
			let metaNode = createElement('dl', {}, [
				createElement('dt', {}, [meta.name]),
				createElement('dd', {}, [
					createElement('img', {src:meta.image}, []),
				]),
			]);
			metaListNode.appendChild(metaNode);
		}
		
	});
})();


function createElement(tagName, attributes, childnodes) {
	let node = document.createElement(tagName);
	if(attributes) {
		for(let key in attributes) {
			node.setAttribute(key, attributes[key]);
		}
	}
	if(childnodes) {
		for(let i=0;i<childnodes.length;++i) {
			if(!childnodes[i].nodeType) {
				childnodes[i] = document.createTextNode(childnodes[i].toString());
			}
			node.appendChild(childnodes[i]);
		}
	}
	return node;
}
