const ping = () => {
  fetch('/ping', {
    method: 'GET',
  })
    .then(resp => resp.text())
    .then(text => console.log(text))
    .catch(error => console.log(error))
}

module.exports = { ping }
