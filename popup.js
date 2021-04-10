document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form');
  const controlsArea = document.getElementById('controls');
  const addMoreBtn = document.getElementById('addMore');
  const updated = document.getElementById('update-container');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputs = controlsArea.getElementsByTagName('input');
    const values = [];
    for (let input of inputs) {
      const value = input.value.trim();
      if (value) {
        values.push(value);
      }
    }
    chrome.storage.local.set({urls: JSON.stringify({values: values})}, () => {
      updated.innerText = 'Updated!';

      setTimeout(() => {
        updated.innerText = '';
      }, 5000);
    });
  });

  addMoreBtn.addEventListener('click', () => {
    controlMake(controlsArea, '');
  });

  chrome.storage.local.get(['urls'], ({urls}) => {
    if (urls) {
      const {values} = JSON.parse(urls);
      if (values && Array.isArray(values) && values.length) {
        values.forEach((v) => {
          controlMake(controlsArea, v);
        });
        return;
      }
    }
    controlMake(controlsArea, '');
  });
});

function controlMake(parent, inputValue) {
  const id = Math.random() + '';

  const controlWrapper = document.createElement('div');
  controlWrapper.classList.add('control-wrapper');

  const label = document.createElement('label');
  label.innerText = 'Url:';
  label.attributes.for = id;

  const control = document.createElement('div');
  control.classList.add('control');

  const input = document.createElement('input');
  input.type = 'text';
  input.id = id;
  input.value = inputValue;

  const button = document.createElement('button');
  button.type = 'button';
  button.innerText = 'Clear';

  control.appendChild(input);
  control.appendChild(button);

  controlWrapper.appendChild(label);
  controlWrapper.appendChild(control);

  const onButtonClick = () => {
    const inputs = parent.getElementsByTagName('input');
    if (inputs.length === 1) {
      inputs[0].value = '';
    } else {
      button.removeEventListener('click', onButtonClick);
      parent.removeChild(controlWrapper);
    }
  };

  button.addEventListener('click', onButtonClick);

  parent.appendChild(controlWrapper);
}
