const recognizeImage = (imageFile, imageMat) => {
  console.log('in recognizeImage func')
  const formData = new FormData()
  formData.append('userName', 'guest')
  if (imageFile){
    formData.append('imageFile', imageFile)
    console.log('sending image file ', imageFile)
  } else {
    const imageBuffer = imageMat.data()
    formData.append('imageBuffer', imageBuffer)
    console.log('sending imageBuffer ', imageBuffer)
  }
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

