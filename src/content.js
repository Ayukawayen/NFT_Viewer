const Network = 10000;

wrapNodes();

function wrapNodes() {
	let re = /\/transaction\/(0x[0-9a-fA-F]{64})/;
	
	let buf = re.exec(location.pathname);
	if(!buf) return;
	
	chrome.runtime.sendMessage({
		getMetadatas:[Network, buf[1]],
	}, (response) => {
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
}


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
