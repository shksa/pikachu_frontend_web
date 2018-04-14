export const recognizeImage = (imageData) => {
  const formData = new FormData()
  formData.append('imageData', imageData)
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

