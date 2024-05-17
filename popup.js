document.getElementById("copy-url").addEventListener("click", () => {
    executeScriptAndCopy(getURL);
  });
  
  document.getElementById("remove-params").addEventListener("click", () => {
    executeScriptAndCopy(removeParameters);
  });
  
  document.getElementById("keep-first-param").addEventListener("click", () => {
    executeScriptAndCopy(keepFirstParameter);
  });
  
  function executeScriptAndCopy(func) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: func
      }, (results) => {
        if (results && results[0] && results[0].result) {
          copyToClipboard(results[0].result);
        }
      });
    });
  }
  
  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      console.log("Markdown link copied to clipboard!");
      showTemporaryMessage("Markdown link copied to clipboard!");
    }).catch(err => {
      console.error("Could not copy text: ", err);
      showTemporaryMessage("Failed to copy Markdown link.");
    });
  }
  
  function showTemporaryMessage(message) {
    const div = document.createElement('div');
    div.innerText = message;
    div.style.position = 'fixed';
    div.style.bottom = '10px';
    div.style.left = '50%';
    div.style.transform = 'translateX(-50%)';
    div.style.backgroundColor = '#323232';
    div.style.color = 'white';
    div.style.padding = '10px';
    div.style.borderRadius = '5px';
    div.style.zIndex = '1000';
    document.body.appendChild(div);
    setTimeout(() => {
      document.body.removeChild(div);
    }, 3000); // 3 seconds
  }
  
  function getURL() {
    return window.location.href;
  }
  
  function removeParameters() {
    return window.location.origin + window.location.pathname;
  }
  
  function keepFirstParameter() {
    const url = new URL(window.location.href);
    const params = url.searchParams;
    const firstParam = params.keys().next().value;
    const queryString = firstParam ? `?${firstParam}=${params.get(firstParam)}` : '';
    return `${window.location.origin}${window.location.pathname}${queryString}`;
  }
  