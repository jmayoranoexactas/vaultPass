/* global chrome */
// We can only access the TABs DOM with this script.
// It will get the credentials via message passing from the popup

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.message === 'fill_creds') {
      console.debug('Will fill credentials for \n username = ' + request.username)
      var inputs = document.getElementsByTagName('input')
      var passwordNode, usernameNode
      for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].type === 'password') {
          passwordNode = inputs[i]
        }
      }
      if (passwordNode === null) {
        console.error('Could not find passwordNode')
        return
      }

      for (let testNode = passwordNode.previousSibling; testNode !== null; testNode = testNode.previousSibling) {
        if (testNode && testNode.tagName && testNode.tagName.toUpperCase() === 'INPUT') {
          usernameNode = testNode
          break
        }
      }

      if (usernameNode !== null) {
        for (let form = passwordNode.parentElement; form !== null; form = form.parentElement) {
          if (form && form.tagName && form.tagName.toUpperCase() === 'FORM') {
            let inputElements = form.getElementsByTagName('input')
            for (let i = 0; i < inputElements.length; i++) {
              if (inputElements[i].type === 'text') {
                usernameNode = inputElements[i]
                break
              }
            }
            break
          }
        }
      }

      if (usernameNode !== null) {
        usernameNode.value = request.username
        passwordNode.value = request.password
      }
    }
  }
)
