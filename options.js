let saveButton = document.getElementById("saveButton");

// Reacts to a button click by marking the selected button and saving
// the selection
function handleButtonClick(event) {
  const textField = document.getElementById("privateKey");
  const privateKeyWIF = textField.value;
  chrome.storage.sync.set({ privateKeyWIF });
  alert("Successfully saved your key");
}
saveButton.addEventListener("click", handleButtonClick);
