const recognizeImage = (imageFile) => {
  console.log('in recognizeImage func')
  const formData = new FormData()
  formData.append('userName', 'guest')
  formData.append('imageFile', imageFile)
  return fetch('/recognizeImage', {
    method: 'POST',
    body: formData,
  })
    .then(resp => resp.json())
    .then((array) => {
      console.log(array)
      return array
    })
    .catch(error => console.log(error))
};

module.exports = { recognizeImage }

