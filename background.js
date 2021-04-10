function onWebNavigationCompleted(details) {
  chrome.scripting.executeScript({
    target: {tabId: details.tabId},
    function: render
  });
}

chrome.storage.local.get(['urls'], ({urls}) => {
  if (urls) {
    const {values} = JSON.parse(urls);
    if (values && Array.isArray(values) && values.length) {
      chrome.webNavigation.onCompleted.addListener(onWebNavigationCompleted, {url: values.map(url => ({urlMatches: url}))});
    }
  }
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
  for (let [key, {oldValue, newValue}] of Object.entries(changes)) {
    if (key === 'urls') {
      const oldValues = JSON.parse(oldValue);
      if (oldValues.hasOwnProperty('values') && Array.isArray(oldValues.values) && oldValues.values.length) {
        chrome.webNavigation.onCompleted.removeListener(onWebNavigationCompleted, {url: oldValues.values.map(url => ({urlMatches: url}))});
      }

      const newValues = JSON.parse(newValue);
      if (newValues.hasOwnProperty('values') && Array.isArray(newValues.values) && newValues.values.length) {
        chrome.webNavigation.onCompleted.addListener(onWebNavigationCompleted, {url: newValues.values.map(url => ({urlMatches: url}))});
      }
    }
  }
});


function render() {
  const id = 'productionKeeperWrapper';
  if (document.getElementById(id)) {return;}

  const wrapper = document.createElement('div');
  wrapper.id = id;
  wrapper.style.width = '130px';
  wrapper.style.height = '130px';
  wrapper.style.overflow = 'hidden';
  wrapper.style.position = 'fixed';
  wrapper.style.top = '0px';
  wrapper.style.right = '0px';
  wrapper.style.zIndex = '9999';
  wrapper.style.pointerEvents = 'none';

  const elem = document.createElement('div');

  elem.style.font = 'bold 15px Sans-Serif';
  elem.style.lineHeight = '18px';
  elem.style.color = '#fff';
  elem.style.textAlign = 'center';
  elem.style.textTransform = 'uppercase';
  elem.style.transform = 'rotate(45deg)';
  elem.style.position = 'relative';
  elem.style.padding = '7px 0';
  elem.style.left = '-20px';
  elem.style.top = '30px';
  elem.style.width = '205px';
  elem.style.backgroundColor = '#db1b1b';
  elem.style.color = '#fff;';
  elem.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
  elem.style.letterSpacing = '0.5px';
  elem.style.cursor = 'default';

  elem.innerText = 'production';

  wrapper.appendChild(elem);

  document.body.appendChild(wrapper);
}
